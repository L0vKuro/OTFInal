'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const pink = '#FF6FB5'

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

      {/* Player section */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Small card */}
        <div
          className="relative w-48 cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${pink}, transparent)` }} />
          <div className="h-64 relative overflow-hidden bg-[#141414] border border-white/5">
            <img
              src="/player-natalee.jpg"
              alt="Natalee"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #141414 10%, transparent 60%)' }} />
            <div className="absolute top-2 right-2">
              <span className="text-[10px] font-mono px-2 py-1 uppercase tracking-wider font-black"
                style={{ color: pink, background: '#000000CC', border: `1px solid ${pink}60` }}>
                Player
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="font-display font-black text-lg text-white uppercase leading-none"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Natalee</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: pink }}>Overtake Fortnite</p>
            </div>
          </div>
        </div>

        {/* Fullscreen hover overlay */}
        {hovered && (
          <div
            className="fixed inset-0 z-50 flex items-end"
            style={{ animation: 'fadeIn 0.25s ease-out' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <img
              src="/player-natalee.jpg"
              alt="Natalee"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                animation: 'scaleIn 0.3s ease-out forwards',
              }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.3) 65%, transparent 100%)' }} />
            <div className="relative z-10 p-12 w-full">
              <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: pink }}>// Overtake Fortnite</p>
              <h2 className="font-display font-black text-6xl md:text-8xl uppercase text-white leading-none mb-4"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Natalee
              </h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-xl mb-6">
                Competitive Fortnite player and streamer for Overtake, splitting time between scrims and content to grow the Fortnite community on and off stream.
              </p>
              <a href="https://x.com/nataleefn" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono px-5 py-3 border hover:bg-white/10 transition-colors"
                style={{ color: pink, borderColor: `${pink}50` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                @nataleefn
              </a>
            </div>
          </div>
        )}
      </div>

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
          from { transform: scale(1.05); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
