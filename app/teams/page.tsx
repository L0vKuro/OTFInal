'use client'

import { useState } from 'react'
import { teams } from '@/lib/data'
import { ChevronRight, ChevronDown, Users, Trophy, Zap, Star } from 'lucide-react'

const GAME_ICONS: Record<string, string> = {
  'VALORANT': '⚡',
  'COUNTER-STRIKE': '🎯',
  'RAINBOW 6 — MAIN': '🛡️',
  'RAINBOW 6 — ACADEMY': '🛡️',
  'RAINBOW 6 — FEMALE': '🛡️',
  'iRACING': '🏎️',
  'CLASH ROYALE': '👑',
  'CALL OF DUTY ACADEMY': '🎯',
  'DEADLOCK': '💀',
  'WARZONE': '🔫',
  'FORTNITE': '🎯',
}

const PLAYER_PHOTOS: Record<string, string> = {
  'ein': 'player-e-in.png',
  'vcipher': 'player-vcipher.png',
  'megahitidee': 'player-megahitIdee.jpg',
  'kiingkooopa': 'player-kiinkooopa.jpg',
  'godcookie': 'player-cookie.webp',
  'kontrol': 'player-kontrol.jpeg',
  'ximmy': 'player-ximmy.png',
  'yesyert': 'player-yesyert.png',
  'deasells': 'player-deasells.png',
  'favor8': 'player-favor8.png',
  'adlibb': 'player-adlibb.png',
  'nathan': 'coach-Nathan.jpg',
  'shiyo': 'coach-Shiyo.jpg',
  'abyce': 'coach-Abyce.jpg',
}

function getPlayerPhoto(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return PLAYER_PHOTOS[key] || `player-${key}.jpg`
}

