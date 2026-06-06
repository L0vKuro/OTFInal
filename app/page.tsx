'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, MessageCircle, ArrowRight } from 'lucide-react'
import { teams, news } from '@/lib/data'

const stats = [
  { label: 'Active Rosters', value: '8', unit: '' },
  { label: 'Tournament Wins', value: '20', unit: '+' },
  { label: 'Followers', value: '5K', unit: '+' },
  { label: 'Engagements', value: '3M', unit: '+' },
]

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const lastScroll = useRef(0)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleYes = () => {
    setFadeOut(true)
    setTimeout(() => setSplashDone(true), 700)
  }

  const handleNo = () => {
    window.location.href = 'https://x.com/OvertakeSector'
  }

  return (
    <>
      {/* ─── SPLASH SCREEN ─── */}
      {!splashDone && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0D0D0D] transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#E8191A]/12 blur-[160px] rounded-full animate-pulse" />
          <div className="relative z-10 flex flex-col items-center text-center px-6 w-full">
            <div className="relative mb-8" style={{ width: 'min(600px, 90vw)', height: 'min(180px, 27vw)', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 40px rgba(232,25,26,0.5))' }}>
              <Image src="/wordmark.png" alt="Overtake" fill className="object-contain" priority />
            </div>
            <h1 className="font-display font-black text-3xl md:text-6xl uppercase text-[#F2F2F2] mb-2 leading-tight"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              ARE YOU READY TO
            </h1>
            <h2 className="font-display font-black text-4xl md:text-7xl uppercase leading-tight mb-10"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', background: 'linear-gradient(135deg, #FF3334, #E8191A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              OVERTAKE YOUR LIMITS?
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <button onClick={handleYes}
                className="group flex items-center justify-center gap-3 bg-[#E8191A] hover:bg-[#B81011] font-black tracking-widest uppercase text-xl transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.6)] text-[#F2F2F2]"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', width: '200px', height: '64px', clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}>
                YES <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={handleNo}
                className="flex items-center justify-center font-black tracking-widest uppercase text-xl text-[#F2F2F2]/60 hover:text-[#F2F2F2] border border-white/20 hover:border-white/40 transition-all"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', width: '200px', height: '64px', clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}>
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN SITE ─── */}
      <div className={`transition-opacity duration-700 ${splashDone ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[#0D0D0D]" />
          <div className="absolute inset-0">
            <img src="/overtake-wallpaper.png" alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.18, position: 'absolute', inset: 0 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/60" />
          </div>
          <div className="absolute inset-0 bg-grid opacity-25" />
          <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute top-0 right-0 w-px h-full bg-[#E8191A]/40"
                style={{ right: `${i * 60}px`, transform: 'skewX(-15deg)', transformOrigin: 'top' }} />
            ))}
          </div>
          <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16 w-full">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 border border-[#E8191A]/30 bg-[#E8191A]/5 px-4 py-1.5 rounded-sm mb-6">
                <div className="w-1.5 h-1.5 bg-[#E8191A] rounded-full animate-pulse" />
                <span className="text-xs font-mono text-[#E8191A] tracking-widest uppercase">Season 2026 — Now Recruiting</span>
              </div>
              <h1 className="font-display font-black uppercase leading-none mb-5" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                <span className="block text-[#F2F2F2] text-[clamp(56px,11vw,130px)] tracking-tight">COMPETE.</span>
                <span className="block text-[clamp(56px,11vw,130px)] tracking-tight" style={{ background: 'linear-gradient(135deg, #FF3334 0%, #E8191A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CREATE.</span>
                <span className="block text-[#F2F2F2] text-[clamp(56px,11vw,130px)] tracking-tight">DOMINATE.</span>
              </h1>
              <p className="text-[#F2F2F2]/50 text-lg max-w-xl leading-relaxed mb-8">
                Overtake is a premier competitive esports organization build
