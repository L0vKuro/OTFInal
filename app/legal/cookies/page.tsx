import Link from 'next/link'

export const metadata = { title: 'Cookie Policy — Overtake Sector' }

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F2F2F2] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-[#E8191A] text-xs font-bold tracking-widest uppercase mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>// LEGAL</p>
        <h1 className="text-5xl font-black uppercase mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Cookie Policy</h1>
        <p className="text-[#F2F2F2]/40 text-sm mb-12">Last updated: June 26, 2026</p>

        <div className="space-y-10 text-[#F2F2F2]/70 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>1. What Are Cookies</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They help the site remember information about your visit, such as your preferences and cart contents, making your next visit easier and the site more useful to you.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>2. How We Use Cookies</h2>
            <p>Overtake Sector LLC uses cookies and similar local storage technologies for the following purposes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#F2F2F2]/60">
              <li><span className="text-white/80">Cart persistence</span> — we store your cart items locally (via <code className="text-[#E8191A]">localStorage</code>) so they remain between sessions</li>
              <li><span className="text-white/80">Analytics</span> — Vercel Analytics collects anonymized usage data to help us understand how visitors interact with the Site</li>
              <li><span className="text-white/80">Payment processing</span> — PayPal may set cookies when you initiate a transaction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>3. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <p className="text-white/80 font-semibold mb-1">Essential Cookies</p>
                <p>Required for the Site to function. This includes cart storage and session management. These cannot be disabled.</p>
              </div>
              <div>
                <p className="text-white/80 font-semibold mb-1">Analytics Cookies</p>
                <p>Used to collect anonymized data on Site usage. Provided by Vercel Analytics. No personally identifiable information is collected.</p>
              </div>
              <div>
                <p className="text-white/80 font-semibold mb-1">Third-Party Cookies</p>
                <p>Services like PayPal may set their own cookies during the checkout process. These are governed by their respective privacy policies.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>4. Managing Cookies</h2>
            <p>You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of the Site, including cart persistence. For more information on managing cookies, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#E8191A] hover:underline">allaboutcookies.org</a>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>5. Changes to This Policy</h2>
            <p>We may update this Cookie Policy as our practices change. Updates will be posted on this page with a revised date.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>6. Contact</h2>
            <p>For cookie-related questions, reach us at <a href="mailto:overtakesect@gmail.com" className="text-[#E8191A] hover:underline">overtakesect@gmail.com</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-xs text-[#F2F2F2]/30">
          <Link href="/legal/privacy" className="hover:text-[#E8191A] transition-colors">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-[#E8191A] transition-colors">Terms of Service</Link>
          <Link href="/" className="hover:text-[#E8191A] transition-colors">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
