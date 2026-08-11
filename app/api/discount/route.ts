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

    const now = new Date()

    // Legacy hardcoded codes — response shape matches what the checkout page
    // expects (type/value), not the old percent-only shape.
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

    // Custom codes created in Supabase (admin-created discount codes) — this
    // table was never actually checked here before, so custom codes could
    // never be applied no matter what you set them to.
    const { data: row } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code)
      .maybeSingle()

    if (!row) {
      return NextResponse.json({ valid: false, message: 'Invalid discount code' })
    }
    if (row.expires_at && now > new Date(row.expires_at)) {
      return NextResponse.json({ valid: false, message: 'This discount code has expired' })
    }
    if (row.max_uses !== null && row.uses >= row.max_uses) {
      return NextResponse.json({ valid: false, message: 'This discount code has reached its usage limit' })
    }

    // Count this as a use now that it's confirmed valid and is being applied
    // to a cart. /api/checkout re-validates at final payment but intentionally
    // doesn't increment again, since that already happens here.
    await supabase
      .from('discount_codes')
      .update({ uses: row.uses + 1 })
      .eq('code', code)

    return NextResponse.json({ valid: true, type: row.type, value: row.value })

  } catch (err) {
    console.error('Discount API error:', err)
    return NextResponse.json({ valid: false, message: 'Invalid discount code' })
  }
}
