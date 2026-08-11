import { NextResponse } from 'next/server'
import { creators } from '@/lib/data'

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!

async function getToken() {
  const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, {
    method: 'POST',
  })
  const data = await res.json()
  return data.access_token
}

export async function GET() {
  try {
    // Pulled live from the creators list instead of a separate hardcoded array.
    // That array had drifted badly out of sync (several current creators missing
    // entirely, a typo'd handle, a couple of stale/renamed logins, and even a
    // couple of team-roster names mixed in) since nothing kept it in sync with
    // lib/data.ts as creators were added, renamed, or removed.
    const logins = creators
      .map(c => c.socials?.twitch)
      .filter((l): l is string => !!l)

    if (logins.length === 0) {
      return NextResponse.json({ streams: [] })
    }

    const token = await getToken()
    const query = logins.map(l => `user_login=${encodeURIComponent(l)}`).join('&')
    const res = await fetch(`https://api.twitch.tv/helix/streams?${query}`, {
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    })
    const data = await res.json()
    return NextResponse.json({ streams: data.data || [] })
  } catch {
    return NextResponse.json({ streams: [] })
  }
}
