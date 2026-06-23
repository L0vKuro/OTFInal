'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronRight, ShoppingBag, Trash2 } from 'lucide-react'
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
  const lastScroll = useRef(0)
  const pathname = usePathname()
  const router = useRouter()
  const { items, removeItem, total, count } = useCart()

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

  useEffect(() => { setMenuOpen(false); setCartOpen(false) }, [pathname])

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
                className={`nav-link px-4 py-2 text-sm font-medium tracking-wider uppercase transition-colors ${
                  pathname === link.href ? 'text-[#E8191A]' : 'text-[#F2F2F2]/55 hover:text-[#F2F2F2]'
                }`}
                style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.12em' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {/* Cart Button — visible on all screen sizes */}
            <button onClick={() => setCartOpen(!cartOpen)}
              className="relative flex items-center justify-center border border-white/10 hover:border-[#E8191A]/50 hover:text-[#E8191A] text-[#F2F2F2]/50 transition-all p-3">
              <ShoppingBag size={16} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E8191A] text-white text-[10px] font-black flex items-center justify-center rounded-full">
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

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed top-0 right-0 h-full w-80 bg-[#141414] border-l border-white/5 z-50 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#E8191A]" />
              <h2 className="font-display font-black text-lg uppercase text-[#F2F2F2]"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Cart {count > 0 && <span className="text-[#E8191A]">({count})</span>}
              </h2>
            </div>
            <button onClick={() => setCartOpen(false)} className="text-[#F2F2F2]/40 hover:text-[#F2F2F2]">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={32} className="text-[#F2F2F2]/10 mx-auto mb-3" />
                <p className="text-[#F2F2F2]/30 text-sm font-mono">Your cart is empty</p>
              </div>
            ) : (
              items.map((item, i) => (
                <div key={i} className="bg-[#0D0D0D] border border-white/5 p-4">
                  <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-3" />
                  <div className="flex gap-3">
                    <img src={item.image} alt={item.name}
                      style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#141414', padding: '4px', borderRadius: '4px', flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-black text-sm uppercase text-[#F2F2F2] leading-tight mb-1"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{item.name}</h4>
                      <p className="text-[#F2F2F2]/40 text-xs font-mono">Size: {item.size}</p>
                      <p className="text-[#F2F2F2]/40 text-xs font-mono">Name: {item.nameOnBack}</p>
                      {item.isVNeck && <p className="text-[#F2F2F2]/40 text-xs font-mono">#{item.numberOnBack}</p>}
                      <p className="text-[#E8191A] font-black text-sm mt-1">${item.price}.00</p>
                    </div>
                    <button onClick={() => removeItem(i)}
                      className="text-[#F2F2F2]/20 hover:text-[#E8191A] transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#F2F2F2]/40 text-sm font-mono uppercase">Total</span>
                <span className="font-display font-black text-2xl text-[#E8191A]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>${total}.00</span>
              </div>
              <button
                onClick={goToCheckout}
                className="flex items-center justify-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-4 font-black tracking-widest uppercase text-sm transition-all text-white w-full clip-corner"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Checkout <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cart overlay */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setCartOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-[#0D0D0D]/95 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-[#141414] border-l border-white/5 flex flex-col transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <img src="/wordmark.png" alt="OVERTAKE"
              style={{ height: '36px', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }} />
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
          <div className="p-4 border-t border-white/5 space-y-3">
            <button
              onClick={goToCheckout}
              className="flex items-center justify-center gap-2 border border-white/10 hover:border-[#E8191A]/50 px-5 py-3 text-sm font-bold tracking-widest uppercase transition-all w-full text-[#F2F2F2]/60 hover:text-[#F2F2F2]"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <ShoppingBag size={14} /> Cart {count > 0 && `(${count})`}
            </button>
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
