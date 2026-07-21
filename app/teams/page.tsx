'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { teams } from '@/lib/data'
import { ChevronRight, ExternalLink } from 'lucide-react'

const GAME_SHORT: Record<string, string> = {
  'VALORANT': 'VAL',
  'COUNTER-STRIKE': 'CS2',
  'RAINBOW 6 — MAIN': 'R6',
  'RAINBOW 6 — ACADEMY': 'R6 ACE',
  'RAINBOW 6 — FEMALE': 'R6 FEM',
  'CALL OF DUTY ACADEMY': 'COD',
  'DEADLOCK': 'DL',
  'WARZONE': 'WZ',
}

const TEAM_DESCRIPTIONS: Record<string, string> = {
  'VALORANT': 'Tactical, precise, relentless. Our Valorant squad competes at the highest level of ranked and tournament play, representing Overtake with strategy and skill.',
  'COUNTER-STRIKE': 'Old school discipline, new era results. Our CS roster brings grit and game sense to every server they touch.',
  'RAINBOW 6 — MAIN': 'Siege is won in the details. Our main roster runs calculated strats and clutch plays that keep Overtake in the conversation at every level.',
  'RAINBOW 6 — ACADEMY': 'The next wave is here. Overtake Academy is where raw talent gets refined into competitive excellence.',
  'RAINBOW 6 — FEMALE': 'Breaking barriers and setting standards. Our female roster competes with the same intensity and drive as every Overtake squad.',
  'CALL OF DUTY ACADEMY': 'Built for the big stage. Our CoD Academy roster has LAN experience and championship DNA.',
  'DEADLOCK': 'First movers in a new era. Overtake entered Deadlock early and we\'re here to dominate it.',
  'WARZONE': 'Drop in, wipe the lobby, repeat. Our Warzone squad brings elite gunfight IQ and BR experience.',
}

const PLAYER_PHOTOS: Record<string, string> = {
  ein: 'player-e-in.png',
  vcipher: 'player-vcipher.png',
  megahitidee: 'player-megahitIdee.jpg',
  kiingkooopa: 'player-kiinkooopa.jpg',
  godcookie: 'player-cookie.webp',
  kontrol: 'player-kontrol.jpeg',
  ximmy: 'player-ximmy.png',
  yesyert: 'player-yesyert.png',
  deasells: 'player-deasells.png',
  favor8: 'player-favor8.png',
  adlibb: 'player-adlibb.png',
  nathan: 'coach-Nathan.jpg',
  shiyo: 'coach-Shiyo.jpg',
  abyce: 'coach-Abyce.jpg',
  final: 'player-finalkiss.jpg',
  gingy: 'coach-gingy.jpg',
  jogorku: 'coach-jogorku.jpg',
  emma: 'player-emma.jpg',
  azzyriax: 'player-azzy.jpg',
  flip: 'player-flip.jpg',
  swisz: 'player-Swisz.jpg',
  ghost: 'player-ghost.jpg',
  holdmypollo: 'player-pollo.jpg',
}

const TRACKER_LINKS: Record<string, string> = {
  valorant: 'https://www.vlr.gg/team/17236/overtake',
  counterstrike: 'https://www.hltv.org/team/13855/overtake-sector',
  deadlock: '',
  'r6-main': 'https://liquipedia.net/rainbowsix/Overtake_Sector',
}

function getPlayerPhoto(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return PLAYER_PHOTOS[key] || `player-${key}.jpg`
}

const filteredTeams = teams.filter(t => t.id !== 'fortnite')

