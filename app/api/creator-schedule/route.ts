import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Public, read-only view of the admin Creator Schedule tab — powers the "What's
// Next" content timeline on /creators. Only ever returns upcoming, not-yet-posted
// items (never past or completed ones, and never the internal `notes` field),
// so this is safe to show to anyone without leaking planning notes.
export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await supabase
      .from('creator_schedule')
      .select('person_name, content_type, title, scheduled_date')
      .gte('scheduled_date', today)
      .eq('completed', false)
      .order('scheduled_date', { ascending: true })
      .limit(12)

    const { data: members } = await supabase
      .from('roster_members')
      .select('person_name, photo_url')
      .eq('active', true)
    const photoMap: Record<string, string> = {}
    for (const mem of members || []) photoMap[mem.person_name] = mem.photo_url || ''

    const items = (data || []).map(item => ({ ...item, photo_url: photoMap[item.person_name] || '' }))

    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
