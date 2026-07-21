import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const checkAuth = (password: string) => password === process.env.ADMIN_PASSWORD

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action, password } = body

  if (action !== 'login' && !checkAuth(password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  switch (action) {
    case 'login':
      return NextResponse.json({ success: body.password === process.env.ADMIN_PASSWORD })

    case 'getCodes': {
      const { data } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false })
      return NextResponse.json({ data })
    }

    case 'createCode': {
      const { data } = await supabase.from('discount_codes').insert({
        code: body.code,
        type: body.type,
        value: body.value,
        max_uses: body.max_uses || null,
        expires_at: body.expires_at || null,
        notes: body.notes || '',
      }).select()
      return NextResponse.json({ data })
    }

    case 'deleteCode': {
      await supabase.from('discount_codes').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    case 'getLinks': {
      const { data } = await supabase.from('tracking_links').select('*').order('created_at', { ascending: false })
      return NextResponse.json({ data })
    }

    case 'createLink': {
      const { data } = await supabase.from('tracking_links').insert({
        name: body.name,
        slug: body.slug,
        destination_url: body.destination_url,
        sent_to: body.sent_to || '',
        notes: body.notes || '',
      }).select()
      return NextResponse.json({ data })
    }

    case 'deleteLink': {
      await supabase.from('tracking_links').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    case 'getOrderEmails': {
      const { data } = await supabase.from('order_emails').select('*').order('sent_at', { ascending: false })
      return NextResponse.json({ data })
    }

    case 'sendTrackingEmail': {
      const { customer_name, customer_email, order_number, tracking_url, notes } = body

      const { error } = await resend.emails.send({
        from: 'Overtake Store <orders@overtakegg.com>',
        to: customer_email,
        subject: `Your Overtake Order #${order_number} Has Shipped!`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:'Arial',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid rgba(255,255,255,0.08);max-width:600px;width:100%;">
          
          <!-- Red top bar -->
          <tr>
            <td style="background:#E8191A;height:4px;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <img src="https://overtakegg.com/wordmark.png" alt="OVERTAKE" style="height:48px;mix-blend-mode:screen;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:rgba(242,242,242,0.4);font-size:11px;font-family:monospace;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 16px;">// Order Update</p>
              <h1 style="color:#F2F2F2;font-size:32px;font-weight:900;text-transform:uppercase;margin:0 0 8px;letter-spacing:0.05em;">
                YOUR ORDER<br/><span style="color:#E8191A;">HAS SHIPPED</span>
              </h1>
              <p style="color:rgba(242,242,242,0.5);font-size:15px;margin:20px 0 0;">
                Hey ${customer_name},
              </p>
              <p style="color:rgba(242,242,242,0.5);font-size:15px;line-height:1.6;margin:12px 0 32px;">
                Your Overtake order <strong style="color:#F2F2F2;">#${order_number}</strong> is on its way. Click the button below to track your package in real time.
              </p>

              <!-- Order number badge -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:rgba(232,25,26,0.08);border:1px solid rgba(232,25,26,0.25);padding:12px 20px;">
                    <span style="color:rgba(242,242,242,0.4);font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:0.15em;">Order Number</span><br/>
                    <span style="color:#F2F2F2;font-size:20px;font-weight:900;letter-spacing:0.1em;">#${order_number}</span>
                  </td>
                </tr>
              </table>

              <!-- Track button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                <tr>
                  <td style="background:#E8191A;">
                    <a href="${tracking_url}" target="_blank"
                      style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;">
                      TRACK MY PACKAGE →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:rgba(242,242,242,0.3);font-size:13px;line-height:1.6;margin:0;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${tracking_url}" style="color:#E8191A;word-break:break-all;">${tracking_url}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,#E8191A,transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:30px 40px;text-align:center;">
              <p style="color:rgba(242,242,242,0.2);font-size:11px;font-family:monospace;margin:0 0 8px;">
                © 2026 OVERTAKE SECTOR LLC. ALL RIGHTS RESERVED.
              </p>
              <p style="color:rgba(242,242,242,0.2);font-size:11px;font-family:monospace;margin:0;">
                Questions? Contact us at <a href="mailto:orders@overtakegg.com" style="color:#E8191A;">orders@overtakegg.com</a>
              </p>
            </td>
          </tr>

          <!-- Bottom red bar -->
          <tr>
            <td style="background:#E8191A;height:2px;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Log the sent email
      await supabase.from('order_emails').insert({
        customer_name,
        customer_email,
        order_number,
        tracking_url,
        notes: notes || '',
      })

      return NextResponse.json({ success: true })
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}
