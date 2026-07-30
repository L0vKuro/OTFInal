import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const checkAuth = (password: string) => password === process.env.ADMIN_PASSWORD

async function getTwitchToken() {
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  )
  const data = await res.json()
  return data.access_token as string
}

async function countTwitchStreamsInMonth(login: string, period: string, token: string) {
  const [year, month] = period.split('-').map(Number)
  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const monthEnd = new Date(Date.UTC(year, month, 1))

  const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${login}`, {
    headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
  })
  const userData = await userRes.json()
  const userId = userData.data?.[0]?.id
  if (!userId) return 0

  let count = 0
  let cursor = ''
  let keepGoing = true

  while (keepGoing) {
    const url = `https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=100${cursor ? `&after=${cursor}` : ''}`
    const res = await fetch(url, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID!, 'Authorization': `Bearer ${token}` },
    })
    const data = await res.json()
    const videos = data.data || []
    if (videos.length === 0) break

    for (const v of videos) {
      const created = new Date(v.created_at)
      if (created >= monthStart && created < monthEnd) count++
      if (created < monthStart) keepGoing = false
    }

    cursor = data.pagination?.cursor
    if (!cursor) keepGoing = false
  }

  return count
}

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

    case 'getComplianceEntries': {
      const { data } = await supabase
        .from('roster_compliance')
        .select('*')
        .eq('period', body.period)
        .order('person_name', { ascending: true })
      return NextResponse.json({ data })
    }

    case 'upsertComplianceEntry': {
      const { data, error } = await supabase
        .from('roster_compliance')
        .upsert({
          person_name: body.person_name,
          role_type: body.role_type,
          twitch_login: body.twitch_login || '',
          period: body.period,
          twitch_streams: body.twitch_streams ?? 0,
          tiktok_posts: body.tiktok_posts ?? 0,
          yt_shorts: body.yt_shorts ?? 0,
          notes: body.notes || '',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'person_name,period' })
        .select()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }

    case 'deleteComplianceEntry': {
      await supabase.from('roster_compliance').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    case 'copyRosterToPeriod': {
      const { data: source } = await supabase
        .from('roster_compliance')
        .select('*')
        .eq('period', body.fromPeriod)

      if (source && source.length > 0) {
        const rows = source.map((r: any) => ({
          person_name: r.person_name,
          role_type: r.role_type,
          twitch_login: r.twitch_login,
          period: body.toPeriod,
          twitch_streams: 0,
          tiktok_posts: 0,
          yt_shorts: 0,
          notes: '',
        }))
        await supabase
          .from('roster_compliance')
          .upsert(rows, { onConflict: 'person_name,period', ignoreDuplicates: true })
      }

      return NextResponse.json({ success: true })
    }

    case 'syncTwitchStreams': {
      const { data: rows } = await supabase
        .from('roster_compliance')
        .select('*')
        .eq('period', body.period)
        .neq('twitch_login', '')

      if (!rows || rows.length === 0) {
        return NextResponse.json({ success: true, updated: 0 })
      }

      const token = await getTwitchToken()
      let updated = 0

      for (const row of rows) {
        try {
          const count = await countTwitchStreamsInMonth(row.twitch_login, body.period, token)
          await supabase
            .from('roster_compliance')
            .update({ twitch_streams: count, updated_at: new Date().toISOString() })
            .eq('id', row.id)
          updated++
        } catch {
          // skip this creator, keep going
        }
      }

      return NextResponse.json({ success: true, updated })
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}
