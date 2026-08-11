'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Lock, ShoppingBag, Trash2, Tag, Check, CreditCard } from 'lucide-react'
import { useCart } from '@/components/CartContext'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled') === 'true'
  const { items, removeItem, total, loaded } = useCart()

  const [step, setStep] = useState<'info' | 'payment'>('info')
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
  const [checkoutError, setCheckoutError] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent')
  const [discountValue, setDiscountValue] = useState(0)
  const [discountError, setDiscountError] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountLoading, setDiscountLoading] = useState(false)

  const discountedTotal = discountType === 'percent'
    ? Math.round(total * (1 - discountValue / 100) * 100) / 100
    : Math.max(0, Math.round((total - discountValue) * 100) / 100)
  const savings = Math.round((total - discountedTotal) * 100) / 100
  const finalTotal = discountApplied ? discountedTotal : total

  const applyDiscount = async () => {
    if (!discountCode.trim()) return
    setDiscountLoading(true)
    setDiscountError('')
    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode }),
      })
      const data = await res.json()
      if (data.valid) {
        setDiscountType(data.type)
        setDiscountValue(data.value)
        setDiscountApplied(true)
        setDiscountError('')
      } else {
        setDiscountError(data.message)
        setDiscountValue(0)
        setDiscountApplied(false)
      }
    } catch {
      setDiscountError('Failed to apply code')
    } finally {
      setDiscountLoading(false)
    }
  }

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

  const startStripeCheckout = async () => {
    setLoading(true)
    setCheckoutError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          form,
          discountCode: discountApplied ? discountCode : '',
        }),
      })
      const data = await res.json()
      if (data.url) {
        // Full navigation to Stripe's hosted checkout — cart state resets on return,
        // which is fine since the order is already captured by then.
        window.location.href = data.url
      } else {
        setCheckoutError(data.error || 'Could not start checkout. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setCheckoutError('Could not start checkout. Please try again.')
      setLoading(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full bg-[#0D0D0D] border ${errors[field] ? 'border-[#E8191A]' : 'border-white/10'} px-4 py-3 text-[#F2F2F2] text-sm font-mono focus:outline-none focus:border-[#E8191A]/60 transition-colors`

  if (!loaded) {
    return (
      <div className="relative min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#E8191A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#F2F2F2]/30 font-mono text-sm">Loading your cart...</p>
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

        {canceled && (
          <div className="bg-[#F0A500]/10 border border-[#F0A500]/30 px-5 py-3 mb-6">
            <p className="text-[#F0A500] text-sm font-mono">Payment was canceled — your cart items are still below, nothing was charged.</p>
          </div>
        )}

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

                  {/* Discount Code */}
                  <div className="bg-[#141414] border border-white/5 p-6">
                    <div className="h-px w-full bg-gradient-to-r from-[#E8191A] to-transparent mb-6" />
                    <h3 className="font-display font-black text-xl uppercase text-[#F2F2F2] mb-4"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Discount Code</h3>
                    <div className="flex gap-2">
                      <input
                        value={discountCode}
                        onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        disabled={discountApplied}
                        className="flex-1 bg-[#0D0D0D] border border-white/10 px-4 py-3 text-[#F2F2F2] text-sm font-mono focus:outline-none focus:border-[#E8191A]/60 transition-colors disabled:opacity-50"
                      />
                      <button
                        onClick={applyDiscount}
                        disabled={discountApplied || discountLoading}
                        className="px-5 py-3 font-black tracking-widest uppercase text-sm transition-all disabled:opacity-50 flex items-center gap-2"
                        style={{
                          fontFamily: 'Barlow Condensed, sans-serif',
                          background: discountApplied ? '#00A878' : '#E8191A',
                          color: 'white',
                        }}>
                        {discountApplied ? <><Check size={14} /> Applied</> : discountLoading ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                    {discountError && <p className="text-[#E8191A] text-xs font-mono mt-2">{discountError}</p>}
                    {discountApplied && (
                      <p className="text-[#00A878] text-xs font-mono mt-2">
                        ✓ {discountType === 'percent' ? `${discountValue}% discount` : `$${discountValue} off`} applied — you save ${savings.toFixed(2)}!
                      </p>
                    )}
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

                  <p className="text-[#F2F2F2]/50 text-sm leading-relaxed mb-6">
                    You'll be taken to Stripe's secure checkout page to enter your card details. Nothing is charged until you complete payment there.
                  </p>

                  {checkoutError && (
                    <div className="bg-[#E8191A]/10 border border-[#E8191A]/30 px-4 py-3 mb-6">
                      <p className="text-[#E8191A] text-sm font-mono">{checkoutError}</p>
                    </div>
                  )}

                  <button onClick={startStripeCheckout} disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-[#635BFF] hover:bg-[#4F46E5] px-10 py-5 font-black tracking-widest uppercase text-base transition-all clip-corner text-white disabled:opacity-50"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} /> Pay ${finalTotal.toFixed(2)} with Stripe
                      </>
                    )}
                  </button>
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
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F2F2F2]/40 text-sm font-mono uppercase">Subtotal</span>
                    <span className="text-[#F2F2F2] text-sm font-mono">${total}.00</span>
                  </div>
                  {discountApplied && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#00A878] text-sm font-mono uppercase flex items-center gap-1">
                        <Tag size={10} /> {discountType === 'percent' ? `${discountValue}% Off` : `$${discountValue} Off`}
                      </span>
                      <span className="text-[#00A878] text-sm font-mono">-${savings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-[#F2F2F2]/40 text-sm font-mono uppercase">Total</span>
                    <span className="font-display font-black text-2xl text-[#E8191A]"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-[#F2F2F2]/20 text-xs font-mono">
                  <Lock size={10} /> Secured by Stripe
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
