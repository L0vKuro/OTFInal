'use client'

import { useState } from 'react'
import { ChevronRight, Calendar, Clock, Trophy, Users, Tv, ChevronDown, MapPin } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  'TOURNAMENT': '#FF4655',
  'COMMUNITY': '#00A878',
  'TRYOUTS': '#E8191A',
  'CREATOR STREAM': '#9146FF',
  'WATCH PARTY': '#F0A500',
  'PARTNER EVENT': '#A855F7',
  'LAN': '#F0A500',
}

const upcomingEvents = [
  {
    id: 1,
    title: 'FRAG MIDWEST: ST. LOUIS',
    category: 'LAN',
    game: 'COUNTER-STRIKE',
    featured: true,
    date: 'August 29–30, 2026',
    location: 'Impact Gaming Center — Fairview Heights, IL',
    link: 'https://x.com/fragadelphia',
    prizePool: 'Up to $10,000',
    description: 'Overtake Counter-Strike heads to St. Louis for FRAG Midwest — a 32-team LAN event hosted by FRAG at Impact Gaming Center. Up to $10,000 on the line with VRS eligible matches.',
    details: [
      'Prize Pool scales up to $10,000 at full tournament (32 teams)',
      '1st: $5,500 | 2nd: $2,500 | 3rd: $1,300 | 4th: $700',
      'No refunds or ticket transfers',
      'VRS Eligible',
      'Hosted by @fragadelphia',
    ],
    days: [
      {
        day: 'DAY 1 — FRIDAY, AUG 29TH',
        subtitle: 'GROUPS',
        schedule: [
          { time: 'TBA', event: 'Check-in & Setup' },
          { time: 'TBA', event: 'Group Stage Begins' },
        ],
      },
      {
        day: 'DAY 2 — SATURDAY, AUG 30TH',
        subtitle: 'PLAYOFFS',
        schedule: [
          { time: 'TBA', event: 'Playoff Bracket' },
          { time: 'TBA', event: 'Grand Finals' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'R6 NA OPEN CUP LAN — ST. LOUIS',
    category: 'LAN',
    game: 'RAINBOW 6',
    featured: false,
    date: 'August 21–23, 2026',
    location: 'St. Louis, MO',
    link: 'https://x.com/R6esportsNA',
    prizePool: 'TBA',
    description: 'Overtake Rainbow 6 competes in the NA Open Cup LAN series, heading to St. Louis for the third stop of the season. Hosted by Rainbow Six Esports NA.',
    details: [
      'Part of the NA Open Cup LAN series',
      'Previous stops: Philadelphia PA (Jun 12–14), Windsor ON (Jul 17–19)',
      'Upcoming: Palmetto Bay FL (Sept 25–27)',
      'Finals: Salt Lake City UT (Oct 23–25)',
      'Hosted by @R6esportsNA',
    ],
    days: [
      {
        day: 'DAY 1 — THURSDAY, AUG 21ST',
        subtitle: 'GROUPS',
        schedule: [{ time: 'TBA', event: 'Group Stage' }],
      },
      {
        day: 'DAY 2 — FRIDAY, AUG 22ND',
        subtitle: 'GROUPS',
        schedule: [{ time: 'TBA', event: 'Group Stage Continues' }],
      },
      {
        day: 'DAY 3 — SATURDAY, AUG 23RD',
        subtitle: 'PLAYOFFS',
        schedule: [{ time: 'TBA', event: 'Playoff Bracket & Finals' }],
      },
    ],
  },
]

const archivedEvents = [
  {
    id: 10,
    title: 'WILD//WEST STAGE 2 — QUALIFIER 6',
    category: 'TOURNAMENT',
    game: 'VALORANT',
    date: 'June 13–15, 2026',
    location: 'Online',
    link: 'https://funhaver.gg/',
    description: 'Overtake Valorant competed in the Wild//West Stage 2 Qualifier 6, a GSL group format tournament with playoffs spanning three days.',
    details: [],
    days: [
      {
        day: 'DAY 1 — FRIDAY, JUNE 13TH',
        subtitle: 'GSL GROUPS',
        schedule: [
          { time: '5:30 PM EDT', event: 'Captains Meeting & Vetos Open' },
          { time: '5:40 PM EDT', event: 'Ready Penalties Enabled' },
          { time: '5:55 PM EDT', event: 'Vetos Must Begin or Lose Maps/Sides' },
          { time: '6:00 PM EDT', event: 'Group Opener' },
          { time: '8:00 PM EDT', event: 'Upper Decider' },
          { time: '8:00 PM EDT', event: 'Lower Round 1' },
          { time: '10:00 PM EDT', event: 'Lower Decider' },
        ],
      },
      {
        day: 'DAY 2 — SATURDAY, JUNE 14TH',
        subtitle: 'PLAYOFFS',
        schedule: [
          { time: '1:50 PM EDT', event: 'Vetos Must Begin or Lose Maps/Sides' },
          { time: '2:00 PM EDT', event: 'Round of 32' },
          { time: '4:00 PM EDT', event: 'Round of 16' },
        ],
      },
      {
        day: 'DAY 3 — SUNDAY, JUNE 15TH',
        subtitle: 'PLAYOFFS',
        schedule: [
          { time: '2:45 PM EDT', event: 'Vetos Must Begin or Lose Maps/Sides' },
          { time: '3:00 PM EDT', event: 'Quarter Finals' },
          { time: '5:00 PM EDT', event: 'Semifinals' },
          { time: '7:00 PM EDT', event: 'Grand Finals' },
        ],
      },
    ],
  },
  { id: 11, title: 'Overtake Wins Denver LAN', category: 'TOURNAMENT', game: 'Call of Duty', date: 'April 5, 2026', location: 'Denver, CO', link: 'https://x.com/OvertakeSector/status/2041028971186516153?s=20', description: 'Overtake took home the trophy at the Denver LAN, proving dominance in competitive Call of Duty on the big stage.', details: [], days: [] },
  { id: 12, title: 'Overtake Wins Vintage SoCal LAN', category: 'TOURNAMENT', game: 'Call of Duty', date: 'March 30, 2026', location: 'Southern California', link: 'https://x.com/OvertakeSector/status/2038578890751558141/photo/1', description: 'Overtake dominated the Vintage SoCal LAN tournament, cementing their reputation as one of the top CoD teams in the region.', details: [], days: [] },
  { id: 13, title: 'NAL Challengers Series Qualification', category: 'TOURNAMENT', game: 'Rainbow 6', date: 'March 1, 2026', location: 'Online', link: 'https://x.com/OvertakeSector/status/2028306360925138995?s=20', description: 'Overtake qualified for the NAL Challengers Series with Lunar, Sneky, Valen, Tweedy, and Ayex leading the charge.', details: [], days: [] },
  { id: 14, title: 'DivineCorp Proving Grounds Championship', category: 'TOURNAMENT', game: 'Rainbow 6', date: 'January 18, 2026', location: 'Online', link: 'https://x.com/OvertakeSector/status/2013103219547779326?s=20', description: 'Overtake claimed the DivineCorp Proving Grounds championship with Valen, Ayex, Tweedy, Sneky, Lunar, and Enoa.', details: [], days: [] },
]

export default function EventsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const featured = upcomingEvents.find(e => e.featured)
  const otherUpcoming = upcomingEvents.filter(e => !e.featured)

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px bg-[#E8191A]"
              style={{ right: `${i * 50}px`, transform: 'skewX(-15deg)' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Schedule & Events</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-[#F2F2F2] leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            EVENTS &<br />
            <span style={{ background: 'linear-gradient(135deg, #FF3334, #E8191A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>COMMUNITY</span>
          </h1>
          <p className="text-[#F2F2F2]/40 text-lg mt-6 max-w-xl">
            Stay connected with Overtake through tournaments, creator streams, community nights, giveaways, and official team events.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Upcoming Events', value: '2' },
              { label: 'Active Teams', value: '10' },
              { label: 'Tournament Wins', value: '20+' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 border border-white/8 px-5 py-3 bg-white/2">
                <Trophy size={14} className="text-[#E8191A]" />
                <span className="text-[#F2F2F2]/40 text-sm">{label}</span>
                <span className="font-display font-black text-xl text-[#F2F2F2]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">

        {/* Featured Event */}
        {featured && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-[#E8191A] rounded-full animate-pulse" />
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase">// Featured Upcoming Event</p>
            </div>
            <div className="bg-[#141414] border border-[#E8191A]/20 overflow-hidden">
              <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent" />
              <div className="p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-[10px] font-mono font-black px-3 py-1.5 uppercase tracking-widest"
                    style={{ color: CATEGORY_COLORS[featured.category] || '#E8191A', background: `${CATEGORY_COLORS[featured.category] || '#E8191A'}15`, border: `1px solid ${CATEGORY_COLORS[featured.category] || '#E8191A'}30` }}>
                    {featured.category}
                  </span>
                  <span className="text-[10px] font-mono px-3 py-1.5 bg-white/5 border border-white/10 text-[#F2F2F2]/60 uppercase tracking-widest">
                    {featured.game}
                  </span>
                  <span className="text-[10px] font-mono px-3 py-1.5 bg-[#E8191A]/10 border border-[#E8191A]/20 text-[#E8191A] uppercase tracking-widest">
                    {featured.prizePool} PRIZE POOL
                  </span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-6xl uppercase text-[#F2F2F2] mb-3"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {featured.title}
                </h2>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[#F2F2F2]/40 text-sm">
                    <Calendar size={14} className="text-[#E8191A]" />
                    {featured.date}
                  </div>
                  <div className="flex items-center gap-2 text-[#F2F2F2]/40 text-sm">
                    <MapPin size={14} className="text-[#E8191A]" />
                    {featured.location}
                  </div>
                </div>
                <p className="text-[#F2F2F2]/50 text-base leading-relaxed mb-6 max-w-2xl">{featured.description}</p>
                <div className="space-y-2 mb-8">
                  {featured.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-[#E8191A] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-[#F2F2F2]/40 text-sm font-mono">{d}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {featured.days.map((day, di) => (
                    <div key={di} className="bg-[#0D0D0D] border border-white/5 p-5">
                      <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-4" />
                      <p className="font-display font-black text-sm text-[#F2F2F2] uppercase mb-1"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{day.day}</p>
                      <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">{day.subtitle}</p>
                      <div className="space-y-2">
                        {day.schedule.map((item, si) => (
                          <div key={si} className="flex items-start gap-3">
                            <span className="text-[#E8191A] font-mono text-xs whitespace-nowrap mt-0.5">{item.time}</span>
                            <span className="text-[#F2F2F2]/50 text-xs">{item.event}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <a href={featured.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-black tracking-widest uppercase text-sm transition-all hover:shadow-[0_0_30px_rgba(232,25,26,0.4)] clip-corner text-white"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  View Event <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Other Upcoming */}
        {otherUpcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Calendar size={14} className="text-[#E8191A]" />
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase">// Also Coming Up</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherUpcoming.map((event) => {
                const color = CATEGORY_COLORS[event.category] || '#E8191A'
                return (
                  <div key={event.id} className="bg-[#141414] border border-white/5 hover:border-white/10 overflow-hidden transition-all">
                    <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-[10px] font-mono font-black px-2 py-1 uppercase tracking-widest"
                          style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
                          {event.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/10 text-[#F2F2F2]/40 uppercase tracking-widest">
                          {event.game}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-2xl text-[#F2F2F2] uppercase mb-3"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{event.title}</h3>
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="flex items-center gap-2 text-[#F2F2F2]/40 text-xs font-mono">
                          <Calendar size={12} style={{ color }} />{event.date}
                        </div>
                        <div className="flex items-center gap-2 text-[#F2F2F2]/40 text-xs font-mono">
                          <MapPin size={12} style={{ color }} />{event.location}
                        </div>
                      </div>
                      <p className="text-[#F2F2F2]/40 text-sm leading-relaxed mb-4">{event.description}</p>
                      <div className="space-y-1 mb-5">
                        {event.details.map((d, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
                            <span className="text-[#F2F2F2]/30 text-xs font-mono">{d}</span>
                          </div>
                        ))}
                      </div>
                      <a href={event.link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-white/10 hover:border-[#E8191A]/50 px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-[#F2F2F2]/50 hover:text-[#E8191A] transition-all">
                        View Event <ChevronRight size={12} />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Coming Soon Placeholders */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Clock size={14} className="text-[#F2F2F2]/30" />
            <p className="text-[#F2F2F2]/30 text-xs font-mono tracking-widest uppercase">// More Coming Soon</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Community Night', category: 'COMMUNITY', desc: 'Join the Overtake Discord for a community gaming night. Details coming soon.', icon: Users },
              { title: 'Creator Stream Takeover', category: 'CREATOR STREAM', desc: 'Overtake creators go live together. Platform and schedule TBA.', icon: Tv },
              { title: 'Open Tryouts', category: 'TRYOUTS', desc: 'Season 2026 tryouts are open. Apply now to compete for a roster spot.', icon: Trophy },
            ].map((event, i) => {
              const Icon = event.icon
              const color = CATEGORY_COLORS[event.category] || '#E8191A'
              return (
                <div key={i} className="bg-[#0D0D0D] border border-white/5 hover:border-white/10 overflow-hidden transition-all">
                  <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-mono font-black px-2 py-1 uppercase tracking-widest"
                        style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
                        {event.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon size={20} style={{ color }} />
                      <h3 className="font-display font-black text-2xl text-[#F2F2F2] uppercase"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{event.title}</h3>
                    </div>
                    <p className="text-[#F2F2F2]/40 text-sm leading-relaxed mb-4">{event.desc}</p>
                    <div className="flex items-center gap-2 text-xs font-mono" style={{ color }}>
                      <Clock size={12} /> TBA
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Archive */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[#F2F2F2]/40 text-xs font-mono tracking-widest uppercase">// Event Archive</p>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="space-y-3">
            {archivedEvents.map((event) => {
              const color = CATEGORY_COLORS[event.category] || '#E8191A'
              const isOpen = expandedId === event.id
              return (
                <div key={event.id} className="bg-[#0D0D0D] border border-white/5 hover:border-white/10 overflow-hidden transition-all">
                  <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <button
                    onClick={() => setExpandedId(isOpen ? null : event.id)}
                    className="w-full flex items-center justify-between p-5 text-left group">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-[10px] font-mono font-black px-2 py-1 uppercase tracking-widest"
                        style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
                        {event.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/10 text-[#F2F2F2]/40 uppercase tracking-widest">
                        {event.game}
                      </span>
                      <h4 className="font-display font-black text-xl text-[#F2F2F2] uppercase group-hover:text-[#E8191A] transition-colors"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{event.title}</h4>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <span className="text-[#F2F2F2]/30 text-xs font-mono hidden sm:block">{event.date}</span>
                      <ChevronDown size={16} className={`text-[#F2F2F2]/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 border-t border-white/5">
                      <p className="text-[#F2F2F2]/50 text-sm leading-relaxed mt-4 mb-4">{event.description}</p>
                      {event.days.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          {event.days.map((day, di) => (
                            <div key={di} className="bg-[#141414] border border-white/5 p-4">
                              <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-3" />
                              <p className="font-display font-black text-sm text-[#F2F2F2] uppercase mb-1"
                                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{day.day}</p>
                              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-3">{day.subtitle}</p>
                              <div className="space-y-2">
                                {day.schedule.map((item, si) => (
                                  <div key={si} className="flex items-start gap-3">
                                    <span className="text-[#E8191A] font-mono text-xs whitespace-nowrap mt-0.5">{item.time}</span>
                                    <span className="text-[#F2F2F2]/40 text-xs">{item.event}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-white/10 hover:border-[#E8191A]/50 px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-[#F2F2F2]/50 hover:text-[#E8191A] transition-all">
                          View Event <ChevronRight size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#141414] border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Stay In The Loop</p>
          <h2 className="font-display font-black text-5xl md:text-6xl uppercase text-[#F2F2F2] mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            NEVER MISS<br />AN EVENT
          </h2>
          <p className="text-[#F2F2F2]/40 mb-8">Join the Discord to get notified about upcoming tournaments, community nights, and tryouts.</p>
          <a href="https://discord.com/invite/OvertakeSector" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-10 py-5 font-black tracking-widest uppercase text-base transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.4)] clip-corner text-white"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Join Discord <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}
