import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // Referrer check
    const origin = req.headers.get('origin') ?? ''
    if (!origin.includes('overtakegg.com') && !origin.includes('localhost')) {
      return NextResponse.json({ valid: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const code = (body?.code ?? '').toString().trim().toUpperCase()

    if (!code) {
      return NextResponse.json({ valid: false, message: 'No code entered' })
    }

    // Check codes created in the admin dashboard first
    const { data: row } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code)
      .maybeSingle()

    if (row) {
      if (row.expires_at && new Date() > new Date(row.expires_at)) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      if (row.max_uses !== null && row.uses >= row.max_uses) {
        return NextResponse.json({ valid: false, message: 'This discount code has reached its usage limit' })
      }

      // Track usage against max_uses
      await supabase.from('discount_codes').update({ uses: row.uses + 1 }).eq('id', row.id)

      return NextResponse.json({ valid: true, type: row.type, value: row.value })
    }

    // Legacy hardcoded codes — kept working in case any of these were already shared publicly
    const now = new Date()

    if (code === 'MEMBER15') {
      if (now > new Date('2027-01-01')) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, type: 'percent', value: 15 })
    }

    if (code === 'DISCOUNT10') {
      if (now > new Date('2026-07-01')) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, type: 'percent', value: 10 })
    }

    if (code === 'YKEEKDGHFMSU') {
      if (now > new Date('2026-07-01')) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, type: 'percent', value: 25 })
    }

    return NextResponse.json({ valid: false, message: 'Invalid discount code' })

  } catch (err) {
    console.error('Discount API error:', err)
    return NextResponse.json({ valid: false, message: 'Invalid discount code' })
  }
}
