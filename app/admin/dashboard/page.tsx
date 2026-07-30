'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Copy, ExternalLink, Tag, Link, BarChart2, LogOut, Check, Mail, Send, Clock, Users, RefreshCw, Save, CopyPlus } from 'lucide-react'

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

type ComplianceEntry = {
  id: string
  person_name: string
  role_type: 'streamer' | 'tiktok_creator' | 'creator'
  twitch_login: string
  period: string
  twitch_streams: number
  tiktok_posts: number
  yt_shorts: number
  notes: string
  updated_at: string
}

type OrderEmail = {
  id: string
  customer_name: string
  customer_email: string
  order_number: string
  tracking_url: string
  sent_at: string
  notes: string
}

const ROLE_LABELS: Record<string, string> = {
  streamer: 'Streamer',
  tiktok_creator: 'TikTok Creator',
  creator: 'Creator (TikTok/YT)',
}

const ROLE_REQUIREMENTS: Record<string, string> = {
  streamer: 'Twitch: 10–12 streams / month',
  tiktok_creator: 'TikTok: 5–7 posts / week',
  creator: '8–10 TikTok + YT Shorts uploads / month',
}

const ROLE_TARGET: Record<string, number> = {
  streamer: 10,
  tiktok_creator: 20,
  creator: 8,
}

function getActual(entry: ComplianceEntry) {
  if (entry.role_type === 'streamer') return entry.twitch_streams
  if (entry.role_type === 'tiktok_creator') return entry.tiktok_posts
  return entry.tiktok_posts + entry.yt_shorts
}

