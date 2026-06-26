import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY ?? '')
    const order = await req.json()

    const {
      customerName,
      customerEmail,
      address,
      city,
      state,
      zip,
      country,
      product,
      size,
      nameOnBack,
      numberOnBack,
      price,
      paypalOrderId,
    } = order

    const isVNeck = product.includes('V-NECK')

    const customerEmailHtml = `
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
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Product</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${product}</td></tr>
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Size</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${size}</td></tr>
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Name on Back</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${nameOnBack}</td></tr>
                ${isVNeck ? `<tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Number on Back</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${numberOnBack}</td></tr>` : ''}
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Price</td><td style="color:#E8191A;font-size:14px;font-weight:bold;padding:6px 0;">${price}</td></tr>
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Order ID</td><td style="color:#F2F2F2;opacity:0.6;font-size:12px;padding:6px 0;">${paypalOrderId}</td></tr>
              </table>
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
      </html>
    `

    const ownerEmailHtml = `
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
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Product</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${product}</td></tr>
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Size</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${size}</td></tr>
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Name on Back</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${nameOnBack}</td></tr>
                ${isVNeck ? `<tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Number on Back</td><td style="color:#F2F2F2;font-size:14px;padding:6px 0;">${numberOnBack}</td></tr>` : ''}
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">Price</td><td style="color:#E8191A;font-size:14px;font-weight:bold;padding:6px 0;">${price}</td></tr>
                <tr><td style="color:#F2F2F2;opacity:0.4;font-size:12px;padding:6px 0;text-transform:uppercase;">PayPal Order ID</td><td style="color:#F2F2F2;opacity:0.6;font-size:12px;padding:6px 0;">${paypalOrderId}</td></tr>
              </table>
            </div>
          </div>
        </body>
      </html>
    `

    await resend.emails.send({
      from: 'Overtake Store <store@overtakegg.com>',
      to: customerEmail,
      subject: '🎯 Your Overtake Order is Confirmed!',
      html: customerEmailHtml,
    })

    await resend.emails.send({
      from: 'Overtake Store <onboarding@resend.dev>',
      to: ['dalmazank7@gmail.com', 'samuel.rojas504@gmail.com'],
      subject: `🛒 New Order: ${product} — ${customerName}`,
      html: ownerEmailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
