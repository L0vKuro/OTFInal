'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const pink = '#FF6FB5'

const player = {
  name: 'Natalee',
  role: 'Overtake Fortnite',
  twitter: 'nataleefn',
  photo: '/player-natalee.jpg',
  bio: 'Competitive Fortnite player and streamer for Overtake, splitting time between scrims and content to grow the Fortnite community on and off stream.',
}

export default function OvertakeFemalesPage() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${pink}08, transparent)` }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <a href="/teams/fortnite" className="text-[#F2F2F2]/30 hover:text-[#F2F2F2] text-xs font-mono tracking-widest uppercase transition-colors">Back to Fortnite</a>
          </div>
          <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: pink }}>// Women in Overtake</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-[#F2F2F2] leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OVERTAKE<br />
            <span style={{ background: `linear-gradient(135deg, ${pink}, #E8191A)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>FEMALES</span>
          </h1>
          <p className="text-[#F2F2F2]/40 text-lg mt-6 max-w-xl">
            Celebrating the women competing and creating under the Overtake banner.
          </p>
        </div>
      </div>

      {/* Player grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <a
            href={`https://x.com/${player.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative bg-[#141414] border border-white/5 hover:border-white/20 overflow-hidden block"
            style={{ transition: 'border-color 0.2s' }}
          >
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${pink}, transparent)` }} />
            <div className="h-56 relative overflow-hidden bg-[#0D0D0D]">
              <img
                src={player.photo}
                alt={player.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.85, transition: 'opacity 0.3s' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #141414 10%, transparent 60%)' }} />
              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-mono px-2 py-1 uppercase tracking-wider font-black"
                  style={{ color: pink, background: '#000000CC', border: `1px solid ${pink}60` }}>
                  Player
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-display font-black text-lg text-[#F2F2F2] uppercase"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {player.name}
              </h3>
              <p className="text-xs mt-0.5 font-mono" style={{ color: pink }}>
                {player.role}
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Hover modal — same style as Creators page */}
      {hovered && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 pointer-events-none"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <div
            className="relative bg-[#0D0D0D] border w-full max-w-3xl overflow-hidden shadow-2xl"
            style={{ borderColor: `${pink}30`, animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <div className="h-1 w-full" style={{ background: pink }} />
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Photo */}
              <div className="relative h-72 sm:h-full min-h-[320px] overflow-hidden bg-[#141414]">
                <img
                  src={player.photo}
                  alt={player.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0D0D0D 5%, transparent 50%)' }} />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-widest"
                    style={{ color: pink, background: 'rgba(0,0,0,0.7)', border: `1px solid ${pink}80` }}>
                    Player
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-8 flex flex-col justify-center">
                <h3 className="font-display font-black text-4xl text-white uppercase mb-1"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {player.name}
                </h3>
                <p className="text-sm mb-5 font-mono" style={{ color: pink }}>{player.role}</p>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{player.bio}</p>
                <div className="flex items-center gap-2 pt-5 border-t border-white/5">
                  <span className="text-white/20 text-xs font-mono mr-1">FOLLOW:</span>
                  <div className="w-8 h-8 flex items-center justify-center border border-white/8 rounded"
                    style={{ color: pink }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  <span className="text-white/30 text-xs font-mono">@{player.twitter}</span>
                  <span className="ml-auto text-white/30 text-xs font-mono">Click to visit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-[#141414] border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display font-black text-4xl md:text-6xl uppercase text-[#F2F2F2] mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            WANT TO JOIN?
          </h2>
          <p className="text-[#F2F2F2]/40 mb-8">Apply for a roster spot or join the Discord to stay connected.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/join"
              className="inline-flex items-center gap-3 px-10 py-5 font-black tracking-widest uppercase text-base transition-all clip-corner text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', background: pink }}>
              Apply for Tryout <ChevronRight size={18} />
            </a>
            <a href="https://discord.com/invite/OvertakeSector" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white/10 hover:border-white/30 px-10 py-5 font-black tracking-widest uppercase text-base transition-all text-[#F2F2F2]/60 hover:text-[#F2F2F2]"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Join Discord <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
