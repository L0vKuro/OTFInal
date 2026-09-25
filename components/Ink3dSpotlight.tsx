'use client'

import { useRef, useState } from 'react'
import { ChevronRight, Sparkles, Zap } from 'lucide-react'

type Partner = {
  name: string
  category: string
  tier: string
  desc: string
  logo: string
  link: string
}

// Ink3D gets its own oversized, animated spotlight instead of sitting in the
// regular partner grid — bigger type, a holographic gradient treatment, a
// tilting image panel, and a looping marquee ribbon, to read as the org's
// most exclusive partnership rather than one tile among many.
export default function Ink3dSpotlight({ partner }: { partner: Partner }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -10, y: px * 14 })
  }

  const resetTilt = () => setTilt({ x: 0, y: 0 })

  const marqueeText = 'CUSTOM 3D DESIGNS  •  EXCLUSIVE OVERTAKE PARTNER  •  LOGOS  •  APPAREL  •  COLLECTIBLES  •  '

  return (
    <section className="relative overflow-hidden bg-[#050505] border-b border-white/5">
      <style>{`
        @keyframes ink3d-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ink3d-glow { 0%, 100% { box-shadow: 0 0 40px rgba(232,25,26,0.25), 0 0 90px rgba(168,85,247,0.12); } 50% { box-shadow: 0 0 70px rgba(168,85,247,0.35), 0 0 120px rgba(56,189,248,0.18); } }
        @keyframes ink3d-holo { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes ink3d-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(220%); } }
        @keyframes ink3d-pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        .ink3d-holo-text {
          background: linear-gradient(90deg, #E8191A, #A855F7, #38BDF8, #E8191A);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ink3d-holo 6s ease infinite;
        }
        .ink3d-panel { animation: ink3d-glow 4s ease-in-out infinite; transition: transform 0.15s ease-out; }
      `}</style>

      {/* Top marquee ribbon */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-[#E8191A]/20 via-[#A855F7]/20 to-[#38BDF8]/20 py-2 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: 'ink3d-marquee 22s linear infinite', width: 'fit-content' }}>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 px-4">{marqueeText.repeat(4)}</span>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 px-4">{marqueeText.repeat(4)}</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#A855F7]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#E8191A]/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#A855F7]" style={{ animation: 'ink3d-pulse-dot 1.8s ease-in-out infinite' }} />
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.3em]"
            style={{ color: '#A855F7', fontFamily: 'Barlow Condensed, sans-serif' }}>
            Exclusive Partner Spotlight
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mt-8">
          {/* Image / tilt panel */}
          <div
            ref={panelRef}
            onMouseMove={handleMove}
            onMouseLeave={resetTilt}
            className="ink3d-panel relative overflow-hidden rounded-sm border border-white/10"
            style={{
              aspectRatio: '4/3',
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01,1.01,1.01)`,
            }}>
            <img src="/ink3dpartner.jpg" alt="Overtake x Ink3D"
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(5,5,5,0.15) 20%, rgba(5,5,5,0.85) 100%)' }} />

            {/* Scanning light sweep */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
              <div className="w-full h-1/3" style={{ background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.5), transparent)', animation: 'ink3d-scan 3.5s ease-in-out infinite' }} />
            </div>

            {/* Floating logo badge */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-3">
              {partner.logo && (
                <img src={partner.logo} alt={partner.name}
                  style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 6, background: '#fff', padding: 4 }} />
              )}
              <div>
                <p className="font-display font-black text-lg text-white uppercase leading-none"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{partner.name}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-0.5">{partner.category}</p>
              </div>
            </div>

            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-[#A855F7]/40">
              <Sparkles size={12} className="text-[#A855F7]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A855F7]">Featured</span>
            </div>
          </div>

          {/* Copy */}
          <div>
            <h2 className="font-display font-black uppercase leading-[0.85] text-6xl sm:text-7xl xl:text-8xl mb-6 ink3d-holo-text"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {partner.name}
            </h2>

            <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
              {partner.desc}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { label: partner.category, icon: Zap },
                { label: `${partner.tier} Partner`, icon: Sparkles },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/[0.03]">
                  <Icon size={13} className="text-[#A855F7]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60">{label}</span>
                </div>
              ))}
            </div>

            <a href={partner.link || '#'} target="_blank" rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-10 py-5 font-black uppercase tracking-widest text-base overflow-hidden"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <span className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #E8191A, #A855F7, #38BDF8)', backgroundSize: '200% auto', animation: 'ink3d-holo 5s ease infinite' }} />
              <span className="relative flex items-center gap-3 text-white">
                Shop Ink3D <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom marquee ribbon */}
      <div className="relative border-t border-white/10 bg-gradient-to-r from-[#38BDF8]/20 via-[#A855F7]/20 to-[#E8191A]/20 py-2 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: 'ink3d-marquee 26s linear infinite reverse', width: 'fit-content' }}>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 px-4">{marqueeText.repeat(4)}</span>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 px-4">{marqueeText.repeat(4)}</span>
        </div>
      </div>
    </section>
  )
}