export default function TeamsPage() {
  const router = useRouter()
  const [activeTeam, setActiveTeam] = useState(filteredTeams[0])

  const team = activeTeam as any
  const trackerLink = team.id in TRACKER_LINKS ? TRACKER_LINKS[team.id] : null
  const desc = TEAM_DESCRIPTIONS[team.game] || ''
  const isFemaleTeam = team.id === 'r6-FEMALE'

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Hero */}
      <div className="relative pt-36 pb-16 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Competitive Rosters</p>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-[#F2F2F2] leading-none"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              OUR<br />ROSTERS
            </h1>
            <a href="/teams/fortnite"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 font-black tracking-widest uppercase text-sm transition-all duration-300 mt-6 group animate-pulse hover:animate-none"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#00D4FF',
                border: '1px solid rgba(0,212,255,0.4)',
                background: 'rgba(0,212,255,0.08)',
                clipPath: 'polygon(0 0, 100% 0, 100% 60%, 92% 100%, 0 100%)',
              }}>
              Fortnite Division <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="text-[#F2F2F2]/40 text-lg mt-6 max-w-lg">
            Eight rosters. Eight disciplines. One standard of excellence.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Active Rosters', value: '8' },
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

      {/* Tab nav */}
      <div className="sticky top-16 z-30 bg-[#0D0D0D]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-0" style={{ scrollbarWidth: 'none' }}>
            {filteredTeams.map((t) => {
              const isActive = activeTeam.id === t.id
              return (
                <button key={t.id}
                  onClick={() => setActiveTeam(t)}
                  className="flex-shrink-0 px-5 py-4 text-xs font-black tracking-widest uppercase transition-all border-b-2 whitespace-nowrap"
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    color: isActive ? (t as any).color : 'rgba(242,242,242,0.3)',
                    borderBottomColor: isActive ? (t as any).color : 'transparent',
                    background: isActive ? `${(t as any).color}08` : 'transparent',
                  }}>
                  {GAME_SHORT[(t as any).game] || (t as any).game}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Active team section */}
      <div
        key={team.id}
        className="relative overflow-hidden"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${team.color}08 0%, transparent 60%)` }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">

          {/* Team header */}
          <div className="mb-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase mb-1"
                  style={{ color: `${team.color}80` }}>
                  OVERTAKE
                </p>
                <h2 className="font-display font-black uppercase leading-none"
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    color: team.color,
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                  }}>
                  {team.game}
                </h2>
                <p className="text-[#F2F2F2]/50 text-base mt-3 max-w-xl leading-relaxed">
                  {desc}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3 mt-2 flex-shrink-0">
                <span className="text-xs font-mono px-3 py-1.5 font-bold uppercase tracking-widest"
                  style={{ color: team.color, background: `${team.color}15`, border: `1px solid ${team.color}30` }}>
                  {team.region} — ACTIVE
                </span>
                {trackerLink !== null && (
                  trackerLink !== '' ? (
                    <a href={trackerLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-all hover:opacity-80"
                      style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        color: team.color,
                        border: `1px solid ${team.color}60`,
                        background: `${team.color}15`,
                      }}>
                      <ExternalLink size={12} /> Tracker
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-widest uppercase cursor-not-allowed"
                      style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        color: team.color,
                        border: `1px solid ${team.color}30`,
                        background: `${team.color}08`,
                        opacity: 0.35,
                      }}>
                      <ExternalLink size={12} /> Tracker
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="h-px w-full mt-6"
              style={{ background: `linear-gradient(90deg, ${team.color}, transparent)` }} />
          </div>

          {/* Player cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {team.roster.map((player: any, pi: number) => {
              const photo = getPlayerPhoto(player.name)
              const isRedCard = ['NATHAN', 'SHIYO', 'ABYCE'].includes(player.name)
              const isFemaleCoach = ['GINGY', 'JOGORKU'].includes(player.name)
              const cardColor = isRedCard || isFemaleCoach ? '#E8191A' : isFemaleTeam ? '#FF69B4' : team.color
              const playerSlug = player.name.toLowerCase().replace(/[^a-z0-9]/g, '-')

              return (
                <div key={pi}
                  onClick={() => router.push(`/teams/${team.id}/${playerSlug}`)}
                  className="group relative bg-[#141414] border border-white/5 hover:border-white/20 overflow-hidden cursor-pointer"
                  style={{ transition: 'all 0.3s ease' }}>
                  <div className="h-px w-full"
                    style={{ background: `linear-gradient(90deg, ${cardColor}, transparent)` }} />
                  <div className="relative overflow-hidden bg-[#0D0D0D]" style={{ height: '280px' }}>
                    <img src={`/${photo}`} alt={player.name}
                      className="player-photo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                    <div className="player-overlay absolute inset-0" />
                    <div className="absolute inset-0"
                      style={{ background: `linear-gradient(to top, #141414 15%, transparent 60%)` }} />
                    <div className="absolute bottom-3 left-4">
                      <span className="font-display font-black opacity-20"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif', color: cardColor, fontSize: '3rem' }}>
                        {pi + 1 < 10 ? `0${pi + 1}` : pi + 1}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-mono px-2 py-1 uppercase tracking-wider font-black"
                        style={{ color: cardColor, background: '#000000CC', border: `1px solid ${cardColor}60` }}>
                        {player.role}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest"
                        style={{ background: `${cardColor}CC`, color: '#fff', fontFamily: 'Barlow Condensed, sans-serif' }}>
                        View Profile <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-black text-xl text-[#F2F2F2] uppercase leading-none mb-1"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      {player.name}
                    </h3>
                    <p className="text-xs font-mono" style={{ color: cardColor }}>
                      {player.real}
                    </p>
                    {player.twitter && (
                      <a href={player.twitter} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-mono text-white/30 hover:text-white/70 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        @{player.twitter.split('/').pop()}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
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

      <style>{`
        .player-photo { transition: transform 0.4s ease; }
        .player-overlay { background: rgba(0,0,0,0.6); transition: opacity 0.3s ease; }
        .group:hover .player-photo { transform: scale(1.08); }
        .group:hover .player-overlay { opacity: 0.2; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
