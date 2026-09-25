'use client'

import { useState, useEffect, useRef } from 'react'
import { creators } from '@/lib/data'
import { ExternalLink, Users, TrendingUp, Tv, Video, Upload, Eye, Trophy, Play, Calendar, Sparkles, Crown } from 'lucide-react'

type TwitchStream = {
  user_login: string
  user_name: string
  title: string
  viewer_count: number
  thumbnail_url: string
}

type YouTubeStream = {
  name: string
  channelId: string
  isLive: boolean
  videoId: string | null
  title: string | null
  url: string
}

type LeaderRow = {
  person_name: string
  photo_url: string
  streams: number
  uploads: number
  views: number
}

type LatestVideo = {
  person_name: string
  photo_url: string
  platform: 'twitch' | 'youtube'
  title: string
  external_id: string
  event_date: string
  url: string
}

type LeaderboardData = {
  period: string
  topStreams: LeaderRow[]
  topUploads: LeaderRow[]
  topViews: LeaderRow[]
  latestVideo: LatestVideo | null
}

type ScheduleItem = {
  person_name: string
  content_type: string
  title: string
  scheduled_date: string
  photo_url: string
}

// Kept to a strict white / red / black palette per brand direction — no more
// purple/pink/blue platform colors. PLATFORM_COLORS is the "identity" color
// for each platform (used for fills, glows, borders). Since that identity
// color is sometimes white and sometimes black, PLATFORM_TEXT gives the
// readable text color to pair with a PLATFORM_COLORS-filled background, and
// accentSafe() gives a readable *foreground* color for spots (bare text,
// icons) that would otherwise render TikTok's black invisibly on this dark UI.
const PLATFORM_COLORS: Record<string, string> = {
  Twitch: '#F2F2F2',
  YouTube: '#E8191A',
  TikTok: '#0D0D0D',
  Twitter: '#F2F2F2',
}

const PLATFORM_TEXT: Record<string, string> = {
  Twitch: '#0D0D0D',
  YouTube: '#F2F2F2',
  TikTok: '#F2F2F2',
  Twitter: '#0D0D0D',
}

function accentSafe(platform?: string | null): string {
  if (!platform) return '#E8191A'
  if (platform === 'TikTok') return '#F2F2F2'
  return PLATFORM_COLORS[platform] || '#E8191A'
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  youtube_video: 'YouTube Video',
  youtube_short: 'YouTube Short',
  twitch_stream: 'Twitch Stream',
  tiktok_post: 'TikTok Post',
  other: 'Content',
}

const CONTENT_TYPE_COLORS: Record<string, string> = {
  youtube_video: '#FF4444',
  youtube_short: '#FF8A80',
  twitch_stream: '#9146FF',
  tiktok_post: '#EE1D52',
  other: '#F0A500',
}

const TIER_LABELS: Record<number, string> = {
  1: 'Tier 1',
  2: 'Tier 2',
  3: 'Tier 3',
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// Fades a section up into view the first time it scrolls into frame — used
// throughout this page so scrolling down through Live/Leaders/Timeline/Grid
// keeps feeling alive instead of everything just being there on page load.
function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect() } },
      { threshold: 0.12 }
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
        transform: revealed ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}>
      {children}
    </div>
  )
}

function LeaderAvatar({ src, name, size = 36 }: { src?: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const initials = name.slice(0, 2).toUpperCase()
  if (!src || failed) {
    return (
      <div className="flex items-center justify-center rounded-full bg-white/10 text-white/50 font-mono font-bold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.32 }}>
        {initials}
      </div>
    )
  }
  return (
    <img src={src} alt={name} onError={() => setFailed(true)}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }} />
  )
}

