'use client'

import { useState } from 'react'
import { ChevronRight, Users, Trophy, Zap, Star, Crown, Shield, Sparkles, X } from 'lucide-react'

const color = '#00D4FF'

const rosterTiers = [
  {
    tier: 'Overtake | Fortnite',
    icon: Users,
    tierColor: '#7A7A7A',
    count: 4,
    desc: 'General team members repping the Overtake Fortnite division. The entry point into our competitive pathway.',
    members: [] as { name: string; twitter: string }[],
  },
  {
    tier: 'Overtake | Fortnite Academy',
    icon: Shield,
    tierColor: '#00D4FF',
    count: 3,
    desc: 'Developing players building consistency and results, with a clear path up toward the Competitive Roster.',
    members: [
      { name: 'Extinct', twitter: 'GuruExtinct' },
      { name: 'Motra', twitter: 'motrafnt' },
      { name: 'Washekirk', twitter: 'vask3fnr' },
    ],
  },
  {
    tier: 'Fortnite | Competitive Roster',
    icon: Trophy,
    tierColor: '#E8191A',
    count: 2,
    desc: 'Our active competitive lineup, representing Overtake at tournaments and ranked competition.',
    members: [
      { name: 'Narwhal', twitter: 'Narwhal1x' },
      { name: 'Trapz', twitter: 'trapzvp' },
    ],
  },
  {
    tier: 'Fortnite | Pro Roster',
    icon: Crown,
    tierColor: '#FFD447',
    count: 0,
    desc: 'The top of the pathway. Reserved for our highest-level competitive talent — currently open.',
    members: [] as { name: string; twitter: string }[],
  },
]

const management = [
  {
    name: 'ZAP',
    role: 'Fortnite Manager',
    twitter: 'zapticalggs',
  },
  {
    name: 'JAVSR',
    role: 'Fortnite Talent Manager',
    twitter: 'javsrtalent',
  },
]

