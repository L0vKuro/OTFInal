import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Overtake Sector' }

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F2F2F2] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-[#E8191A] text-xs font-bold tracking-widest uppercase mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>// LEGAL</p>
        <h1 className="text-5xl font-black uppercase mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Terms of Service</h1>
        <p className="text-[#F2F2F2]/40 text-sm mb-12">Last updated: June 26, 2026</p>

        <div className="space-y-10 text-[#F2F2F2]/70 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>1. Acceptance of Terms</h2>
            <p>By accessing or using overtakegg.com (the "Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our Site. These terms apply to all visitors, users, and customers of Overtake Sector LLC.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>2. Use of the Site</h2>
            <p>You agree to use this Site only for lawful purposes and in a manner that does not infringe the rights of others. You may not use our Site to transmit any harmful, offensive, or unauthorized content, or to attempt to gain unauthorized access to any systems or data.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>3. Store & Orders</h2>
            <p>All purchases made through our store are subject to product availability. We reserve the right to refuse or cancel any order at our discretion. Prices are listed in USD and are subject to change without notice. Once an order is placed and payment is confirmed, we will begin fulfillment. All sales are final unless the item arrives damaged or incorrect — contact us within 7 days of delivery for assistance.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>4. Intellectual Property</h2>
            <p>All content on this Site — including logos, graphics, text, images, and design — is the property of Overtake Sector LLC or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>5. Applications & Submissions</h2>
            <p>By submitting a player or creator application through our Site, you acknowledge that Overtake Sector LLC is under no obligation to respond, interview, or sign you. Submissions become the property of Overtake Sector LLC and will not be returned.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>6. Disclaimer of Warranties</h2>
            <p>This Site is provided "as is" without warranties of any kind, either express or implied. Overtake Sector LLC does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>7. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Overtake Sector LLC shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Site or our products.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>8. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms shall be resolved in the appropriate courts of jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>9. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Updates will be posted on this page with a revised date. Continued use of the Site after changes constitutes your acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase tracking-wider text-base mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>10. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:overtakesect@gmail.com" className="text-[#E8191A] hover:underline">overtakesect@gmail.com</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-xs text-[#F2F2F2]/30">
          <Link href="/legal/privacy" className="hover:text-[#E8191A] transition-colors">Privacy Policy</Link>
          <Link href="/legal/cookies" className="hover:text-[#E8191A] transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-[#E8191A] transition-colors">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
