'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Copy, ExternalLink, Tag, Link, BarChart2, LogOut, Check, Mail, Send, Clock, Users, RefreshCw, Save, CopyPlus, Calendar, TrendingUp, UserMinus, Pencil, X, FileText, Eye, EyeOff } from 'lucide-react'
import { creators, news } from '@/lib/data'

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

type ScheduleItem = {
  id: string
  person_name: string
  content_type: string
  title: string
  notes: string
  scheduled_date: string
  completed: boolean
  created_at: string
}
type ArticleRow = {
  news_id: number
  body: string
  cover_image: string
  author: string
  published: boolean
  updated_at: string
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

const CONTENT_TYPE_LABELS: Record<string, string> = {
  youtube_video: 'YouTube Video',
  youtube_short: 'YouTube Short',
  twitch_stream: 'Twitch Stream',
  tiktok_post: 'TikTok Post',
  other: 'Other',
}

const CONTENT_TYPE_COLORS: Record<string, string> = {
  youtube_video: '#FF4444',
  youtube_short: '#FF8A80',
  twitch_stream: '#7A7AFF',
  tiktok_post: '#EE1D52',
  other: '#F0A500',
}

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
  const [tab, setTab] = useState<'codes' | 'links' | 'email' | 'compliance' | 'schedule' | 'articles'>('codes')
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
  // Which person's line is currently highlighted — set by hovering either the
  // legend or the line itself, so the two stay in sync in both directions.
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null)
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

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [addingScheduleItem, setAddingScheduleItem] = useState(false)
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null)
  const [newScheduleItem, setNewScheduleItem] = useState({ person_name: '', content_type: 'youtube_video', scheduled_date: '', title: '', notes: '' })
  const [articles, setArticles] = useState<ArticleRow[]>([])
  const [articlesLoading, setArticlesLoading] = useState(false)
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null)
  const [articleDraft, setArticleDraft] = useState({ body: '', cover_image: '', author: 'Overtake Staff', published: true })
  const [savingArticle, setSavingArticle] = useState(false)

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

  useEffect(() => {
    if (tab === 'schedule') {
      (async () => {
        // The creator dropdown on this tab needs the roster — seed/fetch it here too,
        // since a visit straight to this tab (skipping Compliance) would otherwise
        // never populate rosterMembers.
        if (rosterMembers.length === 0) {
          try {
            await api({ action: 'bulkSeedRoster', candidates: ROSTER_CANDIDATES, period })
          } catch {}
          const members = await api({ action: 'getRosterMembers' })
          setRosterMembers(members.data || [])
        }
        await fetchSchedule()
      })()
    }
  }, [tab, period])
  useEffect(() => {
    if (tab === 'articles') fetchArticles()
  }, [tab])

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

  const fetchSchedule = async () => {
    setScheduleLoading(true)
    const res = await api({ action: 'getScheduleItems', period })
    setScheduleItems(res.data || [])
    setScheduleLoading(false)
  }

  const addScheduleItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newScheduleItem.person_name.trim() || !newScheduleItem.scheduled_date || !newScheduleItem.title.trim()) return
    setAddingScheduleItem(true)
    await api({ action: 'addScheduleItem', ...newScheduleItem })
    setNewScheduleItem({ person_name: '', content_type: 'youtube_video', scheduled_date: '', title: '', notes: '' })
    await fetchSchedule()
    setAddingScheduleItem(false)
  }

  const toggleScheduleComplete = async (item: ScheduleItem) => {
    // Optimistic update so the click feels instant instead of waiting on the round trip
    setScheduleItems(prev => prev.map(s => s.id === item.id ? { ...s, completed: !s.completed } : s))
    await api({ action: 'updateScheduleItem', id: item.id, completed: !item.completed })
  }

  const deleteScheduleItem = async (id: string) => {
    if (!confirm('Remove this from the schedule?')) return
    setDeletingScheduleId(id)
    await api({ action: 'deleteScheduleItem', id })
    await fetchSchedule()
    setDeletingScheduleId(null)
  }
  const fetchArticles = async () => {
    setArticlesLoading(true)
    const res = await api({ action: 'getArticles' })
    setArticles(res.data || [])
    setArticlesLoading(false)
  }
  const openArticleEditor = (newsId: number) => {
    const existing = articles.find(a => a.news_id === newsId)
    setArticleDraft({
      body: existing?.body || '',
      cover_image: existing?.cover_image || '',
      author: existing?.author || 'Overtake Staff',
      published: existing?.published ?? true,
    })
    setEditingArticleId(newsId)
  }
  const saveArticleDraft = async () => {
    if (editingArticleId === null) return
    setSavingArticle(true)
    await api({ action: 'upsertArticle', news_id: editingArticleId, ...articleDraft })
    await fetchArticles()
    setSavingArticle(false)
    setEditingArticleId(null)
  }
  const deleteArticleRow = async (newsId: number) => {
    if (!confirm('Remove this article? The news card will fall back to its excerpt + X link.')) return
    await api({ action: 'deleteArticle', news_id: newsId })
    await fetchArticles()
    if (editingArticleId === newsId) setEditingArticleId(null)
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
            <BarChart2 size={16}
