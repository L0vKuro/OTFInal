import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!

const CREATOR_LOGINS = [
  'x19_eh',
  'luke_12345678932',
  'zendigo_playz',
  'lordrogue22',
  '1umartv',
  'delinquentfps',
  'dynasty_k1ng',
  'godcookie_',
  'ikillshott',
  'jahwci',
  'keotaress',
  'kiiiingkooopa',
  'soto_on_tt',
  'trapzfv',
  'xlluka',
  'finl_gaz',
]

async function getToken() {
  const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, {
    method: 'POST',
  })
  const data = await res.json()
  return data.access_token
}

export async function GET() {
  try {
    const token = await getToken()
    const query = CREATOR_LOGINS.map(l => `user_login=${l}`).join('&')
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
