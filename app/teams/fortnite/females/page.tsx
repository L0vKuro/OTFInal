'use client'

import { ChevronRight } from 'lucide-react'

const pink = '#FF6FB5'

export default function OvertakeFemalesPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${pink}08, transparent)` }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <a href="/teams/fortnite" className="text-[#F2F2F2]/30 hover:text-[#F2F2F2] text-xs font-mono tracking-widest uppercase transition-colors">← Back to Fortnite</a>
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

      {/* Player Card */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-[#141414] border border-white/5 overflow-hidden max-w-md mx-auto">
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${pink}, #E8191A)` }} />
          <div className="h-80 relative overflow-hidden bg-[#141414]">
            <img
              src="/player-natalee.jpg"
              alt="Natalee"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #141414 10%, transparent 60%)' }} />
          </div>
          <div className="p-8">
            <h3 className="font-display font-black text-4xl text-white uppercase mb-1"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Natalee
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: pink }}>Overtake Fortnite</p>
            <p className="text-white/50 text-sm leading-relaxed">
              Bio coming soon. Replace this placeholder text with Natalee&apos;s real description once provided.
            </p>
          </div>
        </div>
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
    </div>
  )
}
