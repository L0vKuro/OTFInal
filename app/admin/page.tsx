'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ChevronRight } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', password }),
    })
    const data = await res.json()
    if (data.success) {
      sessionStorage.setItem('admin_auth', password)
      router.push('/admin/dashboard')
    } else {
      setError('Incorrect password.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#E8191A]/10 border border-[#E8191A]/30 flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-[#E8191A]" />
          </div>
          <h1 className="font-display font-black text-4xl text-white uppercase"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            OVERTAKE ADMIN
          </h1>
          <p className="text-white/40 text-sm font-mono mt-2">Restricted access — staff only</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full bg-[#141414] border border-white/10 focus:border-[#E8191A]/50 px-5 py-4 text-white font-mono text-sm outline-none transition-colors"
          />
          {error && <p className="text-[#E8191A] text-xs font-mono">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-4 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner disabled:opacity-50"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            {loading ? 'Verifying...' : 'Enter Dashboard'} <ChevronRight size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}
