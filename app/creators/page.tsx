'use client'

import { creators } from '@/lib/data'
import { Twitter, Youtube, Twitch, Users, TrendingUp } from 'lucide-react'

const PLATFORM_COLORS: Record<string, string> = {
  Twitch: '#9146FF',
  YouTube: '#FF0000',
  TikTok: '#010101',
}

export default function CreatorsPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
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
              { label: 'Active Creators', value: '6' },
              { label: 'Combined Followers', value: '6K+' },
              { label: 'Platforms', value: 'Twitch' },
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

      {/* Creators Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {creators.map((creator) => (
            
              key={creator.id}
              href={creator.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#E8191A]/20 overflow-hidden card-hover block"
            >
              <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent" />

              <div className="h-48 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${PLATFORM_COLORS[creator.platform] || '#E8191A'}15, transparent 60%)` }}>
                <div className="absolute inset-0 bg-grid opacity-20" />

                <img
                  src={`/${creator.photo}`}
                  alt={creator.handle}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.6 }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0D0D0D 10%, transparent 60%)' }} />

                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur border border-white/10 px-3 py-1.5 rounded-sm">
                    <Users size={11} className="text-white/50" />
                    <span className="font-mono text-xs font-bold text-white">{creator.followers}</span>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <div className="text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-widest"
                    style={{ color: PLATFORM_COLORS[creator.platform] || '#E8191A', background: `${PLATFORM_COLORS[creator.platform] || '#E8191A'}20`, border: `1px solid ${PLATFORM_COLORS[creator.platform] || '#E8191A'}40` }}>
                    {creator.platform}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-black text-3xl text-white uppercase"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      {creator.handle}
                    </h3>
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
          ))}
        </div>
      </div>

      {/* Creator Application */}
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
