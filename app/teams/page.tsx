'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Trophy, Swords, Users, TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react'
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

// Fades an element up into view the first time it crosses into frame — since
// each slide only becomes visible once the carousel scrolls to it, this still
// plays out naturally as a "crisp mount" the first time you land on a team.
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

// The tilting "crest" panel is this page's version of the tilt/glow treatment
// built for the Ink3D partner spotlight — same mouse-follow perspective tilt
// and pulsing colored glow, just keyed to each team's own color instead of
// one fixed palette.
function TeamCrestPanel({ team, stats }: { team: any; stats?: TeamStats }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -8, y: px * 12 })
  }

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative overflow-hidden border p-7 flex flex-col justify-between team-crest-glow"
      style={{
        aspectRatio: '4 / 3',
        borderColor: `${team.color}40`,
        background: `linear-gradient(160deg, ${team.color}20, #0D0D0D 75%)`,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01,1.01,1.01)`,
        transition: 'transform 0.15s ease-out, border-color 0.6s ease, background 0.6s ease',
        ['--crest-glow-a' as any]: `${team.color}25`,
        ['--crest-glow-b' as any]: `${team.color}55`,
      }}>
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="w-full h-1/3" style={{ background: `linear-gradient(180deg, transparent, ${team.color}70, transparent)`, animation: 'carousel-scan 4s ease-in-out infinite' }} />
      </div>

      <div className="relative">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em]" style={{ color: team.color }}>{team.region}</span>
        <h3 className="font-display font-black text-white uppercase leading-none mt-2 text-5xl sm:text-6xl"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          {team.tag}
        </h3>
      </div>

      <div className="relative flex items-end justify-between gap-4">
        {stats?.rank_label ? (
          <div className="flex items-center gap-3">
            <Trophy size={22} style={{ color: team.color }} />
            <div>
              <p className="font-display font-black text-3xl text-white leading-none" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {stats.rank_label}
              </p>
              {stats.rank_sub && <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mt-1">{stats.rank_sub}</p>}
            </div>
          </div>
        ) : (
          <p className="text-white/25 text-xs font-mono uppercase tracking-widest">Rank pending</p>
        )}
        {stats?.record_text && (
          <span className="text-white/50 font-mono text-sm flex-shrink-0">{stats.record_text}</span>
        )}
      </div>
    </div>
  )
}

function TeamSlide({ team, stats }: { team: any; stats?: TeamStats }) {
  const roster = team.roster as { name: string; role: string; country: string; real: string; twitter: string }[]
  const statByName: Record<string, RosterStat> = {}
  for (const r of stats?.roster_stats || []) statByName[r.name] = r

  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 0%, ${team.color}, transparent 55%)` }} />

      <div className="relative max-w-6xl mx-auto px-6 py-10 sm:py-14">
        <Reveal>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: team.color, boxShadow: `0 0 16px ${team.color}` }} />
            <span className="text-xs font-mono uppercase tracking-[0.3em]" style={{ color: team.color }}>Overtake {team.tag}</span>
          </div>
          <h2 className="font-display font-black uppercase leading-[0.85] text-[clamp(40px,7vw,84px)] carousel-holo-text mb-8"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', ['--carousel-c1' as any]: team.color }}>
            {team.game}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roster */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Reveal delay={60}>
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} style={{ color: team.color }} />
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Roster</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roster.map((p, i) => {
                const stat = statByName[p.name]
                return (
                  <Reveal key={p.name} delay={100 + i * 60}>
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

          {/* Crest panel + recent matches */}
          <div className="order-1 lg:order-2 space-y-6">
            <Reveal delay={40}>
              <TeamCrestPanel team={team} stats={stats} />
            </Reveal>

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
      </div>
    </div>
  )
}

export default function TeamsPage() {
  const [statsMap, setStatsMap] = useState<Record<string, TeamStats>>({})
  const [loaded, setLoaded] = useState(false)
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStartX = useRef(0)
  const dragDelta = useRef(0)
  const viewportRef = useRef<HTMLDivElement>(null)

  const count = teams.length

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

  // Deep-link support — /teams#counterstrike still opens on the right slide.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    const found = teams.findIndex((t: any) => t.id === hash)
    if (found >= 0) setIndex(found)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  function goTo(i: number) {
    const clamped = Math.max(0, Math.min(count - 1, i))
    setIndex(clamped)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${(teams[clamped] as any).id}`)
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Don't hijack the pointer for dragging if the press started on a link,
    // button, or anything inside one (player cards, socials, "Stats via"
    // links) — capturing the pointer here was swallowing their clicks
    // entirely, since setPointerCapture reroutes the eventual pointerup away
    // from the actual target.
    if ((e.target as HTMLElement).closest('a, button')) return
    setDragging(true)
    dragStartX.current = e.clientX
    dragDelta.current = 0
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    dragDelta.current = e.clientX - dragStartX.current
    setDragOffset(dragDelta.current)
  }
  function endDrag() {
    if (!dragging) return
    setDragging(false)
    const threshold = 70
    if (dragDelta.current < -threshold) goTo(index + 1)
    else if (dragDelta.current > threshold) goTo(index - 1)
    dragDelta.current = 0
    setDragOffset(0)
  }

  const activeTeam = teams[index] as any

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <style>{`
        @keyframes carousel-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(220%); } }
        @keyframes carousel-holo { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes crest-pulse { 0%, 100% { box-shadow: 0 0 30px var(--crest-glow-a); } 50% { box-shadow: 0 0 55px var(--crest-glow-b); } }
        .team-crest-glow { animation: crest-pulse 4s ease-in-out infinite; }
        .carousel-holo-text {
          background: linear-gradient(90deg, var(--carousel-c1), #ffffff, var(--carousel-c1));
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: carousel-holo 6s ease infinite;
        }
      `}</style>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5 pt-36 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
          <div className="w-full h-40 bg-gradient-to-b from-transparent via-[#E8191A] to-transparent"
            style={{ animation: 'carousel-scan 7s linear infinite' }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Competing Under the Overtake Banner</p>
          <h1 className="font-display font-black uppercase text-white leading-[0.9] text-[clamp(48px,9vw,110px)]"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OUR<br /><span className="text-[#E8191A]">TEAMS</span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-xl mt-6 leading-relaxed">
            Every roster competing for Overtake, with rank and results kept current from HLTV and Liquipedia. Drag, swipe, or use the arrows to move between teams.
          </p>
        </div>
      </div>

      {/* Team tabs */}
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky z-20 backdrop-blur-md" style={{ top: '150px' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {teams.map((t: any, i: number) => (
            <button key={t.id} onClick={() => goTo(i)}
              className="flex items-center gap-2 px-5 py-4 border-b-2 whitespace-nowrap transition-colors flex-shrink-0"
              style={{
                borderColor: i === index ? t.color : 'transparent',
                color: i === index ? '#fff' : 'rgba(255,255,255,0.35)',
              }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color, opacity: i === index ? 1 : 0.4 }} />
              <span className="font-display font-black text-sm uppercase tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                {t.game}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Carousel viewport */}
      <div className="relative">
        <div
          ref={viewportRef}
          className="relative overflow-hidden select-none"
          style={{ height: 'calc(100vh - 220px)', minHeight: 560, touchAction: 'pan-y' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}>
          <div
            className="flex h-full"
            style={{
              width: `${count * 100}%`,
              transform: `translateX(calc(${-index * (100 / count)}% + ${dragOffset}px))`,
              transition: dragging ? 'none' : 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
              cursor: dragging ? 'grabbing' : 'grab',
            }}>
            {teams.map((team: any) => (
              <div key={team.id} className="h-full" style={{ width: `${100 / count}%`, flexShrink: 0 }}>
                <TeamSlide team={team} stats={statsMap[team.id]} />
              </div>
            ))}
          </div>
        </div>

        {/* Prev/Next arrows */}
        {index > 0 && (
          <button onClick={() => goTo(index - 1)}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-white/10 hover:border-white/30 text-white/60 hover:text-white backdrop-blur-sm transition-all">
            <ChevronLeft size={22} />
          </button>
        )}
        {index < count - 1 && (
          <button onClick={() => goTo(index + 1)}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-white/10 hover:border-white/30 text-white/60 hover:text-white backdrop-blur-sm transition-all">
            <ChevronRight size={22} />
          </button>
        )}

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 py-6">
          {teams.map((t: any, i: number) => (
            <button key={t.id} onClick={() => goTo(i)} aria-label={`Go to ${t.game}`}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === index ? 28 : 8, background: i === index ? activeTeam.color : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 text-center border-t border-white/5 pt-10">
        <Swords size={20} className="text-white/15 mx-auto mb-3" />
        <p className="text-white/25 text-xs font-mono uppercase tracking-widest">
          {loaded ? 'Stats current as of each team\'s last manual update' : 'Loading team stats...'}
        </p>
      </div>
    </div>
  )
}
