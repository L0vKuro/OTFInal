'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Trophy, Swords, Users, TrendingUp, ChevronRight } from 'lucide-react'
import { teams } from '@/lib/data'

function playerSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

type RosterStat = { name: string; matches_played: number; note: string }
type RecentMatch = { opponent: string; result: 'W' | 'L' | 'D'; score: string; event: string; date: string }
type TeamStats = {
  team_id: string
  source_label: string
  source_url: string
  rank_label: string
  rank_sub: string
  record_text: string
  roster_stats: RosterStat[]
  recent_matches: RecentMatch[]
  updated_at: string
}

const RESULT_COLOR: Record<string, string> = { W: '#00A878', L: '#E8191A', D: '#F0A500' }

// Fades a section up into view the first time it crosses into the viewport —
// used everywhere on this page instead of one blanket page-load animation, so
// scrolling down through multiple teams keeps feeling alive rather than static.
function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, revealed }
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, revealed } = useRevealed<HTMLDivElement>()
  return (
    <div ref={ref} className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}>
      {children}
    </div>
  )
}

function RankBadge({ label, sub, color }: { label: string; sub: string; color: string }) {
  return (
    <div className="relative bg-[#0D0D0D] border px-6 py-4 overflow-hidden" style={{ borderColor: `${color}40` }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ background: `radial-gradient(circle at 30% 20%, ${color}, transparent 70%)` }} />
      <div className="relative flex items-center gap-3">
        <Trophy size={22} style={{ color }} />
        <div>
          <p className="font-display font-black text-2xl text-white leading-none" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            {label}
          </p>
          {sub && <p className="text-white/30 text-[11px] font-mono uppercase tracking-widest mt-1">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

function TeamSection({ team, stats, index }: { team: any; stats?: TeamStats; index: number }) {
  const roster = team.roster as { name: string; role: string; country: string; real: string; twitter: string }[]
  const statByName: Record<string, RosterStat> = {}
  for (const r of stats?.roster_stats || []) statByName[r.name] = r

  return (
    <section className="relative border-t border-white/5 py-16 sm:py-24 overflow-hidden">
      {/* Ambient color wash unique to this team, plus a faint scanning line for
          texture — cheap to render, but it's what keeps each section from
          feeling like a copy-pasted card. */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ background: `radial-gradient(circle at ${index % 2 === 0 ? '15%' : '85%'} 0%, ${team.color}, transparent 55%)` }} />

      <div className="max-w-6xl mx-auto px-6 relative">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: team.color, boxShadow: `0 0 16px ${team.color}` }} />
                <span className="text-xs font-mono uppercase tracking-[0.3em]" style={{ color: team.color }}>{team.region} · Overtake {team.tag}</span>
              </div>
              <h2 className="font-display font-black uppercase text-white leading-[0.9] text-[clamp(36px,6vw,68px)]"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {team.game}
              </h2>
              {stats?.record_text && (
                <p className="text-white/40 font-mono text-sm mt-2">{stats.record_text}</p>
              )}
            </div>
            {stats?.rank_label && (
              <RankBadge label={stats.rank_label} sub={stats.rank_sub} color={team.color} />
            )}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roster */}
          <div className="lg:col-span-2">
            <Reveal delay={80}>
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} style={{ color: team.color }} />
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Roster</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roster.map((p, i) => {
                const stat = statByName[p.name]
                return (
                  <Reveal key={p.name} delay={120 + i * 60}>
                    <div className="group relative bg-[#141414] border border-white/5 p-4 overflow-hidden transition-all hover:border-white/20"
                      style={{ borderLeftColor: team.color, borderLeftWidth: '3px' }}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(120deg, transparent, ${team.color}08, transparent)` }} />
                      <div className="relative flex items-center justify-between gap-3">
                        <Link href={`/teams/${team.id}/${playerSlug(p.name)}`} className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-black text-lg text-white uppercase truncate group-hover:text-white transition-colors"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{p.name}</span>
                            <span>{p.country}</span>
                          </div>
                          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">{p.role}{stat?.note ? ` · ${stat.note}` : ''}</p>
                        </Link>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {stat && (
                            <div className="text-right">
                              <p className="font-display font-black text-xl text-white leading-none" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                                {stat.matches_played}
                              </p>
                              <p className="text-white/25 text-[9px] font-mono uppercase">matches</p>
                            </div>
                          )}
                          {p.twitter && (
                            <a href={p.twitter} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="text-white/20 hover:text-white transition-colors">
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          {/* Recent matches */}
          <div>
            <Reveal delay={100}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} style={{ color: team.color }} />
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Recent Matches</p>
              </div>
            </Reveal>
            <div className="space-y-2">
              {(!stats?.recent_matches || stats.recent_matches.length === 0) && (
                <Reveal delay={140}>
                  <div className="bg-[#141414] border border-white/5 p-5 text-center">
                    <p className="text-white/25 text-xs font-mono">No matches logged yet.</p>
                  </div>
                </Reveal>
              )}
              {(stats?.recent_matches || []).map((m, i) => (
                <Reveal key={i} delay={140 + i * 70}>
                  <div className="flex items-center gap-3 bg-[#141414] border border-white/5 px-4 py-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-sm font-display font-black text-sm flex-shrink-0"
                      style={{ color: RESULT_COLOR[m.result], background: `${RESULT_COLOR[m.result]}15`, fontFamily: 'Barlow Condensed, sans-serif' }}>
                      {m.result}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">vs {m.opponent}</p>
                      <p className="text-white/30 text-[10px] font-mono truncate">{m.event}{m.date ? ` · ${m.date}` : ''}</p>
                    </div>
                    {m.score && <span className="text-white/50 font-mono text-xs flex-shrink-0">{m.score}</span>}
                  </div>
                </Reveal>
              ))}
            </div>

            {stats?.source_url && (
              <Reveal delay={260}>
                <a href={stats.source_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/25 hover:text-white text-[11px] font-mono uppercase tracking-widest mt-4 transition-colors">
                  Stats via {stats.source_label || 'external source'} <ChevronRight size={12} />
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function TeamsPage() {
  const [statsMap, setStatsMap] = useState<Record<string, TeamStats>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/team-stats')
      .then(res => res.json())
      .then(data => {
        const map: Record<string, TeamStats> = {}
        for (const row of data.data || []) map[row.team_id] = row
        setStatsMap(map)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <style>{`
        @keyframes teams-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5 py-20 sm:py-28">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
          <div className="w-full h-40 bg-gradient-to-b from-transparent via-[#E8191A] to-transparent"
            style={{ animation: 'teams-scan 7s linear infinite' }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Competing Under the Overtake Banner</p>
          <h1 className="font-display font-black uppercase text-white leading-[0.9] text-[clamp(48px,9vw,110px)]"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OUR<br /><span className="text-[#E8191A]">TEAMS</span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-xl mt-6 leading-relaxed">
            Every roster competing for Overtake, with rank and results kept current from HLTV and Liquipedia.
          </p>
        </div>
      </div>

      {teams.map((team: any, i: number) => (
        <TeamSection key={team.id} team={team} stats={statsMap[team.id]} index={i} />
      ))}

      <div className="max-w-6xl mx-auto px-6 py-16 text-center border-t border-white/5">
        <Swords size={20} className="text-white/15 mx-auto mb-3" />
        <p className="text-white/25 text-xs font-mono uppercase tracking-widest">
          {loaded ? 'Stats current as of each team\'s last manual update' : 'Loading team stats...'}
        </p>
      </div>
    </div>
  )
}
