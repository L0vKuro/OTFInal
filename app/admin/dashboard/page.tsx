'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Copy, ExternalLink, Tag, Link, BarChart2, LogOut, Check, Mail, Send, Clock, Users, RefreshCw, Save, CopyPlus, Calendar, TrendingUp, UserMinus, Pencil, X } from 'lucide-react'
import { creators } from '@/lib/data'

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

type RosterMember = {
  id: string
  person_name: string
  role_type: 'streamer' | 'tiktok_creator' | 'creator'
  twitch_login: string
  youtube_channel: string
  photo_url: string
  active: boolean
  created_at: string
}

type ActivityEvent = {
  id: string
  person_name: string
  platform: 'twitch' | 'youtube'
  event_date: string
  external_id: string
  title: string
}

type TiktokCount = {
  id: string
  person_name: string
  period: string
  tiktok_posts: number
  notes: string
}

type TrendRow = {
  period: string
  person_name: string
  twitch: number
  youtube: number
  tiktok: number
  total: number
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
  streamer: 'Twitch: 10–12 streams / month (auto)',
  tiktok_creator: 'TikTok: 5–7 posts / week (manual)',
  creator: '8–10 TikTok + YT uploads / month (YT auto, TikTok manual)',
}

const ROLE_TARGET: Record<string, number> = {
  streamer: 10,
  tiktok_creator: 20,
  creator: 8,
}

const CHART_COLORS = ['#E8191A', '#00D4FF', '#F0A500', '#00A878', '#FF6FB5', '#7A7AFF', '#FF9E4A', '#4AE0C9']

function inferCreatorRole(c: any): 'streamer' | 'tiktok_creator' | 'creator' {
  if (c.socials?.twitch) return 'streamer'
  if (c.socials?.youtube) return 'creator'
  return 'tiktok_creator'
}

// Only the /creators roster gets auto-tracked (not competitive team players) — this
// is sent to the backend on every visit to the tab, and the backend only inserts
// whoever isn't already there.
const ROSTER_CANDIDATES = creators.map((c: any) => ({
  person_name: c.handle,
  role_type: inferCreatorRole(c),
  twitch_login: c.socials?.twitch || '',
  youtube_channel: c.socials?.youtube || '',
  photo_url: c.photo ? `/${c.photo}` : '',
}))

function eventUrl(ev: { platform: string; external_id: string }): string {
  return ev.platform === 'twitch'
    ? `https://www.twitch.tv/videos/${ev.external_id}`
    : `https://www.youtube.com/watch?v=${ev.external_id}`
}

function Avatar({ src, name, size = 48 }: { src?: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const initials = name.slice(0, 2).toUpperCase()
  if (!src || failed) {
    return (
      <div className="flex items-center justify-center rounded-full bg-white/10 text-white/50 font-mono font-bold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.32 }}>
        {initials}
      </div>
    )
  }
  return (
    <img src={src} alt={name} onError={() => setFailed(true)}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }} />
  )
}

function getActual(member: RosterMember, twitchCount: number, youtubeCount: number, tiktokCount: number) {
  if (member.role_type === 'streamer') return twitchCount
  if (member.role_type === 'tiktok_creator') return tiktokCount
  return tiktokCount + youtubeCount
}

function getCurrentPeriod() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getStatus(actual: number, target: number) {
  const ratio = target > 0 ? actual / target : 0
  if (ratio >= 1) return { label: 'On Track', color: '#00A878' }
  if (ratio >= 0.6) return { label: 'Behind', color: '#F0A500' }
  return { label: 'Non-Compliant', color: '#E8191A' }
}

function daysInPeriod(period: string) {
  const [y, m] = period.split('-').map(Number)
  const dayCount = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay()
  return { dayCount, firstWeekday }
}

