'use client'

import { teams } from '@/lib/data'
import { ChevronRight } from 'lucide-react'

const GAME_ICONS: Record<string, string> = {
  'VALORANT': '⚡',
  'COUNTER-STRIKE': '🎯',
  'RAINBOW 6 — MAIN': '🛡️',
  'RAINBOW 6 — ACADEMY': '🛡️',
  'iRACING': '🏎️',
  'CLASH ROYALE': '👑',
  'CALL OF DUTY': '🎯',
  'DEADLOCK': '💀',
}

export default function TeamsPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative pt-36 pb-16 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Competitive Rosters</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-[#F2F2F2] leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OUR<br />TEAMS
          </h1>
          <p className="text-[#F2F2F2]/40 text-lg mt-6 max-w-lg">
            Eight rosters. Eight disciplines. One standard of excellence.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Active Rosters', value: '8' },
              { label: 'Tournament Wins', value: '20+' },
              { label: 'Active Players', value: '30+' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 border border-white/8 px-5 py-3 bg-white/2">
                <span className="text-[#F2F2F2]/40 text-sm">{label}</span>
                <span className="font-display font-black text-xl text-[#F2F2F2]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {teams.map((team, idx) => (
          <div key={team.id} id={team.id} className="scroll-mt-24">
            {/* Team Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{GAME_ICONS[team.game] || '🎮'}</span>
                  <span className="text-xs font-mono px-2 py-1 font-bold uppercase tracking-widest"
                    style={{ color: team.color, background: `${team.color}15`, border: `1px solid ${team.color}30` }}>
                    {team.region}
                  </span>
                </div>
                <h2 className="font-display font-black text-5xl md:text-6xl uppercase"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color: team.color }}>
                  {team.game}
                </h2>
              </div>
            </div>

            {/* Roster Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {team.roster.map((player, pi) => {
                const photoName = `player-${player.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.jpg`
                return (
                  <div key={pi} className="group relative bg-[#141414] border border-white/5 hover:border-opacity-40 overflow-hidden card-hover">
                    <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${team.color}, transparent)` }} />

                    {/* Player photo */}
                    <div className="h-40 relative overflow-hidden bg-[#0D0D0D]">
                      <img
                        src={`/${photoName}`}
                        alt={player.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.85 }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${team.color}30, transparent)` }} />
                      <div className="absolute bottom-2 left-3">
                        <span className="font-display font-black text-3xl opacity-20"
                          style={{ fontFamily: 'Barlow Condensed, sans-serif', color: team.color }}>
                          {pi + 1 < 10 ? `0${pi + 1}` : pi + 1}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 uppercase tracking-wider"
                          style={{ color: team.color, background: `${team.color}15`, border: `1px solid ${team.color}30` }}>
                          {player.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="font-display font-black text-lg text-[#F2F2F2] uppercase"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                        {player.name}
                      </h3>
                      <p className="text-[#F2F2F2]/30 text-xs mt-0.5 font-mono">{player.real}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {idx < teams.length - 1 && (
              <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
          </div>
        ))}
      </div>

      {/* Join CTA */}
      <div className="bg-[#141414] border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display font-black text-5xl md:text-6xl uppercase text-[#F2F2F2] mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            WANT TO WEAR THE JERSEY?
          </h2>
          <p className="text-[#F2F2F2]/40 mb-8">Applications for Season 2026 tryouts are open.</p>
          <a href="/join"
            className="inline-flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-10 py-5 font-black tracking-widest uppercase text-base transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.4)] clip-corner text-[#F2F2F2]"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Apply for Tryout <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}
