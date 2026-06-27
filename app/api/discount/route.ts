import { NextRequest, NextResponse } from 'next/server'

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

    if (code === 'MEMBER15') {
      if (now > new Date('2027-01-01')) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, percent: 15 })
    }

    if (code === 'DISCOUNT10') {
      if (now > new Date('2026-07-01')) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, percent: 10 })
    }

    if (code === 'YKEEKDGHFMSU') {
      if (now > new Date('2026-07-01')) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, percent: 25 })
    }

    return NextResponse.json({ valid: false, message: 'Invalid discount code' })

  } catch (err) {
    console.error('Discount API error:', err)
    return NextResponse.json({ valid: false, message: 'Invalid discount code' })
  }
}
