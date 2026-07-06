'use client'

import { ChevronRight } from 'lucide-react'

const pink = '#FF6FB5'

export default function OvertakeFemalesPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

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

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <a
            href="https://x.com/nataleefn"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-[#141414] border border-white/5 hover:border-white/20 overflow-hidden card-hover block"
          >
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${pink}, transparent)` }} />
            <div className="h-56 relative overflow-hidden bg-[#0D0D0D]">
              <img
                src="/player-natalee.jpg"
                alt="Natalee"
                className="player-photo"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <div className="player-overlay absolute inset-0" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${pink}30, transparent)` }} />
              <div className="absolute bottom-2 left-3">
                <span className="font-display font-black text-3xl opacity-20"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color: pink }}>
                  01
                </span>
              </div>
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
                Natalee
              </h3>
              <p className="text-xs mt-0.5 font-mono" style={{ color: pink }}>
                Overtake Fortnite
              </p>
            </div>
          </a>
        </div>

        <div className="mt-8 max-w-2xl">
          <p className="text-white/50 text-sm leading-relaxed">
            Competitive Fortnite player and streamer for Overtake, splitting time between scrims and content to grow the Fortnite community on and off stream.
          </p>
        </div>
      </div>

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
        .player-photo { transition: transform 0.3s ease; }
        .player-overlay { background: rgba(0,0,0,0.75); transition: opacity 0.3s ease; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: scale(1.05); box-shadow: 0 20px 40px rgba(0,0,0,0.6); z-index: 10; position: relative; }
        .card-hover:hover .player-photo { transform: scale(1.15); }
        .card-hover:hover .player-overlay { opacity: 0; }
      `}</style>
    </div>
  )
}
