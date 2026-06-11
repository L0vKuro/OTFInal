'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, MessageCircle, ArrowRight } from 'lucide-react'
import { teams, news } from '@/lib/data'

const stats = [
  { label: 'Active Rosters', value: '10', unit: '' },
  { label: 'Tournament Wins', value: '20', unit: '+' },
  { label: 'Followers', value: '5K', unit: '+' },
  { label: 'Engagements', value: '3M', unit: '+' },
]

function LiveButton() {
  const [liveCount, setLiveCount] = useState(0)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/twitch-live')
        const data = await res.json()
        setLiveCount(data.streams?.length || 0)
      } catch {}
    }
    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [])

  if (liveCount === 0) return null

  return (
    <Link href="/creators"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0D0D0D] border border-[#E8191A]/60 px-8 py-5 shadow-[0_0_30px_rgba(232,25,26,0.5)] hover:shadow-[0_0_50px_rgba(232,25,26,0.8)] transition-all group"
      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
      <div className="relative flex items-center justify-center">
        <div className="w-3 h-3 bg-[#E8191A] rounded-full animate-pulse" />
        <div className="absolute w-3 h-3 bg-[#E8191A] rounded-full animate-ping opacity-60" />
      </div>
      <div>
        <p className="font-black text-sm uppercase tracking-widest text-[#F2F2F2]">LIVE NOW</p>
        <p className="text-[10px] font-mono text-[#E8191A]">{liveCount} creator{liveCount > 1 ? 's' : ''} streaming</p>
      </div>
      <ChevronRight size={16} className="text-[#E8191A] group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

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
                Overtake is a premier competitive esports organization building the next generation of champions in & out of the game.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/join"
                  className="group flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.4)] clip-corner text-[#F2F2F2]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Try Out Now <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/teams"
                  className="flex items-center gap-3 border border-white/10 hover:border-white/30 px-8 py-4 text-[#F2F2F2]/70 hover:text-[#F2F2F2] font-medium tracking-wider uppercase text-sm transition-all"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Our Rosters
                </Link>
                <a href="https://discord.com/invite/OvertakeSector" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#E8191A] hover:text-[#F2F2F2] border border-[#E8191A]/20 hover:border-[#E8191A]/50 hover:bg-[#E8191A]/10 px-5 py-4 text-sm font-medium transition-all">
                  <MessageCircle size={16} /> Discord
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MARQUEE BAR ─── */}
        <div className="relative bg-[#141414] border-y border-white/5 py-5 overflow-hidden w-full">
          <div className="flex items-center"
            style={{ animation: 'marquee 25s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
            {[...Array(16)].map((_, i) => (
              <div key={i} className="flex items-center gap-10 mx-10">
                <img src="/wordmark.png" alt="OVERTAKE"
                  style={{ height: '80px', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen', opacity: 0.6 }} />
                <span className="text-[#E8191A] text-2xl">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── STATS BAR ─── */}
        <div className="bg-[#E8191A] py-4 relative overflow-hidden">
          <div className="flex items-center px-8 w-full justify-center flex-wrap gap-y-3">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4">
                <span className="font-display font-black text-4xl text-[#F2F2F2]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{s.value}{s.unit}</span>
                <span className="text-[#F2F2F2]/70 text-sm font-medium uppercase tracking-wider">{s.label}</span>
                {i < stats.length - 1 && <div className="w-px h-8 bg-white/20 hidden sm:block mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* ─── TEAMS ─── */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-3">// Our Rosters</p>
                <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-[#F2F2F2]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  COMPETING AT<br />THE HIGHEST LEVEL
                </h2>
              </div>
              <Link href="/teams" className="hidden md:flex items-center gap-2 text-[#F2F2F2]/40 hover:text-[#E8191A] text-sm font-medium tracking-wider transition-colors">
                View All Teams <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <Link key={team.id} href={`/teams#${team.id}`}
                  className="group relative bg-[#141414] border border-white/5 hover:border-white/10 p-6 card-hover overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: team.color }} />
                  <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, ${team.color}, transparent)` }} />
                  <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: team.color }} />
                  <div className="mb-4">
                    <span className="text-xs font-mono px-2 py-0.5 mb-1 inline-block"
                      style={{ color: team.color, background: `${team.color}15`, border: `1px solid ${team.color}30` }}>{team.region}</span>
                    <h3 className="font-display font-black text-3xl text-[#F2F2F2] uppercase" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{team.game}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {team.roster.map((player, pi) => (
                      <div key={pi} className="flex items-center gap-1.5 bg-white/3 border border-white/5 px-3 py-1.5 rounded-sm">
                        <span className="font-mono text-xs font-bold text-[#F2F2F2]">{player.name}</span>
                        <span className="text-[#F2F2F2]/30 text-xs">·</span>
                        <span className="text-[#F2F2F2]/40 text-xs">{player.role}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-xs text-[#F2F2F2]/30 group-hover:text-[#F2F2F2]/60 transition-colors font-medium">
                    View Roster <ChevronRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── NEWS ─── */}
        <section id="news" className="relative py-20 bg-[#141414] overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-15" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-3">// Latest Updates</p>
              <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-[#F2F2F2]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>NEWS &<br />UPDATES</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {news.map((article) => (
                <a key={article.id} href={article.link} target="_blank" rel="noopener noreferrer"
                  className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#E8191A]/30 overflow-hidden card-hover block">
                  <div className="h-48 relative overflow-hidden bg-[#1A1A1A]">
                    <img src={article.image} alt={article.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25)', transition: 'filter 0.5s ease, transform 0.5s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(0.25)')} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent group-hover:via-transparent transition-all duration-500" />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-mono font-bold px-2 py-1 bg-[#E8191A] text-[#F2F2F2] uppercase tracking-widest">{article.category}</span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-6 h-6 bg-black/70 rounded flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[#F2F2F2]/30 text-xs font-mono mb-2">{article.date}</p>
                    <h3 className="font-display font-bold text-lg text-[#F2F2F2] group-hover:text-[#E8191A] transition-colors uppercase leading-tight mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{article.title}</h3>
                    <p className="text-[#F2F2F2]/40 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-[#E8191A] font-medium">Read on X <ChevronRight size={12} /></div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOLLOW US ─── */}
        <section className="relative py-16 bg-[#141414] border-y border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Stay Connected</p>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase text-[#F2F2F2] mb-8"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              FOLLOW THE MOVEMENT
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="https://www.youtube.com/@OVERTAKESECTOR" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0D0D0D] border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 px-8 py-4 transition-all group"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span className="font-black text-sm uppercase tracking-widest text-[#F2F2F2] group-hover:text-red-400 transition-colors">YouTube</span>
              </a>
              <a href="https://www.twitch.tv/OVERTAKESECTOR" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0D0D0D] border border-white/10 hover:border-[#9146FF]/50 hover:bg-[#9146FF]/5 px-8 py-4 transition-all group"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#9146FF"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
                <span className="font-black text-sm uppercase tracking-widest text-[#F2F2F2] group-hover:text-[#9146FF] transition-colors">Twitch</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─── DISCORD CTA ─── */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[300px] bg-[#E8191A]/8 blur-[100px] rounded-full" />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 border border-[#E8191A]/30 bg-[#E8191A]/5 px-4 py-2 rounded-sm mb-8">
              <MessageCircle size={14} className="text-[#E8191A]" />
              <span className="text-xs font-mono text-[#E8191A] tracking-widest uppercase">Community</span>
            </div>
            <h2 className="font-display font-black text-6xl md:text-8xl uppercase text-[#F2F2F2] leading-none mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              JOIN THE<br />
              <span style={{ background: 'linear-gradient(135deg, #FF3334, #E8191A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>COMMUNITY</span>
            </h2>
            <p className="text-[#F2F2F2]/40 text-lg mb-10 max-w-lg mx-auto">Connect with Overtake fans, get exclusive updates, and be first in line for tryouts.</p>
            <a href="https://discord.com/invite/OvertakeSector" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-10 py-5 font-bold tracking-widest uppercase text-base transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.5)] text-[#F2F2F2]"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <MessageCircle size={18} /> Join Discord — Free
            </a>
          </div>
        </section>

        {/* ─── JOIN CTA ─── */}
        <div className="relative bg-[#E8191A] py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[#F2F2F2]/60 text-sm font-mono tracking-widest uppercase mb-2">// Open Tryouts 2026</p>
              <h2 className="font-display font-black text-5xl md:text-6xl uppercase text-[#F2F2F2]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>THINK YOU HAVE<br />WHAT IT TAKES?</h2>
            </div>
            <Link href="/join"
              className="group flex-shrink-0 flex items-center gap-3 bg-[#F2F2F2] text-[#E8191A] hover:bg-[#0D0D0D] hover:text-[#F2F2F2] px-10 py-5 font-black tracking-widest uppercase text-base transition-all clip-corner"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Apply Now <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      {/* ─── FLOATING LIVE BUTTON ─── */}
      <LiveButton />
    </>
  )
}
