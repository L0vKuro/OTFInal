'use client'

import { useParams } from 'next/navigation'
import { teams } from '@/lib/data'
import { ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

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

export default function PlayerPage() {
  const params = useParams()
  const teamId = params.teamId as string
  const playerSlug = params.playerSlug as string

  const team = teams.find(t => t.id === teamId)
  if (!team) return <div className="pt-36 text-center text-white/40">Team not found.</div>

  const player = team.roster.find((p: any) =>
    p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === playerSlug
  )
  if (!player) return <div className="pt-36 text-center text-white/40">Player not found.</div>

  const photo = getPlayerPhoto(player.name)
  const isFemaleTeam = team.id === 'r6-FEMALE'
  const isRedCard = ['NATHAN', 'SHIYO', 'ABYCE'].includes(player.name)
  const isFemaleCoach = ['GINGY', 'JOGORKU'].includes(player.name)
  const cardColor = isRedCard || isFemaleCoach ? '#E8191A' : isFemaleTeam ? '#FF69B4' : team.color
  const trackerLink = TRACKER_LINKS[teamId] || null

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Full height split layout */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* Left — info */}
        <div className="relative flex flex-col justify-center pt-36 pb-20 px-10 lg:px-16 order-2 lg:order-1">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${cardColor}06 0%, transparent 70%)` }} />

          <div className="relative">
            {/* Back link */}
            <Link href="/teams"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors mb-10">
              ← Back to Rosters
            </Link>

            {/* Team label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono px-3 py-1.5 font-bold uppercase tracking-widest"
                style={{ color: cardColor, background: `${cardColor}15`, border: `1px solid ${cardColor}30` }}>
                OVERTAKE — {team.game}
              </span>
            </div>

            {/* Player name */}
            <h1 className="font-display font-black uppercase leading-none mb-2"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#F2F2F2',
                fontSize: 'clamp(4rem, 10vw, 8rem)',
              }}>
              {player.name}
            </h1>

            {/* Real name */}
            <p className="text-lg font-mono mb-2" style={{ color: cardColor }}>
              {player.real}
            </p>

            {/* Role */}
            <p className="text-white/40 text-sm font-mono uppercase tracking-widest mb-10">
              {player.role}
            </p>

            {/* Divider */}
            <div className="h-px w-24 mb-10" style={{ background: cardColor }} />

            {/* Socials */}
            <div className="flex flex-wrap gap-3">
              {player.twitter && (
                <a href={player.twitter} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest transition-all hover:opacity-80"
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    color: cardColor,
                    border: `1px solid ${cardColor}50`,
                    background: `${cardColor}10`,
                  }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  Twitter / X
                </a>
              )}
              {trackerLink && (
                <a href={trackerLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest transition-all hover:opacity-80"
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    color: cardColor,
                    border: `1px solid ${cardColor}50`,
                    background: `${cardColor}10`,
                  }}>
                  <ExternalLink size={12} />
                  Team Tracker
                </a>
              )}
            </div>

            {/* View full roster */}
            <Link href="/teams"
              className="inline-flex items-center gap-2 mt-10 text-white/30 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors group">
              View Full Roster <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right — photo */}
        <div className="relative order-1 lg:order-2 min-h-[50vh] lg:min-h-screen overflow-hidden bg-[#0D0D0D]">
          <img
            src={`/${photo}`}
            alt={player.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              position: 'absolute',
              inset: 0,
            }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0D0D0D 0%, transparent 30%)' }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, transparent 50%, ${cardColor}15 100%)` }} />

          {/* Big name watermark */}
          <div className="absolute bottom-8 right-6 pointer-events-none">
            <p className="font-display font-black uppercase text-right leading-none select-none"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                color: `${cardColor}15`,
              }}>
              {player.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
