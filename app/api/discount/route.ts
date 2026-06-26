import { NextRequest, NextResponse } from 'next/server'

const DISCOUNT_CODE = 'DISCOUNT10'
const DISCOUNT_PERCENT = 10
const DISCOUNT_EXPIRY = new Date('2026-07-01')

const TEST_CODE = 'TEST90'
const TEST_PERCENT = 90
const TEST_EXPIRY = new Date('2026-07-01')

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (code.toUpperCase() === TEST_CODE) {
      if (new Date() > TEST_EXPIRY) {
        return NextResponse.json({ valid: false, message: 'This discount code has expired' })
      }
      return NextResponse.json({ valid: true, percent: TEST_PERCENT })
    }

    if (code.toUpperCase() !== DISCOUNT_CODE) {
      return NextResponse.json({ valid: false, message: 'Invalid discount code' })
    }

    if (new Date() > DISCOUNT_EXPIRY) {
      return NextResponse.json({ valid: false, message: 'This discount code has expired' })
    }

    return NextResponse.json({ valid: true, percent: DISCOUNT_PERCENT })
  } catch {
    return NextResponse.json({ valid: false, message: 'Something went wrong' })
  }
}
