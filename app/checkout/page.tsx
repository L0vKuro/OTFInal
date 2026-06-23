'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { ChevronRight, Lock, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/components/CartContext'

function CheckoutContent() {
  const router = useRouter()
  const { items, removeItem, total, clearCart } = useCart()

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info')
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customerName) e.customerName = 'Required'
    if (!form.customerEmail || !form.customerEmail.includes('@')) e.customerEmail = 'Valid email required'
    if (!form.address) e.address = 'Required'
    if (!form.city) e.city = 'Required'
    if (!form.state) e.state = 'Required'
    if (!form.zip) e.zip = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (items.length === 0) return
    if (validate()) setStep('payment')
  }

  const handleApprove = async (paypalOrderId: string) => {
    setLoading(true)
    try {
      for (const item of items) {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            product: item.name,
            size: item.size,
            nameOnBack: item.nameOnBack,
            numberOnBack: item.numberOnBack,
            price: `$${item.price}.00`,
            paypalOrderId,
          }),
        })
      }
      clearCart()
      setStep('success')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full bg-[#0D0D0D] border ${errors[field] ? 'border-[#E8191A]' : 'border-white/10'} px-4 py-3 text-[#F2F2F2] text-sm font-mono focus:outline-none focus:border-[#E8191A]/60 transition-colors`

  if (step === 'success') {
    return (
      <div className="relative min-h-screen pt-36 pb-20">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6">
          <div className="bg-[#141414] border border-[#00A878]/30 p-12 text-center">
            <div className="h-px w-full bg-gradient-to-r from-[#00A878] to-transparent mb-8" />
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#00A878]/10 border border-[#00A878]/30 rounded-full">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="font-display font-black text-4xl uppercase text-[#F2F2F2] mb-3"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Order Confirmed!</h2>
            <p className="text-[#F2F2F2]/50 mb-2">Thanks for repping Overtake, {form.customerName}.</p>
            <p className="text-[#F2F2F2]/30 text-sm font-mono mb-8">A confirmation email has been sent to {form.customerEmail}</p>
            <button onClick={() => router.push('/store')}
              className="inline-flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Back to Store <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pt-36 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6">

        <div className="mb-10">
          <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-2">// Checkout</p>
          <h1 className="font-display font-black text-5xl uppercase text-[#F2F2F2]"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Complete Your Order
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#141414] border border-white/5 p-12 text-center">
            <ShoppingBag size={32} className="text-[#F2F2F2]/10 mx-auto mb-4" />
            <p className="text-[#F2F2F2]/30 font-mono mb-6">Your cart is empty</p>
            <button onClick={() => router.push('/store')}
              className="inline-flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-8 py-4 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Back to Store <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {step === 'info' && (
                <>
                  <div className="bg-[#141414] border border-white/5 p-6">
                    <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-6" />
                    <h3 className="font-display font-black text-xl uppercase text-[#F2F2F2] mb-4"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">Full Name *</label>
                        <input value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))}
                          placeholder="John Doe" className={inputClass('customerName')} />
                        {errors.customerName && <p className="text-[#E8191A] text-xs font-mono mt-1">{errors.customerName}</p>}
                      </div>
                      <div>
                        <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">Email *</label>
                        <input value={form.customerEmail} onChange={e => setForm(p => ({ ...p, customerEmail: e.target.value }))}
                          placeholder="you@email.com" type="email" className={inputClass('customerEmail')} />
                        {errors.customerEmail && <p className="text-[#E8191A] text-xs font-mono mt-1">{errors.customerEmail}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#141414] border border-white/5 p-6">
                    <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-6" />
                    <h3 className="font-display font-black text-xl uppercase text-[#F2F2F2] mb-4"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">Street Address *</label>
                        <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                          placeholder="123 Main St" className={inputClass('address')} />
                        {errors.address && <p className="text-[#E8191A] text-xs font-mono mt-1">{errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">City *</label>
                          <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                            placeholder="City" className={inputClass('city')} />
                          {errors.city && <p className="text-[#E8191A] text-xs font-mono mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">State *</label>
                          <input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                            placeholder="TX" className={inputClass('state')} />
                          {errors.state && <p className="text-[#E8191A] text-xs font-mono mt-1">{errors.state}</p>}
                        </div>
                        <div>
                          <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">ZIP *</label>
                          <input value={form.zip} onChange={e => setForm(p => ({ ...p, zip: e.target.value }))}
                            placeholder="12345" className={inputClass('zip')} />
                          {errors.zip && <p className="text-[#E8191A] text-xs font-mono mt-1">{errors.zip}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="text-[#F2F2F2]/40 text-xs font-mono uppercase tracking-widest mb-2 block">Country *</label>
                        <select value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                          className={inputClass('country')}>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="MX">Mexico</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleContinue}
                    className="w-full flex items-center justify-center gap-3 bg-[#E8191A] hover:bg-[#B81011] px-10 py-5 font-black tracking-widest uppercase text-base transition-all hover:shadow-[0_0_40px_rgba(232,25,26,0.4)] clip-corner text-white"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Continue to Payment <ChevronRight size={18} />
                  </button>
                </>
              )}

              {step === 'payment' && (
                <div className="bg-[#141414] border border-white/5 p-6">
                  <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-6" />
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={14} className="text-[#00A878]" />
                    <h3 className="font-display font-black text-xl uppercase text-[#F2F2F2]"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Secure Payment</h3>
                  </div>
                  <button onClick={() => setStep('info')}
                    className="text-[#F2F2F2]/30 hover:text-[#F2F2F2] text-xs font-mono uppercase tracking-widest mb-6 block transition-colors">
                    ← Back to Info
                  </button>
                  <PayPalScriptProvider options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                    currency: 'USD',
                  }}>
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: 'CAPTURE',
                          purchase_units: [{
                            amount: {
                              currency_code: 'USD',
                              value: total.toString(),
                            },
                            description: items.map(i => `${i.name} (${i.size})`).join(', '),
                          }],
                        })
                      }}
                      onApprove={async (data, actions) => {
                        if (actions.order) {
                          await actions.order.capture()
                          await handleApprove(data.orderID)
                        }
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#141414] border border-white/5 p-6 sticky top-28">
                <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-6" />
                <h3 className="font-display font-black text-lg uppercase text-[#F2F2F2] mb-4"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item, i) => (
                    <div key={i} className="bg-[#0D0D0D] border border-white/5 p-3">
                      <div className="flex gap-3">
                        <img src={item.image} alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#141414', padding: '4px', borderRadius: '4px', flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-black text-xs uppercase text-[#F2F2F2] leading-tight"
                            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{item.name}</h4>
                          <p className="text-[#F2F2F2]/40 text-xs font-mono">Size: {item.size}</p>
                          <p className="text-[#F2F2F2]/40 text-xs font-mono">Name: {item.nameOnBack}</p>
                          {item.isVNeck && <p className="text-[#F2F2F2]/40 text-xs font-mono">#{item.numberOnBack}</p>}
                          <p className="text-[#E8191A] font-black text-sm">${item.price}.00</p>
                        </div>
                        {step === 'info' && (
                          <button onClick={() => removeItem(i)}
                            className="text-[#F2F2F2]/20 hover:text-[#E8191A] transition-colors flex-shrink-0">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="text-[#F2F2F2]/40 text-sm font-mono uppercase">Total</span>
                  <span className="font-display font-black text-2xl text-[#E8191A]"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>${total}.00</span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-[#F2F2F2]/20 text-xs font-mono">
                  <Lock size={10} /> Secured by PayPal
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
}
