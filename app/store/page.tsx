'use client'

import { useState } from 'react'
import { useRef } from 'react'
import { ChevronRight, ShoppingBag, Tag, Package, X, Check, Sparkles } from 'lucide-react'
import { useCart } from '@/components/CartContext'

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']

const products = [
  {
    id: 'polo-2026',
    name: 'OFFICIAL 2026 POLO',
    price: 65,
    tag: 'NEW DROP',
    description: 'The official Overtake 2026 Polo — built for competitors who refuse to blend in. Dark navy performance fabric with red dragon-art sleeves, a custom crosshair chest emblem, and the Overtake wordmark front and center. This is what it looks like to represent.',
    details: ['Premium performance fabric', 'Custom dragon art sleeve graphics', 'Overtake crosshair emblem', 'Personalized nickname on back', 'Available via RepulseCo'],
    images: ['/Front.png', '/Rear.png'],
    isVNeck: false,
  },
  {
    id: 'vneck-jersey-2026',
    name: 'OFFICIAL 2026 V-NECK POLO',
    price: 60,
    tag: 'NEW DROP',
    description: 'The Overtake 2026 V-Neck Jersey — clean, sharp, and built to rep the org on and off the server. Featuring a modern V-neck collar, subtle Overtake crosshair branding, and a sleek black and white colorway with red accents. Customized with your name and number on the back.',
    details: ['Premium performance jersey fabric', 'V-neck collar with crosshair detail', 'Black & white colorway with red accents', 'Custom name & number on back', 'Available via RepulseCo'],
    images: ['/FRONT-JERSEY.png', '/BACK-JERSEY.png'],
    isVNeck: true,
  },
]

