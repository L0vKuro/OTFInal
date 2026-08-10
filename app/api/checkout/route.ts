import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { stripe } from '@/lib/stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
})

type CartItem = {
  name: string
  price: number
  size: string
  nameOnBack: string
  numberOnBack: string
  isVNeck: boolean
}

// Re-checks a discount code server-side instead of trusting the type/value the
// client sends — mirrors the lookup in /api/discount, but doesn't increment
// `uses` again since that already happened when the code was applied at checkout.
async function revalidateDiscount(code: string): Promise<{ type: 'percent' | 'fixed'; value: number; label: string } | null> {
  if (!code) return null
  const upper = code.trim().toUpperCase()
  if (!upper) return null

  const { data: row } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', upper)
    .maybeSingle()

  if (row) {
    if (row.expires_at && new Date() > new Date(row.expires_at)) return null
    if (row.max_uses !== null && row.uses > row.max_uses) return null
    return { type: row.type, value: row.value, label: `${row.type === 'percent' ? row.value + '%' : '$' + row.value} off (${upper})` }
  }

  const now = new Date()
  if (upper === 'MEMBER15' && now <= new Date('2027-01-01')) return { type: 'percent', value: 15, label: `15% off (${upper})` }
  if (upper === 'DISCOUNT10' && now <= new Date('2026-07-01')) return { type: 'percent', value: 10, label: `10% off (${upper})` }
  if (upper === 'YKEEKDGHFMSU' && now <= new Date('2026-07-01')) return { type: 'percent', value: 25, label: `25% off (${upper})` }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') ?? ''
    if (!origin.includes('overtakegg.com') && !origin.includes('localhost')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const items: CartItem[] = Array.isArray(body?.items) ? body.items : []
    const form = body?.form ?? {}
    const discountCode = (body?.discountCode ?? '').toString()

    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (items.length > 20) {
      return NextResponse.json({ error: 'Too many items in cart' }, { status: 400 })
    }

    const requiredForm = ['customerName', 'customerEmail', 'address', 'city', 'state', 'zip', 'country']
    for (const field of requiredForm) {
      const value = form[field]
      if (!value || typeof value !== 'string' || value.trim().length === 0 || value.length > 200) {
        return NextResponse.json({ error: `Invalid field: ${field}` }, { status: 400 })
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    for (const item of items) {
      if (!item.name || typeof item.price !== 'number' || item.price <= 0 || item.price > 1000 || !item.size || !item.nameOnBack) {
        return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
      }
    }

    const discount = await revalidateDiscount(discountCode)

    let couponId: string | undefined
    if (discount) {
      const coupon = await stripe.coupons.create(
        discount.type === 'percent'
          ? { percent_off: discount.value, duration: 'once', name: discount.label }
          : { amount_off: Math.round(discount.value * 100), currency: 'usd', duration: 'once', name: discount.label }
      )
      couponId = coupon.id
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.name} — Size ${item.size}`,
          description: item.isVNeck ? `Name: ${item.nameOnBack} · #${item.numberOnBack}` : `Name: ${item.nameOnBack}`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }))

    // Stripe metadata values are capped at 500 chars each — one key per item keeps
    // each value well under that instead of risking truncation on one big JSON blob.
    const metadata: Record<string, string> = {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      discountLabel: discount ? discount.label : 'None',
      itemCount: String(items.length),
    }
    items.forEach((item, i) => {
      metadata[`item_${i}`] = JSON.stringify({
        name: item.name,
        size: item.size,
        nameOnBack: item.nameOnBack,
        numberOnBack: item.numberOnBack,
        isVNeck: item.isVNeck,
        price: item.price,
      })
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: form.customerEmail,
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      metadata,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 })
  }
}
