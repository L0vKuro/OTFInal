import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const checkAuth = (password: string) => password === process.env.ADMIN_PASSWORD

async function getTwitchToken() {
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

type PlatformEvent = { externalId: string; eventDate: string; title: string }

function monthRange(period: string) {
  const [year, month] = period.split('-').map(Number)
  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const monthEnd = new Date(Date.UTC(year, month, 1))
  return { monthStart, monthEnd }
}

async function getTwitchVideosInMonth(login: string, period: string, token: string): Promise<PlatformEvent[]> {
  const { monthStart, monthEnd } = monthRange(period)

  const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${login}`, {
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
        events.push({ externalId: v.id, eventDate: v.created_at.slice(0, 10), title: v.title || '' })
      }
      if (created < monthStart) keepGoing = false
    }

    cursor = data.pagination?.cursor
    if (!cursor) keepGoing = false
  }

  return events
}

async function getYoutubeUploadsPlaylistId(channelValue: string, apiKey: string): Promise<string> {
  const value = channelValue.trim()
  let url = ''
  if (value.startsWith('UC')) {
    url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${value}&key=${apiKey}`
  } else if (value.startsWith('@')) {
    url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${value}&key=${apiKey}`
  } else {
    url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${value}&key=${apiKey}`
  }
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`YouTube channel lookup failed for "${channelValue}" (${res.status}): ${data.error?.message || JSON.stringify(data)}`)
  }
  const playlist = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!playlist) {
    throw new Error(`YouTube channel "${channelValue}" not found — check the channel ID/handle for typos`)
  }
  return playlist
}

