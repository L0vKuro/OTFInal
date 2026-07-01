'use client'

import { useState } from 'react'
import { ChevronRight, Gamepad2, Camera, Check } from 'lucide-react'

type FormType = 'player' | 'creator'

const GAMES = ['VALORANT', 'Warzone', 'Apex Legends', 'Call of Duty', 'Rocket League', 'Rainbow 6 Siege', 'Deadlock', 'Clash Royale', 'iRacing', 'Other']

const RANKS: Record<string, string[]> = {
  'VALORANT': ['Iron 1', 'Iron 2', 'Iron 3', 'Bronze 1', 'Bronze 2', 'Bronze 3', 'Silver 1', 'Silver 2', 'Silver 3', 'Gold 1', 'Gold 2', 'Gold 3', 'Platinum 1', 'Platinum 2', 'Platinum 3', 'Diamond 1', 'Diamond 2', 'Diamond 3', 'Ascendant 1', 'Ascendant 2', 'Ascendant 3', 'Immortal 1', 'Immortal 2', 'Immortal 3', 'Radiant'],
  'Warzone': ['Unranked', 'Bronze I', 'Bronze II', 'Bronze III', 'Silver I', 'Silver II', 'Silver III', 'Gold I', 'Gold II', 'Gold III', 'Platinum I', 'Platinum II', 'Platinum III', 'Diamond I', 'Diamond II', 'Diamond III', 'Crimson I', 'Crimson II', 'Crimson III', 'Iridescent', 'Top 250'],
  'Apex Legends': ['Bronze IV', 'Bronze III', 'Bronze II', 'Bronze I', 'Silver IV', 'Silver III', 'Silver II', 'Silver I', 'Gold IV', 'Gold III', 'Gold II', 'Gold I', 'Platinum IV', 'Platinum III', 'Platinum II', 'Platinum I', 'Diamond IV', 'Diamond III', 'Diamond II', 'Diamond I', 'Master', 'Predator'],
  'Call of Duty': ['Bronze I', 'Bronze II', 'Bronze III', 'Silver I', 'Silver II', 'Silver III', 'Gold I', 'Gold II', 'Gold III', 'Platinum I', 'Platinum II', 'Platinum III', 'Diamond I', 'Diamond II', 'Diamond III', 'Crimson I', 'Crimson II', 'Crimson III', 'Iridescent', 'Top 250'],
  'Rocket League': ['Bronze I', 'Bronze II', 'Bronze III', 'Silver I', 'Silver II', 'Silver III', 'Gold I', 'Gold II', 'Gold III', 'Platinum I', 'Platinum II', 'Platinum III', 'Diamond I', 'Diamond II', 'Diamond III', 'Champion I', 'Champion II', 'Champion III', 'Grand Champion I', 'Grand Champion II', 'Grand Champion III', 'Supersonic Legend'],
  'Rainbow 6 Siege': ['Copper V', 'Copper IV', 'Copper III', 'Copper II', 'Copper I', 'Bronze V', 'Bronze IV', 'Bronze III', 'Bronze II', 'Bronze I', 'Silver V', 'Silver IV', 'Silver III', 'Silver II', 'Silver I', 'Gold III', 'Gold II', 'Gold I', 'Platinum III', 'Platinum II', 'Platinum I', 'Diamond III', 'Diamond II', 'Diamond I', 'Champion'],
  'Deadlock': ['Obscurus', 'Seeker', 'Alchemist', 'Arcanist', 'Ritualist', 'Emissary', 'Phantom', 'Ascendant'],
  'Clash Royale': ['Arena 1', 'Arena 2', 'Arena 3', 'Arena 4', 'Arena 5', 'Arena 6', 'Arena 7', 'Arena 8', 'Arena 9', 'Arena 10', 'Arena 11', 'Arena 12', 'Arena 13', 'Arena 14', 'Arena 15', 'Legendary Arena', 'Champion', 'Grand Champion', 'Ultimate Champion', 'Master I', 'Master II', 'Master III'],
  'iRacing': ['Rookie', 'Class D', 'Class C', 'Class B', 'Class A', 'Pro', 'Pro/WC'],
  'Other': [],
}

