import { partners } from '@/lib/data'
import { ChevronRight, Mail } from 'lucide-react'

export const metadata = {
  title: 'Partners — Overtake Esports',
  description: 'Meet the brands and organizations that power Overtake Esports.',
}

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Founding: { label: 'FOUNDING PARTNER', color: '#E8191A', bg: '#E8191A15', border: '#E8191A30' },
  Premier: { label: 'PREMIER PARTNER', color: '#FFB800', bg: '#FFB80015', border: '#FFB80030' },
  Official: { label: 'OFFICIAL PARTNER', color: '#ffffff', bg: '#ffffff08', border: '#ffffff15' },
  Partner: { label: 'PARTNER', color: '#A855F7', bg: '#A855F715', border: '#A855F730' },
}

export default function PartnersPage() {
  const grouped: Record<string, typeof partners> = {
    Founding: partners.filter(p => p.tier === 'Founding'),
    Premier: partners.filter(p => p.tier === 'Premier'),
    Official: partners.filter(p => p.tier === 'Official'),
    Partner: partners.filter(p => p.tier === 'Partner'),
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative pt-36 pb-20 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8191A]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Partnerships</p>
          <h1 className="font-display font-black text-7xl md:text-9xl uppercase text-white leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OUR<br />PARTNERS
          </h1>
          <p className="text-white/40 text-lg mt-6 max-w-xl">
            Overtake partners with the world's leading brands in gaming, hardware, and lifestyle. Together we build the future of competitive esports.
          </p>
        </div>
      </div>

      {/* Partners by tier */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        {Object.entries(grouped).map(([tier, tierPartners]) => {
          if (!tierPartners.length) return null
          const config = TIER_CONFIG[tier]
          return (
            <div key={tier}>
              <div className="flex items-center gap-4 mb-10">
                <span className="text-xs font-mono font-bold px-3 py-1.5 uppercase tracking-widest"
                  style={{ color: config.color, background: config.bg, border: `1px solid ${config.border}` }}>
                  {config.label}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className={`grid gap-4 ${tier === 'Founding' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {tierPartners.map((partner) => (
                  <a key={partner.name}
                    href={partner.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-[#0D0D0D] border border-white/5 hover:border-white/20 overflow-hidden card-hover p-6 block"
                    style={{ borderTopColor: config.color + '40' }}>
                    <div className="h-px w-full mb-6" style={{ background: `linear-gradient(90deg, ${config.color}, transparent)` }} />

                    <span className="text-[10px] font-mono uppercase tracking-widest mb-3 block"
                      style={{ color: config.color, opacity: 0.7 }}>
                      {partner.category}
                    </span>

                    <div className="mb-4 flex items-center gap-4">
                      {partner.logo && (
                        <img src={partner.logo} alt={partner.name}
                          style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '8px', background: '#fff', padding: '6px' }} />
                      )}
                      <h3 className={`font-display font-black uppercase text-white ${tier === 'Founding' ? 'text-5xl' : 'text-3xl'}`}
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                        {partner.name}
                      </h3>
                    </div>

                    <p className="text-white/40 text-sm leading-relaxed">{partner.desc}</p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all"
                      style={{ color: config.color }}>
                      Visit Website <ChevronRight size={14} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Partnership Inquiry */}
      <div className="bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-4">// Work With Us</p>
              <h2 className="font-display font-black text-5xl md:text-6xl uppercase text-white leading-tight mb-6"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                INTERESTED IN<br />PARTNERING WITH<br />OVERTAKE?
              </h2>
              <p className="text-white/40 leading-relaxed mb-8">
                We work with brands that share our values — high performance, authenticity, and a deep connection to gaming culture. Reach out to our partnerships team.
              </p>
              <a href="mailto:contact@overtakegg.com"
                className="flex items-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all hover:shadow-[0_0_30px_rgba(232,25,26,0.4)] clip-corner text-white w-fit"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                <Mail size={16} />
                here@overtakegg.com
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Brand Visibility', desc: 'Across all Overtake platforms, jerseys, and content' },
                { label: 'Creator Integrations', desc: 'Organic content with 1M+ combined reach' },
                { label: 'Event Presence', desc: 'Logos and activations at live tournament events' },
                { label: 'Custom Campaigns', desc: 'Tailored activations built around your goals' },
              ].map((benefit) => (
                <div key={benefit.label} className="bg-[#141414] border border-white/5 p-5">
                  <div className="w-1.5 h-1.5 bg-[#E8191A] rounded-full mb-3" />
                  <h4 className="font-display font-bold text-lg text-white uppercase mb-2"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {benefit.label}
                  </h4>
                  <p className="text-white/30 text-xs leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
