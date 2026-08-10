import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function currentPeriod() {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

// Public, unauthenticated — powers the leaderboard on /creators. Reads pre-synced
// data from Supabase only (no live Twitch/YouTube API calls), so this stays fast
// and never burns API quota on public traffic.
export async function GET() {
  try {
    const period = currentPeriod()
    const [y, m] = period.split('-').map(Number)
    const monthStart = new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 10)
    const monthEnd = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10)

    const { data: members } = await supabase
      .from('roster_members')
      .select('person_name, photo_url')
      .eq('active', true)

    const { data: events } = await supabase
      .from('activity_events')
      .select('person_name, platform, view_count')
      .gte('event_date', monthStart)
      .lt('event_date', monthEnd)

    const photoMap: Record<string, string> = {}
    for (const mem of members || []) photoMap[mem.person_name] = mem.photo_url || ''

    const stats: Record<string, { streams: number; uploads: number; views: number }> = {}
    for (const ev of events || []) {
      if (!stats[ev.person_name]) stats[ev.person_name] = { streams: 0, uploads: 0, views: 0 }
      if (ev.platform === 'twitch') stats[ev.person_name].streams++
      if (ev.platform === 'youtube') stats[ev.person_name].uploads++
      stats[ev.person_name].views += ev.view_count || 0
    }

    const rows = Object.entries(stats).map(([person_name, s]) => ({
      person_name,
      photo_url: photoMap[person_name] || '',
      streams: s.streams,
      uploads: s.uploads,
      views: s.views,
    }))

    const topStreams = [...rows].filter(r => r.streams > 0).sort((a, b) => b.streams - a.streams).slice(0, 5)
    const topUploads = [...rows].filter(r => r.uploads > 0).sort((a, b) => b.uploads - a.uploads).slice(0, 5)
    const topViews = [...rows].filter(r => r.views > 0).sort((a, b) => b.views - a.views).slice(0, 5)

    return NextResponse.json({ period, topStreams, topUploads, topViews })
  } catch {
    return NextResponse.json({ period: currentPeriod(), topStreams: [], topUploads: [], topViews: [] })
  }
}
