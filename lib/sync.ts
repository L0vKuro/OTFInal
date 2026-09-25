// Shared Twitch/YouTube sync helpers — used by both the admin dashboard's
// manual "Sync" buttons (app/api/admin/route.ts) and the automatic cron sync
// (app/api/cron/sync-activity/route.ts) so the two stay in lockstep instead of
// drifting apart as two separate copies of the same API-calling logic.

export async function getTwitchToken() {
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  )
  const data = await res.json()
  if (!res.ok || !data.access_token) {
    throw new Error(`Twitch auth failed (${res.status}): ${data.message || JSON.stringify(data)}`)
  }
  return data.access_token as string
}

export type PlatformEvent = { externalId: string; eventDate: string; title: string; viewCount: number }

export function monthRange(period: string) {
  const [year, month] = period.split('-').map(Number)
  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const monthEnd = new Date(Date.UTC(year, month, 1))
  return { monthStart, monthEnd }
}

export async function getTwitchVideosInMonth(login: string, period: string, token: string): Promise<PlatformEvent[]> {
  const { monthStart, monthEnd } = monthRange(period)

  // Twitch's API only matches the exact lowercase login — mixed-case handles (as
  // typed into the site's creator data) will silently fail to resolve otherwise.
  const loginLower = login.trim().toLowerCase()

  const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(loginLower)}`, {
    headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
  })
  const userData = await userRes.json()
  if (!userRes.ok) {
    throw new Error(`Twitch user lookup failed for "${login}" (${userRes.status}): ${userData.message || JSON.stringify(userData)}`)
  }
  const userId = userData.data?.[0]?.id
  if (!userId) {
    throw new Error(`Twitch login "${login}" not found — check for typos`)
  }

  const events: PlatformEvent[] = []
  let cursor = ''
  let keepGoing = true

  while (keepGoing) {
    const url = `https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=100${cursor ? `&after=${cursor}` : ''}`
    const res = await fetch(url, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(`Twitch videos lookup failed for "${login}" (${res.status}): ${data.message || JSON.stringify(data)}`)
    }
    const videos = data.data || []
    if (videos.length === 0) break

    for (const v of videos) {
      const created = new Date(v.created_at)
      if (created >= monthStart && created < monthEnd) {
        events.push({ externalId: v.id, eventDate: v.created_at.slice(0, 10), title: v.title || '', viewCount: v.view_count || 0 })
      }
      if (created < monthStart) keepGoing = false
    }

    cursor = data.pagination?.cursor
    if (!cursor) keepGoing = false
  }

  return events
}

// Site data has stored YouTube channels in inconsistent formats over time — some as
// bare channel IDs, some with a "channel/" prefix, some as full URLs, some as a
// handle missing its leading "@". This normalizes+resolves all of them by trying
// every plausible lookup strategy until one returns a real channel.
export async function fetchYoutubeChannelItem(channelValue: string, apiKey: string, part: string): Promise<{ item: any | null; lastError: string | null }> {
  let value = channelValue.trim()
  if (value.startsWith('channel/')) value = value.slice('channel/'.length)
  if (value.startsWith('http')) {
    try {
      const u = new URL(value)
      const segments = u.pathname.split('/').filter(Boolean)
      if (segments[0] === 'channel' && segments[1]) value = segments[1]
      else if (segments[0]?.startsWith('@')) value = segments[0]
      else if ((segments[0] === 'c' || segments[0] === 'user') && segments[1]) value = segments[1]
    } catch {}
  }

  const tryFetch = async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok) return { item: null, error: data.error?.message || `HTTP ${res.status}` }
    return { item: data.items?.[0] || null, error: null }
  }

  let lastError: string | null = null

  if (value.startsWith('UC')) {
    const r = await tryFetch(`https://www.googleapis.com/youtube/v3/channels?part=${part}&id=${value}&key=${apiKey}`)
    if (r.item) return { item: r.item, lastError: null }
    lastError = r.error
  } else if (value.startsWith('@')) {
    const r = await tryFetch(`https://www.googleapis.com/youtube/v3/channels?part=${part}&forHandle=${value}&key=${apiKey}`)
    if (r.item) return { item: r.item, lastError: null }
    lastError = r.error
  } else {
    // Bare username with no prefix — try the legacy username lookup first, then
    // fall back to treating it as a handle that's just missing its "@".
    const r1 = await tryFetch(`https://www.googleapis.com/youtube/v3/channels?part=${part}&forUsername=${value}&key=${apiKey}`)
    if (r1.item) return { item: r1.item, lastError: null }
    lastError = r1.error
    const r2 = await tryFetch(`https://www.googleapis.com/youtube/v3/channels?part=${part}&forHandle=@${value}&key=${apiKey}`)
    if (r2.item) return { item: r2.item, lastError: null }
    lastError = r2.error || lastError
  }

  return { item: null, lastError }
}

