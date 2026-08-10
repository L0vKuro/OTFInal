'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, XCircle } from 'lucide-react'

type OrderItem = {
  name: string
  size: string
  nameOnBack: string
  numberOnBack: string
  isVNeck: boolean
  price: number
}

type OrderSummary = {
  customerName: string
  customerEmail: string
  items: OrderItem[]
  discountLabel: string
  total: string
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [order, setOrder] = useState<OrderSummary | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      setError('Missing order reference.')
      setLoading(false)
      return
    }
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setOrder(data)
        }
      })
      .catch(() => setError('Could not load your order.'))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div className="relative min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#E8191A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#F2F2F2]/30 font-mono text-sm">Confirming your order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="relative min-h-screen pt-36 pb-20">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6">
          <div className="bg-[#141414] border border-[#E8191A]/30 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#E8191A]/10 border border-[#E8191A]/30 rounded-full">
              <XCircle size={28} className="text-[#E8191A]" />
            </div>
            <h2 className="font-display font-black text-3xl uppercase text-[#F2F2F2] mb-3"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Couldn't Confirm Order</h2>
            <p className="text-[#F2F2F2]/40 text-sm font-mono mb-8">
              {error || 'Something went wrong loading your order.'} If you were charged, contact us at{' '}
              <a href="mailto:overtakesect@gmail.com" className="text-[#E8191A] hover:underline">overtakesect@gmail.com</a> and we'll sort it out.
            </p>
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
      <div className="relative max-w-2xl mx-auto px-6">
        <div className="bg-[#141414] border border-[#00A878]/30 p-12 text-center">
          <div className="h-px w-full bg-gradient-to-r from-[#00A878] to-transparent mb-8" />
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#00A878]/10 border border-[#00A878]/30 rounded-full">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="font-display font-black text-4xl uppercase text-[#F2F2F2] mb-3"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Order Confirmed!</h2>
          <p className="text-[#F2F2F2]/50 mb-2">Thanks for repping Overtake, {order.customerName}.</p>
          <p className="text-[#F2F2F2]/30 text-sm font-mono mb-8">A confirmation email has been sent to {order.customerEmail}</p>

          <div className="bg-[#0D0D0D] border border-white/5 p-5 text-left mb-8">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                <div>
                  <p className="text-[#F2F2F2] text-sm font-bold">{item.name} <span className="text-[#F2F2F2]/40 font-mono text-xs">({item.size})</span></p>
                  <p className="text-[#F2F2F2]/30 text-xs font-mono">{item.nameOnBack}{item.isVNeck ? ` #${item.numberOnBack}` : ''}</p>
                </div>
                <span className="text-[#E8191A] font-black text-sm">${item.price}.00</span>
              </div>
            ))}
            {order.discountLabel !== 'None' && (
              <p className="text-[#00A878] text-xs font-mono mt-2">Discount applied: {order.discountLabel}</p>
            )}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-white/10">
              <span className="text-[#F2F2F2]/40 text-xs font-mono uppercase">Total Charged</span>
              <span className="font-display font-black text-xl text-[#E8191A]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>${order.total}</span>
            </div>
          </div>

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

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
