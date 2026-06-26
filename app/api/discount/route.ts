import { NextRequest, NextResponse } from 'next/server'

const DISCOUNT_CODE = 'DISCOUNT10'
const DISCOUNT_PERCENT = 10
const DISCOUNT_EXPIRY = new Date('2026-07-01')

const TEST_CODE = 'TEST90'
const TEST_PERCENT = 90
const TEST_EXPIRY = new Date('2026-07-01')

const MEMBER_CODE = 'OVER18TAKE'
const MEMBER_PERCENT = 18
const MEMBER_EXPIRY = new Date('2027-01-01')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const code = (body?.code ?? '').toString().trim().toUpperCase()

    if (!code) {
      return NextResponse.json({ valid: false, message: 'No code entered' })
    }

    if (code === TEST_CODE) {
      if (new Date() > TEST_EXPIRY) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, percent: TEST_PERCENT })
    }

    if (code === MEMBER_CODE) {
      if (new Date() > MEMBER_EXPIRY) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, percent: MEMBER_PERCENT })
    }

    if (code === DISCOUNT_CODE) {
      if (new Date() > DISCOUNT_EXPIRY) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, percent: DISCOUNT_PERCENT })
    }

    return NextResponse.json({ valid: false, message: 'Invalid discount code' })

  } catch {
    return NextResponse.json({ valid: false, message: 'Something went wrong' })
  }
}
