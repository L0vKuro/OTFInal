import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params

  const { data: link } = await supabase
    .from('tracking_links')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!link) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Increment click count
  await supabase
    .from('tracking_links')
    .update({ clicks: link.clicks + 1 })
    .eq('id', link.id)

  // Log the click event
  await supabase.from('click_events').insert({
    tracking_link_id: link.id,
    user_agent: req.headers.get('user-agent') || '',
    ip: req.headers.get('x-forwarded-for') || '',
  })

  return NextResponse.redirect(new URL(link.destination_url))
}
