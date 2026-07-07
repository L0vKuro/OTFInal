'use client'

import { Download, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const guidePages = [
  { file: '/brand/guide-1.jpg', label: 'Cover / Overview' },
  { file: '/brand/guide-2.jpg', label: 'Logo & Lockups' },
  { file: '/brand/guide-3.jpg', label: 'Color & Typography' },
  { file: '/brand/guide-4.jpg', label: 'Usage Guidelines' },
]

const logos = [
  {
    file: '/brand/logo-transparent-red__1_.png',
    label: 'Icon Logo',
    desc: 'Red star mark — transparent background',
    filename: 'overtake-icon-red.png',
  },
  {
    file: '/brand/overtakewordmark.png',
    label: 'Wordmark',
    desc: 'OVERTAKE text lockup — transparent background',
    filename: 'overtake-wordmark.png',
  },
]

const colors = [
  { name: 'Overtake Red', hex: '#E8191A' },
  { name: 'Red (Hover)', hex: '#B81011' },
  { name: 'Void Black', hex: '#0D0D0D' },
  { name: 'Card Black', hex: '#141414' },
  { name: 'White', hex: '#FFFFFF' },
]

export default function BrandPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Hero */}
      <div className="relative pt-36 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Assets & Guidelines</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            <span className="text-white">BRAND</span><br />
            <span style={{ background: 'linear-gradient(135deg, #FF3334 0%, #E8191A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>KIT</span>
          </h1>
          <p className="text-white/40 text-xl mt-8 max-w-2xl leading-relaxed">
            Everything designers and creators need to build for Overtake — logos, colors, and typography, free to use for Overtake projects. No need to contact us first.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <a href="/brand/Overtake_BrandGuide.pdf" download
              className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all clip-corner text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              <Download size={16} /> Download Full Guide (PDF)
            </a>
          </div>
        </div>
      </div>

      {/* Logo Downloads */}
      <div className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Logo Assets</p>
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            LOGOS
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {logos.map((logo) => (
            <div key={logo.file} className="bg-[#141414] border border-white/5 overflow-hidden">
              {/* Preview */}
              <div className="bg-[#0D0D0D] flex items-center justify-center p-12 border-b border-white/5" style={{ minHeight: '160px' }}>
                <img
                  src={logo.file}
                  alt={logo.label}
                  style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', filter: 'invert(1)' }}
                />
              </div>
              {/* Info + download */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-bold text-sm uppercase" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{logo.label}</p>
                  <p className="text-white/40 text-xs font-mono mt-0.5">{logo.desc}</p>
                </div>
                <a href={logo.file} download={logo.filename}
                  className="flex items-center gap-2 bg-[#E8191A]/10 hover:bg-[#E8191A]/20 border border-[#E8191A]/30 px-4 py-2 text-[#E8191A] text-xs font-mono uppercase tracking-wider transition-colors flex-shrink-0">
                  <Download size={12} /> PNG
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-[#0D0D0D] border-t border-b border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Palette</p>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              COLORS
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {colors.map((c) => (
              <div key={c.hex} className="bg-[#141414] border border-white/5 hover:border-[#E8191A]/30 p-4 card-hover">
                <div className="w-full h-24 mb-4 border border-white/10" style={{ backgroundColor: c.hex }} />
                <p className="text-white font-bold text-sm uppercase" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{c.name}</p>
                <p className="text-white/40 text-xs font-mono mt-1">{c.hex}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Type</p>
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            TYPOGRAPHY
          </h2>
        </div>
        <div className="bg-[#141414] border border-white/5 p-10">
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Display / Headings</p>
          <p className="text-6xl font-black text-white uppercase mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Barlow Condensed
          </p>
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Used for headlines, stat callouts, and all-caps labels.</p>
        </div>
      </div>

      {/* Guide Downloads */}
      <div className="bg-[#0D0D0D] border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Downloads</p>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              GUIDE FILES
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guidePages.map((d) => (
              <a key={d.file} href={d.file} download
                className="flex items-center justify-between bg-[#141414] border border-white/5 hover:border-[#E8191A]/30 p-6 card-hover group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center border border-[#E8191A]/30 bg-[#E8191A]/10">
                    <Download size={14} className="text-[#E8191A]" />
                  </div>
                  <p className="text-white font-bold uppercase tracking-wider text-sm"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {d.label}
                  </p>
                </div>
                <Download size={16} className="text-white/30 group-hover:text-[#E8191A] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display font-black text-4xl md:text-6xl uppercase text-white mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            QUESTIONS ABOUT USAGE?
          </h2>
          <p className="text-white/40 mb-10">If you need something not covered here, reach out and we&apos;ll help.</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 border border-white/10 hover:border-white/30 px-8 py-4 text-white/60 hover:text-white font-medium tracking-wider uppercase text-sm transition-all"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Get in Touch <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
