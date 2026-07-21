'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Copy, ExternalLink, Tag, Link, BarChart2, LogOut, Check } from 'lucide-react'

type DiscountCode = {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  max_uses: number | null
  uses: number
  expires_at: string | null
  notes: string
  created_at: string
}

type TrackingLink = {
  id: string
  name: string
  slug: string
  destination_url: string
  clicks: number
  sent_to: string
  notes: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'codes' | 'links'>('codes')
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [links, setLinks] = useState<TrackingLink[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  // New code form
  const [newCode, setNewCode] = useState({ code: '', type: 'percent', value: '', max_uses: '', expires_at: '', notes: '' })
  // New link form
  const [newLink, setNewLink] = useState({ name: '', slug: '', destination_url: '', sent_to: '', notes: '' })

  const getAuth = () => sessionStorage.getItem('admin_auth') || ''

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (!auth) { router.push('/admin'); return }
    fetchAll()
  }, [])

  const api = async (body: object) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, password: getAuth() }),
    })
    return res.json()
  }

  const fetchAll = async () => {
    setLoading(true)
    const [c, l] = await Promise.all([
      api({ action: 'getCodes' }),
      api({ action: 'getLinks' }),
    ])
    setCodes(c.data || [])
    setLinks(l.data || [])
    setLoading(false)
  }

  const createCode = async (e: React.FormEvent) => {
    e.preventDefault()
    await api({ action: 'createCode', ...newCode, value: parseFloat(newCode.value), max_uses: newCode.max_uses ? parseInt(newCode.max_uses) : null })
    setNewCode({ code: '', type: 'percent', value: '', max_uses: '', expires_at: '', notes: '' })
    fetchAll()
  }

  const deleteCode = async (id: string) => {
    if (!confirm('Delete this code?')) return
    await api({ action: 'deleteCode', id })
    fetchAll()
  }

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault()
    await api({ action: 'createLink', ...newLink })
    setNewLink({ name: '', slug: '', destination_url: '', sent_to: '', notes: '' })
    fetchAll()
  }

  const deleteLink = async (id: string) => {
    if (!confirm('Delete this link?')) return
    await api({ action: 'deleteLink', id })
    fetchAll()
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const logout = () => {
    sessionStorage.removeItem('admin_auth')
    router.push('/admin')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <p className="text-white/40 font-mono text-sm animate-pulse">Loading dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <div className="bg-[#141414] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/wordmark.png" alt="OVERTAKE" style={{ height: '36px', mixBlendMode: 'screen' }} />
          <div className="h-6 w-px bg-white/10" />
          <p className="text-white/60 text-xs font-mono uppercase tracking-widest">Admin Dashboard</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-white/30 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Stats bar */}
      <div className="border-b border-white/5 bg-[#141414]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <Tag size={16} className="text-[#E8191A]" />
            <span className="text-white/40 text-sm font-mono">Discount Codes</span>
            <span className="font-display font-black text-xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{codes.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link size={16} className="text-[#E8191A]" />
            <span className="text-white/40 text-sm font-mono">Tracking Links</span>
            <span className="font-display font-black text-xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{links.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart2 size={16} className="text-[#E8191A]" />
            <span className="text-white/40 text-sm font-mono">Total Clicks</span>
            <span className="font-display font-black text-xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{links.reduce((a, l) => a + l.clicks, 0)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Tag size={16} className="text-[#E8191A]" />
            <span className="text-white/40 text-sm font-mono">Total Code Uses</span>
            <span className="font-display font-black text-xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{codes.reduce((a, c) => a + c.uses, 0)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/5">
          {[{ id: 'codes', label: 'Discount Codes', icon: Tag }, { id: 'links', label: 'Tracking Links', icon: Link }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as any)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest transition-all border-b-2"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: tab === id ? '#E8191A' : 'rgba(242,242,242,0.3)',
                borderBottomColor: tab === id ? '#E8191A' : 'transparent',
              }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* DISCOUNT CODES TAB */}
        {tab === 'codes' && (
          <div className="space-y-8">
            {/* Create form */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <h2 className="font-display font-black text-xl text-white uppercase mb-5"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Create New Code
              </h2>
              <form onSubmit={createCode} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Code *</label>
                  <input required value={newCode.code} onChange={e => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                    placeholder="OVERTAKE20"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Type *</label>
                  <select value={newCode.type} onChange={e => setNewCode({ ...newCode, type: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors">
                    <option value="percent">Percent Off (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Value *</label>
                  <input required type="number" value={newCode.value} onChange={e => setNewCode({ ...newCode, value: e.target.value })}
                    placeholder={newCode.type === 'percent' ? '20' : '10'}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Max Uses (blank = unlimited)</label>
                  <input type="number" value={newCode.max_uses} onChange={e => setNewCode({ ...newCode, max_uses: e.target.value })}
                    placeholder="100"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Expires At (optional)</label>
                  <input type="date" value={newCode.expires_at} onChange={e => setNewCode({ ...newCode, expires_at: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Notes</label>
                  <input value={newCode.notes} onChange={e => setNewCode({ ...newCode, notes: e.target.value })}
                    placeholder="e.g. For partners only"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <button type="submit"
                    className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    <Plus size={14} /> Create Code
                  </button>
                </div>
              </form>
            </div>

            {/* Codes list */}
            <div className="space-y-3">
              {codes.length === 0 && (
                <div className="bg-[#141414] border border-white/5 p-8 text-center">
                  <p className="text-white/30 font-mono text-sm">No discount codes yet. Create one above.</p>
                </div>
              )}
              {codes.map((code) => (
                <div key={code.id} className="bg-[#141414] border border-white/5 p-5 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-black text-2xl text-white uppercase"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{code.code}</span>
                      <span className="text-xs font-mono px-2 py-0.5 border"
                        style={{ color: '#E8191A', borderColor: '#E8191A40', background: '#E8191A10' }}>
                        {code.type === 'percent' ? `${code.value}% OFF` : `$${code.value} OFF`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-white/40">
                      <span>Uses: <span className="text-white">{code.uses}{code.max_uses ? ` / ${code.max_uses}` : ' / ∞'}</span></span>
                      {code.expires_at && <span>Expires: <span className="text-white">{new Date(code.expires_at).toLocaleDateString()}</span></span>}
                      {code.notes && <span>Note: <span className="text-white/60">{code.notes}</span></span>}
                      <span>Created: {new Date(code.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {/* Usage bar */}
                  {code.max_uses && (
                    <div className="w-32">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#E8191A] rounded-full transition-all"
                          style={{ width: `${Math.min((code.uses / code.max_uses) * 100, 100)}%` }} />
                      </div>
                      <p className="text-white/30 text-[10px] font-mono mt-1 text-right">
                        {Math.round((code.uses / code.max_uses) * 100)}% used
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button onClick={() => copyToClipboard(code.code, code.id)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                      {copied === code.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      {copied === code.id ? 'Copied' : 'Copy'}
                    </button>
                    <button onClick={() => deleteCode(code.id)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-[#E8191A]/50 text-white/40 hover:text-[#E8191A] text-xs font-mono uppercase tracking-widest transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRACKING LINKS TAB */}
        {tab === 'links' && (
          <div className="space-y-8">
            {/* Create form */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <h2 className="font-display font-black text-xl text-white uppercase mb-5"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Create Tracking Link
              </h2>
              <form onSubmit={createLink} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Name *</label>
                  <input required value={newLink.name} onChange={e => setNewLink({ ...newLink, name: e.target.value })}
                    placeholder="Dynasty Instagram Bio"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Slug * (used in URL)</label>
                  <div className="flex items-center">
                    <span className="bg-[#0D0D0D] border border-r-0 border-white/10 px-3 py-3 text-white/30 font-mono text-xs whitespace-nowrap">overtakegg.com/track/</span>
                    <input required value={newLink.slug} onChange={e => setNewLink({ ...newLink, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      placeholder="dynasty-ig"
                      className="flex-1 bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Destination URL *</label>
                  <input required type="url" value={newLink.destination_url} onChange={e => setNewLink({ ...newLink, destination_url: e.target.value })}
                    placeholder="https://overtakegg.com/store"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Sent To</label>
                  <input value={newLink.sent_to} onChange={e => setNewLink({ ...newLink, sent_to: e.target.value })}
                    placeholder="Dynasty, Jxe"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Notes</label>
                  <input value={newLink.notes} onChange={e => setNewLink({ ...newLink, notes: e.target.value })}
                    placeholder="Instagram bio link for store launch"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit"
                    className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    <Plus size={14} /> Create Link
                  </button>
                </div>
              </form>
            </div>

            {/* Links list */}
            <div className="space-y-3">
              {links.length === 0 && (
                <div className="bg-[#141414] border border-white/5 p-8 text-center">
                  <p className="text-white/30 font-mono text-sm">No tracking links yet. Create one above.</p>
                </div>
              )}
              {links.map((link) => (
                <div key={link.id} className="bg-[#141414] border border-white/5 p-5 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-black text-2xl text-white uppercase"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{link.name}</span>
                      <span className="text-xs font-mono px-2 py-0.5 border"
                        style={{ color: '#00D4FF', borderColor: '#00D4FF40', background: '#00D4FF10' }}>
                        {link.clicks} clicks
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-white/40">
                      <span>URL: <span className="text-[#E8191A]">overtakegg.com/track/{link.slug}</span></span>
                      <span>→ <span className="text-white/60 truncate max-w-xs">{link.destination_url}</span></span>
                      {link.sent_to && <span>Sent to: <span className="text-white">{link.sent_to}</span></span>}
                      {link.notes && <span>Note: <span className="text-white/60">{link.notes}</span></span>}
                      <span>Created: {new Date(link.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => copyToClipboard(`https://overtakegg.com/track/${link.slug}`, link.id)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                      {copied === link.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      {copied === link.id ? 'Copied' : 'Copy Link'}
                    </button>
                    <a href={link.destination_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                      <ExternalLink size={12} />
                    </a>
                    <button onClick={() => deleteLink(link.id)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-[#E8191A]/50 text-white/40 hover:text-[#E8191A] text-xs font-mono uppercase tracking-widest transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
