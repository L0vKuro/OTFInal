'use client'

import { useState, useEffect } from 'react'
import { Trophy, Users, Globe, Zap, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const values = [
  {
    icon: Trophy,
    title: 'Excellence',
    desc: 'We set high standards for every player, creator, and staff member. Every detail matters.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Our supporters are the foundation of what we build. We grow stronger together.',
  },
  {
    icon: Globe,
    title: 'Inclusion',
    desc: 'Esports is global. We welcome talent from every background and create opportunities for all.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    desc: 'We challenge the standard approach to esports through smarter content, development, and team structure.',
  },
]

const milestones = [
  { year: '2024', title: 'Foundation Begins', desc: 'Overtake Sector begins building its identity on X, laying the groundwork for a competitive esports brand focused on players, creators, and community.' },
  { year: '2025', title: 'Official Expansion', desc: 'Overtake grows into a recognized esports organization, expanding into multiple titles and developing its roster, content, and brand presence.' },
  { year: '2025', title: 'Competitive Growth', desc: 'Overtake enters the competitive scene with active teams and creators, pushing the organization into larger esports spaces while building its public reputation.' },
  { year: '2025', title: 'Brand Development', desc: 'Overtake continues strengthening its image through social media, community engagement, official jerseys, and the #OvertakeYourLimits identity.' },
  { year: '2026', title: 'New Level of Competition', desc: 'Overtake steps further into competitive esports with appearances across titles such as VALORANT and Counter-Strike, continuing to build results and visibility.' },
  { year: '2026', title: 'The Next Chapter', desc: 'Overtake focuses on long-term growth through stronger rosters, better content structure, creator development, and a larger community-driven presence.' },
]

const leadership = [
  { name: 'Lazur', role: 'CEO / Founder', bio: 'Visionary behind Overtake Sector. Building the org from the ground up with passion and purpose.', twitter: 'wydlazur' },
  { name: 'Kuro', role: 'COO', bio: 'Oversees day-to-day operations and keeps the organization running at its best.', twitter: 'L0vKuro' },
  { name: 'Shady', role: 'Chief Strategy Officer', bio: 'Develops and oversees the organization\'s long-term growth strategy, positioning Overtake for sustained success.', twitter: 'ShadyBoBandy' },
  { name: 'Isaac', role: 'Esports Director', bio: 'Oversees competitive teams, players, coaches, recruitment, tournament participation, and overall esports operations.', twitter: 'IsaaacBlitz' },
  { name: 'Ghxst', role: 'General Manager & Relations', bio: 'Manages the overall direction of teams and ensures competitive excellence across all titles.', twitter: 'JohnWickFPS' },
  { name: 'Ghost', role: 'Project Manager', bio: 'Coordinates projects and initiatives across the organization to keep everything on track.', twitter: 'GraveGhost_1' },
  { name: 'Dynasty', role: 'Content Manager', bio: 'Leads the content strategy and creative direction for Overtake across all platforms.', twitter: 'DynastyK1NG' },
  { name: 'Jxe', role: 'Social Media Manager', bio: "Drives Overtake's social presence and keeps fans connected with the latest updates.", twitter: 'OfficialJxe5_' },
  { name: 'Visionz', role: 'CoD Manager', bio: 'Oversees the Call of Duty roster and competitive strategy.', twitter: 'Visionzuh' },
  { name: 'Zap', role: 'Fortnite Manager', bio: 'Manages the Fortnite division and competitive operations.', twitter: 'zapticalggs' },
  { name: 'Javsr', role: 'Fortnite Talent Manager', bio: 'Oversees Fortnite talent acquisition and player development within the Overtake division.', twitter: 'javsrtalent' },
]

const quotes = [
  { name: 'Lazur', role: 'CEO / Founder', quote: "Don't worry about failure; you only have to be right once." },
  { name: 'Kuro', role: 'COO', quote: 'Doubt kills more dreams than failure ever will.' },
  { name: 'Shady', role: 'Chief Strategy Officer', quote: 'No discipline feels pleasant in the moment — it is painful. But those who push through it are rewarded with a harvest of growth, peace, and purpose.' },
  { name: 'Isaac', role: 'Esports Director', quote: 'Good company is the company of clever, well-informed people who have a great deal of conversation — that is what moves things forward.' },
  { name: 'Ghxst', role: 'General Manager & Relations', quote: 'To be a goat, you must learn and overcome the failures and struggles that go along with the dreams you foresee.' },
  { name: 'Ghost', role: 'Project Manager', quote: 'It is during our darkest moments that we must focus to see the light.' },
  { name: 'Dynasty', role: 'Content Manager', quote: 'Life is like a video game, it gets hard because you leveled up.' },
  { name: 'Jxe', role: 'Social Media Manager', quote: 'In order to be successful at what you\'re doing, you have to be obsessed with change.' },
  { name: 'Visionz', role: 'CoD Manager', quote: 'Success is focusing the full power of all you are on what you have a burning desire to achieve.' },
  { name: 'Zap', role: 'Fortnite Manager', quote: 'Learn as if you will live forever, live like you will die tomorrow.' },
  { name: 'Javsr', role: 'Fortnite Talent Manager', quote: 'Talent wins games, but teamwork and intelligence win championships.' },
]

export default function AboutPage() {
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % quotes.length)
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goTo = (i: number) => {
    setFade(false)
    setTimeout(() => {
      setCurrent(i)
      setFade(true)
    }, 400)
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Hero */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Our Story</p>
              <h1 className="font-display font-black text-7xl md:text-9xl uppercase leading-none"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                <span className="text-white">WHO</span><br />
                <span style={{ background: 'linear-gradient(135deg, #FF3334 0%, #E8191A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>WE ARE</span>
              </h1>
              <p className="text-white/40 text-xl mt-8 max-w-2xl leading-relaxed">
                Driven by Passion, Overtake is backed by Members who believe in doing more than just playing video games. In and out of the game we support each other for who we are. 1 Goal, 1 Mission, we are Overtake.
              </p>
            </div>
            <Link href="/brand"
              className="hidden md:flex items-center gap-2 bg-[#141414] border border-[#E8191A]/40 hover:border-[#E8191A] px-6 py-3 text-white hover:bg-[#1c1c1c] font-bold tracking-wider uppercase text-sm transition-all whitespace-nowrap shadow-lg"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Brand Kit <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quote Slideshow */}
      <div className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[200px] bg-[#E8191A]/6 blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="border border-[#E8191A]/20 p-12 relative" style={{ background: 'rgba(232,25,26,0.03)' }}>
            <div className="absolute top-0 left-0 w-8 h-px bg-[#E8191A]" />
            <div className="absolute top-0 left-0 h-8 w-px bg-[#E8191A]" />
            <div className="absolute bottom-0 right-0 w-8 h-px bg-[#E8191A]" />
            <div className="absolute bottom-0 right-0 h-8 w-px bg-[#E8191A]" />
            <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.4s ease' }}>
              <p className="font-display font-black text-2xl md:text-3xl text-white uppercase leading-tight mb-6"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                &ldquo;{quotes[current].quote}&rdquo;
              </p>
              <p className="text-[#E8191A] text-sm font-mono tracking-widest uppercase">
                — {quotes[current].name}, {quotes[current].role}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? '24px' : '8px',
                    height: '8px',
                    background: i === current ? '#E8191A' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-[#0D0D0D] border-t border-b border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// What We Stand For</p>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              OUR VALUES
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="relative bg-[#141414] border border-white/5 hover:border-[#E8191A]/20 p-8 group card-hover">
                <div className="h-px w-full mb-8 bg-gradient-to-r from-[#E8191A] to-transparent" />
                <Icon size={28} className="text-[#E8191A] mb-4" />
                <h3 className="font-display font-black text-2xl text-white uppercase mb-3"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
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
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            THE JOURNEY
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/8 hidden md:block" />
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={`${m.year}-${i}`}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-0 pb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <div className="inline-block font-display font-black text-5xl text-[#E8191A] mb-2"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {m.year}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white uppercase mb-2"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {m.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">{m.desc}</p>
                </div>
                <div className="absolute left-0 md:left-1/2 top-2 w-3 h-3 bg-[#E8191A] rounded-full -translate-x-1/2 border-2 border-[#0D0D0D] hidden md:block" />
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
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              LEADERSHIP
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leadership.map((person) => (
              <a key={person.name}
                href={`https://x.com/${person.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#141414] border border-white/5 hover:border-[#E8191A]/30 p-6 card-hover block group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8191A]/10 border border-[#E8191A]/20 flex items-center justify-center">
                    <span className="font-display font-black text-xl text-[#E8191A]"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      {person.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="w-7 h-7 flex items-center justify-center text-white/20 group-hover:text-white/60 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-white uppercase mb-1 group-hover:text-[#E8191A] transition-colors"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {person.name}
                </h3>
                <p className="text-[#E8191A] text-xs font-mono tracking-wider uppercase mb-3">{person.role}</p>
                <p className="text-white/40 text-sm leading-relaxed mb-3">{person.bio}</p>
                <p className="text-white/25 text-xs font-mono">@{person.twitter}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            BE PART OF THE STORY
          </h2>
          <p className="text-white/40 mb-10">Whether you play, create, or watch — there is a place for you in Overtake.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/join"
              className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all clip-corner text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Join Overtake <ChevronRight size={14} />
            </Link>
            <Link href="/brand"
              className="flex items-center gap-2 border border-white/10 hover:border-[#E8191A]/40 px-8 py-4 text-white/60 hover:text-white font-medium tracking-wider uppercase text-sm transition-all"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Brand Kit <ChevronRight size={14} />
            </Link>
            <Link href="/contact"
              className="flex items-center gap-2 border border-white/10 hover:border-white/30 px-8 py-4 text-white/60 hover:text-white font-medium tracking-wider uppercase text-sm transition-all"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
