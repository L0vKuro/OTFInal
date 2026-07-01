'use client'

import { useState, useEffect } from 'react'
import { creators } from '@/lib/data'
import { Twitter, Youtube, Twitch, Users, TrendingUp } from 'lucide-react'

const PLATFORM_COLORS: Record<string, string> = {
  Twitch: '#9146FF',
  YouTube: '#FF0000',
  TikTok: '#EE1D52',
}

function LiveSection() {
  const [streams, setStreams] = useState<any[]>([])

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/twitch-live')
        const data = await res.json()
        setStreams(data.streams || [])
      } catch {}
    }
    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [])

  if (streams.length === 0) return null

  return (
    <div className="border-b border-white/5 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 bg-[#E8191A] rounded-full animate-pulse" />
            <div className="absolute w-3 h-3 bg-[#E8191A] rounded-full animate-ping opacity-60" />
          </div>
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase">// Live Right Now</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streams.map((stream: any) => {
            return (
              <a key={stream.id} href={`https://twitch.tv/${stream.user_login}`} target="_blank" rel="noopener noreferrer"
                className="group relative bg-[#141414] border border-[#E8191A]/20 hover:border-[#E8191A]/50 overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(232,25,26,0.15)]">
                <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent" />
                <div className="h-40 relative overflow-hidden bg-[#0D0D0D]">
                  <img
                    src={stream.thumbnail_url?.replace('{width}', '440').replace('{height}', '248')}
                    alt={stream.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#E8191A] px-2 py-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Live</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 px-2 py-1">
                    <span className="text-[10px] font-mono text-white">{stream.viewer_count?.toLocaleString()} viewers</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-black text-xl text-[#F2F2F2] uppercase mb-1"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {stream.user_name}
                  </h3>
                  <p className="text-[#F2F2F2]/40 text-xs font-mono line-clamp-1">{stream.title}</p>
                  <p className="text-[#9146FF] text-xs font-mono mt-1">{stream.game_name}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function CreatorsPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px bg-[#E8191A]"
              style={{ right: `${i * 50}px`, transform: 'skewX(-20deg)', transformOrigin: 'top' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Content Division</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-white leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OUR<br />
            <span style={{ background: 'linear-gradient(135deg, #FF3334 0%, #E8191A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CREATORS</span>
          </h1>
          <p className="text-white/40 text-lg mt-6 max-w-lg">
            Gaming culture is shaped by the people who create it. Meet the Overtake content division — streamers, personalities, and creators pushing the culture forward.
          </p>
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { label: 'Active Creators', value: '10' },
              { label: 'Combined Followers', value: '9.4k+' },
              { label: 'Platforms', value: 'Youtube, Twitch & TikTok' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 border border-white/8 px-5 py-3 bg-white/2">
                <TrendingUp size={16} className="text-[#E8191A]" />
                <span className="text-white/40 text-sm">{label}</span>
                <span className="font-display font-black text-xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Section */}
      <LiveSection />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {creators.map((creator) => {
            const platformColor = PLATFORM_COLORS[creator.platform] || '#E8191A'
            return (
              <a key={creator.id} href={creator.link} target="_blank" rel="noopener noreferrer"
                className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#E8191A]/20 overflow-hidden card-hover block">
                <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent" />
                <div className="h-48 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${platformColor}15, transparent 60%)` }}>
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <img src={`/${creator.photo}`} alt={creator.handle}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.6 }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0D0D0D 10%, transparent 60%)' }} />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur border border-white/10 px-3 py-1.5 rounded-sm">
                      <Users size={11} className="text-white/50" />
                      <span className="font-mono text-xs font-bold text-white">{creator.followers}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-widest"
                      style={{ color: '#ffffff', background: platformColor, border: `1px solid ${platformColor}` }}>
                      {creator.platform}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-black text-3xl text-white uppercase"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{creator.handle}</h3>
                      <p className="text-white/30 text-sm">{creator.real} {creator.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#E8191A]/10 text-[#E8191A] border border-[#E8191A]/20 uppercase tracking-wider">
                      {creator.specialty}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed mb-5">{creator.bio}</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <span className="text-white/20 text-xs font-mono mr-1">FOLLOW:</span>
                    {creator.socials.twitch && (
                      <a href={`https://twitch.tv/${creator.socials.twitch}`} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="w-7 h-7 flex items-center justify-center border border-white/8 hover:border-[#9146FF]/50 hover:bg-[#9146FF]/10 rounded transition-all text-white/30 hover:text-[#9146FF]">
                        <Twitch size={12} />
                      </a>
                    )}
                    {creator.socials.twitter && (
                      <a href={creator.socials.twitter} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="w-7 h-7 flex items-center justify-center border border-white/8 hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 rounded transition-all text-white/30 hover:text-[#1DA1F2]">
                        <Twitter size={12} />
                      </a>
                    )}
                    {creator.link && creator.platform === 'TikTok' && (
                      <a href={creator.link} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="w-7 h-7 flex items-center justify-center border border-white/8 hover:border-[#EE1D52]/50 hover:bg-[#EE1D52]/10 rounded transition-all text-white/30 hover:text-[#EE1D52]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
                      </a>
                    )}
                    {creator.socials.youtube && (
                      <a href={`https://youtube.com/@${creator.socials.youtube}`} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="w-7 h-7 flex items-center justify-center border border-white/8 hover:border-red-500/50 hover:bg-red-500/10 rounded transition-all text-white/30 hover:text-red-400">
                        <Youtube size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
      <div className="bg-[#0D0D0D] border-t border-white/5 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Creator Program</p>
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            BECOME AN<br />OVERTAKE CREATOR
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
            Got an audience and the content to match? We're always looking for creators who align with the Overtake ethos. Apply to join the team.
          </p>
          <a href="/join#creator"
            className="inline-flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-10 py-5 font-black tracking-widest uppercase text-base transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.4)] clip-corner"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Apply as Creator
          </a>
        </div>
      </div>
    </div>
  )
}