function getCurrentPeriod() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getStatus(entry: ComplianceEntry) {
  const target = ROLE_TARGET[entry.role_type]
  const actual = getActual(entry)
  const ratio = target > 0 ? actual / target : 0
  if (ratio >= 1) return { label: 'On Track', color: '#00A878' }
  if (ratio >= 0.6) return { label: 'Behind', color: '#F0A500' }
  return { label: 'Non-Compliant', color: '#E8191A' }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'codes' | 'links' | 'email' | 'compliance'>('codes')
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [links, setLinks] = useState<TrackingLink[]>([])
  const [orderEmails, setOrderEmails] = useState<OrderEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  const [complianceEntries, setComplianceEntries] = useState<ComplianceEntry[]>([])
  const [period, setPeriod] = useState(getCurrentPeriod())
  const [complianceLoading, setComplianceLoading] = useState(false)
  const [syncingTwitch, setSyncingTwitch] = useState(false)
  const [savingRow, setSavingRow] = useState<string | null>(null)
  const [newPerson, setNewPerson] = useState({ person_name: '', role_type: 'streamer', twitch_login: '' })

  const [newCode, setNewCode] = useState({ code: '', type: 'percent', value: '', max_uses: '', expires_at: '', notes: '' })
  const [newLink, setNewLink] = useState({ name: '', slug: '', destination_url: '', sent_to: '', notes: '' })
  const [emailForm, setEmailForm] = useState({ customer_name: '', customer_email: '', order_number: '', tracking_url: '', notes: '' })

  const getAuth = () => sessionStorage.getItem('admin_auth') || ''

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (!auth) { router.push('/admin'); return }
    fetchAll()
  }, [])

  useEffect(() => {
    if (tab === 'compliance') fetchCompliance()
  }, [tab, period])

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
    const [c, l, e] = await Promise.all([
      api({ action: 'getCodes' }),
      api({ action: 'getLinks' }),
      api({ action: 'getOrderEmails' }),
    ])
    setCodes(c.data || [])
    setLinks(l.data || [])
    setOrderEmails(e.data || [])
    setLoading(false)
  }

  const fetchCompliance = async () => {
    setComplianceLoading(true)
    const res = await api({ action: 'getComplianceEntries', period })
    setComplianceEntries(res.data || [])
    setComplianceLoading(false)
  }

  const addPerson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPerson.person_name.trim()) return
    await api({ action: 'upsertComplianceEntry', ...newPerson, period, twitch_streams: 0, tiktok_posts: 0, yt_shorts: 0, notes: '' })
    setNewPerson({ person_name: '', role_type: 'streamer', twitch_login: '' })
    fetchCompliance()
  }

  const updateRowField = (id: string, field: keyof ComplianceEntry, value: string | number) => {
    setComplianceEntries(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const saveRow = async (row: ComplianceEntry) => {
    setSavingRow(row.id)
    await api({
      action: 'upsertComplianceEntry',
      person_name: row.person_name,
      role_type: row.role_type,
      twitch_login: row.twitch_login,
      period: row.period,
      twitch_streams: Number(row.twitch_streams) || 0,
      tiktok_posts: Number(row.tiktok_posts) || 0,
      yt_shorts: Number(row.yt_shorts) || 0,
      notes: row.notes,
    })
    setSavingRow(null)
    fetchCompliance()
  }

  const deleteRow = async (id: string) => {
    if (!confirm('Remove this person from this period?')) return
    await api({ action: 'deleteComplianceEntry', id })
    fetchCompliance()
  }

  const syncTwitch = async () => {
    setSyncingTwitch(true)
    await api({ action: 'syncTwitchStreams', period })
    await fetchCompliance()
    setSyncingTwitch(false)
  }

  const copyPreviousPeriod = async () => {
    const [y, m] = period.split('-').map(Number)
    const prevDate = new Date(Date.UTC(y, m - 2, 1))
    const fromPeriod = `${prevDate.getUTCFullYear()}-${String(prevDate.getUTCMonth() + 1).padStart(2, '0')}`
    await api({ action: 'copyRosterToPeriod', fromPeriod, toPeriod: period })
    fetchCompliance()
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

  const sendTrackingEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setEmailError('')
    const res = await api({ action: 'sendTrackingEmail', ...emailForm })
    if (res.success) {
      setEmailSent(true)
      setEmailForm({ customer_name: '', customer_email: '', order_number: '', tracking_url: '', notes: '' })
      fetchAll()
      setTimeout(() => setEmailSent(false), 4000)
    } else {
      setEmailError(res.error || 'Failed to send email.')
    }
    setSending(false)
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
            <Mail size={16} className="text-[#E8191A]" />
            <span className="text-white/40 text-sm font-mono">Emails Sent</span>
            <span className="font-display font-black text-xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{orderEmails.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users size={16} className="text-[#E8191A]" />
            <span className="text-white/40 text-sm font-mono">Tracked This Period</span>
            <span className="font-display font-black text-xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{complianceEntries.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/5">
          {[
            { id: 'codes', label: 'Discount Codes', icon: Tag },
            { id: 'links', label: 'Tracking Links', icon: Link },
            { id: 'email', label: 'Send Tracking Email', icon: Mail },
            { id: 'compliance', label: 'Creator Compliance', icon: Users },
          ].map(({ id, label, icon: Icon }) => (
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
            <div className="bg-[#141414] border border-white/5 p-6">
              <h2 className="font-display font-black text-xl text-white uppercase mb-5"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Create New Code</h2>
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
            <div className="space-y-3">
              {codes.length === 0 && (
                <div className="bg-[#141414] border border-white/5 p-8 text-center">
                  <p className="text-white/30 font-mono text-sm">No discount codes yet.</p>
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
                    </div>
                  </div>
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
            <div className="bg-[#141414] border border-white/5 p-6">
              <h2 className="font-display font-black text-xl text-white uppercase mb-5"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Create Tracking Link</h2>
              <form onSubmit={createLink} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Name *</label>
                  <input required value={newLink.name} onChange={e => setNewLink({ ...newLink, name: e.target.value })}
                    placeholder="Dynasty Instagram Bio"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Slug *</label>
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
            <div className="space-y-3">
              {links.length === 0 && (
                <div className="bg-[#141414] border border-white/5 p-8 text-center">
                  <p className="text-white/30 font-mono text-sm">No tracking links yet.</p>
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
                      {link.sent_to && <span>Sent to: <span className="text-white">{link.sent_to}</span></span>}
                      {link.notes && <span>Note: <span className="text-white/60">{link.notes}</span></span>}
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

        {/* SEND TRACKING EMAIL TAB */}
        {tab === 'email' && (
          <div className="space-y-8">
            {/* Send form */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <h2 className="font-display font-black text-xl text-white uppercase mb-2"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Send Order Tracking Email</h2>
              <p className="text-white/40 text-sm font-mono mb-6">Sends a branded Overtake email to the customer with their tracking link.</p>

              {emailSent && (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 px-4 py-3 mb-6">
                  <Check size={16} className="text-green-400" />
                  <p className="text-green-400 text-sm font-mono">Email sent successfully!</p>
                </div>
              )}
              {emailError && (
                <div className="bg-[#E8191A]/10 border border-[#E8191A]/30 px-4 py-3 mb-6">
                  <p className="text-[#E8191A] text-sm font-mono">{emailError}</p>
                </div>
              )}

              <form onSubmit={sendTrackingEmail} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Customer Name *</label>
                  <input required value={emailForm.customer_name} onChange={e => setEmailForm({ ...emailForm, customer_name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Customer Email *</label>
                  <input required type="email" value={emailForm.customer_email} onChange={e => setEmailForm({ ...emailForm, customer_email: e.target.value })}
                    placeholder="customer@email.com"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Order Number *</label>
                  <input required value={emailForm.order_number} onChange={e => setEmailForm({ ...emailForm, order_number: e.target.value })}
                    placeholder="1234"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Tracking URL *</label>
                  <input required type="url" value={emailForm.tracking_url} onChange={e => setEmailForm({ ...emailForm, tracking_url: e.target.value })}
                    placeholder="https://tools.usps.com/go/TrackConfirmAction?tLabels=..."
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Internal Notes (not sent to customer)</label>
                  <input value={emailForm.notes} onChange={e => setEmailForm({ ...emailForm, notes: e.target.value })}
                    placeholder="e.g. Jersey + hoodie order"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={sending}
                    className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner disabled:opacity-50"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {sending ? <><Clock size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Send Tracking Email</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Email history */}
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase mb-4"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Email History <span className="text-white/30 text-base">({orderEmails.length})</span>
              </h3>
              <div className="space-y-3">
                {orderEmails.length === 0 && (
                  <div className="bg-[#141414] border border-white/5 p-8 text-center">
                    <p className="text-white/30 font-mono text-sm">No emails sent yet.</p>
                  </div>
                )}
                {orderEmails.map((email) => (
                  <div key={email.id} className="bg-[#141414] border border-white/5 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-display font-black text-xl text-white uppercase"
                            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{email.customer_name}</span>
                          <span className="text-xs font-mono px-2 py-0.5 border"
                            style={{ color: '#00A878', borderColor: '#00A87840', background: '#00A87810' }}>
                            Order #{email.order_number}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs font-mono text-white/40">
                          <span>To: <span className="text-white">{email.customer_email}</span></span>
                          <span>Tracking: <a href={email.tracking_url} target="_blank" rel="noopener noreferrer" className="text-[#E8191A] hover:underline">View Link</a></span>
                          {email.notes && <span>Note: <span className="text-white/60">{email.notes}</span></span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                        <Clock size={12} />
                        {new Date(email.sent_at).toLocaleDateString()} {new Date(email.sent_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CREATOR COMPLIANCE TAB */}
        {tab === 'compliance' && (
          <div className="space-y-8">
            {/* Controls */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
                <div>
                  <h2 className="font-display font-black text-xl text-white uppercase mb-1"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Creator Compliance</h2>
                  <p className="text-white/40 text-sm font-mono">Tracks streaming/posting activity against org requirements, by month.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Period</label>
                    <input type="month" value={period} onChange={e => setPeriod(e.target.value)}
                      className="bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-2.5 text-white font-mono text-sm outline-none transition-colors" />
                  </div>
                  <button onClick={copyPreviousPeriod}
                    className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all mt-5">
                    <CopyPlus size={14} /> Copy Roster From Prior Month
                  </button>
                  <button onClick={syncTwitch} disabled={syncingTwitch}
                    className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-4 py-2.5 font-black tracking-widest uppercase text-xs transition-all text-white clip-corner disabled:opacity-50 mt-5">
                    <RefreshCw size={14} className={syncingTwitch ? 'animate-spin' : ''} /> {syncingTwitch ? 'Syncing...' : 'Sync Twitch Streams'}
                  </button>
                </div>
              </div>
              <p className="text-white/25 text-xs font-mono">
                Twitch stream counts pull automatically from the Twitch API for anyone with a Twitch handle on file. TikTok posts and YT Shorts are entered manually until TikTok auto-sync is set up.
              </p>
            </div>

            {/* Add person form */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <h3 className="font-display font-black text-lg text-white uppercase mb-4"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Add Person To This Period</h3>
              <form onSubmit={addPerson} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Name *</label>
                  <input required value={newPerson.person_name} onChange={e => setNewPerson({ ...newPerson, person_name: e.target.value })}
                    placeholder="Dynasty"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Role *</label>
                  <select value={newPerson.role_type} onChange={e => setNewPerson({ ...newPerson, role_type: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors">
                    <option value="streamer">Streamer (Twitch)</option>
                    <option value="tiktok_creator">TikTok Creator</option>
                    <option value="creator">Creator (TikTok/YT)</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Twitch Login (optional, enables auto-sync)</label>
                  <input value={newPerson.twitch_login} onChange={e => setNewPerson({ ...newPerson, twitch_login: e.target.value.toLowerCase() })}
                    placeholder="dynasty_k1ng"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div className="flex items-end">
                  <button type="submit"
                    className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner w-full justify-center"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </form>
            </div>

            {/* Roster table */}
            <div className="space-y-3">
              {complianceLoading && (
                <div className="bg-[#141414] border border-white/5 p-8 text-center">
                  <p className="text-white/30 font-mono text-sm animate-pulse">Loading roster...</p>
                </div>
              )}
              {!complianceLoading && complianceEntries.length === 0 && (
                <div className="bg-[#141414] border border-white/5 p-8 text-center">
                  <p className="text-white/30 font-mono text-sm">No one tracked for this period yet. Add someone above, or copy last month's roster.</p>
                </div>
              )}
              {!complianceLoading && complianceEntries.map((row) => {
                const status = getStatus(row)
                const target = ROLE_TARGET[row.role_type]
                const actual = getActual(row)
                return (
                  <div key={row.id} className="bg-[#141414] border border-white/5 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-display font-black text-2xl text-white uppercase"
                            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{row.person_name}</span>
                          <span className="text-xs font-mono px-2 py-0.5 border"
                            style={{ color: '#00D4FF', borderColor: '#00D4FF40', background: '#00D4FF10' }}>
                            {ROLE_LABELS[row.role_type]}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 border"
                            style={{ color: status.color, borderColor: `${status.color}40`, background: `${status.color}10` }}>
                            {status.label} ({actual}/{target})
                          </span>
                        </div>
                        <p className="text-white/30 text-xs font-mono">{ROLE_REQUIREMENTS[row.role_type]}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => saveRow(row)} disabled={savingRow === row.id}
                          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-50">
                          {savingRow === row.id ? <Clock size={12} className="animate-spin" /> : <Save size={12} />}
                          Save
                        </button>
                        <button onClick={() => deleteRow(row.id)}
                          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-[#E8191A]/50 text-white/40 hover:text-[#E8191A] text-xs font-mono uppercase tracking-widest transition-all">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <div>
                        <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Twitch Login</label>
                        <input value={row.twitch_login} onChange={e => updateRowField(row.id, 'twitch_login', e.target.value.toLowerCase())}
                          placeholder="not set"
                          className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Twitch Streams</label>
                        <input type="number" min={0} value={row.twitch_streams} onChange={e => updateRowField(row.id, 'twitch_streams', e.target.value)}
                          className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">TikTok Posts</label>
                        <input type="number" min={0} value={row.tiktok_posts} onChange={e => updateRowField(row.id, 'tiktok_posts', e.target.value)}
                          className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">YT Shorts</label>
                        <input type="number" min={0} value={row.yt_shorts} onChange={e => updateRowField(row.id, 'yt_shorts', e.target.value)}
                          className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Notes</label>
                        <input value={row.notes} onChange={e => updateRowField(row.id, 'notes', e.target.value)}
                          placeholder="e.g. out sick this week"
                          className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
