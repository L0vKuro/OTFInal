'use client'

import { ChevronRight, Calendar, Clock, Trophy, Users, Tv } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  'TOURNAMENT': '#FF4655',
  'COMMUNITY': '#00A878',
  'TRYOUTS': '#E8191A',
  'CREATOR STREAM': '#9146FF',
  'WATCH PARTY': '#F0A500',
  'PARTNER EVENT': '#A855F7',
}

const upcomingEvents = [
  {
    id: 1,
    title: 'WILD//WEST STAGE 2 — QUALIFIER 6',
    category: 'TOURNAMENT',
    game: 'VALORANT',
    featured: true,
    platform: 'funhaver.gg',
    link: 'https://funhaver.gg/',
    description: 'Overtake Valorant competes in the Wild//West Stage 2 Qualifier 6, a GSL group format tournament with playoffs spanning three days. Follow the action live.',
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
]

const pastEvents = [
  { title: 'Overtake Wins Denver LAN', category: 'TOURNAMENT', game: 'Call of Duty', date: 'April 5, 2026' },
  { title: 'Overtake Wins Vintage SoCal LAN', category: 'TOURNAMENT', game: 'Call of Duty', date: 'March 30, 2026' },
  { title: 'NAL Challengers Series Qualification', category: 'TOURNAMENT', game: 'Rainbow 6', date: 'March 1, 2026' },
  { title: 'DivineCorp Proving Grounds Championship', category: 'TOURNAMENT', game: 'Rainbow 6', date: 'January 18, 2026' },
]

export default function EventsPage() {
  const featured = upcomingEvents.find(e => e.featured)

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
              { label: 'Upcoming Events', value: '1' },
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
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase">// Featured Event</p>
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
                    HAPPENING THIS WEEKEND
                  </span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-6xl uppercase text-[#F2F2F2] mb-4"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {featured.title}
                </h2>
                <p className="text-[#F2F2F2]/50 text-base leading-relaxed mb-8 max-w-2xl">{featured.description}</p>

                {/* Schedule Days */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  View on funhaver.gg <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* More Coming Soon */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Calendar size={14} className="text-[#E8191A]" />
            <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase">// More Coming Soon</p>
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

        {/* Past Events */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[#F2F2F2]/40 text-xs font-mono tracking-widest uppercase">// Past Events</p>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pastEvents.map((event, i) => {
              const color = CATEGORY_COLORS[event.category] || '#E8191A'
              return (
                <div key={i} className="bg-[#0D0D0D] border border-white/5 p-5 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="h-px w-full mb-4" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest mb-2 block" style={{ color }}>{event.game}</span>
                  <h4 className="font-display font-black text-lg text-[#F2F2F2] uppercase mb-2"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{event.title}</h4>
                  <p className="text-[#F2F2F2]/30 text-xs font-mono">{event.date}</p>
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
