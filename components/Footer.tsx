import Link from 'next/link'
import { Twitter, Youtube, Twitch, MessageCircle, ChevronRight } from 'lucide-react'

const socialLinks = [
  { icon: Twitter,       label: 'Twitter',   href: 'https://twitter.com/OvertakeSector' },
  { icon: Youtube,       label: 'YouTube',   href: 'https://youtube.com/@OvertakeSector' },
  { icon: Twitch,        label: 'Twitch',    href: 'https://twitch.tv/OvertakeSector' },
  { icon: MessageCircle, label: 'Discord',   href: 'https://discord.com/invite/OvertakeSector' },
]

const footerLinks = {
  Organization: [
    { href: '/about',    label: 'About Us' },
    { href: '/teams',    label: 'Teams' },
    { href: '/creators', label: 'Creators' },
    { href: '/partners', label: 'Partners' },
  ],
  Engage: [
    { href: '/join',                                     label: 'Join Overtake' },
    { href: '/contact',                                  label: 'Contact' },
    { href: '/#news',                                    label: 'News' },
    { href: 'https://discord.com/invite/OvertakeSector', label: 'Discord' },
  ],
  Legal: [
    { href: '/legal/privacy',  label: 'Privacy Policy' },
    { href: '/legal/terms',    label: 'Terms of Service' },
    { href: '/legal/cookies',  label: 'Cookie Policy' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative bg-[#141414] border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8191A]/4 blur-[100px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center mb-6">
              <img
                src="/wordmark.png"
                alt="OVERTAKE"
                style={{ height: '68px', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }}
              />
            </Link>
            <p className="text-[#F2F2F2]/35 text-sm leading-relaxed max-w-xs mb-6">
              Overtake is a premier competitive esports organization building the next generation of champions in & out of the game.
            </p>
            <a href="https://discord.com/invite/OvertakeSector" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#E8191A]/10 hover:bg-[#E8191A]/20 border border-[#E8191A]/30 px-5 py-3 rounded-sm text-sm font-medium text-[#E8191A] hover:text-[#F2F2F2] transition-all group">
              <MessageCircle size={16} />
              Join our Discord
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold tracking-widest uppercase text-[#E8191A] mb-5"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.2em' }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[#F2F2F2]/35 hover:text-[#F2F2F2] text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5" />

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#F2F2F2]/20 text-xs font-mono">
            © {new Date().getFullYear()} OVERTAKE SECTOR LLC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-8 h-8 flex items-center justify-center text-[#F2F2F2]/25 hover:text-[#F2F2F2] border border-white/5 hover:border-[#E8191A]/40 hover:bg-[#E8191A]/10 rounded transition-all">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
