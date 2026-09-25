import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Public, read-only. Returns whatever admin-entered competitive stats exist
// for any team (rank, record, roster match counts, recent matches). A team
// with no row here just isn't included — the public page falls back to its
// static roster with no rank/match info for that team.
export async function GET() {
  const { data } = await supabase.from('team_stats').select('*')
  return NextResponse.json({ data: data || [] })
}
