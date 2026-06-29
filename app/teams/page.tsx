'use client'

import { teams } from '@/lib/data'
import { ChevronRight, ExternalLink } from 'lucide-react'

const GAME_ICONS: Record<string, string> = {
  'VALORANT': '⚡',
  'COUNTER-STRIKE': '🎯',
  'RAINBOW 6 — MAIN': '🛡️',
  'RAINBOW 6 — ACADEMY': '🛡️',
  'RAINBOW 6 — FEMALE': '🛡️',
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
  'final': 'player-finalkiss.jpg',
  'gingy': 'coach-gingy.jpg',
  'jogorku': 'coach-jogorku.jpg',
  'emma': 'player-emma.jpg',
  'azzyriax': 'player-azzy.jpg',
  'flip': 'player-flip.jpg',
  'swisz': 'player-Swisz.jpg',
}

const TRACKER_LINKS: Record<string, string> = {
  'valorant': 'https://www.vlr.gg/team/17236/overtake',
  'counterstrike': 'https://www.hltv.org/team/13855/overtake-sector',
  'deadlock': '',
  'r6-main': '',
}

function getPlayerPhoto(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return PLAYER_PHOTOS[key] || `player-${key}.jpg`
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
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-[#F2F2F2] leading-none"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              OUR<br />TEAMS
            </h1>
            <a href="/fortnite"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 font-black tracking-widest uppercase text-sm transition-all duration-300 mt-6 group animate-pulse hover:animate-none hover:shadow-[0_0_30px_rgba(0,212,255,0.6),0_0_60px_rgba(0,212,255,0.3)]"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#00D4FF',
                border: '1px solid rgba(0,212,255,0.4)',
                background: 'rgba(0,212,255,0.08)',
                clipPath: 'polygon(0 0, 100% 0, 100% 60%, 92% 100%, 0 100%)',
              }}>
              🎯 Fortnite Division <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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

      {/* Teams */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {teams.map((team: any, idx: number) => {
          if (team.id === 'fortnite') return null

          const trackerLink = team.id in TRACKER_LINKS ? TRACKER_LINKS[team.id] : null

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
                    style={{ fontFamily:
