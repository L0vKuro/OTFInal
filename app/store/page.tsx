'use client'

import { useState } from 'react'
import { ChevronRight, ShoppingBag, Tag, Package } from 'lucide-react'

const products = [
  {
    id: 'polo-2026',
    name: 'OFFICIAL 2026 POLO',
    price: '$65.00',
    tag: 'NEW DROP',
    description: 'The official Overtake 2026 Polo — built for competitors who refuse to blend in. Dark navy performance fabric with red dragon-art sleeves, a custom crosshair chest emblem, and the Overtake wordmark front and center. This is what it looks like to represent.',
    details: ['Premium performance fabric', 'Custom dragon art sleeve graphics', 'Overtake crosshair emblem', 'Personalized nickname on back', 'Available via RepulseCo'],
    images: ['/Front.png', '/Rear.png'],
    available: false,
  },
  {
    id: 'vneck-jersey-2026',
    name: 'OFFICIAL 2026 V-NECK POLO',
    price: '$60.00',
    tag: 'NEW DROP',
    description: 'The Overtake 2026 V-Neck Jersey — clean, sharp, and built to rep the org on and off the server. Featuring a modern V-neck collar, subtle Overtake crosshair branding, and a sleek black and white colorway with red accents. Customized with your name and number on the back.',
    details: ['Premium performance jersey fabric', 'V-neck collar with crosshair detail', 'Black & white colorway with red accents', 'Custom name & number on back', 'Available via RepulseCo'],
    images: ['/FRONT-JERSEY.png', '/BACK-JERSEY.png'],
    available: false,
  },
]

export default function StorePage() {
  const [activeImage, setActiveImage] = useState<Record<string, number>>({})

  const getImage = (id: string) => activeImage[id] ?? 0

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
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Official Merch</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-[#F2F2F2] leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OVERTAKE<br />
            <span style={{ background: 'linear-gradient(135deg, #FF3334, #E8191A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>STORE</span>
          </h1>
          <p className="text-[#F2F2F2]/40 text-lg mt-6 max-w-xl">
            Wear the brand. Rep the movement. Official Overtake merch powered by RepulseCo — built for competitors who refuse to blend in.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Products', value: '2' },
              { label: 'Partner', value: 'RepulseCo' },
              { label: 'Status', value: 'Coming Soon' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 border border-white/8 px-5 py-3 bg-white/2">
                <ShoppingBag size={14} className="text-[#E8191A]" />
                <span className="text-[#F2F2F2]/40 text-sm">{label}</span>
                <span className="font-display font-black text-lg text-[#F2F2F2]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-[#E8191A]/10 border-y border-[#E8191A]/20 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
          <div className="w-2 h-2 bg-[#E8191A] rounded-full animate-pulse" />
          <p className="text-[#E8191A] text-sm font-mono tracking-widest uppercase">
            Store launching soon — powered by RepulseCo. Orders will open when the store goes live.
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-28">
        {products.map((product, idx) => (
          <div key={product.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>

            {/* Image Gallery */}
            <div className={`space-y-4 ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
              <div className="relative bg-[#141414] border border-white/5 overflow-hidden aspect-square"
                style={{ borderRadius: '12px' }}>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#E8191A] to-transparent" />
                <img
                  src={product.images[getImage(product.id)]}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '32px',
                    borderRadius: '12px',
                  }}
                />
                {product.tag && (
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono font-black px-3 py-1.5 bg-[#E8191A] text-white uppercase tracking-widest">
                      {product.tag}
                    </span>
                  </div>
                )}
                {!product.available && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-mono font-black px-3 py-1.5 bg-black/80 border border-white/10 text-white/60 uppercase tracking-widest">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(prev => ({ ...prev, [product.id]: i }))}
                    className={`w-20 h-20 border overflow-hidden transition-all ${
                      getImage(product.id) === i ? 'border-[#E8191A]' : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ borderRadius: '6px' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px', borderRadius: '6px' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className={`space-y-6 pt-4 ${idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={12} className="text-[#E8191A]" />
                  <span className="text-[#E8191A] text-xs font-mono tracking-widest uppercase">Official Apparel</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl uppercase text-[#F2F2F2] leading-tight mb-4"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {product.name}
                </h2>
                <p className="font-display font-black text-4xl text-[#E8191A]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {product.price}
                </p>
              </div>

              <p className="text-[#F2F2F2]/50 text-base leading-relaxed border-t border-white/5 pt-6">
                {product.description}
              </p>

              <div className="space-y-2">
                {product.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-[#E8191A] rounded-full flex-shrink-0" />
                    <span className="text-[#F2F2F2]/40 text-sm font-mono">{detail}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 bg-[#141414] border border-white/5 px-5 py-4">
                  <Package size={16} className="text-[#E8191A]" />
                  <p className="text-[#F2F2F2]/40 text-sm font-mono">
                    Available through <span className="text-[#F2F2F2]">RepulseCo</span> when the store launches
                  </p>
                </div>
                <a href="https://www.repulseco.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-10 py-5 font-black tracking-widest uppercase text-base transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.4)] clip-corner text-white w-full"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Visit RepulseCo <ChevronRight size={18} />
                </a>
                <p className="text-[#F2F2F2]/20 text-xs font-mono text-center">
                  Store not yet live — check back soon for ordering details
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#141414] border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Powered By</p>
          <h2 className="font-display font-black text-5xl md:text-6xl uppercase text-[#F2F2F2] mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            BUILT WITH<br />REPULSECO
          </h2>
          <p className="text-[#F2F2F2]/40 mb-8 max-w-lg mx-auto">
            The fear of being normal. RepulseCo is redefining esports apparel — built for competitors who refuse to blend in.
          </p>
          <a href="https://www.repulseco.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-white/10 hover:border-[#E8191A]/50 px-10 py-5 font-black tracking-widest uppercase text-base transition-all text-[#F2F2F2]/60 hover:text-[#F2F2F2] clip-corner"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            repulseco.com <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}
