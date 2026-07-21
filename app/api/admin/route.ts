import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const checkAuth = (password: string) => password === process.env.ADMIN_PASSWORD

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

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}
