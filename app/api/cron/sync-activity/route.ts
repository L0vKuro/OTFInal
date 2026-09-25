import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTwitchToken, getTwitchVideosInMonth, getYoutubeVideosInMonth } from '@/lib/sync'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function currentPeriod() {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

// Runs the same Twitch/YouTube sync the admin dashboard's manual "Sync" button
// does, but automatically on a schedule (see vercel.json) so the public
// leaderboard and "Just Dropped" numbers stay current without anyone having to
// remember to click Sync. Protected by CRON_SECRET so this can't be triggered
// by randoms hitting the URL — Vercel Cron automatically sends
// `Authorization: Bearer $CRON_SECRET` on scheduled invocations once that
// env var is set on the project.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const period = currentPeriod()
  const results = { twitch: { updated: 0, eventsAdded: 0, errors: [] as any[] }, youtube: { updated: 0, eventsAdded: 0, errors: [] as any[] } }

  const { data: members } = await supabase.from('roster_members').select('*').eq('active', true)

  const twitchMembers = (members || []).filter(m => m.twitch_login)
  if (twitchMembers.length > 0) {
    try {
      const token = await getTwitchToken()
      for (const member of twitchMembers) {
        try {
          const events = await getTwitchVideosInMonth(member.twitch_login, period, token)
          if (events.length > 0) {
            await supabase.from('activity_events').upsert(
              events.map(e => ({ person_name: member.person_name, platform: 'twitch', event_date: e.eventDate, external_id: e.externalId, title: e.title, view_count: e.viewCount })),
              { onConflict: 'platform,external_id', ignoreDuplicates: true }
            )
          }
          results.twitch.eventsAdded += events.length
          results.twitch.updated++
        } catch (err: any) {
          results.twitch.errors.push({ person_name: member.person_name, error: err.message })
        }
      }
    } catch (err: any) {
      results.twitch.errors.push({ person_name: 'ALL', error: `Twitch auth failed: ${err.message}` })
    }
  }

  const youtubeMembers = (members || []).filter(m => m.youtube_channel)
  for (const member of youtubeMembers) {
    try {
      const events = await getYoutubeVideosInMonth(member.youtube_channel, period, process.env.YOUTUBE_API_KEY!)
      if (events.length > 0) {
        await supabase.from('activity_events').upsert(
          events.map(e => ({ person_name: member.person_name, platform: 'youtube', event_date: e.eventDate, external_id: e.externalId, title: e.title, view_count: e.viewCount })),
          { onConflict: 'platform,external_id', ignoreDuplicates: true }
        )
      }
      results.youtube.eventsAdded += events.length
      results.youtube.updated++
    } catch (err: any) {
      results.youtube.errors.push({ person_name: member.person_name, error: err.message })
    }
  }

  return NextResponse.json({ success: true, period, ...results })
}
