import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Origin can legitimately be missing on a same-origin POST — some privacy-hardened
// browsers and extensions strip it. Falling back to Referer (and comparing against
// this request's own Host instead of a hardcoded string) avoids blocking real users
// while still rejecting requests that are clearly coming from somewhere else.
function isAllowedRequest(req: NextRequest): boolean {
  const host = req.headers.get('host') ?? ''
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')

  if (origin) {
    if (origin.includes('overtakegg.com') || origin.includes('localhost')) return true
    try { return new URL(origin).host === host } catch { return false }
  }
  if (referer) {
    if (referer.includes('overtakegg.com') || referer.includes('localhost')) return true
    try { return new URL(referer).host === host } catch { return false }
  }
  // Neither header present — unusual, but don't hard-block a real checkout over it.
  return true
}

export async function POST(req: NextRequest) {
  try {
    // Referrer check
    if (!isAllowedRequest(req)) {
      return NextResponse.json({ valid: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const code = (body?.code ?? '').toString().trim().toUpperCase()

    if (!code) {
      return NextResponse.json({ valid: false, message: 'No code entered' })
    }

    const now = new Date()

    // Custom codes created in Supabase (admin-created discount codes) are checked
    // FIRST, before the 3 legacy hardcoded codes below — this table was never
    // actually checked here before, so custom codes could never be applied no
    // matter what you set them to. Checking Supabase first also means a custom
    // code always wins if its name happens to collide with a legacy one (e.g.
    // creating a new "DISCOUNT10"), instead of the old hardcoded/expired version
    // silently intercepting it.
    const { data: row } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code)
      .maybeSingle()

    if (row) {
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
    }

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

    return NextResponse.json({ valid: false, message: 'Invalid discount code' })

  } catch (err) {
    console.error('Discount API error:', err)
    return NextResponse.json({ valid: false, message: 'Invalid discount code' })
  }
}