function FortniteSection({ team }: { team: any }) {
  const [expanded, setExpanded] = useState(false)
  const color = team.color

  return (
    <div id={team.id} className="scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎯</span>
            <span className="text-xs font-mono px-2 py-1 font-bold uppercase tracking-widest"
              style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
              {team.region}
            </span>
            <span className="text-xs font-mono px-2 py-1 font-bold uppercase tracking-widest bg-[#E8191A]/10 text-[#E8191A] border border-[#E8191A]/20">
              FEATURED
            </span>
          </div>
          <h2 className="font-display font-black text-5xl md:text-6xl uppercase"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>
            {team.game}
          </h2>
        </div>
      </div>

      {/* Collapsed preview card */}
      <div className="bg-[#141414] border overflow-hidden transition-all"
        style={{ borderColor: `${color}30` }}>
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

        <div className="p-8 md:p-10">
          {/* Top banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-[#F2F2F2]/40 text-sm font-mono mb-3">The biggest game in the world. Overtake is building something special in Fortnite — rosters, creators, and community all under one banner.</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Trophy, label: 'Competitive' },
                  { icon: Users, label: 'Community' },
                  { icon: Star, label: 'Content' },
                  { icon: Zap, label: 'Season 2026' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-1.5 border border-white/5 bg-white/2">
                    <Icon size={12} style={{ color }} />
                    <span className="text-[#F2F2F2]/50 text-xs font-mono uppercase tracking-widest">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0 flex items-center gap-3 px-8 py-4 font-black tracking-widest uppercase text-sm transition-all border group"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color,
                borderColor: `${color}40`,
                background: `${color}10`,
              }}>
              {expanded ? 'COLLAPSE' : 'EXPLORE FORTNITE'}
              <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-0">
            {[
              { label: 'Division', value: 'NA' },
              { label: 'Status', value: 'ACTIVE' },
              { label: 'Season', value: '2026' },
              { label: 'Roster', value: 'TBA' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0D0D0D] border border-white/5 p-4">
                <p className="text-[#F2F2F2]/30 text-xs font-mono uppercase tracking-widest mb-1">{label}</p>
                <p className="font-display font-black text-xl uppercase"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expanded section */}
        {expanded && (
          <div className="border-t px-8 md:px-10 py-8 space-y-8"
            style={{ borderColor: `${color}20` }}>

            {/* About */}
            <div>
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// About Our Fortnite Division</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0D0D0D] border border-white/5 p-6">
                  <div className="h-px w-full mb-4" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <h3 className="font-display font-black text-2xl uppercase mb-3"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>Competitive</h3>
                  <p className="text-[#F2F2F2]/40 text-sm leading-relaxed">Overtake is building a competitive Fortnite presence from the ground up. We're scouting and recruiting top talent to represent the org at the highest level.</p>
                </div>
                <div className="bg-[#0D0D0D] border border-white/5 p-6">
                  <div className="h-px w-full mb-4" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <h3 className="font-display font-black text-2xl uppercase mb-3"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>Content</h3>
                  <p className="text-[#F2F2F2]/40 text-sm leading-relaxed">Fortnite content is at the core of Overtake's creator division. Our creators stream, clip, and compete — bringing the community along for every moment.</p>
                </div>
                <div className="bg-[#0D0D0D] border border-white/5 p-6">
                  <div className="h-px w-full mb-4" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <h3 className="font-display font-black text-2xl uppercase mb-3"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>Community</h3>
                  <p className="text-[#F2F2F2]/40 text-sm leading-relaxed">Join the Overtake Discord to be part of the Fortnite community — scrims, events, giveaways, and more. This is where the movement starts.</p>
                </div>
                <div className="bg-[#0D0D0D] border border-white/5 p-6">
                  <div className="h-px w-full mb-4" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <h3 className="font-display font-black text-2xl uppercase mb-3"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>Tryouts</h3>
                  <p className="text-[#F2F2F2]/40 text-sm leading-relaxed">Think you have what it takes? Fortnite roster spots are open. Submit your application and show us what you're made of.</p>
                </div>
              </div>
            </div>

            {/* Roster coming soon */}
            <div>
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Roster</p>
              <div className="bg-[#0D0D0D] border border-white/5 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border"
                  style={{ borderColor: `${color}30`, background: `${color}10` }}>
                  <Users size={24} style={{ color }} />
                </div>
                <h3 className="font-display font-black text-2xl uppercase mb-2"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>Roster Announcement Coming Soon</h3>
                <p className="text-[#F2F2F2]/30 text-sm font-mono mb-6">Players are being finalized. Follow @OvertakeSector on X for the official announcement.</p>
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

            {/* Zap Manager */}
            <div>
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Management</p>
              <div className="bg-[#0D0D0D] border border-white/5 p-6 flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center border flex-shrink-0"
                  style={{ borderColor: `${color}30`, background: `${color}10` }}>
                  <Star size={18} style={{ color }} />
                </div>
                <div>
                  <h4 className="font-display font-black text-xl uppercase"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color }}>ZAP</h4>
                  <p className="text-[#F2F2F2]/40 text-xs font-mono">Fortnite Manager · @zapticalggs</p>
                </div>
                <a href="https://x.com/zapticalggs" target="_blank" rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 text-xs font-mono text-[#F2F2F2]/30 hover:text-[#F2F2F2] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  @zapticalggs
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
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
            Eleven rosters. Eleven disciplines. One standard of excellence.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Active Rosters', value: '11' },
              { label: 'Tournament Wins', value: '20+' },
              { label: 'Active Players', value: '40+' },
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
        {teams.map((team: any, idx: number) => {
          if (team.fortniteSpecial) {
            return (
              <div key={team.id}>
                <FortniteSection team={team} />
                {idx < teams.length - 1 && (
                  <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}
              </div>
            )
          }

          return (
            <div key={team.id} id={team.id} className="scroll-mt-24">
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

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {team.roster.map((player: any, pi: number) => {
                  const photo = getPlayerPhoto(player.name)
                  const isFemaleTeam = team.id === 'r6-FEMALE'
                  const isRedCard = ['NATHAN', 'SHIYO', 'ABYCE'].includes(player.name)
                  const cardColor = isRedCard ? '#E8191A' : isFemaleTeam ? '#FF69B4' : team.color
                  const hasTwitter = player.twitter && player.twitter !== ''

                  const inner = (
                    <>
                      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${cardColor}, transparent)` }} />
                      <div className="h-40 relative overflow-hidden bg-[#0D0D0D]">
                        <img
                          src={`/${photo}`}
                          alt={player.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.85 }}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${cardColor}30, transparent)` }} />
                        <div className="absolute bottom-2 left-3">
                          <span className="font-display font-black text-3xl opacity-20"
                            style={{ fontFamily: 'Barlow Condensed, sans-serif', color: cardColor }}>
                            {pi + 1 < 10 ? `0${pi + 1}` : pi + 1}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-mono px-2 py-1 uppercase tracking-wider font-black"
                            style={{ color: cardColor, background: `#000000CC`, border: `1px solid ${cardColor}60` }}>
                            {player.role}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-display font-black text-lg text-[#F2F2F2] uppercase"
                          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                          {player.name}
                        </h3>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: cardColor }}>
                          {player.real}
                        </p>
                      </div>
                    </>
                  )

                  return hasTwitter ? (
                    <a key={pi} href={player.twitter} target="_blank" rel="noopener noreferrer"
                      className="group relative bg-[#141414] border border-white/5 hover:border-white/20 overflow-hidden card-hover block">
                      {inner}
                    </a>
                  ) : (
                    <div key={pi} className="group relative bg-[#141414] border border-white/5 overflow-hidden card-hover">
                      {inner}
                    </div>
                  )
                })}
              </div>

              {idx < teams.length - 1 && (
                <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              )}
            </div>
          )
        })}
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
