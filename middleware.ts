import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block common attack paths
  const blockedPaths = [
    '/wp-admin', '/wp-login', '/.env', '/phpinfo',
    '/admin.php', '/shell', '/config.php', '/.git',
  ]
  if (blockedPaths.some(p => pathname.startsWith(p))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Block suspicious user agents
  const ua = req.headers.get('user-agent') ?? ''
  const blockedAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab']
  if (blockedAgents.some(a => ua.toLowerCase().includes(a))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
