import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

const resend = new Resend(process.env.RESEND_API_KEY ?? '')

type OrderItem = {
  name: string
  size: string
  nameOnBack: string
  numberOnBack: string
  isVNeck: boolean
  price: number
}

function itemsTableRows(items: OrderItem[]): string {
  return items.map(item => `
    <tr>
      <td style="color:#F2F2F2;font-size:14px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${item.name} (${item.size})</td>
      <td style="color:#F2F2F2;opacity:0.6;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${item.nameOnBack}${item.isVNeck ? ` #${item.numberOnBack}` : ''}</td>
      <td style="color:#E8191A;font-size:14px;font-weight:bold;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;">$${item.price}.00</td>
    </tr>`).join('')
}

function customerEmailHtml(opts: { customerName: string; items: OrderItem[]; address: string; city: string; state: string; zip: string; country: string; discountLabel: string; total: string; orderId: string }): string {
  const { customerName, items, address, city, state, zip, country, discountLabel, total, orderId } = opts
  return `
    <!DOCTYPE html>
    <html>
      <body style="background:#0D0D0D;color:#F2F2F2;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
        <div style="max-width:600px;margin:0 auto;">
          <div style="border-bottom:2px solid #E8191A;padding-bottom:20px;margin-bottom:30px;">
            <h1 style="color:#E8191A;font-size:32px;margin:0;text-transform:uppercase;letter-spacing:2px;">OVERTAKE SECTOR</h1>
            <p style="color:#F2F2F2;opacity:0.4;margin:4px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Order Confirmation</p>
          </div>
          <h2 style="color:#F2F2F2;font-size:24px;text-transform:uppercase;">Your Order is Confirmed! 🎯</h2>
          <p style="color:#F2F2F2;opacity:0.6;line-height:1.6;">Hey ${customerName}, thanks for repping Overtake — your order is confirmed and we're on it.</p>
          <div style="background:#141414;border:1px solid rgba(255,255,255,0.1);border-left:3px solid #E8191A;padding:24px;margin:24px 0;">
            <h3 style="color:#E8191A;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Order Summary</h3>
            <table style="width:100%;border-collapse:collapse;">${itemsTableRows(items)}</table>
            ${discountLabel !== 'None' ? `<p style="color:#00A878;font-size:13px;margin:12px 0 0;">Discount applied: ${discountLabel}</p>` : ''}
            <p style="color:#F2F2F2;font-size:18px;font-weight:bold;margin:16px 0 0;text-align:right;">Total: <span style="color:#E8191A;">$${total}</span></p>
            <p style="color:#F2F2F2;opacity:0.3;font-size:11px;margin:12px 0 0;">Order ID: ${orderId}</p>
          </div>
          <div style="background:#141414;border:1px solid rgba(255,255,255,0.1);border-left:3px solid #E8191A;padding:24px;margin:24px 0;">
            <h3 style="color:#E8191A;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Shipping To</h3>
            <p style="color:#F2F2F2;opacity:0.8;margin:0;line-height:1.8;">${customerName}<br>${address}<br>${city}, ${state} ${zip}<br>${country}</p>
          </div>
          <p style="color:#F2F2F2;opacity:0.4;font-size:13px;line-height:1.6;">Questions? Contact us at <a href="mailto:overtakesect@gmail.com" style="color:#E8191A;">overtakesect@gmail.com</a></p>
          <div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;padding-top:20px;text-align:center;">
            <p style="color:#E8191A;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0;">#OvertakeYourLimits</p>
            <p style="color:#F2F2F2;opacity:0.2;font-size:11px;margin:8px 0 0;">Overtake Sector · overtakegg.com</p>
          </div>
        </div>
      </body>
    </html>`
}

function ownerEmailHtml(opts: { customerName: string; customerEmail: string; items: OrderItem[]; address: string; city: string; state: string; zip: string; country: string; discountLabel: string; total: string; orderId: string }): string {
  const { customerName, customerEmail, items, address, city, state, zip, country, discountLabel, total, orderId } = opts
  return `
    <!DOCTYPE html>
    <html>
      <body style="background:#0D0D0D;color:#F2F2F2;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
        <div style="max-width:600px;margin:0 auto;">
          <h1 style="color:#E8191A;font-size:24px;text-transform:uppercase;">🛒 New Order Received!</h1>
          <div style="background:#141414;border:1px solid rgba(255,255,255,0.1);border-left:3px solid #E8191A;padding:24px;margin:24px 0;">
            <h3 style="color:#E8191A;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Customer Info</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Name</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${customerName}</td></tr>
              <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Email</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${customerEmail}</td></tr>
              <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Address</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${address}, ${city}, ${state} ${zip}, ${country}</td></tr>
            </table>
          </div>
          <div style="background:#141414;border:1px solid rgba(255,255,255,0.1);border-left:3px solid #E8191A;padding:24px;margin:24px 0;">
            <h3 style="color:#E8191A;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Order Details</h3>
            <table style="width:100%;border-collapse:collapse;">${itemsTableRows(items)}</table>
            ${discountLabel !== 'None' ? `<p style="color:#00A878;font-size:13px;margin:12px 0 0;">Discount applied: ${discountLabel}</p>` : ''}
            <p style="color:#F2F2F2;font-size:18px;font-weight:bold;margin:16px 0 0;text-align:right;">Total charged: <span style="color:#E8191A;">$${total}</span></p>
            <p style="color:#F2F2F2;opacity:0.3;font-size:11px;margin:12px 0 0;">Stripe Session: ${orderId}</p>
          </div>
        </div>
      </body>
    </html>`
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Must read the raw body (not req.json()) — Stripe's signature is computed over
  // the exact bytes it sent, and JSON.parse/stringify round-tripping would break it.
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata || {}
    const itemCount = parseInt(metadata.itemCount || '0', 10) || 0
    const items: OrderItem[] = []
    for (let i = 0; i < itemCount; i++) {
      const raw = metadata[`item_${i}`]
      if (raw) {
        try { items.push(JSON.parse(raw)) } catch {}
      }
    }

    const customerName = metadata.customerName || 'Customer'
    const customerEmail = metadata.customerEmail || session.customer_email || ''
    const total = ((session.amount_total || 0) / 100).toFixed(2)
    const orderInfo = {
      customerName,
      items,
      address: metadata.address || '',
      city: metadata.city || '',
      state: metadata.state || '',
      zip: metadata.zip || '',
      country: metadata.country || '',
      discountLabel: metadata.discountLabel || 'None',
      total,
      orderId: session.id,
    }

    try {
      if (customerEmail) {
        await resend.emails.send({
          from: 'Overtake Store <store@overtakegg.com>',
          to: customerEmail,
          subject: '🎯 Your Overtake Order is Confirmed!',
          html: customerEmailHtml(orderInfo),
        })
      }
      await resend.emails.send({
        from: 'Overtake Store <store@overtakegg.com>',
        to: ['dalmazank7@gmail.com', 'samuel.rojas504@gmail.com'],
        subject: `🛒 New Order — ${customerName} ($${total})`,
        html: ownerEmailHtml({ ...orderInfo, customerEmail }),
      })
    } catch (err) {
      console.error('Order confirmation email failed:', err)
      // Don't fail the webhook over an email issue — Stripe already has the payment
      // recorded. Returning 500 here would just cause Stripe to retry indefinitely.
    }
  }

  return NextResponse.json({ received: true })
}