function RosterTiers() {
  return (
    <div>
      <p className="text-xs font-mono tracking-widest uppercase mb-8" style={{ color }}>// Roster Pathway</p>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/8 hidden sm:block" />
        <div className="space-y-4">
          {rosterTiers.map(({ tier, icon: Icon, tierColor, count, desc, members }) => (
            <div key={tier} className="relative flex items-start gap-6 bg-[#141414] border border-white/5 p-6 sm:pl-6">
              <div className="relative z-10 w-12 h-12 flex items-center justify-center border flex-shrink-0"
                style={{ borderColor: `${tierColor}50`, background: `${tierColor}15` }}>
                <Icon size={20} style={{ color: tierColor }} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-display font-black text-2xl uppercase leading-none"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color: tierColor }}>
                    {tier}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-1 uppercase tracking-widest border"
                    style={{ color: tierColor, borderColor: `${tierColor}40`, background: `${tierColor}10` }}>
                    {count} {count === 1 ? 'Member' : 'Members'}
                  </span>
                </div>
                <p className="text-[#F2F2F2]/40 text-sm leading-relaxed mb-4">{desc}</p>
                {members.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {members.map((m) => (
                      <a key={m.name} href={`https://x.com/${m.twitter}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-mono text-[#F2F2F2]/50 hover:text-[#F2F2F2] transition-colors border border-white/8 hover:border-white/20 px-3 py-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        {m.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FemaleSection() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Side tab trigger */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex fixed top-1/2 right-0 -translate-y-1/2 z-40 items-center gap-2 bg-[#141414] border border-[#FF6FB5]/40 hover:border-[#FF6FB5] pl-4 pr-3 py-4 rounded-l-md shadow-lg transition-all hover:pr-5 group"
        style={{ writingMode: 'vertical-rl' }}
        aria-label="View Overtake Women"
      >
        <Sparkles size={16} className="text-[#FF6FB5] rotate-90 group-hover:scale-110 transition-transform" />
        <span className="font-display font-black uppercase tracking-widest text-sm text-white"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Overtake Women
        </span>
      </button>

      {/* Slide-in panel */}
      <div
        className={`fixed inset-0 z-50 transition-opacity ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-[#0D0D0D] border-l border-[#FF6FB5]/30 shadow-2xl overflow-y-auto transition-transform duration-300"
          style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FF6FB5, #E8191A)' }} />
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[#FF6FB5] text-xs font-mono tracking-widest uppercase">// Overtake Women</p>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="bg-[#141414] border border-white/5 overflow-hidden">
              <div className="h-64 relative overflow-hidden bg-[#141414]">
                {/* Upload player-natalee.jpg to your public folder for this to render */}
                <img
                  src="/player-natalee.jpg"
                  alt="Natalee"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #141414 10%, transparent 60%)' }} />
              </div>
              <div className="p-6">
                <h3 className="font-display font-black text-3xl text-white uppercase mb-1"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Natalee
                </h3>
                <p className="text-[#FF6FB5] text-xs font-mono uppercase tracking-widest mb-4">Overtake Fortnite</p>
                {/* Placeholder bio — replace with the real description */}
                <p className="text-white/50 text-sm leading-relaxed">
                  Bio coming soon. Replace this placeholder text with Natalee&apos;s real description once provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function FortnitePage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <FemaleSection />

      {/* Header */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${color}08, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px"
              style={{ right: `${i * 50}px`, transform: 'skewX(-15deg)', background: color }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <a href="/teams" className="text-[#F2F2F2]/30 hover:text-[#F2F2F2] text-xs font-mono tracking-widest uppercase transition-colors">← Back to Teams</a>
          </div>
          <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color }}>// Overtake Fortnite Division</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-[#F2F2F2] leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OVER<br />
            <span style={{ background: `linear-gradient(135deg, ${color}, #0099BB)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TAKE</span><br />
            FORTNITE
          </h1>
          <p className="text-[#F2F2F2]/40 text-lg mt-6 max-w-xl">
            The biggest game in the world. Overtake is building something special in Fortnite — rosters, creators, and community all under one banner.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Division', value: 'NA' },
              { label: 'Status', value: 'ACTIVE' },
              { label: 'Manager', value: 'ZAP' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 border border-white/8 px-5 py-3 bg-white/2">
                <span className="text-[#F2F2F2]/40 text-sm">{label}</span>
                <span className="font-display font-black text-xl"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">

        {/* Roster Tiers */}
        <RosterTiers />

        {/* About */}
        <div>
          <p className="text-xs font-mono tracking-widest uppercase mb-8" style={{ color }}>// About Our Division</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Trophy, title: 'Competitive', desc: 'Overtake is building a competitive Fortnite presence from the ground up. We\'re scouting and recruiting top talent to represent the org at the highest level.' },
              { icon: Star, title: 'Content', desc: 'Fortnite content is at the core of Overtake\'s creator division. Our creators stream, clip, and compete — bringing the community along for every moment.' },
              { icon: Users, title: 'Community', desc: 'Join the Overtake Discord to be part of the Fortnite community — scrims, events, giveaways, and more. This is where the movement starts.' },
              { icon: Zap, title: 'Tryouts', desc: 'Think you have what it takes? Fortnite roster spots are open. Submit your application and show us what you\'re made of.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#141414] border border-white/5 p-6">
                <div className="h-px w-full mb-6" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={20} style={{ color }} />
                  <h3 className="font-display font-black text-2xl uppercase"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>{title}</h3>
                </div>
                <p className="text-[#F2F2F2]/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Management */}
        <div>
          <p className="text-xs font-mono tracking-widest uppercase mb-8" style={{ color }}>// Management</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {management.map(({ name, role, twitter }) => (
              <div key={name} className="bg-[#141414] border border-white/5 p-6 flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center border flex-shrink-0"
                  style={{ borderColor: `${color}30`, background: `${color}10` }}>
                  <Star size={22} style={{ color }} />
                </div>
                <div>
                  <h4 className="font-display font-black text-2xl uppercase"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>{name}</h4>
                  <p className="text-[#F2F2F2]/40 text-xs font-mono">{role}</p>
                </div>
                <a href={`https://x.com/${twitter}`} target="_blank" rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 text-xs font-mono text-[#F2F2F2]/30 hover:text-[#F2F2F2] transition-colors border border-white/5 hover:border-white/20 px-4 py-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  @{twitter}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#141414] border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color }}>// Join The Movement</p>
          <h2 className="font-display font-black text-5xl md:text-6xl uppercase text-[#F2F2F2] mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            WANT IN ON<br />FORTNITE?
          </h2>
          <p className="text-[#F2F2F2]/40 mb-8">Apply for a roster spot or join the Discord to stay connected with the Overtake Fortnite division.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/join"
              className="inline-flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-10 py-5 font-black tracking-widest uppercase text-base transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.4)] clip-corner text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
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
