'use client'

import { ChevronRight, Users, Trophy, Zap, Star } from 'lucide-react'

const color = '#00D4FF'

export default function FortnitePage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

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

        {/* Roster Coming Soon */}
        <div>
          <p className="text-xs font-mono tracking-widest uppercase mb-8" style={{ color }}>// Roster</p>
          <div className="bg-[#141414] border p-12 text-center" style={{ borderColor: `${color}20` }}>
            <div className="h-px w-full mb-10" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border"
              style={{ borderColor: `${color}30`, background: `${color}10` }}>
              <Users size={32} style={{ color }} />
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase mb-4"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>
              Roster Announcement Coming Soon
            </h2>
            <p className="text-[#F2F2F2]/30 text-sm font-mono mb-8 max-w-md mx-auto">
              Players are being finalized. Follow @OvertakeSector on X for the official announcement.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://x.com/OvertakeSector" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-black tracking-widest uppercase text-sm transition-all"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', background: `${color}15`, color, border: `1px solid ${color}30` }}>
                Follow for Updates <ChevronRight size={14} />
              </a>
              <a href="/join"
                className="inline-flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Apply for Tryout <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>

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
          <div className="bg-[#141414] border border-white/5 p-6 flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center border flex-shrink-0"
              style={{ borderColor: `${color}30`, background: `${color}10` }}>
              <Star size={22} style={{ color }} />
            </div>
            <div>
              <h4 className="font-display font-black text-2xl uppercase"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>ZAP</h4>
              <p className="text-[#F2F2F2]/40 text-xs font-mono">Fortnite Manager</p>
            </div>
            <a href="https://x.com/zapticalggs" target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 text-xs font-mono text-[#F2F2F2]/30 hover:text-[#F2F2F2] transition-colors border border-white/5 hover:border-white/20 px-4 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @zapticalggs
            </a>
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
