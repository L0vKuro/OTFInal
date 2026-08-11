import { NextResponse } from 'next/server'
import { creators } from '@/lib/data'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!

// Creators' socials.youtube values aren't stored in one consistent format —
// some are "channel/UC..." (a URL path fragment), some are "@handle", and a
// couple are bare strings with no prefix at all. This resolves any of those
// down to a plain channel ID, which is what the live-search endpoint below needs.
async function resolveChannelId(rawValue: string): Promise<string | null> {
  let value = rawValue.trim()
  if (!value) return null
  if (value.startsWith('channel/')) value = value.slice('channel/'.length)
  if (value.startsWith('UC')) return value

  const handle = value.startsWith('@') ? value : `@${value}`
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // channel IDs don't change — cache an hour
    )
    const data = await res.json()
    return data.items?.[0]?.id || null
  } catch {
    return null
  }
}

export async function GET() {
  try {
    // Pulled live from the creators list instead of a separate hardcoded array,
    // which previously tracked exactly one person (and with a name format that
    // didn't even match what the /creators page looks for) — so this could
    // never have shown anyone else as live no matter what.
    const withYoutube = creators.filter(c => c.socials?.youtube)

    const liveStreams = await Promise.all(
      withYoutube.map(async (creator) => {
        const channelId = await resolveChannelId(creator.socials!.youtube as string)
        if (!channelId) return null

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`,
          { next: { revalidate: 600 } } // cache for 10 minutes to preserve API quota
        )
        const data = await res.json()
        const isLive = data.items && data.items.length > 0
        return {
          name: creator.handle,
          channelId,
          isLive,
          videoId: isLive ? data.items[0].id.videoId : null,
          title: isLive ? data.items[0].snippet.title : null,
          thumbnail: isLive ? data.items[0].snippet.thumbnails?.high?.url : null,
          url: isLive ? `https://www.youtube.com/watch?v=${data.items[0].id.videoId}` : `https://www.youtube.com/channel/${channelId}`,
        }
      })
    )

    const live = liveStreams.filter((c): c is NonNullable<typeof c> => c !== null && c.isLive)
    return NextResponse.json({ streams: live })
  } catch {
    return NextResponse.json({ streams: [] })
  }
}
