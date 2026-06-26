import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — Overtake Sector' }

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F2F2F2] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-[#E8191A] text-xs font-bold tracking-widest uppercase mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>// LEGAL</p>
        <h1 className="text-5xl font-black uppercase mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Privacy Policy</h1>
        <p className="text-[#F2F2F2]/40 text-sm mb-12">Last updated: June 26, 2026</p>

        <div className="space-y-10 text-[#F2F2F2]/70 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>1. Information We Collect</h2>
            <p>When you interact with Overtake Sector LLC ("Overtake," "we," "us"), we may collect information you provide directly — such as your name, email address, shipping address, and payment details when placing an order, or your contact information when submitting an application or reaching out via our contact form.</p>
            <p className="mt-3">We also automatically collect certain technical data when you visit our site, including your IP address, browser type, pages visited, and referring URLs, through standard web analytics tools.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#F2F2F2]/60">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmation and shipping notifications</li>
              <li>Respond to inquiries and applications</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>3. Third-Party Services</h2>
            <p>Our site integrates with third-party services including PayPal (payment processing), Resend (transactional email), Vercel (hosting and analytics), and Formspree (application forms). Each of these services operates under their own privacy policies and we encourage you to review them.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>4. Data Retention</h2>
            <p>We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy or as required by applicable law. Order information is retained for a minimum of 3 years for financial record-keeping purposes.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>5. Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your personal data. To exercise any of these rights, contact us at <a href="mailto:overtakesect@gmail.com" className="text-[#E8191A] hover:underline">overtakesect@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>6. Security</h2>
            <p>We take reasonable technical and organizational measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of our site after changes constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>8. Contact</h2>
            <p>For privacy-related questions, reach us at <a href="mailto:overtakesect@gmail.com" className="text-[#E8191A] hover:underline">overtakesect@gmail.com</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-xs text-[#F2F2F2]/30">
          <Link href="/legal/terms" className="hover:text-[#E8191A] transition-colors">Terms of Service</Link>
          <Link href="/legal/cookies" className="hover:text-[#E8191A] transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-[#E8191A] transition-colors">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
