import { NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!

const CREATORS = [
  { name: 'Dynasty_K1NG', channelId: 'UCaTSUhTLxgSzqkkeOMonLgg' },
]

export async function GET() {
  try {
    const liveStreams = await Promise.all(
      CREATORS.map(async (creator) => {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${creator.channelId}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`,
          { next: { revalidate: 600 } } // cache for 10 minutes to preserve API quota
        )
        const data = await res.json()
        const isLive = data.items && data.items.length > 0
        return {
          name: creator.name,
          channelId: creator.channelId,
          isLive,
          videoId: isLive ? data.items[0].id.videoId : null,
          title: isLive ? data.items[0].snippet.title : null,
          thumbnail: isLive ? data.items[0].snippet.thumbnails?.high?.url : null,
          url: isLive ? `https://www.youtube.com/watch?v=${data.items[0].id.videoId}` : `https://www.youtube.com/channel/${creator.channelId}`,
        }
      })
    )

    const live = liveStreams.filter(c => c.isLive)
    return NextResponse.json({ streams: live })
  } catch {
    return NextResponse.json({ streams: [] })
  }
}