function LeaderboardBoard({ title, icon: Icon, color, rows, unit, platformLabel }: { title: string; icon: any; color: string; rows: LeaderRow[]; unit: (r: LeaderRow) => number; platformLabel: string }) {
  return (
    <div className="bg-[#141414] border border-white/5 overflow-hidden transition-colors hover:border-white/10">
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <Icon size={14} style={{ color }} />
        <h3 className="font-display font-black text-sm text-[#F2F2F2] uppercase tracking-wide"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{title}</h3>
        <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ml-auto"
          style={{ color, borderColor: `${color}40`, background: `${color}10` }}>{platformLabel}</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-white/20 text-xs font-mono px-5 pb-5">No data yet this month.</p>
      ) : (
        <div className="px-2 pb-3">
          {rows.map((r, i) => (
            <div key={r.person_name} className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-white/[0.03]">
              <span className="font-display font-black text-lg w-5 text-center flex-shrink-0"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', color: i === 0 ? color : 'rgba(242,242,242,0.25)' }}>
                {i + 1}
              </span>
              <LeaderAvatar src={r.photo_url} name={r.person_name} />
              <span className="flex-1 min-w-0 truncate font-display font-black text-sm text-[#F2F2F2] uppercase"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{r.person_name}</span>
              <span className="text-xs font-mono flex-shrink-0" style={{ color }}>{formatNum(unit(r))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function relativeDay(dateStr: string): string {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  return target.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function JustDroppedCard({ video, creator }: { video: LatestVideo; creator: any }) {
  const platformKey = video.platform === 'twitch' ? 'Twitch' : 'YouTube'
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-[#E8191A]" />
        <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Just Dropped</p>
      </div>
      <a href={video.url} target="_blank" rel="noopener noreferrer"
        className="group relative block bg-[#0D0D0D] border border-white/10 hover:border-[#E8191A]/40 overflow-hidden transition-all">
        <div className="relative overflow-hidden bg-[#141414]" style={{ aspectRatio: '16/9' }}>
          {creator ? (
            <img src={`/${creator.photo}`} alt={video.person_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ objectPosition: 'top' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#141414]">
              <Video size={24} className="text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#E8191A] flex items-center justify-center shadow-[0_0_20px_rgba(232,25,26,0.5)] group-hover:scale-110 transition-transform">
              <Play size={16} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          <div className="absolute top-2 left-2">
            <span className="text-[9px] font-black px-2 py-1 uppercase tracking-widest"
              style={{ background: PLATFORM_COLORS[platformKey], color: PLATFORM_TEXT[platformKey] }}>
              {video.platform === 'twitch' ? 'Twitch VOD' : 'YouTube'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <LeaderAvatar src={video.photo_url} name={video.person_name} size={22} />
            <span className="font-display font-bold text-xs text-[#E8191A] uppercase tracking-wide"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{video.person_name}</span>
            <span className="text-white/25 text-[10px] font-mono ml-auto">
              {new Date(video.event_date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h3 className="font-display font-black text-base text-white uppercase leading-tight mb-2 group-hover:text-[#E8191A] transition-colors"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            {video.title || 'New content just went up'}
          </h3>
          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-mono uppercase tracking-widest">
            <Play size={10} /> Watch now <ExternalLink size={10} />
          </div>
        </div>
      </a>
    </div>
  )
}

export default function CreatorsPage() {
  const [twitchStreams, setTwitchStreams] = useState<TwitchStream[]>([])
  const [youtubeStreams, setYoutubeStreams] = useState<YouTubeStream[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'live'>('all')

  // Hover preview — a short delay before showing (so a quick mouse pass
  // across the grid doesn't pop things open), no delay on hide.
  const [hoveredCreator, setHoveredCreator] = useState<any>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCardEnter = (creator: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setHoveredCreator(creator), 180)
  }
  const handleCardLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setHoveredCreator(null)
  }

  useEffect(() => {
    fetch('/api/twitch-live')
      .then(r => r.json())
      .then(d => setTwitchStreams(d.streams || []))
      .catch(() => {})

    fetch('/api/youtube-live')
      .then(r => r.json())
      .then(d => setYoutubeStreams(d.streams || []))
      .catch(() => {})

    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => setLeaderboard(d))
      .catch(() => {})

    fetch('/api/creator-schedule')
      .then(r => r.json())
      .then(d => setSchedule(d.items || []))
      .catch(() => {})
  }, [])

  const getTwitchStream = (creator: any) => {
    if (creator.socials?.twitch) {
      return twitchStreams.find(s =>
        s.user_login.toLowerCase() === creator.socials.twitch.toLowerCase()
      )
    }
    return twitchStreams.find(s =>
      s.user_login.toLowerCase() === creator.handle.toLowerCase().replace(/\s/g, '')
    )
  }

  const getYouTubeStream = (creator: any) => {
    return youtubeStreams.find(s =>
      s.name.toLowerCase() === creator.handle.toLowerCase().replace(/\s/g, '_')
    )
  }

  const isLive = (creator: any) => !!getTwitchStream(creator) || !!getYouTubeStream(creator)

  const getLivePlatform = (creator: any) => {
    if (getTwitchStream(creator)) return 'Twitch'
    if (getYouTubeStream(creator)) return 'YouTube'
    return null
  }

  const getLiveUrl = (creator: any) => {
    const twitch = getTwitchStream(creator)
    if (twitch) return `https://twitch.tv/${twitch.user_login}`
    const yt = getYouTubeStream(creator)
    if (yt) return yt.url
    return null
  }

  const getLiveViewers = (creator: any) => {
    const twitch = getTwitchStream(creator)
    if (twitch) return twitch.viewer_count
    return null
  }

  const totalFollowers = creators.reduce((acc, c) => {
    const f = parseInt(c.followers?.replace(/[^0-9]/g, '') || '0')
    return acc + f
  }, 0)

  const liveCount = creators.filter(c => isLive(c)).length

  const hasLeaderboardData = leaderboard && (leaderboard.topStreams.length > 0 || leaderboard.topUploads.length > 0 || leaderboard.topViews.length > 0)

  // "Creator of the Month" — whoever tops the combined-views board, since that
  // reflects overall reach across both platforms rather than just one metric.
  // Falls back to the top streamer, then top uploader, so this only stays empty
  // if there's genuinely no synced activity at all yet.
  const creatorOfMonth = leaderboard?.topViews[0] || leaderboard?.topStreams[0] || leaderboard?.topUploads[0] || null
  const creatorOfMonthData = creatorOfMonth ? creators.find(c => c.handle.toUpperCase() === creatorOfMonth.person_name.toUpperCase()) : null

  const latestVideoData = leaderboard?.latestVideo
  const latestVideoCreator = latestVideoData ? creators.find(c => c.handle.toUpperCase() === latestVideoData.person_name.toUpperCase()) : null

  return (
    <div className="relative min-h-screen">
      <style>{`
        .creator-photo { transition: transform 0.3s ease; }
        .creator-overlay { background: rgba(0,0,0,0.5); transition: opacity 0.3s ease; }
        .group:hover .creator-photo { transform: scale(1.05); }
        .group:hover .creator-overlay { opacity: 0.1; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes hoverPeekIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes creators-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(232,25,26,0.15); } 50% { box-shadow: 0 0 40px rgba(232,25,26,0.35); } }
        .timeline-dot { animation: pulse-glow 2.5s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Hero */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
          <div className="w-full h-40 bg-gradient-to-b from-transparent via-[#E8191A] to-transparent"
            style={{ animation: 'creators-scan 8s linear infinite' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Content Division</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            <span className="text-white">OUR</span><br />
            <span style={{ background: 'linear-gradient(135deg, #FF3334 0%, #E8191A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CREATORS</span>
          </h1>
          <p className="text-white/40 text-lg mt-6 max-w-xl leading-relaxed">
            Gaming culture is shaped by the people who create it. Meet the Overtake content division — streamers, personalities, and creators pushing the culture forward.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { icon: Users, label: 'Active Creators', value: creators.length.toString() },
              { icon: TrendingUp, label: 'Combined Followers', value: `${(totalFollowers / 1000).toFixed(1)}k+` },
              { icon: Tv, label: 'Platforms', value: 'Youtube, Twitch & TikTok' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 border border-white/8 px-5 py-3 bg-white/2">
                <Icon size={14} className="text-[#E8191A]" />
                <span className="text-[#F2F2F2]/40 text-sm">{label}</span>
                <span className="font-display font-black text-lg text-[#F2F2F2]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Live filter */}
          {liveCount > 0 && (
            <div className="flex gap-3 mt-6">
              <button onClick={() => setFilter('all')}
                className="px-4 py-2 text-xs font-black uppercase tracking-widest transition-all border"
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  color: filter === 'all' ? '#F2F2F2' : 'rgba(242,242,242,0.3)',
                  borderColor: filter === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  background: filter === 'all' ? 'rgba(255,255,255,0.05)' : 'transparent',
                }}>
                All Creators
              </button>
              <button onClick={() => setFilter('live')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all border"
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  color: filter === 'live' ? '#F2F2F2' : 'rgba(242,242,242,0.3)',
                  borderColor: filter === 'live' ? '#E8191A' : 'rgba(255,255,255,0.05)',
                  background: filter === 'live' ? 'rgba(232,25,26,0.1)' : 'transparent',
                }}>
                <span className="w-2 h-2 rounded-full bg-[#E8191A] animate-pulse" />
                Live Now ({liveCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Now — its own dedicated section, only shown when that toggle is active */}
      {filter === 'live' ? (
        <div className="relative border-b border-white/5 overflow-hidden min-h-[50vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/8 via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8191A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E8191A]" />
              </span>
              <h2 className="font-display font-black text-3xl text-[#F2F2F2] uppercase"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Live Right Now</h2>
            </div>
            <p className="text-white/40 text-sm max-w-2xl leading-relaxed mb-10">
              Overtake's creators stream and post across Twitch, YouTube, and TikTok all week long. The moment one of them goes live, they show up right here — no need to check every platform yourself.
            </p>

            {liveCount > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {creators.filter(c => isLive(c)).map((creator, i) => {
                  const livePlatform = getLivePlatform(creator)
                  const liveUrl = getLiveUrl(creator)
                  const viewers = getLiveViewers(creator)
                  const twitchStream = getTwitchStream(creator)
                  const color = PLATFORM_COLORS[livePlatform!] || '#E8191A'

                  return (
                    <Reveal key={creator.id} delay={i * 80}>
                      <a href={liveUrl ?? '#'} target="_blank" rel="noopener noreferrer"
                        className="group relative block bg-[#141414] overflow-hidden"
                        style={{ border: `1px solid ${color}50`, boxShadow: `0 0 40px ${color}1c` }}>
                        <div className="relative overflow-hidden bg-[#0D0D0D]" style={{ aspectRatio: '16/9' }}>
                          {twitchStream ? (
                            <img
                              src={twitchStream.thumbnail_url.replace('{width}', '800').replace('{height}', '450')}
                              alt={creator.handle}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <img
                              src={`/${creator.photo}`}
                              alt={creator.handle}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              style={{ objectPosition: 'top' }}
                              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                            />
                          )}
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.92) 8%, transparent 55%)' }} />

                          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5"
                            style={{ background: color }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: PLATFORM_TEXT[livePlatform!] || '#fff' }} />
                            <span className="text-xs font-black uppercase tracking-widest" style={{ color: PLATFORM_TEXT[livePlatform!] || '#fff' }}>Live</span>
                          </div>

                          <div className="absolute top-4 right-4">
                            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1.5"
                              style={{ background: 'rgba(0,0,0,0.6)', color, border: `1px solid ${color}50` }}>
                              Tier {creator.tier}
                            </span>
                          </div>

                          {viewers !== null && (
                            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70">
                              <Users size={12} className="text-white/70" />
                              <span className="text-xs font-mono text-white/90">
                                {viewers >= 1000 ? `${(viewers / 1000).toFixed(1)}k` : viewers}
                              </span>
                            </div>
                          )}

                          <div className="absolute bottom-4 left-5 right-5">
                            <h3 className="font-display font-black text-3xl text-white uppercase leading-none mb-1"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                              {creator.handle}
                            </h3>
                            <p className="text-sm font-mono uppercase tracking-widest" style={{ color }}>
                              {livePlatform} · {creator.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-colors"
                          style={{ color, background: `${color}12` }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
                          Watch on {livePlatform}
                        </div>
                      </a>
                    </Reveal>
                  )
                })}
              </div>
            ) : (
              <div className="border border-white/5 bg-[#141414] px-8 py-16 text-center">
                <p className="text-white/30 font-mono text-sm mb-6">Nobody's live right now — check back soon.</p>
                <button onClick={() => setFilter('all')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-all"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Browse All Creators
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Leaders — Creator of the Month spotlight + supporting boards */}
          {hasLeaderboardData && (
            <div className="border-b border-white/5 bg-white/[0.015]">
              <div className="max-w-7xl mx-auto px-6 py-16">
                <Reveal>
                  <div className="flex items-center gap-3 mb-8">
                    <Trophy size={18} className="text-[#E8191A]" />
                    <h2 className="font-display font-black text-3xl text-[#F2F2F2] uppercase"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>This Month's Leaders</h2>
                    <span className="text-white/25 text-xs font-mono">{leaderboard!.period}</span>
                  </div>
                </Reveal>

                {creatorOfMonth && (
                  <Reveal delay={60}>
                    <div className="relative mb-8 overflow-hidden bg-gradient-to-br from-[#E8191A]/10 via-[#141414] to-[#141414] border border-[#E8191A]/30 p-8 flex flex-wrap items-center gap-6">
                      <div className="absolute -top-10 -right-10 opacity-[0.06] pointer-events-none">
                        <Crown size={220} />
                      </div>
                      <div className="relative flex items-center gap-2 px-3 py-1.5 bg-[#E8191A] flex-shrink-0"
                        style={{ alignSelf: 'flex-start' }}>
                        <Crown size={14} className="text-white" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Creator of the Month</span>
                      </div>
                      <div className="relative flex items-center gap-5 flex-1 min-w-[240px]">
                        <LeaderAvatar src={creatorOfMonth.photo_url} name={creatorOfMonth.person_name} size={72} />
                        <div>
                          <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-none"
                            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{creatorOfMonth.person_name}</h3>
                          {creatorOfMonthData && (
                            <p className="text-white/40 text-sm font-mono mt-1">{creatorOfMonthData.specialty}</p>
                          )}
                        </div>
                      </div>
                      <div className="relative flex gap-6 flex-wrap">
                        {creatorOfMonth.streams > 0 && (
                          <div>
                            <p className="font-display font-black text-2xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{creatorOfMonth.streams}</p>
                            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">Streams</p>
                          </div>
                        )}
                        {creatorOfMonth.uploads > 0 && (
                          <div>
                            <p className="font-display font-black text-2xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{creatorOfMonth.uploads}</p>
                            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">Uploads</p>
                          </div>
                        )}
                        {creatorOfMonth.views > 0 && (
                          <div>
                            <p className="font-display font-black text-2xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{formatNum(creatorOfMonth.views)}</p>
                            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">Views</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Reveal delay={100}><LeaderboardBoard title="Most Streams" icon={Video} color="#9146FF" rows={leaderboard!.topStreams} unit={r => r.streams} platformLabel="Twitch" /></Reveal>
                  <Reveal delay={160}><LeaderboardBoard title="Most Uploads" icon={Upload} color="#FF0000" rows={leaderboard!.topUploads} unit={r => r.uploads} platformLabel="YouTube" /></Reveal>
                  <Reveal delay={220}><LeaderboardBoard title="Most Views" icon={Eye} color="#E8191A" rows={leaderboard!.topViews} unit={r => r.views} platformLabel="Twitch + YouTube" /></Reveal>
                </div>
              </div>
            </div>
          )}

          {/* What's Next — forward-looking content timeline, pulled from the admin
              Creator Schedule. Only ever shows upcoming, not-yet-posted items. */}
          {schedule.length > 0 && (
            <div className="border-b border-white/5">
              <div className="max-w-5xl mx-auto px-6 py-16">
                <Reveal>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={18} className="text-[#E8191A]" />
                    <h2 className="font-display font-black text-3xl text-[#F2F2F2] uppercase"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>What's Next</h2>
                  </div>
                  <p className="text-white/40 text-sm mb-10">Upcoming content from the crew — streams, uploads, and posts on the way.</p>
                </Reveal>
                <div className="relative pl-8 sm:pl-10">
                  <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-[#E8191A]/50 via-white/10 to-transparent" />
                  <div className="space-y-5">
                    {schedule.map((item, i) => {
                      const color = CONTENT_TYPE_COLORS[item.content_type] || '#F0A500'
                      return (
                        <Reveal key={i} delay={i * 60}>
                          <div className="relative flex items-center gap-4">
                            <span className="absolute -left-8 sm:-left-10 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full timeline-dot flex-shrink-0"
                              style={{ background: color }} />
                            <div className="flex items-center gap-4 bg-[#141414] border border-white/5 hover:border-white/15 px-5 py-4 flex-1 transition-colors">
                              <LeaderAvatar src={item.photo_url} name={item.person_name} size={40} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                  <span className="font-display font-black text-white uppercase text-sm"
                                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{item.person_name}</span>
                                  <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border"
                                    style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                                    {CONTENT_TYPE_LABELS[item.content_type] || 'Content'}
                                  </span>
                                </div>
                                <p className="text-white/50 text-sm truncate">{item.title}</p>
                              </div>
                              <span className="text-white/30 text-xs font-mono uppercase tracking-widest flex-shrink-0 text-right">
                                {relativeDay(item.scheduled_date)}
                              </span>
                            </div>
                          </div>
                        </Reveal>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Creator grid, with Just Dropped as a side feature instead of a
              full-width top banner */}
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 min-w-0 order-2 lg:order-1">
            {[1, 2, 3].map(tier => {
              const tierCreators = creators.filter(c => c.tier === tier)
              if (tierCreators.length === 0) return null
              return (
                <div key={tier} className="mb-16">
                  <Reveal>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 bg-white/5" />
                      <span className="text-xs font-mono tracking-widest uppercase text-white/30">
                        {TIER_LABELS[tier]}
                      </span>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                  </Reveal>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {tierCreators.map((creator, i) => {
                      const live = isLive(creator)
                      const livePlatform = getLivePlatform(creator)
                      const liveUrl = getLiveUrl(creator)
                      const viewers = getLiveViewers(creator)
                      const platformColor = PLATFORM_COLORS[creator.platform] || '#E8191A'

                      return (
                        <Reveal key={creator.id} delay={(i % 10) * 40}>
                          <div
                            className="group relative bg-[#141414] border border-white/5 overflow-hidden cursor-pointer"
                            style={{
                              borderColor: live ? `${PLATFORM_COLORS[livePlatform!]}40` : 'rgba(255,255,255,0.05)',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={() => setSelected(creator)}
                            onMouseEnter={() => handleCardEnter(creator)}
                            onMouseLeave={handleCardLeave}>

                            {/* Top color line */}
                            <div className="h-px w-full"
                              style={{ background: `linear-gradient(90deg, ${platformColor}, transparent)` }} />

                            {/* Thumbnail / photo — always the profile photo, never swapped for the live stream thumbnail (that only shows in the Live Now section) */}
                            <div className="relative overflow-hidden bg-[#0D0D0D]" style={{ aspectRatio: '1' }}>
                              <img
                                src={`/${creator.photo}`}
                                alt={creator.handle}
                                className="creator-photo"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.85 }}
                                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                              />
                              <div className="creator-overlay absolute inset-0" />

                              {/* Platform badge */}
                              <div className="absolute top-2 left-2">
                                <span className="text-[10px] font-black px-2 py-1 uppercase tracking-widest"
                                  style={{ background: platformColor, color: PLATFORM_TEXT[creator.platform] || '#fff' }}>
                                  {creator.platform}
                                </span>
                              </div>

                              {/* Live badge */}
                              {live && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1"
                                  style={{ background: PLATFORM_COLORS[livePlatform!] }}>
                                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PLATFORM_TEXT[livePlatform!] || '#fff' }} />
                                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: PLATFORM_TEXT[livePlatform!] || '#fff' }}>Live</span>
                                </div>
                              )}

                              {/* Viewer count */}
                              {viewers !== null && (
                                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70">
                                  <Users size={10} className="text-white/60" />
                                  <span className="text-[10px] font-mono text-white/80">
                                    {viewers >= 1000 ? `${(viewers / 1000).toFixed(1)}k` : viewers}
                                  </span>
                                </div>
                              )}

                              {/* Tier badge */}
                              <div className="absolute bottom-2 left-2">
                                <span className="text-[10px] font-mono px-2 py-1 uppercase"
                                  style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                  Tier {creator.tier}
                                </span>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                              <h3 className="font-display font-black text-base text-[#F2F2F2] uppercase leading-none mb-1"
                                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                                {creator.handle}
                              </h3>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-white/30">{creator.specialty}</span>
                                <span className="flex items-center gap-1 text-xs font-mono text-white/30">
                                  <Users size={10} /> {creator.followers}
                                </span>
                              </div>
                            </div>

                            {/* Watch live button */}
                            {live && liveUrl && (
                              <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-black uppercase tracking-widest border-t transition-colors"
                                style={{
                                  color: PLATFORM_COLORS[livePlatform!],
                                  borderColor: `${PLATFORM_COLORS[livePlatform!]}30`,
                                  background: `${PLATFORM_COLORS[livePlatform!]}10`,
                                }}>
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                                  style={{ background: PLATFORM_COLORS[livePlatform!] }} />
                                Watch on {livePlatform}
                              </a>
                            )}
                          </div>
                        </Reveal>
                      )
                    })}
                  </div>
                </div>
              )
            })}
              </div>

              {latestVideoData && (
                <aside className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
                  <div className="lg:sticky lg:top-24">
                    <JustDroppedCard video={latestVideoData} creator={latestVideoCreator} />
                  </div>
                </aside>
              )}
            </div>
          </div>
        </>
      )}

      {/* Hover preview — a quick, non-blocking peek at a creator card without
          requiring a click. Clicking through it opens the full modal. */}
      {hoveredCreator && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-6 pointer-events-none">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-auto transition-opacity"
            onClick={handleCardLeave} />
          <div className="relative bg-[#0D0D0D] border border-white/10 shadow-2xl overflow-hidden pointer-events-auto cursor-pointer"
            style={{ width: 'min(360px, 90vw)', animation: 'hoverPeekIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}
            onClick={() => { setSelected(hoveredCreator); handleCardLeave() }}>
            <div className="h-1 w-full" style={{ background: PLATFORM_COLORS[hoveredCreator.platform] || '#E8191A' }} />
            <div className="relative overflow-hidden bg-[#141414]" style={{ aspectRatio: '1' }}>
              <img src={`/${hoveredCreator.photo}`} alt={hoveredCreator.handle}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0D0D0D 10%, transparent 55%)' }} />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-black px-2 py-1 uppercase tracking-widest"
                  style={{ background: PLATFORM_COLORS[hoveredCreator.platform] || '#E8191A', color: PLATFORM_TEXT[hoveredCreator.platform] || '#fff' }}>
                  {hoveredCreator.platform}
                </span>
              </div>
              {isLive(hoveredCreator) && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1"
                  style={{ background: PLATFORM_COLORS[getLivePlatform(hoveredCreator)!] }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PLATFORM_TEXT[getLivePlatform(hoveredCreator)!] || '#fff' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: PLATFORM_TEXT[getLivePlatform(hoveredCreator)!] || '#fff' }}>Live</span>
                </div>
              )}
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-display font-black text-2xl text-white uppercase leading-none"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{hoveredCreator.handle}</h3>
                <p className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: accentSafe(hoveredCreator.platform) }}>
                  {hoveredCreator.specialty}
                </p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3">{hoveredCreator.bio}</p>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-white/30">
                  <Users size={11} /> {hoveredCreator.followers} followers
                </span>
                <span className="text-white/25 uppercase tracking-widest">Click for full profile</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creator modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-[#0D0D0D] border border-white/10 w-full max-w-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'scaleIn 0.2s ease-out' }}>
            <div className="h-1 w-full"
              style={{ background: PLATFORM_COLORS[selected.platform] || '#E8191A' }} />
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative h-64 sm:h-auto overflow-hidden bg-[#141414]">
                <img src={`/${selected.photo}`} alt={selected.handle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0D0D0D 5%, transparent 50%)' }} />
                {isLive(selected) && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5"
                    style={{ background: PLATFORM_COLORS[getLivePlatform(selected)!] }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: PLATFORM_TEXT[getLivePlatform(selected)!] || '#fff' }} />
                    <span className="text-xs font-black uppercase" style={{ color: PLATFORM_TEXT[getLivePlatform(selected)!] || '#fff' }}>Live on {getLivePlatform(selected)}</span>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black px-2 py-1 uppercase tracking-widest"
                    style={{ background: PLATFORM_COLORS[selected.platform] || '#E8191A', color: PLATFORM_TEXT[selected.platform] || '#fff' }}>
                    {selected.platform}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 uppercase border"
                    style={{ color: 'rgba(242,242,242,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    Tier {selected.tier}
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl text-white uppercase mb-1"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{selected.handle}</h2>
                <p className="text-xs font-mono mb-4" style={{ color: accentSafe(selected.platform) }}>
                  {selected.specialty}
                </p>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{selected.bio}</p>
                <div className="flex items-center gap-2 mb-6 pb-5 border-b border-white/5">
                  <Users size={12} className="text-white/30" />
                  <span className="text-white/30 text-xs font-mono">{selected.followers} followers</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.link && (
                    <a href={selected.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all"
                      style={{
                        color: PLATFORM_TEXT[selected.platform] || '#fff',
                        background: PLATFORM_COLORS[selected.platform] || '#E8191A',
                        fontFamily: 'Barlow Condensed, sans-serif',
                      }}>
                      <ExternalLink size={11} /> {selected.platform}
                    </a>
                  )}
                  {selected.socials?.twitter && (
                    <a href={selected.socials.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-widest border border-white/10 hover:border-white/30 text-white/40 hover:text-white transition-all"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Twitter
                    </a>
                  )}
                  {selected.socials?.tiktok && (
                    <a href={selected.socials.tiktok} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-widest border border-white/10 hover:border-white/30 text-white/40 hover:text-white transition-all"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                      TikTok
                    </a>
                  )}
                  {isLive(selected) && getLiveUrl(selected) && (
                    <a href={getLiveUrl(selected)!} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all animate-pulse"
                      style={{
                        color: PLATFORM_TEXT[getLivePlatform(selected)!] || '#fff',
                        background: PLATFORM_COLORS[getLivePlatform(selected)!],
                        fontFamily: 'Barlow Condensed, sans-serif',
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: PLATFORM_TEXT[getLivePlatform(selected)!] || '#fff' }} />
                      Watch Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
