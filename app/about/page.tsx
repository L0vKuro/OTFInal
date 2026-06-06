import { Trophy, Users, Globe, Zap, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About — Overtake Esports',
  description: 'Learn about Overtake Esports — our story, mission, and the team behind the organization.',
}

const values = [
  {
    icon: Trophy,
    title: 'Excellence',
    desc: 'We hold every player, creator, and staff member to the highest standard. Good enough never is.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Our fans aren\'t just spectators. They\'re the backbone of everything we build.',
  },
  {
    icon: Globe,
    title: 'Inclusion',
    desc: 'Esports has no borders. We recruit globally and celebrate every background.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    desc: 'We push beyond traditional structures — from content creation to athlete development.',
  },
]

const milestones = [
  { year: '2020', title: 'Overtake Founded', desc: 'Started as a scrappy Valorant team of five. First regional win in three months.' },
  { year: '2021', title: 'First Major Title', desc: 'Claimed the Challengers NA trophy, putting Overtake on the national map.' },
  { year: '2022', title: 'Expansion to 3 Titles', desc: 'Launched Apex Legends and Call of Duty rosters. Creator program launched.' },
  { year: '2023', title: 'International Debut', desc: 'Rocket League team competes globally. First EU presence established.' },
  { year: '2024', title: 'Landmark Partnerships', desc: 'Signed founding partnerships with NVIDIA and SteelSeries. Creator roster triples.' },
  { year: '2025', title: 'LA Training Facility', desc: 'Opening a 12,000 sq ft performance center — Overtake HQ in Los Angeles.' },
]

const leadership = [
  { name: 'Jordan Lee', role: 'Founder & CEO', bio: 'Former pro turned org builder. 8 years in competitive esports.' },
  { name: 'Mia Kovacs', role: 'Head of Esports', bio: 'Former team manager for two top-tier NA organizations.' },
  { name: 'Darius Webb', role: 'Head of Content', bio: 'Built creator programs reaching 30M+ monthly views.' },
  { name: 'Samantha Rojas', role: 'Head of Partnerships', bio: '10+ years in brand marketing and sponsorship activation.' },
]

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Hero */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Our Story</p>
          <h1
            className="font-display font-black text-7xl md:text-9xl uppercase leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            <span className="text-white">WHO</span><br />
            <span style={{
              background: 'linear-gradient(135deg, #FF3334 0%, #E8191A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>WE ARE</span>
          </h1>
          <p className="text-white/40 text-xl mt-8 max-w-2xl leading-relaxed">
            Overtake was born from a simple idea: esports deserves an organization built on genuine passion, performance, and people. We started with five players and a shared Google Doc. Five years later, we're a multi-title org competing globally — and we're just getting started.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[200px] bg-[#E8191A]/6 blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="border border-[#E8191A]/20 p-12 bg-[#E8191A]/3 relative">
            <div className="absolute top-0 left-0 w-8 h-px bg-[#E8191A]" />
            <div className="absolute top-0 left-0 h-8 w-px bg-[#E8191A]" />
            <div className="absolute bottom-0 right-0 w-8 h-px bg-[#E8191A]" />
            <div className="absolute bottom-0 right-0 h-8 w-px bg-[#E8191A]" />
            <p
              className="font-display font-black text-3xl md:text-4xl text-white uppercase leading-tight"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              "To build the most competitive and culturally relevant esports organization in the world — one player, one creator, one community at a time."
            </p>
            <p className="text-[#E8191A] text-sm font-mono mt-6 tracking-widest uppercase">— Jordan Lee, Founder</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-[#0D0D0D] border-t border-b border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// What We Stand For</p>
            <h2
              className="font-display font-black text-5xl md:text-7xl uppercase text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              OUR VALUES
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="relative bg-[#141414] border border-white/5 hover:border-[#E8191A]/20 p-8 group card-hover">
                <div className="h-px w-full mb-8 bg-gradient-to-r from-[#E8191A] to-transparent" />
                <Icon size={28} className="text-[#E8191A] mb-4" />
                <h3
                  className="font-display font-black text-2xl text-white uppercase mb-3"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// History</p>
          <h2
            className="font-display font-black text-5xl md:text-7xl uppercase text-white"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            THE JOURNEY
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/8 hidden md:block" />
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-0 pb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <div
                    className="inline-block font-display font-black text-5xl text-[#E8191A] mb-2"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {m.year}
                  </div>
                  <h3
                    className="font-display font-bold text-2xl text-white uppercase mb-2"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {m.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">{m.desc}</p>
                </div>

                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 top-2 w-3 h-3 bg-[#E8191A] rounded-full -translate-x-1/2 border-2 border-[#0D0D0D] hidden md:block" />

                {/* Spacer */}
                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="bg-[#0D0D0D] border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// The Team</p>
            <h2
              className="font-display font-black text-5xl md:text-7xl uppercase text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              LEADERSHIP
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {leadership.map((person) => (
              <div key={person.name} className="bg-[#141414] border border-white/5 hover:border-white/10 p-6 card-hover">
                <div className="w-12 h-12 rounded-full bg-[#E8191A]/10 border border-[#E8191A]/20 flex items-center justify-center mb-4">
                  <span
                    className="font-display font-black text-xl text-[#E8191A]"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3
                  className="font-display font-bold text-xl text-white uppercase mb-1"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {person.name}
                </h3>
                <p className="text-[#E8191A] text-xs font-mono tracking-wider uppercase mb-3">{person.role}</p>
                <p className="text-white/40 text-sm leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="font-display font-black text-5xl md:text-7xl uppercase text-white mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            BE PART OF THE STORY
          </h2>
          <p className="text-white/40 mb-10">Whether you play, create, or watch — there's a place for you in Overtake.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all clip-corner"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Join Overtake <ChevronRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 border border-white/10 hover:border-white/30 px-8 py-4 text-white/60 hover:text-white font-medium tracking-wider uppercase text-sm transition-all"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