export async function getYoutubeUploadsPlaylistId(channelValue: string, apiKey: string): Promise<string> {
  const { item, lastError } = await fetchYoutubeChannelItem(channelValue, apiKey, 'contentDetails')
  const playlist = item?.contentDetails?.relatedPlaylists?.uploads
  if (!playlist) {
    throw new Error(`YouTube channel "${channelValue}" not found${lastError ? ` (${lastError})` : ''} — check the channel ID/handle for typos`)
  }
  return playlist
}

// Like getYoutubeUploadsPlaylistId, but also grabs the channel's avatar so we can
// auto-fill a roster member's photo without the admin having to find/paste one.
export async function getYoutubeChannelInfo(channelValue: string, apiKey: string): Promise<{ uploadsPlaylist: string | null; thumbnailUrl: string | null }> {
  const { item } = await fetchYoutubeChannelItem(channelValue, apiKey, 'snippet,contentDetails')
  return {
    uploadsPlaylist: item?.contentDetails?.relatedPlaylists?.uploads || null,
    thumbnailUrl: item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url || null,
  }
}

export async function getTwitchAvatar(login: string, token: string): Promise<string> {
  try {
    const res = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(login.trim().toLowerCase())}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
    })
    const data = await res.json()
    return data.data?.[0]?.profile_image_url || ''
  } catch {
    return ''
  }
}

export async function getYoutubeVideosInMonth(channelValue: string, period: string, apiKey: string): Promise<PlatformEvent[]> {
  const { monthStart, monthEnd } = monthRange(period)
  const uploadsPlaylist = await getYoutubeUploadsPlaylistId(channelValue, apiKey)

  const events: PlatformEvent[] = []
  let pageToken = ''
  let keepGoing = true

  while (keepGoing) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=50&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok) {
      throw new Error(`YouTube playlist lookup failed for "${channelValue}" (${res.status}): ${data.error?.message || JSON.stringify(data)}`)
    }
    const items = data.items || []
    if (items.length === 0) break

    for (const item of items) {
      const publishedAt = item.snippet?.publishedAt
      if (!publishedAt) continue
      const published = new Date(publishedAt)
      const videoId = item.snippet?.resourceId?.videoId
      if (published >= monthStart && published < monthEnd && videoId) {
        events.push({ externalId: videoId, eventDate: publishedAt.slice(0, 10), title: item.snippet?.title || '', viewCount: 0 })
      }
      if (published < monthStart) keepGoing = false
    }

    pageToken = data.nextPageToken
    if (!pageToken) keepGoing = false
  }

  // playlistItems doesn't include view counts — batch-fetch them separately
  // (YouTube allows up to 50 video IDs per call).
  for (let i = 0; i < events.length; i += 50) {
    const chunk = events.slice(i, i + 50)
    const ids = chunk.map(e => e.externalId).join(',')
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${apiKey}`)
      const data = await res.json()
      const viewMap: Record<string, number> = {}
      for (const item of data.items || []) viewMap[item.id] = parseInt(item.statistics?.viewCount || '0', 10) || 0
      for (const e of chunk) e.viewCount = viewMap[e.externalId] || 0
    } catch {}
  }

  return events
}
