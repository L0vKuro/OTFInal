import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// Public — powers the /checkout/success page. Only ever called with a session_id
// that Stripe itself put in the redirect URL, so there's nothing to guess/enumerate.
// Used purely to display an order summary; email sending happens from the webhook,
// not from here, so a user closing the tab before this loads doesn't lose their
// confirmation email.
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id')
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
    }

    const metadata = session.metadata || {}
    const itemCount = parseInt(metadata.itemCount || '0', 10) || 0
    const items = []
    for (let i = 0; i < itemCount; i++) {
      const raw = metadata[`item_${i}`]
      if (raw) {
        try { items.push(JSON.parse(raw)) } catch {}
      }
    }

    return NextResponse.json({
      customerName: metadata.customerName || '',
      customerEmail: metadata.customerEmail || session.customer_email || '',
      items,
      discountLabel: metadata.discountLabel || 'None',
      total: ((session.amount_total || 0) / 100).toFixed(2),
    })
  } catch (error) {
    console.error('Session lookup error:', error)
    return NextResponse.json({ error: 'Could not load order' }, { status: 500 })
  }
}