// Like getYoutubeUploadsPlaylistId, but also grabs the channel's avatar so we can
// auto-fill a roster member's photo without the admin having to find/paste one.
async function getYoutubeChannelInfo(channelValue: string, apiKey: string): Promise<{ uploadsPlaylist: string | null; thumbnailUrl: string | null }> {
  const value = channelValue.trim()
  let url = ''
  if (value.startsWith('UC')) {
    url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${value}&key=${apiKey}`
  } else if (value.startsWith('@')) {
    url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forHandle=${value}&key=${apiKey}`
  } else {
    url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forUsername=${value}&key=${apiKey}`
  }
  const res = await fetch(url)
  const data = await res.json()
  const item = data.items?.[0]
  return {
    uploadsPlaylist: item?.contentDetails?.relatedPlaylists?.uploads || null,
    thumbnailUrl: item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url || null,
  }
}

async function getTwitchAvatar(login: string, token: string): Promise<string> {
  try {
    const res = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(login)}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
    })
    const data = await res.json()
    return data.data?.[0]?.profile_image_url || ''
  } catch {
    return ''
  }
}

async function getYoutubeVideosInMonth(channelValue: string, period: string, apiKey: string): Promise<PlatformEvent[]> {
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
        events.push({ externalId: videoId, eventDate: publishedAt.slice(0, 10), title: item.snippet?.title || '' })
      }
      if (published < monthStart) keepGoing = false
    }

    pageToken = data.nextPageToken
    if (!pageToken) keepGoing = false
  }

  return events
}

function periodsBack(count: number): string[] {
  const periods: string[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    periods.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`)
  }
  return periods
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action, password } = body

  if (action !== 'login' && !checkAuth(password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  switch (action) {
    case 'login':
      return NextResponse.json({ success: body.password === process.env.ADMIN_PASSWORD })

    case 'getCodes': {
      const { data } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false })
      return NextResponse.json({ data })
    }

    case 'createCode': {
      const { data } = await supabase.from('discount_codes').insert({
        code: body.code,
        type: body.type,
        value: body.value,
        max_uses: body.max_uses || null,
        expires_at: body.expires_at || null,
        notes: body.notes || '',
      }).select()
      return NextResponse.json({ data })
    }

    case 'deleteCode': {
      await supabase.from('discount_codes').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    case 'getLinks': {
      const { data } = await supabase.from('tracking_links').select('*').order('created_at', { ascending: false })
      return NextResponse.json({ data })
    }

    case 'createLink': {
      const { data } = await supabase.from('tracking_links').insert({
        name: body.name,
        slug: body.slug,
        destination_url: body.destination_url,
        sent_to: body.sent_to || '',
        notes: body.notes || '',
      }).select()
      return NextResponse.json({ data })
    }

    case 'deleteLink': {
      await supabase.from('tracking_links').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    case 'getOrderEmails': {
      const { data } = await supabase.from('order_emails').select('*').order('sent_at', { ascending: false })
      return NextResponse.json({ data })
    }

    case 'sendTrackingEmail': {
      const { customer_name, customer_email, order_number, tracking_url, notes } = body

      const { error } = await resend.emails.send({
        from: 'Overtake Store <orders@overtakegg.com>',
        to: customer_email,
        subject: `Your Overtake Order #${order_number} Has Shipped!`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:'Arial',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid rgba(255,255,255,0.08);max-width:600px;width:100%;">

          <!-- Red top bar -->
          <tr>
            <td style="background:#E8191A;height:4px;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <img src="https://overtakegg.com/wordmark.png" alt="OVERTAKE" style="height:48px;mix-blend-mode:screen;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:rgba(242,242,242,0.4);font-size:11px;font-family:monospace;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 16px;">// Order Update</p>
              <h1 style="color:#F2F2F2;font-size:32px;font-weight:900;text-transform:uppercase;margin:0 0 8px;letter-spacing:0.05em;">
                YOUR ORDER<br/><span style="color:#E8191A;">HAS SHIPPED</span>
              </h1>
              <p style="color:rgba(242,242,242,0.5);font-size:15px;margin:20px 0 0;">
                Hey ${customer_name},
              </p>
              <p style="color:rgba(242,242,242,0.5);font-size:15px;line-height:1.6;margin:12px 0 32px;">
                Your Overtake order <strong style="color:#F2F2F2;">#${order_number}</strong> is on its way. Click the button below to track your package in real time.
              </p>

              <!-- Order number badge -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:rgba(232,25,26,0.08);border:1px solid rgba(232,25,26,0.25);padding:12px 20px;">
                    <span style="color:rgba(242,242,242,0.4);font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:0.15em;">Order Number</span><br/>
                    <span style="color:#F2F2F2;font-size:20px;font-weight:900;letter-spacing:0.1em;">#${order_number}</span>
                  </td>
                </tr>
              </table>

              <!-- Track button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                <tr>
                  <td style="background:#E8191A;">
                    <a href="${tracking_url}" target="_blank"
                      style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;">
                      TRACK MY PACKAGE →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:rgba(242,242,242,0.3);font-size:13px;line-height:1.6;margin:0;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${tracking_url}" style="color:#E8191A;word-break:break-all;">${tracking_url}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,#E8191A,transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:30px 40px;text-align:center;">
              <p style="color:rgba(242,242,242,0.2);font-size:11px;font-family:monospace;margin:0 0 8px;">
                © 2026 OVERTAKE SECTOR LLC. ALL RIGHTS RESERVED.
              </p>
              <p style="color:rgba(242,242,242,0.2);font-size:11px;font-family:monospace;margin:0;">
                Questions? Contact us at <a href="mailto:orders@overtakegg.com" style="color:#E8191A;">orders@overtakegg.com</a>
              </p>
            </td>
          </tr>

          <!-- Bottom red bar -->
          <tr>
            <td style="background:#E8191A;height:2px;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Log the sent email
      await supabase.from('order_emails').insert({
        customer_name,
        customer_email,
        order_number,
        tracking_url,
        notes: notes || '',
      })

      return NextResponse.json({ success: true })
    }

    case 'getRosterMembers': {
      const { data } = await supabase
        .from('roster_members')
        .select('*')
        .eq('active', true)
        .order('person_name', { ascending: true })
      return NextResponse.json({ data })
    }

    case 'addRosterMember': {
      const period = body.period || `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}`
      const results: any = { twitch: 0, youtube: 0 }
      let photo_url = body.photo_url || ''
      let token = ''

      if (body.twitch_login) {
        try {
          token = await getTwitchToken()
          if (!photo_url) photo_url = await getTwitchAvatar(body.twitch_login, token)
        } catch {}
      }

      if (!photo_url && body.youtube_channel) {
        try {
          const info = await getYoutubeChannelInfo(body.youtube_channel, process.env.YOUTUBE_API_KEY!)
          photo_url = info.thumbnailUrl || ''
        } catch {}
      }

      const { error } = await supabase
        .from('roster_members')
        .upsert({
          person_name: body.person_name,
          role_type: body.role_type,
          twitch_login: body.twitch_login || '',
          youtube_channel: body.youtube_channel || '',
          photo_url,
          active: true,
        }, { onConflict: 'person_name' })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Kick off an immediate sync for just this person so their stats start populating right away
      if (body.twitch_login) {
        try {
          if (!token) token = await getTwitchToken()
          const events = await getTwitchVideosInMonth(body.twitch_login, period, token)
          if (events.length > 0) {
            await supabase.from('activity_events').upsert(
              events.map(e => ({ person_name: body.person_name, platform: 'twitch', event_date: e.eventDate, external_id: e.externalId, title: e.title })),
              { onConflict: 'platform,external_id', ignoreDuplicates: true }
            )
          }
          results.twitch = events.length
        } catch {}
      }

      if (body.youtube_channel) {
        try {
          const events = await getYoutubeVideosInMonth(body.youtube_channel, period, process.env.YOUTUBE_API_KEY!)
          if (events.length > 0) {
            await supabase.from('activity_events').upsert(
              events.map(e => ({ person_name: body.person_name, platform: 'youtube', event_date: e.eventDate, external_id: e.externalId, title: e.title })),
              { onConflict: 'platform,external_id', ignoreDuplicates: true }
            )
          }
          results.youtube = events.length
        } catch {}
      }

      return NextResponse.json({ success: true, synced: results, photo_url })
    }

    case 'updateRosterMember': {
      const update: any = {
        role_type: body.role_type,
        twitch_login: body.twitch_login || '',
        youtube_channel: body.youtube_channel || '',
      }
      if (body.photo_url !== undefined) update.photo_url = body.photo_url || ''

      const { error } = await supabase
        .from('roster_members')
        .update(update)
        .eq('person_name', body.person_name)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case 'removeRosterMember': {
      await supabase.from('roster_members').update({ active: false }).eq('person_name', body.person_name)
      return NextResponse.json({ success: true })
    }

    case 'bulkSeedRoster': {
      // Auto-adds anyone from the site's teams/creators data who isn't already tracked.
      // Never touches existing rows (including ones the admin removed), so edits and
      // removals always stick.
      const { data: existing } = await supabase.from('roster_members').select('person_name')
      const existingNames = new Set((existing || []).map((r: any) => r.person_name))
      const candidates = (body.candidates || []) as any[]
      const toInsert = candidates.filter(c => c.person_name && !existingNames.has(c.person_name))

      if (toInsert.length === 0) {
        return NextResponse.json({ success: true, added: [] })
      }

      const period = body.period || `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}`

      // Batch-resolve Twitch avatars for anyone missing a photo but with a Twitch login
      let twitchToken = ''
      const needsTwitchPhoto = toInsert.filter(c => c.twitch_login && !c.photo_url)
      const twitchAvatars: Record<string, string> = {}
      if (needsTwitchPhoto.length > 0) {
        try {
          twitchToken = await getTwitchToken()
          const logins = needsTwitchPhoto.map(c => String(c.twitch_login).toLowerCase())
          const q = logins.map(l => `login=${encodeURIComponent(l)}`).join('&')
          const res = await fetch(`https://api.twitch.tv/helix/users?${q}`, {
            headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${twitchToken}` },
          })
          const data = await res.json()
          for (const u of data.data || []) twitchAvatars[u.login.toLowerCase()] = u.profile_image_url
        } catch {}
      }

      const rowsToInsert: any[] = []
      for (const c of toInsert) {
        let photo_url = c.photo_url || ''
        if (!photo_url && c.twitch_login) photo_url = twitchAvatars[String(c.twitch_login).toLowerCase()] || ''
        if (!photo_url && c.youtube_channel) {
          try {
            const info = await getYoutubeChannelInfo(c.youtube_channel, process.env.YOUTUBE_API_KEY!)
            photo_url = info.thumbnailUrl || ''
          } catch {}
        }
        rowsToInsert.push({
          person_name: c.person_name,
          role_type: c.role_type || 'creator',
          twitch_login: c.twitch_login || '',
          youtube_channel: c.youtube_channel || '',
          photo_url,
          active: true,
        })
      }

      const { error } = await supabase.from('roster_members').insert(rowsToInsert)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Sync activity for anyone with handles so stats populate immediately
      if (!twitchToken && rowsToInsert.some(r => r.twitch_login)) {
        try { twitchToken = await getTwitchToken() } catch {}
      }
      for (const row of rowsToInsert) {
        if (row.twitch_login && twitchToken) {
          try {
            const events = await getTwitchVideosInMonth(row.twitch_login, period, twitchToken)
            if (events.length > 0) {
              await supabase.from('activity_events').upsert(
                events.map(e => ({ person_name: row.person_name, platform: 'twitch', event_date: e.eventDate, external_id: e.externalId, title: e.title })),
                { onConflict: 'platform,external_id', ignoreDuplicates: true }
              )
            }
          } catch {}
        }
        if (row.youtube_channel) {
          try {
            const events = await getYoutubeVideosInMonth(row.youtube_channel, period, process.env.YOUTUBE_API_KEY!)
            if (events.length > 0) {
              await supabase.from('activity_events').upsert(
                events.map(e => ({ person_name: row.person_name, platform: 'youtube', event_date: e.eventDate, external_id: e.externalId, title: e.title })),
                { onConflict: 'platform,external_id', ignoreDuplicates: true }
              )
            }
          } catch {}
        }
      }

      return NextResponse.json({ success: true, added: rowsToInsert.map(r => r.person_name) })
    }

    case 'getActivityEvents': {
      const { monthStart, monthEnd } = monthRange(body.period)
      const { data } = await supabase
        .from('activity_events')
        .select('*')
        .gte('event_date', monthStart.toISOString().slice(0, 10))
        .lt('event_date', monthEnd.toISOString().slice(0, 10))
        .order('event_date', { ascending: true })
      return NextResponse.json({ data })
    }

    case 'getTiktokCounts': {
      const { data } = await supabase
        .from('tiktok_manual_counts')
        .select('*')
        .eq('period', body.period)
      return NextResponse.json({ data })
    }

    case 'upsertTiktokCount': {
      const { error } = await supabase
        .from('tiktok_manual_counts')
        .upsert({
          person_name: body.person_name,
          period: body.period,
          tiktok_posts: body.tiktok_posts ?? 0,
          notes: body.notes || '',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'person_name,period' })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case 'syncTwitchStreams': {
      let query = supabase.from('roster_members').select('*').eq('active', true).neq('twitch_login', '')
      if (body.personName) query = query.eq('person_name', body.personName)
      const { data: members } = await query

      if (!members || members.length === 0) {
        return NextResponse.json({ success: true, updated: 0, eventsAdded: 0, errors: [] })
      }

      let token = ''
      try {
        token = await getTwitchToken()
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
      }

      let updated = 0
      let eventsAdded = 0
      const errors: { person_name: string; error: string }[] = []

      for (const member of members) {
        try {
          const events = await getTwitchVideosInMonth(member.twitch_login, body.period, token)
          if (events.length > 0) {
            await supabase.from('activity_events').upsert(
              events.map(e => ({ person_name: member.person_name, platform: 'twitch', event_date: e.eventDate, external_id: e.externalId, title: e.title })),
              { onConflict: 'platform,external_id', ignoreDuplicates: true }
            )
          }
          eventsAdded += events.length
          updated++
        } catch (err: any) {
          errors.push({ person_name: member.person_name, error: err.message })
        }
      }

      return NextResponse.json({ success: true, updated, eventsAdded, errors })
    }

    case 'syncYoutubeUploads': {
      let query = supabase.from('roster_members').select('*').eq('active', true).neq('youtube_channel', '')
      if (body.personName) query = query.eq('person_name', body.personName)
      const { data: members } = await query

      if (!members || members.length === 0) {
        return NextResponse.json({ success: true, updated: 0, eventsAdded: 0, errors: [] })
      }

      let updated = 0
      let eventsAdded = 0
      const errors: { person_name: string; error: string }[] = []

      for (const member of members) {
        try {
          const events = await getYoutubeVideosInMonth(member.youtube_channel, body.period, process.env.YOUTUBE_API_KEY!)
          if (events.length > 0) {
            await supabase.from('activity_events').upsert(
              events.map(e => ({ person_name: member.person_name, platform: 'youtube', event_date: e.eventDate, external_id: e.externalId, title: e.title })),
              { onConflict: 'platform,external_id', ignoreDuplicates: true }
            )
          }
          eventsAdded += events.length
          updated++
        } catch (err: any) {
          errors.push({ person_name: member.person_name, error: err.message })
        }
      }

      return NextResponse.json({ success: true, updated, eventsAdded, errors })
    }

    case 'getTrendData': {
      const months = body.months || 3
      const periods = periodsBack(months)
      const earliest = monthRange(periods[0]).monthStart.toISOString().slice(0, 10)

      const { data: events } = await supabase
        .from('activity_events')
        .select('person_name, platform, event_date')
        .gte('event_date', earliest)

      const { data: tiktokRows } = await supabase
        .from('tiktok_manual_counts')
        .select('person_name, period, tiktok_posts')
        .in('period', periods)

      const buckets: Record<string, Record<string, { twitch: number; youtube: number; tiktok: number }>> = {}
      for (const period of periods) buckets[period] = {}

      for (const ev of events || []) {
        const period = ev.event_date.slice(0, 7)
        if (!buckets[period]) continue
        if (!buckets[period][ev.person_name]) buckets[period][ev.person_name] = { twitch: 0, youtube: 0, tiktok: 0 }
        if (ev.platform === 'twitch') buckets[period][ev.person_name].twitch++
        if (ev.platform === 'youtube') buckets[period][ev.person_name].youtube++
      }

      for (const row of tiktokRows || []) {
        if (!buckets[row.period]) continue
        if (!buckets[row.period][row.person_name]) buckets[row.period][row.person_name] = { twitch: 0, youtube: 0, tiktok: 0 }
        buckets[row.period][row.person_name].tiktok = row.tiktok_posts
      }

      const rows: any[] = []
      for (const period of periods) {
        for (const person_name of Object.keys(buckets[period])) {
          const b = buckets[period][person_name]
          rows.push({ period, person_name, twitch: b.twitch, youtube: b.youtube, tiktok: b.tiktok, total: b.twitch + b.youtube + b.tiktok })
        }
      }

      return NextResponse.json({ data: rows, periods })
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}
