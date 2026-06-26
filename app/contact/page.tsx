'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Twitter, ChevronRight, Send, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('https://formspree.io/f/mbdeolpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSubmitted(true)
    } catch {
      // fail silently
    }
    setSubmitting(false)
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative pt-36 pb-20 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Get In Touch</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-white leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            CONTACT<br />US
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="font-display font-black text-2xl uppercase text-white mb-6"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                REACH OUT
              </h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Have a question, partnership inquiry, or media request? Use the form or reach us directly through any of the channels below.
              </p>
            </div>

            {/* Contact channels */}
            <div className="space-y-3">
              {[
                { icon: Mail, label: 'General Inquiries', value: 'contact@overtakegg.com', color: '#E8191A' },
                { icon: MapPin, label: 'Headquarters', value: 'Louisiana, USA', color: '#E8191A' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-start gap-4 bg-[#0D0D0D] border border-white/5 p-4">
                  <div className="w-8 h-8 flex items-center justify-center border border-white/10 flex-shrink-0" style={{ color }}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-white/20 text-xs font-mono tracking-widest uppercase mb-4">// Follow Us</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '@OvertakeSector', href: 'https://twitter.com/OvertakeSector', icon: Twitter },
                  { label: 'Join Discord', href: 'https://discord.com/invite/OvertakeSector', icon: MessageCircle },
                ].map(({ label, href, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-white/8 hover:border-[#E8191A]/30 hover:bg-[#E8191A]/5 px-4 py-2.5 text-sm text-white/50 hover:text-white transition-all">
                    <Icon size={14} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="relative bg-[#0D0D0D] border border-white/5 p-8 md:p-10">
              <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-8" />

              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-[#E8191A]/10 border border-[#E8191A]/30 flex items-center justify-center mx-auto mb-6">
                    <Send size={24} className="text-[#E8191A]" />
                  </div>
                  <h3 className="font-display font-black text-4xl text-white uppercase mb-3"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    MESSAGE SENT
                  </h3>
                  <p className="text-white/40">We will get back to you within 1–2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Full Name *</label>
                      <input type="text" name="name" required value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Email *</label>
                      <input type="email" name="email" required value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="input-dark w-full px-4 py-3 rounded-sm text-sm" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Subject *</label>
                    <select required name="subject" value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-sm text-sm appearance-none"
                      style={{ background: '#141414', color: '#F2F2F2', border: '1px solid rgba(242,242,242,0.08)' }}>
                      <option value="" disabled style={{ background: '#141414', color: '#F2F2F2' }}>Select a subject</option>
                      <option value="general" style={{ background: '#141414', color: '#F2F2F2' }}>General Inquiry</option>
                      <option value="partnership" style={{ background: '#141414', color: '#F2F2F2' }}>Partnership Opportunity</option>
                      <option value="media" style={{ background: '#141414', color: '#F2F2F2' }}>Media & Press</option>
                      <option value="player" style={{ background: '#141414', color: '#F2F2F2' }}>Player Inquiry</option>
                      <option value="creator" style={{ background: '#141414', color: '#F2F2F2' }}>Creator Inquiry</option>
                      <option value="other" style={{ background: '#141414', color: '#F2F2F2' }}>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Message *</label>
                    <textarea required name="message" rows={6} value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="input-dark w-full px-4 py-3 rounded-sm text-sm resize-none"
                      placeholder="Tell us what's on your mind..." />
                  </div>

                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all hover:shadow-[0_0_30px_rgba(232,25,26,0.4)] clip-corner group disabled:opacity-50 text-white"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {submitting ? 'Sending...' : 'Send Message'}
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