// The jersey image panel gets the same tilt/glow/marquee treatment built for
// the Ink3D partner spotlight (see components/Ink3dSpotlight.tsx) — mouse-follow
// perspective tilt, a pulsing holographic glow border, a scanning light sweep,
// and looping marquee ribbons — so the product shots feel as premium as the
// partner spotlight instead of sitting in a plain static square.
function JerseyShowcase({ image, tag }: { image: string; tag?: string }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -8, y: px * 12 })
  }

  const marqueeText = 'OFFICIAL OVERTAKE MERCH  \u2022  BUILT WITH REPULSECO  \u2022  CUSTOM NAME & NUMBER  \u2022  '

  return (
    <div className="relative overflow-hidden border border-white/10" style={{ borderRadius: '12px' }}>
      <style>{`
        @keyframes jersey-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes jersey-glow { 0%, 100% { box-shadow: inset 0 0 0 1px rgba(232,25,26,0.25), 0 0 40px rgba(232,25,26,0.2), 0 0 80px rgba(168,85,247,0.1); } 50% { box-shadow: inset 0 0 0 1px rgba(168,85,247,0.35), 0 0 60px rgba(168,85,247,0.3), 0 0 100px rgba(56,189,248,0.15); } }
        @keyframes jersey-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(220%); } }
        .jersey-glow-panel { animation: jersey-glow 4s ease-in-out infinite; }
      `}</style>

      {/* Top marquee ribbon */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-[#E8191A]/20 via-[#A855F7]/20 to-[#38BDF8]/20 py-1.5 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: 'jersey-marquee 20s linear infinite', width: 'fit-content' }}>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 px-3">{marqueeText.repeat(6)}</span>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 px-3">{marqueeText.repeat(6)}</span>
        </div>
      </div>

      <div
        ref={panelRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="jersey-glow-panel relative bg-[#141414] overflow-hidden aspect-square"
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01,1.01,1.01)`,
          transition: 'transform 0.15s ease-out',
        }}>
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 30% 20%, #A855F7, transparent 60%)' }} />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#E8191A] via-[#A855F7] to-transparent" />

        {/* Scanning light sweep */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="w-full h-1/3" style={{ background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.5), transparent)', animation: 'jersey-scan 3.5s ease-in-out infinite' }} />
        </div>

        <img
          src={image}
          alt=""
          style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', padding: '32px', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
        />

        {tag && (
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-mono font-black px-3 py-1.5 bg-[#E8191A] text-white uppercase tracking-widest">
              {tag}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-[#A855F7]/40">
          <Sparkles size={11} className="text-[#A855F7]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#A855F7]">Official</span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] font-mono font-black px-3 py-1.5 bg-[#00A878] text-white uppercase tracking-widest">
            Available Now
          </span>
        </div>
      </div>

      {/* Bottom marquee ribbon */}
      <div className="relative border-t border-white/10 bg-gradient-to-r from-[#38BDF8]/20 via-[#A855F7]/20 to-[#E8191A]/20 py-1.5 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: 'jersey-marquee 24s linear infinite reverse', width: 'fit-content' }}>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 px-3">{marqueeText.repeat(6)}</span>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 px-3">{marqueeText.repeat(6)}</span>
        </div>
      </div>
    </div>
  )
}

export default function StorePage() {
  const [activeImage, setActiveImage] = useState<Record<string, number>>({})
  const [modal, setModal] = useState<string | null>(null)
  const [size, setSize] = useState('')
  const [nameOnBack, setNameOnBack] = useState('')
  const [numberOnBack, setNumberOnBack] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)
  const { addItem, count } = useCart()

  const getImage = (id: string) => activeImage[id] ?? 0

  const openModal = (id: string) => {
    setModal(id)
    setSize('')
    setNameOnBack('')
    setNumberOnBack('')
    setErrors({})
    setAdded(false)
  }

  const closeModal = () => {
    setModal(null)
    setAdded(false)
  }

  const handleAddToCart = () => {
    const product = products.find(p => p.id === modal)
    if (!product) return

    const e: Record<string, string> = {}
    if (!size) e.size = 'Please select a size'
    if (!nameOnBack.trim()) e.nameOnBack = 'Required'
    if (product.isVNeck && !numberOnBack.trim()) e.numberOnBack = 'Required'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      nameOnBack: nameOnBack.trim(),
      numberOnBack: numberOnBack.trim(),
      isVNeck: product.isVNeck,
    })

    setAdded(true)
    // Close modal after showing success
    setTimeout(() => closeModal(), 1500)
  }

  const modalProduct = products.find(p => p.id === modal)

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
              { label: 'Status', value: 'Available Now' },
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

      {/* Available Now Banner */}
      <div className="bg-[#00A878]/10 border-y border-[#00A878]/20 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
          <div className="w-2 h-2 bg-[#00A878] rounded-full animate-pulse" />
          <p className="text-[#00A878] text-sm font-mono tracking-widest uppercase">
            Store is live — powered by RepulseCo. Order your gear now.
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-28">
        {products.map((product, idx) => (
          <div key={product.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>

            {/* Image Gallery */}
            <div className={`space-y-4 ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
              <JerseyShowcase image={product.images[getImage(product.id)]} tag={product.tag} />
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
                  ${product.price}.00
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
                  <Package size={16} className="text-[#00A878]" />
                  <p className="text-[#F2F2F2]/40 text-sm font-mono">
                    <span className="text-[#00A878] font-black">Available Now</span>
                  </p>
                </div>
                <button onClick={() => openModal(product.id)}
                  className="flex items-center justify-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-10 py-5 font-black tracking-widest uppercase text-base transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.4)] clip-corner text-white w-full"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                {count > 0 && (
                  <p className="text-center text-[#F2F2F2]/30 text-xs font-mono">
                    {count} item{count > 1 ? 's' : ''} in cart
                  </p>
                )}
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

      {/* Add to Cart Modal */}
      {modal && modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-[#141414] border border-white/10 w-full max-w-md p-6 z-10 shadow-2xl"
            style={{ animation: 'fadeInUp 0.2s ease-out' }}>
            <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-6" />
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display font-black text-2xl uppercase text-[#F2F2F2]"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{modalProduct.name}</h3>
                <p className="text-[#E8191A] font-black text-xl">${modalProduct.price}.00</p>
              </div>
              <button onClick={closeModal} className="text-[#F2F2F2]/40 hover:text-[#F2F2F2] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Size */}
            <div className="mb-5">
              <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">
                Size * {size && <span className="text-[#E8191A] ml-2">— {size} selected</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => { setSize(s); setErrors(p => ({ ...p, size: '' })) }}
                    className={`px-4 py-2 text-sm font-mono font-black uppercase border transition-all ${
                      size === s
                        ? 'border-[#E8191A] bg-[#E8191A]/10 text-[#E8191A]'
                        : 'border-white/10 text-[#F2F2F2]/50 hover:border-white/30 hover:text-[#F2F2F2]'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
              {errors.size && <p className="text-[#E8191A] text-xs font-mono mt-1">{errors.size}</p>}
            </div>

            {/* Name on Back */}
            <div className="mb-5">
              <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">Name on Back *</label>
              <input
                value={nameOnBack}
                onChange={e => { setNameOnBack(e.target.value); setErrors(p => ({ ...p, nameOnBack: '' })) }}
                placeholder="Your name or gamertag"
                maxLength={20}
                className="w-full bg-[#0D0D0D] border border-white/10 px-4 py-3 text-[#F2F2F2] text-sm font-mono focus:outline-none focus:border-[#E8191A]/60 transition-colors"
              />
              <div className="flex justify-between mt-1">
                {errors.nameOnBack
                  ? <p className="text-[#E8191A] text-xs font-mono">{errors.nameOnBack}</p>
                  : <span />}
                <p className="text-[#F2F2F2]/20 text-xs font-mono">{nameOnBack.length}/20</p>
              </div>
            </div>

            {/* Number on Back (V-Neck only) */}
            {modalProduct.isVNeck && (
              <div className="mb-5">
                <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">Number on Back *</label>
                <input
                  value={numberOnBack}
                  onChange={e => { setNumberOnBack(e.target.value); setErrors(p => ({ ...p, numberOnBack: '' })) }}
                  placeholder="e.g. 24"
                  maxLength={3}
                  className="w-full bg-[#0D0D0D] border border-white/10 px-4 py-3 text-[#F2F2F2] text-sm font-mono focus:outline-none focus:border-[#E8191A]/60 transition-colors"
                />
                {errors.numberOnBack && <p className="text-[#E8191A] text-xs font-mono mt-1">{errors.numberOnBack}</p>}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full flex items-center justify-center gap-3 px-10 py-4 font-black tracking-widest uppercase text-base transition-all clip-corner text-white ${
                added
                  ? 'bg-[#00A878] cursor-default'
                  : 'bg-[#E8191A] hover:bg-[#B81011] hover:shadow-[0_0_40px_rgba(232,25,26,0.4)]'
              }`}
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {added
                ? <><Check size={18} /> Added to Cart!</>
                : <><ShoppingBag size={18} /> Add to Cart</>}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
