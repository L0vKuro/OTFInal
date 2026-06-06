'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronRight } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/teams', label: 'Teams' },
  { href: '/creators', label: 'Creators' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center group">
            <img
              src="/overtake-wordmark.png"
              alt="OVERTAKE"
              style={{ height: '52px', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }}
            />
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`nav-link px-4 py-2 text-sm font-medium tracking-wider uppercase transition-colors ${
                  pathname === link.href ? 'text-[#E8191A]' : 'text-[#F2F2F2]/55 hover:text-[#F2F2F2]'
                }`}
                style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.12em' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── CTA + Toggle ── */}
          <div className="flex items-center gap-4">
            <Link href="/join"
              className="hidden sm:flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 text-sm font-bold tracking-widest uppercase transition-all hover:shadow-[0_0_20px_rgba(232,25,26,0.4)] clip-corner text-[#F2F2F2]"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Join Overtake <ChevronRight size={14} />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#F2F2F2]/55 hover:text-[#F2F2F2] transition-colors p-1">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-[#0D0D0D]/95 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-[#141414] border-l border-white/5 flex flex-col transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <img
              src="/overtake-wordmark.png"
              alt="OVERTAKE"
              style={{ height: '36px', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }}
            />
            <button onClick={() => setMenuOpen(false)} className="text-[#F2F2F2]/40 hover:text-[#F2F2F2]">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col p-4 gap-1 flex-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-sm text-sm font-medium tracking-wider uppercase border transition-all ${
                  pathname === link.href
                    ? 'text-[#E8191A] border-[#E8191A]/20 bg-[#E8191A]/5'
                    : 'text-[#F2F2F2]/55 hover:text-[#F2F2F2] border-transparent hover:border-white/10 hover:bg-white/5'
                }`}
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {link.label}
                <ChevronRight size={14} className="opacity-40" />
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-white/5">
            <Link href="/join"
              className="flex items-center justify-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-5 py-3 text-sm font-bold tracking-widest uppercase transition-all w-full text-[#F2F2F2] clip-corner"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Join Overtake <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
