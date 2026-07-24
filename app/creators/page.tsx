'use client'

import { useState, useEffect } from 'react'
import { creators } from '@/lib/data'
import { ExternalLink, Users, TrendingUp, Tv } from 'lucide-react'

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

const PLATFORM_COLORS: Record<string, string> = {
  Twitch: '#9146FF',
  YouTube: '#FF0000',
  TikTok: '#EE1D52',
  Twitter: '#1DA1F2',
}

const TIER_LABELS: Record<number, string> = {
  1: 'Tier 1',
  2: 'Tier 2',
  3: 'Tier 3',
}

export default function CreatorsPage() {
  const [twitchStreams, setTwitchStreams] = useState<TwitchStream[]>([])
  const [youtubeStreams, setYoutubeStreams] = useState<YouTubeStream[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'live'>('all')

  useEffect(() => {
    fetch('/api/twitch-live')
      .then(r => r.json())
      .then(d => setTwitchStreams(d.streams || []))
      .catch(() => {})

    fetch('/api/youtube-live')
      .then(r => r.json())
      .then(d => setYoutubeStreams(d.streams || []))
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
  const displayed = filter === 'live' ? creators.filter(c => isLive(c)) : creators

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Hero */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
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

      {/* Creator grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {[1, 2, 3].map(tier => {
          const tierCreators = displayed.filter(c => c.tier === tier)
          if (tierCreators.length === 0) return null
          return (
            <div key={tier} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-xs font-mono tracking-widest uppercase text-white/30">
                  {TIER_LABELS[tier]}
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {tierCreators.map((creator) => {
                  const live = isLive(creator)
                  const livePlatform = getLivePlatform(creator)
                  const liveUrl = getLiveUrl(creator)
                  const viewers = getLiveViewers(creator)
                  const twitchStream = getTwitchStream(creator)
                  const platformColor = PLATFORM_COLORS[creator.platform] || '#E8191A'

                  return (
                    <div key={creator.id}
                      className="group relative bg-[#141414] border border-white/5 overflow-hidden cursor-pointer"
                      style={{
                        borderColor: live ? `${PLATFORM_COLORS[livePlatform!]}40` : 'rgba(255,255,255,0.05)',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => setSelected(creator)}>

                      {/* Top color line */}
                      <div className="h-px w-full"
                        style={{ background: `linear-gradient(90deg, ${platformColor}, transparent)` }} />

                      {/* Thumbnail / photo */}
                      <div className="relative overflow-hidden bg-[#0D0D0D]" style={{ aspectRatio: '1' }}>
                        {live && twitchStream ? (
                          <img
                            src={twitchStream.thumbnail_url.replace('{width}', '440').replace('{height}', '440')}
                            alt={creator.handle}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src={`/${creator.photo}`}
                            alt={creator.handle}
                            className="creator-photo"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.85 }}
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                        <div className="creator-overlay absolute inset-0" />

                        {/* Platform badge */}
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-black px-2 py-1 uppercase tracking-widest"
                            style={{ background: platformColor, color: '#fff' }}>
                            {creator.platform}
                          </span>
                        </div>

                        {/* Live badge */}
                        {live && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1"
                            style={{ background: PLATFORM_COLORS[livePlatform!] }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live</span>
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
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

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
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-black text-white uppercase">Live on {getLivePlatform(selected)}</span>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black px-2 py-1 uppercase tracking-widest"
                    style={{ background: PLATFORM_COLORS[selected.platform] || '#E8191A', color: '#fff' }}>
                    {selected.platform}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 uppercase border"
                    style={{ color: 'rgba(242,242,242,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    Tier {selected.tier}
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl text-white uppercase mb-1"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{selected.handle}</h2>
                <p className="text-xs font-mono mb-4" style={{ color: PLATFORM_COLORS[selected.platform] || '#E8191A' }}>
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
                        color: '#fff',
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
                  {isLive(selected) && getLiveUrl(selected) && (
                    <a href={getLiveUrl(selected)!} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all animate-pulse"
                      style={{
                        color: '#fff',
                        background: PLATFORM_COLORS[getLivePlatform(selected)!],
                        fontFamily: 'Barlow Condensed, sans-serif',
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Watch Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .creator-photo { transition: transform 0.3s ease; }
        .creator-overlay { background: rgba(0,0,0,0.5); transition: opacity 0.3s ease; }
        .group:hover .creator-photo { transform: scale(1.05); }
        .group:hover .creator-overlay { opacity: 0.1; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}
