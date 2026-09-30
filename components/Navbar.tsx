'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronRight, ShoppingBag, Trash2, Check } from 'lucide-react'
import { useCart } from '@/components/CartContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/teams', label: 'Teams' },
  { href: '/creators', label: 'Creators' },
  { href: '/events', label: 'Events' },
  { href: '/store', label: 'Store' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const lastScroll = useRef(0)
  const prevCount = useRef(0)
  const pathname = usePathname()
  const router = useRouter()
  const { items, removeItem, total, count, lastAdded } = useCart()

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      setHidden(current > lastScroll.current && current > 80)
      setScrolled(current > 20)
      lastScroll.current = current
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (count > prevCount.current) {
      setCartBump(true)
      setTimeout(() => setCartBump(false), 400)
      setCartOpen(true)
    }
    prevCount.current = count
  }, [count])

  useEffect(() => { setMenuOpen(false); setCartOpen(false) }, [pathname])

  if (pathname.startsWith('/admin')) return null

  const goToCheckout = () => {
    setCartOpen(false)
    setMenuOpen(false)
    router.push('/checkout')
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        scrolled ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <img src="/wordmark.png" alt="OVERTAKE"
              style={{ height: '138px', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }} />
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`nav-link px-4 py-2 text-base font-bold tracking-wider uppercase transition-colors ${
                  pathname === link.href ? 'text-[#E8191A]' : 'text-[#F2F2F2]/55 hover:text-[#F2F2F2]'
                }`}
                style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.12em' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(!cartOpen)}
              className={`relative flex items-center justify-center border hover:border-[#E8191A]/50 hover:text-[#E8191A] text-[#F2F2F2]/50 transition-all p-3 ${
                cartOpen ? 'border-[#E8191A]/50 text-[#E8191A]' : 'border-white/10'
              } ${cartBump ? 'scale-125' : 'scale-100'}`}
              style={{ transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s, color 0.2s' }}>
              <ShoppingBag size={16} />
              {count > 0 && (
                <span className={`absolute -top-2 -right-2 w-5 h-5 bg-[#E8191A] text-white text-[10px] font-black flex items-center justify-center rounded-full transition-transform ${
                  cartBump ? 'scale-125' : 'scale-100'
                }`}>
                  {count}
                </span>
              )}
            </button>
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

      {lastAdded && (
        <div className="fixed top-24 right-4 z-[60] animate-in slide-in-from-right duration-300">
          <div className="bg-[#141414] border border-[#00A878]/40 px-4 py-3 flex items-center gap-3 shadow-2xl max-w-xs">
            <div className="w-6 h-6 bg-[#00A878] rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={12} className="text-white" />
            </div>
            <div>
              <p className="text-[#F2F2F2] text-xs font-black uppercase"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Added to cart!</p>
              <p className="text-[#F2F2F2]/40 text-xs font-mono">{lastAdded.name} — {lastAdded.size}</p>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed top-0 right-0 h-full w-80 bg-[#141414] border-l border-white/5 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#E8191A]" />
            <h2 className="font-display font-black text-lg uppercase text-[#F2F2F2]"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Cart {count > 0 && <span className="text-[#E8191A]">({count})</span>}
            </h2>
          </div>
          <button onClick={() => setCartOpen(false)} className="text-[#F2F2F2]/40 hover:text-[#F2F2F2] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={32} className="text-[#F2F2F2]/10 mx-auto mb-3" />
              <p className="text-[#F2F2F2]/30 text-sm font-mono">Your cart is empty</p>
              <button onClick={() => { setCartOpen(false); router.push('/store') }}
                className="mt-4 text-[#E8191A] text-xs font-mono uppercase tracking-widest hover:underline">
                Browse Store →
              </button>
            </div>
          ) : (
            items.map((item, i) => (
              <div key={i} className="bg-[#0D0D0D] border border-white/5 p-4 transition-all hover:border-white/10">
                <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-3" />
                <div className="flex gap-3">
                  <img src={item.image} alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'contain',