const PLATFORMS = ['Twitch', 'YouTube', 'TikTok', 'Twitter/X', 'Instagram', 'Multiple']

const FORMSPREE_PLAYER = 'https://formspree.io/f/xkoaryvd'
const FORMSPREE_CREATOR = 'https://formspree.io/f/xwvjoyrk'

export default function JoinPage() {
  const [formType, setFormType] = useState<FormType>('player')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [playerForm, setPlayerForm] = useState({
    name: '', ign: '', email: '', game: '', rank: '', otherGame: '', region: '', age: '', socials: '', clips: '', why: '',
  })

  const [creatorForm, setCreatorForm] = useState({
    name: '', handle: '', email: '', twitter: '', platform: '', followers: '', content: '', socials: '', why: '', samples: '',
  })

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(FORMSPREE_PLAYER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[PLAYER APPLICATION] ${playerForm.name} — ${playerForm.game === 'Other' ? playerForm.otherGame : playerForm.game}`,
          Type: 'Player Application',
          ...playerForm,
          game: playerForm.game === 'Other' ? playerForm.otherGame : playerForm.game,
        }),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(FORMSPREE_CREATOR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[CREATOR APPLICATION] ${creatorForm.name} — ${creatorForm.platform}`,
          Type: 'Creator Application',
          ...creatorForm,
        }),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const selectStyle = {
    backgroundColor: '#1A1A1A',
    color: '#F2F2F2',
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/8 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px bg-[#E8191A]"
              style={{ right: `${i * 50}px`, transform: 'skewX(-15deg)' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Open Applications</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-white leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            JOIN<br />
            <span style={{ background: 'linear-gradient(135deg, #FF3334, #E8191A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              OVERTAKE
            </span>
          </h1>
          <p className="text-white/40 text-lg mt-6 max-w-xl">
            Whether you're a top-ranked competitor or an emerging content creator — if you've got what it takes, we want to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Form Type Selector */}
        <div className="flex gap-3 mb-12" id="player">
          {[
            { type: 'player' as FormType, icon: Gamepad2, label: 'Player Application', desc: 'Compete on an Overtake roster' },
            { type: 'creator' as FormType, icon: Camera, label: 'Creator Application', desc: 'Join the content division' },
          ].map(({ type, icon: Icon, label, desc }) => (
            <button key={type} onClick={() => { setFormType(type); setSubmitted(false); }}
              className={`flex-1 flex items-center gap-4 p-5 border transition-all text-left ${formType === type ? 'border-[#E8191A]/50 bg-[#E8191A]/8' : 'border-white/5 bg-[#0D0D0D] hover:border-white/10'}`}>
              <div className={`w-10 h-10 flex items-center justify-center border ${formType === type ? 'border-[#E8191A]/40 bg-[#E8191A]/15' : 'border-white/10 bg-white/5'}`}>
                <Icon size={18} className={formType === type ? 'text-[#E8191A]' : 'text-white/40'} />
              </div>
              <div>
                <div className={`font-display font-bold text-lg uppercase ${formType === type ? 'text-white' : 'text-white/50'}`}
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{label}</div>
                <div className="text-white/30 text-xs">{desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Forms */}
        {submitted ? (
          <div className="text-center py-24 border border-[#E8191A]/20 bg-[#E8191A]/5">
            <div className="w-20 h-20 bg-[#E8191A]/15 border border-[#E8191A]/30 flex items-center justify-center mx-auto mb-8">
              <Check size={36} className="text-[#E8191A]" />
            </div>
            <h2 className="font-display font-black text-5xl text-white uppercase mb-4"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>APPLICATION SUBMITTED</h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              Thanks for applying to Overtake. Our team reviews all applications within 7–14 days. We'll reach out if you're a fit.
            </p>
            <button onClick={() => setSubmitted(false)}
              className="text-sm text-[#E8191A] hover:text-white font-medium tracking-wider transition-colors">
              Submit Another Application
            </button>
          </div>
        ) : (
          <>
            {/* Player Form */}
            {formType === 'player' && (
              <form onSubmit={handlePlayerSubmit} className="bg-[#0D0D0D] border border-white/5 p-8 md:p-10 space-y-6">
                <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent" />
                <h2 className="font-display font-black text-3xl uppercase text-white"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Player Application</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Full Name *</label>
                    <input type="text" required value={playerForm.name} onChange={e => setPlayerForm(f => ({ ...f, name: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="Your real name" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">In-Game Name *</label>
                    <input type="text" required value={playerForm.ign} onChange={e => setPlayerForm(f => ({ ...f, ign: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="Your IGN" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Email *</label>
                    <input type="email" required value={playerForm.email} onChange={e => setPlayerForm(f => ({ ...f, email: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Age *</label>
                    <input type="number" required min="16" max="40" value={playerForm.age} onChange={e => setPlayerForm(f => ({ ...f, age: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="Your age" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Primary Game *</label>
                    <select required value={playerForm.game}
                      onChange={e => setPlayerForm(f => ({ ...f, game: e.target.value, rank: '', otherGame: '' }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm appearance-none"
                      style={selectStyle}>
                      <option value="" disabled style={{ color: '#666' }}>Select game</option>
                      {GAMES.map(g => <option key={g} value={g} style={{ color: '#F2F2F2', backgroundColor: '#1A1A1A' }}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Current Rank *</label>
                    {playerForm.game === 'Other' ? (
                      <input type="text" required value={playerForm.rank}
                        onChange={e => setPlayerForm(f => ({ ...f, rank: e.target.value }))}
                        className="input-dark w-full px-4 py-3 rounded-sm text-sm"
                        placeholder="Enter your rank" />
                    ) : (
                      <select required value={playerForm.rank}
                        onChange={e => setPlayerForm(f => ({ ...f, rank: e.target.value }))}
                        className="input-dark w-full px-4 py-3 rounded-sm text-sm appearance-none"
                        style={selectStyle}
                        disabled={!playerForm.game}>
                        <option value="" disabled style={{ color: '#666' }}>Select rank</option>
                        {(RANKS[playerForm.game] || []).map(r => <option key={r} value={r} style={{ color: '#F2F2F2', backgroundColor: '#1A1A1A' }}>{r}</option>)}
                      </select>
                    )}
                  </div>
                </div>

                {playerForm.game === 'Other' && (
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Which Game? *</label>
                    <input type="text" required value={playerForm.otherGame}
                      onChange={e => setPlayerForm(f => ({ ...f, otherGame: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm"
                      placeholder="Enter the game you play" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Region *</label>
                    <select required value={playerForm.region} onChange={e => setPlayerForm(f => ({ ...f, region: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm appearance-none"
                      style={selectStyle}>
                      <option value="" disabled style={{ color: '#666' }}>Select region</option>
                      {['NA East', 'NA West', 'EU West', 'EU East', 'LATAM', 'Asia Pacific', 'OCE'].map(r => (
                        <option key={r} style={{ color: '#F2F2F2', backgroundColor: '#1A1A1A' }}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Social Links</label>
                    <input type="text" value={playerForm.socials} onChange={e => setPlayerForm(f => ({ ...f, socials: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="Twitter, Discord, Twitch..." />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Clips / VOD Links</label>
                  <input type="text" value={playerForm.clips} onChange={e => setPlayerForm(f => ({ ...f, clips: e.target.value }))}
                    className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="YouTube, Twitch clips, VALORANT tracker..." />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Why Overtake? *</label>
                  <textarea required rows={5} value={playerForm.why} onChange={e => setPlayerForm(f => ({ ...f, why: e.target.value }))}
                    className="input-dark w-full px-4 py-3 rounded-sm text-sm resize-none"
                    placeholder="Tell us about yourself, your competitive journey, and why you want to join Overtake..." />
                </div>

                <button type="submit" disabled={loading}
                  className="flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] disabled:opacity-50 px-10 py-4 font-black tracking-widest uppercase text-sm transition-all hover:shadow-[0_0_30px_rgba(232,25,26,0.4)] clip-corner group text-white"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                  {!loading && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            )}

            {/* Creator Form */}
            {formType === 'creator' && (
              <form onSubmit={handleCreatorSubmit} id="creator" className="bg-[#0D0D0D] border border-white/5 p-8 md:p-10 space-y-6 scroll-mt-24">
                <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent" />
                <h2 className="font-display font-black text-3xl uppercase text-white"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Creator Application</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Full Name *</label>
                    <input type="text" required value={creatorForm.name} onChange={e => setCreatorForm(f => ({ ...f, name: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="Your real name" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Creator Handle *</label>
                    <input type="text" required value={creatorForm.handle} onChange={e => setCreatorForm(f => ({ ...f, handle: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="@yourhandle" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Email *</label>
                    <input type="email" required value={creatorForm.email} onChange={e => setCreatorForm(f => ({ ...f, email: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Twitter / X Handle *</label>
                    <input
                      type="text"
                      required
                      value={creatorForm.twitter}
                      onChange={e => setCreatorForm(f => ({ ...f, twitter: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm"
                      placeholder="@yourtwitter"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Primary Platform *</label>
                    <select required value={creatorForm.platform} onChange={e => setCreatorForm(f => ({ ...f, platform: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm appearance-none"
                      style={selectStyle}>
                      <option value="" disabled style={{ color: '#666' }}>Select platform</option>
                      {PLATFORMS.map(p => <option key={p} style={{ color: '#F2F2F2', backgroundColor: '#1A1A1A' }}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Total Followers / Subs *</label>
                    <input type="text" required value={creatorForm.followers} onChange={e => setCreatorForm(f => ({ ...f, followers: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="e.g. 50,000" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Content Type *</label>
                    <input type="text" required value={creatorForm.content} onChange={e => setCreatorForm(f => ({ ...f, content: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="e.g. FPS gameplay, IRL, strategy..." />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Channel / Profile Links *</label>
                  <input type="text" required value={creatorForm.socials} onChange={e => setCreatorForm(f => ({ ...f, socials: e.target.value }))}
                    className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="Links to your Twitch, YouTube, TikTok, etc." />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Content Samples</label>
                  <input type="text" value={creatorForm.samples} onChange={e => setCreatorForm(f => ({ ...f, samples: e.target.value }))}
                    className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="3 links to your best pieces of content" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Why Overtake? *</label>
                  <textarea required rows={5} value={creatorForm.why} onChange={e => setCreatorForm(f => ({ ...f, why: e.target.value }))}
                    className="input-dark w-full px-4 py-3 rounded-sm text-sm resize-none"
                    placeholder="Tell us about yourself, your content style, and why you'd be a good fit for the Overtake creator roster..." />
                </div>

                <button type="submit" disabled={loading}
                  className="flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] disabled:opacity-50 px-10 py-4 font-black tracking-widest uppercase text-sm transition-all hover:shadow-[0_0_30px_rgba(232,25,26,0.4)] clip-corner group text-white"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                  {!loading && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            )}
          </>
        )}

        {/* What to expect */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Apply', desc: 'Submit your application form with all required info.' },
            { step: '02', title: 'Review', desc: 'Our team reviews all applications within 7–14 days.' },
            { step: '03', title: 'Trial', desc: 'Shortlisted applicants are invited to a formal trial.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-[#0D0D0D] border border-white/5 p-6">
              <div className="font-display font-black text-4xl text-[#E8191A]/40 mb-3"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{step}</div>
              <h3 className="font-display font-bold text-xl text-white uppercase mb-2"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{title}</h3>
              <p className="text-white/30 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