// Smooth Catmull-Rom-to-Bezier curve through a set of points, instead of a jagged
// straight-line polyline — makes sparse weekly data actually look like a trend line.
function smoothLinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M${points[0].x},${points[0].y}`
  if (points.length === 2) return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return d
}

// Closes a smoothed line down to a baseline to make a soft filled area beneath it.
function smoothAreaPath(points: { x: number; y: number }[], baselineY: number): string {
  const line = smoothLinePath(points)
  if (!line || points.length === 0) return ''
  const last = points[points.length - 1]
  const first = points[0]
  return `${line} L${last.x},${baselineY} L${first.x},${baselineY} Z`
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

  const [rosterMembers, setRosterMembers] = useState<RosterMember[]>([])
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([])
  const [tiktokCounts, setTiktokCounts] = useState<TiktokCount[]>([])
  const [trendData, setTrendData] = useState<TrendRow[]>([])
  const [trendPeriodsOrder, setTrendPeriodsOrder] = useState<string[]>([])
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'twitch' | 'youtube'>('all')
  const [period, setPeriod] = useState(getCurrentPeriod())
  const [complianceLoading, setComplianceLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncErrors, setSyncErrors] = useState<string[]>([])
  const [addingPerson, setAddingPerson] = useState(false)
  const [savingTiktok, setSavingTiktok] = useState<string | null>(null)
  const [tiktokDraft, setTiktokDraft] = useState<Record<string, string>>({})
  const [newPerson, setNewPerson] = useState({ person_name: '', role_type: 'streamer', twitch_login: '', youtube_channel: '', photo_url: '' })
  const [editingPerson, setEditingPerson] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ role_type: 'streamer', twitch_login: '', youtube_channel: '', photo_url: '' })
  const [savingEdit, setSavingEdit] = useState(false)

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
    if (tab === 'compliance') {
      (async () => {
        setComplianceLoading(true)
        try {
          await api({ action: 'bulkSeedRoster', candidates: ROSTER_CANDIDATES, period })
        } catch {}
        await fetchCompliance()
      })()
    }
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
    const [members, events, tiktok, trend] = await Promise.all([
      api({ action: 'getRosterMembers' }),
      api({ action: 'getActivityEvents', period }),
      api({ action: 'getTiktokCounts', period }),
      api({ action: 'getTrendData', weeks: 12 }),
    ])
    setRosterMembers(members.data || [])
    setActivityEvents(events.data || [])
    setTiktokCounts(tiktok.data || [])
    setTrendData(trend.data || [])
    setTrendPeriodsOrder(trend.periods || [])
    const draft: Record<string, string> = {}
    for (const t of (tiktok.data || [])) draft[t.person_name] = String(t.tiktok_posts)
    setTiktokDraft(draft)
    setComplianceLoading(false)
  }

  const addPerson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPerson.person_name.trim()) return
    setAddingPerson(true)
    await api({ action: 'addRosterMember', ...newPerson, period })
    setNewPerson({ person_name: '', role_type: 'streamer', twitch_login: '', youtube_channel: '', photo_url: '' })
    await fetchCompliance()
    setAddingPerson(false)
  }

  const removePerson = async (person_name: string) => {
    if (!confirm(`Remove ${person_name} from tracking? Their history stays on record.`)) return
    await api({ action: 'removeRosterMember', person_name })
    fetchCompliance()
  }

  const startEdit = (member: RosterMember) => {
    setEditingPerson(member.person_name)
    setEditDraft({
      role_type: member.role_type,
      twitch_login: member.twitch_login || '',
      youtube_channel: member.youtube_channel || '',
      photo_url: member.photo_url || '',
    })
  }

  const saveEdit = async (person_name: string) => {
    setSavingEdit(true)
    await api({ action: 'updateRosterMember', person_name, ...editDraft })
    await Promise.all([
      api({ action: 'syncTwitchStreams', period, personName: person_name }),
      api({ action: 'syncYoutubeUploads', period, personName: person_name }),
    ])
    setEditingPerson(null)
    await fetchCompliance()
    setSavingEdit(false)
  }

  const syncAll = async () => {
    setSyncing(true)
    setSyncErrors([])
    const [twitchRes, youtubeRes] = await Promise.all([
      api({ action: 'syncTwitchStreams', period }),
      api({ action: 'syncYoutubeUploads', period }),
    ])
    const errs: string[] = []
    if (twitchRes.error) errs.push(`Twitch auth: ${twitchRes.error}`)
    if (youtubeRes.error) errs.push(`YouTube auth: ${youtubeRes.error}`)
    for (const e of (twitchRes.errors || [])) errs.push(`${e.person_name} (Twitch): ${e.error}`)
    for (const e of (youtubeRes.errors || [])) errs.push(`${e.person_name} (YouTube): ${e.error}`)
    setSyncErrors(errs)
    await fetchCompliance()
    setSyncing(false)
  }

  const saveTiktok = async (person_name: string) => {
    setSavingTiktok(person_name)
    const val = parseInt(tiktokDraft[person_name] || '0') || 0
    await api({ action: 'upsertTiktokCount', person_name, period, tiktok_posts: val, notes: '' })
    await fetchCompliance()
    setSavingTiktok(null)
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
            <span className="font-display font-black text-xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{rosterMembers.length}</span>
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
                  <button onClick={syncAll} disabled={syncing}
                    className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-4 py-2.5 font-black tracking-widest uppercase text-xs transition-all text-white clip-corner disabled:opacity-50 mt-5">
                    <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Syncing...' : 'Sync Twitch & YouTube'}
                  </button>
                </div>
              </div>
              <p className="text-white/25 text-xs font-mono">
                Twitch and YouTube activity pull automatically from their APIs for anyone with a handle on file. TikTok posts are entered manually until a TikTok API connection is set up.
              </p>
              {syncErrors.length > 0 && (
                <div className="mt-4 bg-[#E8191A]/10 border border-[#E8191A]/30 px-4 py-3 space-y-1">
                  <p className="text-[#E8191A] text-xs font-mono font-bold uppercase tracking-widest mb-1">Sync issues ({syncErrors.length})</p>
                  {syncErrors.map((e, i) => (
                    <p key={i} className="text-[#E8191A]/80 text-xs font-mono">{e}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Add person form — only for people NOT already in the site's /creators data.
                Everyone already listed on /creators is added automatically. */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <h3 className="font-display font-black text-lg text-white uppercase mb-1"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Add New Creator</h3>
              <p className="text-white/30 text-xs font-mono mb-4">
                Everyone already on /creators is tracked automatically above, with their site photo. Only use this for someone new who isn't listed there yet.
              </p>
              <form onSubmit={addPerson} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Name *</label>
                  <input required value={newPerson.person_name} onChange={e => setNewPerson({ ...newPerson, person_name: e.target.value })}
                    placeholder="New Creator Name"
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
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Twitch Login</label>
                  <input value={newPerson.twitch_login} onChange={e => setNewPerson({ ...newPerson, twitch_login: e.target.value.toLowerCase() })}
                    placeholder="dynasty_k1ng"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">YouTube Channel</label>
                  <input value={newPerson.youtube_channel} onChange={e => setNewPerson({ ...newPerson, youtube_channel: e.target.value })}
                    placeholder="UCxxxx or @handle"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Photo URL (optional)</label>
                  <input value={newPerson.photo_url} onChange={e => setNewPerson({ ...newPerson, photo_url: e.target.value })}
                    placeholder="Auto-fills from Twitch/YT"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div className="flex items-end sm:col-span-2 lg:col-span-5">
                  <button type="submit" disabled={addingPerson}
                    className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner justify-center disabled:opacity-50"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {addingPerson ? <><Clock size={14} className="animate-spin" /> Adding...</> : <><Plus size={14} /> Add & Track</>}
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
              {!complianceLoading && rosterMembers.length === 0 && (
                <div className="bg-[#141414] border border-white/5 p-8 text-center">
                  <p className="text-white/30 font-mono text-sm">No one tracked yet. Add someone above to get started.</p>
                </div>
              )}
              {!complianceLoading && rosterMembers.map((member) => {
                const twitchCount = activityEvents.filter(e => e.person_name === member.person_name && e.platform === 'twitch').length
                const youtubeCount = activityEvents.filter(e => e.person_name === member.person_name && e.platform === 'youtube').length
                const tiktokCount = parseInt(tiktokDraft[member.person_name] ?? '0') || 0
                const target = ROLE_TARGET[member.role_type]
                const actual = getActual(member, twitchCount, youtubeCount, tiktokCount)
                const status = getStatus(actual, target)
                const isEditing = editingPerson === member.person_name
                return (
                  <div key={member.id} className="bg-[#141414] border border-white/5 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar src={member.photo_url} name={member.person_name} size={56} />
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-display font-black text-2xl text-white uppercase"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{member.person_name}</span>
                            <span className="text-xs font-mono px-2 py-0.5 border"
                              style={{ color: '#00D4FF', borderColor: '#00D4FF40', background: '#00D4FF10' }}>
                              {ROLE_LABELS[member.role_type]}
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 border"
                              style={{ color: status.color, borderColor: `${status.color}40`, background: `${status.color}10` }}>
                              {status.label} ({actual}/{target})
                            </span>
                          </div>
                          <p className="text-white/30 text-xs font-mono">{ROLE_REQUIREMENTS[member.role_type]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => isEditing ? setEditingPerson(null) : startEdit(member)}
                          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                          {isEditing ? <X size={12} /> : <Pencil size={12} />} {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <button onClick={() => removePerson(member.person_name)}
                          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-[#E8191A]/50 text-white/40 hover:text-[#E8191A] text-xs font-mono uppercase tracking-widest transition-all">
                          <UserMinus size={12} /> Remove
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
                        <div>
                          <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Role</label>
                          <select value={editDraft.role_type} onChange={e => setEditDraft({ ...editDraft, role_type: e.target.value })}
                            className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors">
                            <option value="streamer">Streamer (Twitch)</option>
                            <option value="tiktok_creator">TikTok Creator</option>
                            <option value="creator">Creator (TikTok/YT)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Twitch Login</label>
                          <input value={editDraft.twitch_login} onChange={e => setEditDraft({ ...editDraft, twitch_login: e.target.value.toLowerCase() })}
                            placeholder="not set"
                            className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors" />
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">YouTube Channel</label>
                          <input value={editDraft.youtube_channel} onChange={e => setEditDraft({ ...editDraft, youtube_channel: e.target.value })}
                            placeholder="UCxxxx or @handle"
                            className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors" />
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Photo URL</label>
                          <input value={editDraft.photo_url} onChange={e => setEditDraft({ ...editDraft, photo_url: e.target.value })}
                            placeholder="Paste a TikTok/Twitch/YT photo URL"
                            className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-3 py-2 text-white font-mono text-sm outline-none transition-colors" />
                        </div>
                        <div className="col-span-2 sm:col-span-4">
                          <button onClick={() => saveEdit(member.person_name)} disabled={savingEdit}
                            className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-2.5 font-black tracking-widest uppercase text-xs transition-all text-white clip-corner disabled:opacity-50">
                            {savingEdit ? <><Clock size={12} className="animate-spin" /> Saving...</> : <><Save size={12} /> Save & Re-sync</>}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-[#0D0D0D] border border-white/5 px-4 py-3">
                          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-1">Twitch Streams (auto)</p>
                          <p className="font-display font-black text-2xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                            {member.twitch_login ? twitchCount : <span className="text-white/20 text-sm font-mono">no handle</span>}
                          </p>
                        </div>
                        <div className="bg-[#0D0D0D] border border-white/5 px-4 py-3">
                          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-1">YouTube Uploads (auto)</p>
                          <p className="font-display font-black text-2xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                            {member.youtube_channel ? youtubeCount : <span className="text-white/20 text-sm font-mono">no channel</span>}
                          </p>
                        </div>
                        <div className="bg-[#0D0D0D] border border-white/5 px-4 py-3">
                          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-1">TikTok Posts (manual)</p>
                          <div className="flex items-center gap-2">
                            <input type="number" min={0} value={tiktokDraft[member.person_name] ?? '0'}
                              onChange={e => setTiktokDraft({ ...tiktokDraft, [member.person_name]: e.target.value })}
                              className="w-16 bg-transparent border-b border-white/20 focus:border-[#E8191A]/60 text-white font-display font-black text-2xl outline-none"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }} />
                            <button onClick={() => saveTiktok(member.person_name)} disabled={savingTiktok === member.person_name}
                              className="flex items-center gap-1 px-2 py-1 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-all disabled:opacity-50">
                              {savingTiktok === member.person_name ? <Clock size={10} className="animate-spin" /> : <Save size={10} />}
                            </button>
                          </div>
                        </div>
                        <div className="bg-[#0D0D0D] border border-white/5 px-4 py-3">
                          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-1">Total Activity</p>
                          <p className="font-display font-black text-2xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                            {twitchCount + youtubeCount + tiktokCount}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Calendar */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Calendar size={18} className="text-[#E8191A]" />
                <h3 className="font-display font-black text-lg text-white uppercase"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Activity Calendar</h3>
                <div className="flex items-center gap-1 ml-auto">
                  {(['all', 'twitch', 'youtube'] as const).map(f => (
                    <button key={f} onClick={() => setCalendarFilter(f)}
                      className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border"
                      style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        color: calendarFilter === f ? '#F2F2F2' : 'rgba(242,242,242,0.3)',
                        borderColor: calendarFilter === f ? (f === 'twitch' ? '#7A7AFF' : f === 'youtube' ? '#FF4444' : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.05)',
                        background: calendarFilter === f ? (f === 'twitch' ? '#7A7AFF15' : f === 'youtube' ? '#FF444415' : 'rgba(255,255,255,0.05)') : 'transparent',
                      }}>
                      {f === 'all' ? 'All' : f === 'twitch' ? 'Twitch' : 'YouTube'}
                    </button>
                  ))}
                </div>
                <span className="text-white/30 text-xs font-mono w-full">Twitch streams + YouTube uploads by day (TikTok not date-tracked yet)</span>
              </div>
              {(() => {
                const { dayCount, firstWeekday } = daysInPeriod(period)
                const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: dayCount }, (_, i) => i + 1)]
                return (
                  <div className="grid grid-cols-7 gap-1.5">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                      <div key={d} className="text-center text-white/25 text-[10px] font-mono uppercase tracking-widest pb-1">{d}</div>
                    ))}
                    {cells.map((day, i) => {
                      if (day === null) return <div key={`blank-${i}`} />
                      const dateStr = `${period}-${String(day).padStart(2, '0')}`
                      const dayEvents = activityEvents.filter(e => e.event_date === dateStr && (calendarFilter === 'all' || e.platform === calendarFilter))
                      return (
                        <div key={dateStr} className="bg-[#0D0D0D] border border-white/5 min-h-[64px] p-1.5">
                          <p className="text-white/30 text-[10px] font-mono mb-1">{day}</p>
                          <div className="space-y-0.5">
                            {dayEvents.slice(0, 3).map(ev => (
                              <a key={ev.id} href={eventUrl(ev)} target="_blank" rel="noopener noreferrer"
                                title={`${ev.person_name} — ${ev.platform === 'twitch' ? 'Twitch stream' : 'YouTube upload'}${ev.title ? ` — ${ev.title}` : ''}`}
                                className="flex items-center gap-1 text-[9px] font-mono px-1 py-0.5 truncate hover:underline"
                                style={{
                                  color: ev.platform === 'twitch' ? '#7A7AFF' : '#FF4444',
                                  background: ev.platform === 'twitch' ? '#7A7AFF15' : '#FF444415',
                                }}>
                                <span className="font-bold" style={{ opacity: 0.8 }}>{ev.platform === 'twitch' ? 'TW' : 'YT'}</span>
                                <span className="truncate">{ev.person_name}</span>
                              </a>
                            ))}
                            {dayEvents.length > 3 && (
                              <p className="text-white/20 text-[9px] font-mono">+{dayEvents.length - 3} more</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            {/* Trend chart */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={18} className="text-[#E8191A]" />
                <h3 className="font-display font-black text-lg text-white uppercase"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>12-Week Trend</h3>
                <span className="text-white/30 text-xs font-mono">Total weekly activity per person — use this to spot who's improving or falling off</span>
              </div>
              {(() => {
                const trendPeriods = trendPeriodsOrder.length > 0 ? trendPeriodsOrder : Array.from(new Set(trendData.map(r => r.period)))
                const personNames = Array.from(new Set(trendData.map(r => r.person_name))).sort()
                if (trendPeriods.length === 0 || personNames.length === 0) {
                  return <p className="text-white/30 font-mono text-sm">Not enough data yet — sync some activity first.</p>
                }
                const maxVal = Math.max(1, ...trendData.map(r => r.total))
                const chartW = 640
                const chartH = 240
                const padL = 30
                const padB = 24
                const padT = 14
                const plotW = chartW - padL - 10
                const plotH = chartH - padB - padT
                const baselineY = padT + plotH
                const xFor = (i: number) => padL + (trendPeriods.length > 1 ? (i / (trendPeriods.length - 1)) * plotW : plotW / 2)
                const yFor = (v: number) => padT + plotH - (v / maxVal) * plotH
                // Only label every other week if there are a lot of them, so labels don't collide
                const labelStep = trendPeriods.length > 8 ? 2 : 1
                return (
                  <div>
                    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: '300px' }}>
                      {[0, 0.5, 1].map(f => (
                        <line key={f} x1={padL} x2={chartW - 10} y1={padT + plotH * (1 - f)} y2={padT + plotH * (1 - f)}
                          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      ))}
                      {trendPeriods.map((p, i) => (
                        i % labelStep === 0 ? (
                          <text key={p} x={xFor(i)} y={chartH - 6} fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle" fontFamily="monospace">{p}</text>
                        ) : null
                      ))}
                      {personNames.map((name, pi) => {
                        const color = CHART_COLORS[pi % CHART_COLORS.length]
                        const points = trendPeriods.map((p, i) => {
                          const row = trendData.find(r => r.person_name === name && r.period === p)
                          return { x: xFor(i), y: yFor(row ? row.total : 0) }
                        })
                        return (
                          <g key={name}>
                            <path d={smoothAreaPath(points, baselineY)} fill={color} opacity={0.08} stroke="none" />
                            <path d={smoothLinePath(points)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                            {points.map((pt, i) => (
                              <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#141414" stroke={color} strokeWidth="2" />
                            ))}
                          </g>
                        )
                      })}
                    </svg>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {personNames.map((name, pi) => (
                        <div key={name} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[pi % CHART_COLORS.length] }} />
                          <span className="text-white/50 text-xs font-mono">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
