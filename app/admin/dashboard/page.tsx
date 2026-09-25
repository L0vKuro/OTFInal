'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Copy, ExternalLink, Tag, Link, BarChart2, LogOut, Check, Mail, Send, Clock, Users, RefreshCw, Save, CopyPlus, Calendar, TrendingUp, UserMinus, Pencil, X, FileText, Eye, EyeOff, Trophy, Swords } from 'lucide-react'
import { creators, news, teams } from '@/lib/data'

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

type RosterStat = { name: string; matches_played: number; note: string }
type RecentMatch = { opponent: string; result: 'W' | 'L' | 'D'; score: string; event: string; date: string }
type TeamStatsRow = {
  team_id: string
  source_label: string
  source_url: string
  rank_label: string
  rank_sub: string
  record_text: string
  roster_stats: RosterStat[]
  recent_matches: RecentMatch[]
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
  const [tab, setTab] = useState<'codes' | 'links' | 'email' | 'compliance' | 'schedule' | 'articles' | 'teams'>('codes')
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

  const [teamStats, setTeamStats] = useState<TeamStatsRow[]>([])
  const [teamStatsLoading, setTeamStatsLoading] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [teamDraft, setTeamDraft] = useState<{
    source_label: string; source_url: string; rank_label: string; rank_sub: string
    record_text: string; roster_stats: RosterStat[]; recent_matches: RecentMatch[]
  }>({ source_label: '', source_url: '', rank_label: '', rank_sub: '', record_text: '', roster_stats: [], recent_matches: [] })
  const [savingTeam, setSavingTeam] = useState(false)

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
  useEffect(() => {
    if (tab === 'teams') fetchTeamStats()
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

  const fetchTeamStats = async () => {
    setTeamStatsLoading(true)
    const res = await api({ action: 'getTeamStats' })
    setTeamStats(res.data || [])
    setTeamStatsLoading(false)
  }

  const openTeamEditor = (teamId: string) => {
    const team = teams.find((t: any) => t.id === teamId)
    const existing = teamStats.find(t => t.team_id === teamId)
    const existingRoster: RosterStat[] = existing?.roster_stats || []
    // Seed one row per player currently on the static roster, carrying over any
    // saved match count/note for that name — so admin never has to retype names.
    const rosterStats: RosterStat[] = (team?.roster || []).map((p: any) => {
      const found = existingRoster.find(r => r.name === p.name)
      return { name: p.name, matches_played: found?.matches_played ?? 0, note: found?.note ?? '' }
    })
    setTeamDraft({
      source_label: existing?.source_label || '',
      source_url: existing?.source_url || '',
      rank_label: existing?.rank_label || '',
      rank_sub: existing?.rank_sub || '',
      record_text: existing?.record_text || '',
      roster_stats: rosterStats,
      recent_matches: existing?.recent_matches || [],
    })
    setEditingTeamId(teamId)
  }

  const updateRosterStat = (index: number, field: 'matches_played' | 'note', value: string) => {
    setTeamDraft(prev => ({
      ...prev,
      roster_stats: prev.roster_stats.map((r, i) => i === index
        ? { ...r, [field]: field === 'matches_played' ? (parseInt(value) || 0) : value }
        : r),
    }))
  }

  const addRecentMatch = () => {
    setTeamDraft(prev => ({
      ...prev,
      recent_matches: [...prev.recent_matches, { opponent: '', result: 'W', score: '', event: '', date: '' }],
    }))
  }

  const updateRecentMatch = (index: number, field: keyof RecentMatch, value: string) => {
    setTeamDraft(prev => ({
      ...prev,
      recent_matches: prev.recent_matches.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }))
  }

  const removeRecentMatch = (index: number) => {
    setTeamDraft(prev => ({ ...prev, recent_matches: prev.recent_matches.filter((_, i) => i !== index) }))
  }

  const saveTeamDraft = async () => {
    if (!editingTeamId) return
    setSavingTeam(true)
    await api({ action: 'upsertTeamStats', team_id: editingTeamId, ...teamDraft })
    await fetchTeamStats()
    setSavingTeam(false)
    setEditingTeamId(null)
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
            { id: 'schedule', label: 'Creator Schedule', icon: Calendar },
            { id: 'articles', label: 'Articles', icon: FileText },
            { id: 'teams', label: 'Teams', icon: Trophy },
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
                      {/* Render hover order (not color/legend order) so whichever line is
                          highlighted draws last and sits visually on top of the others. */}
                      {[...personNames]
                        .sort((a, b) => (a === hoveredPerson ? 1 : b === hoveredPerson ? -1 : 0))
                        .map((name) => {
                        const pi = personNames.indexOf(name)
                        const color = CHART_COLORS[pi % CHART_COLORS.length]
                        const isHovered = hoveredPerson === name
                        const isDimmed = hoveredPerson !== null && !isHovered
                        const points = trendPeriods.map((p, i) => {
                          const row = trendData.find(r => r.person_name === name && r.period === p)
                          return { x: xFor(i), y: yFor(row ? row.total : 0) }
                        })
                        return (
                          <g
                            key={name}
                            onMouseEnter={() => setHoveredPerson(name)}
                            onMouseLeave={() => setHoveredPerson(null)}
                            style={{ cursor: 'pointer', transition: 'opacity 0.15s ease' }}
                          >
                            <path d={smoothAreaPath(points, baselineY)} fill={color} opacity={isDimmed ? 0.02 : 0.08} stroke="none" />
                            {/* Invisible wide hit-path — makes the thin 2.5px line easy to hover
                                without needing pixel-perfect mouse precision. */}
                            <path d={smoothLinePath(points)} fill="none" stroke="transparent" strokeWidth="16" />
                            <path d={smoothLinePath(points)} fill="none" stroke={color} strokeWidth={isHovered ? 4 : 2.5}
                              strokeLinecap="round" opacity={isDimmed ? 0.15 : 1}
                              style={{ transition: 'stroke-width 0.15s ease, opacity 0.15s ease' }} />
                            {points.map((pt, i) => (
                              <circle key={i} cx={pt.x} cy={pt.y} r={isHovered ? 4 : 3} fill="#141414" stroke={color}
                                strokeWidth="2" opacity={isDimmed ? 0.15 : 1} />
                            ))}
                          </g>
                        )
                      })}
                    </svg>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {personNames.map((name, pi) => {
                        const isHovered = hoveredPerson === name
                        const isDimmed = hoveredPerson !== null && !isHovered
                        return (
                          <div key={name}
                            onMouseEnter={() => setHoveredPerson(name)}
                            onMouseLeave={() => setHoveredPerson(null)}
                            className="flex items-center gap-1.5 px-1.5 py-0.5 -mx-1.5 cursor-pointer"
                            style={{
                              opacity: isDimmed ? 0.35 : 1,
                              background: isHovered ? 'rgba(255,255,255,0.06)' : 'transparent',
                              transition: 'opacity 0.15s ease, background 0.15s ease',
                            }}>
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[pi % CHART_COLORS.length] }} />
                            <span className="text-xs font-mono" style={{ color: isHovered ? '#F2F2F2' : 'rgba(242,242,242,0.5)', fontWeight: isHovered ? 700 : 400 }}>{name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* How this works */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <h3 className="font-display font-black text-lg text-white uppercase mb-4"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>How This Tool Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-sm">
                <div>
                  <p className="text-[#00D4FF] text-xs font-mono uppercase tracking-widest mb-1">Who gets tracked</p>
                  <p className="text-white/50 leading-relaxed">
                    Everyone listed on the public /creators page is added here automatically, using their site photo and whatever Twitch/YouTube handles are on file. You only need the "Add New Creator" form for someone new who isn't on /creators yet — anyone already there will just show up on its own next time you open this tab.
                  </p>
                </div>
                <div>
                  <p className="text-[#00D4FF] text-xs font-mono uppercase tracking-widest mb-1">Periods are monthly</p>
                  <p className="text-white/50 leading-relaxed">
                    The "Period" field controls which month you're viewing — codes, streams, uploads, and the calendar all scope to it. Switching periods doesn't delete or change anything, it just changes what you're looking at.
                  </p>
                </div>
                <div>
                  <p className="text-[#00D4FF] text-xs font-mono uppercase tracking-widest mb-1">Twitch & YouTube are automatic — but not live</p>
                  <p className="text-white/50 leading-relaxed">
                    Stream and upload counts pull straight from the Twitch/YouTube APIs, but only when you click "Sync Twitch & YouTube." Nothing runs in the background — if it's been a while since the last sync, the numbers you see are stale, not necessarily zero. If a sync fails for someone, it shows up as a red error under the sync button with the exact reason (usually a wrong or misspelled handle).
                  </p>
                </div>
                <div>
                  <p className="text-[#00D4FF] text-xs font-mono uppercase tracking-widest mb-1">TikTok is manual</p>
                  <p className="text-white/50 leading-relaxed">
                    There's no TikTok API connection yet, so post counts have to be typed in by hand per person, per month, using the number field on their card. Nothing else needs to be touched for TikTok — just the number.
                  </p>
                </div>
                <div>
                  <p className="text-[#00D4FF] text-xs font-mono uppercase tracking-widest mb-1">Editing a handle re-syncs immediately</p>
                  <p className="text-white/50 leading-relaxed">
                    Hitting "Save & Re-sync" after editing someone's Twitch login or YouTube channel pulls their activity again right away, so a typo fix shows updated numbers within a few seconds — no need to hit the big Sync button separately.
                  </p>
                </div>
                <div>
                  <p className="text-[#00D4FF] text-xs font-mono uppercase tracking-widest mb-1">"Remove" is safe — nothing is deleted</p>
                  <p className="text-white/50 leading-relaxed">
                    Removing someone just stops tracking them going forward; their past activity and history stay in the system. If they're still listed on /creators, they'll get auto-added back the next time you open this tab — so removal is really meant for people who've left, not a way to permanently wipe someone.
                  </p>
                </div>
                <div>
                  <p className="text-[#00D4FF] text-xs font-mono uppercase tracking-widest mb-1">This data also powers the public leaderboard</p>
                  <p className="text-white/50 leading-relaxed">
                    The "This Month's Leaders" board on the public /creators page reads directly from the same synced data shown here. If someone's numbers look wrong here, they'll look wrong there too — fixing it in this tab (handle, then re-sync) fixes both places at once.
                  </p>
                </div>
                <div>
                  <p className="text-[#00D4FF] text-xs font-mono uppercase tracking-widest mb-1">Calendar & trend chart are just visualizations</p>
                  <p className="text-white/50 leading-relaxed">
                    Both are read-only — they can't be edited directly, they just reflect whatever's already been synced or entered above. Use the calendar's All/Twitch/YouTube tabs to see who's been active on a given platform, and the trend chart to spot who's ramping up or falling off week to week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREATOR SCHEDULE TAB */}
        {tab === 'schedule' && (
          <div className="space-y-8">
            <div className="bg-[#141414] border border-white/5 p-6">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
                <div>
                  <h2 className="font-display font-black text-xl text-white uppercase mb-1"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Creator Schedule</h2>
                  <p className="text-white/40 text-sm font-mono">Plan what's going out and when — drop a video, short, stream, or post onto the month's calendar before it happens.</p>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Period</label>
                  <input type="month" value={period} onChange={e => setPeriod(e.target.value)}
                    className="bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-2.5 text-white font-mono text-sm outline-none transition-colors" />
                </div>
              </div>
              <p className="text-white/25 text-xs font-mono">
                This is separate from the auto-synced activity above — it's for planning ahead, not tracking what already happened. Anyone with admin access can add or remove items.
              </p>
            </div>

            {/* Add form */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <h3 className="font-display font-black text-lg text-white uppercase mb-4"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Add to Schedule</h3>
              <form onSubmit={addScheduleItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Creator *</label>
                  <select required value={newScheduleItem.person_name}
                    onChange={e => setNewScheduleItem({ ...newScheduleItem, person_name: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors">
                    <option value="">Select creator...</option>
                    {rosterMembers.map(m => (
                      <option key={m.id} value={m.person_name}>{m.person_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Content Type *</label>
                  <select value={newScheduleItem.content_type}
                    onChange={e => setNewScheduleItem({ ...newScheduleItem, content_type: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors">
                    {Object.entries(CONTENT_TYPE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Date *</label>
                  <input required type="date" value={newScheduleItem.scheduled_date}
                    onChange={e => setNewScheduleItem({ ...newScheduleItem, scheduled_date: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Title / Description *</label>
                  <input required value={newScheduleItem.title}
                    onChange={e => setNewScheduleItem({ ...newScheduleItem, title: e.target.value })}
                    placeholder="e.g. Season 3 tier list short"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Notes</label>
                  <input value={newScheduleItem.notes}
                    onChange={e => setNewScheduleItem({ ...newScheduleItem, notes: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2 lg:col-span-5">
                  <button type="submit" disabled={addingScheduleItem}
                    className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner disabled:opacity-50"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {addingScheduleItem ? <><Clock size={14} className="animate-spin" /> Adding...</> : <><Plus size={14} /> Add to Schedule</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Calendar */}
            <div className="bg-[#141414] border border-white/5 p-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Calendar size={18} className="text-[#E8191A]" />
                <h3 className="font-display font-black text-lg text-white uppercase"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Content Calendar</h3>
                <span className="text-white/30 text-xs font-mono">Click an item to toggle it posted/not posted</span>
              </div>
              {scheduleLoading ? (
                <p className="text-white/30 font-mono text-sm animate-pulse">Loading schedule...</p>
              ) : (() => {
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
                      const dayItems = scheduleItems.filter(s => s.scheduled_date === dateStr)
                      return (
                        <div key={dateStr} className="bg-[#0D0D0D] border border-white/5 min-h-[64px] p-1.5">
                          <p className="text-white/30 text-[10px] font-mono mb-1">{day}</p>
                          <div className="space-y-0.5">
                            {dayItems.slice(0, 3).map(item => (
                              <button key={item.id} onClick={() => toggleScheduleComplete(item)}
                                title={`${item.person_name} — ${CONTENT_TYPE_LABELS[item.content_type] || 'Other'}: ${item.title}${item.notes ? ` (${item.notes})` : ''}`}
                                className="flex items-center gap-1 w-full text-[9px] font-mono px-1 py-0.5 truncate text-left"
                                style={{
                                  color: CONTENT_TYPE_COLORS[item.content_type] || '#F0A500',
                                  background: `${CONTENT_TYPE_COLORS[item.content_type] || '#F0A500'}15`,
                                  textDecoration: item.completed ? 'line-through' : 'none',
                                  opacity: item.completed ? 0.5 : 1,
                                }}>
                                <span className="truncate">{item.person_name}</span>
                              </button>
                            ))}
                            {dayItems.length > 3 && (
                              <p className="text-white/20 text-[9px] font-mono">+{dayItems.length - 3} more</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            {/* List */}
            <div className="space-y-3">
              {!scheduleLoading && scheduleItems.length === 0 && (
                <div className="bg-[#141414] border border-white/5 p-8 text-center">
                  <p className="text-white/30 font-mono text-sm">Nothing scheduled for this month yet. Add something above to get started.</p>
                </div>
              )}
              {[...scheduleItems].sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date)).map(item => {
                const color = CONTENT_TYPE_COLORS[item.content_type] || '#F0A500'
                const member = rosterMembers.find(m => m.person_name === item.person_name)
                return (
                  <div key={item.id} className="bg-[#141414] border border-white/5 p-5 flex flex-wrap items-center gap-4">
                    <Avatar src={member?.photo_url} name={item.person_name} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-display font-black text-lg text-white uppercase"
                          style={{
                            fontFamily: 'Barlow Condensed, sans-serif',
                            textDecoration: item.completed ? 'line-through' : 'none',
                            opacity: item.completed ? 0.5 : 1,
                          }}>
                          {item.person_name}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 border"
                          style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                          {CONTENT_TYPE_LABELS[item.content_type] || 'Other'}
                        </span>
                        <span className="text-white/30 text-xs font-mono">
                          {new Date(item.scheduled_date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        {item.completed && (
                          <span className="text-[10px] font-mono px-2 py-0.5 border"
                            style={{ color: '#00A878', borderColor: '#00A87840', background: '#00A87810' }}>
                            Posted
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">{item.title}</p>
                      {item.notes && <p className="text-white/30 text-xs font-mono mt-1">{item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleScheduleComplete(item)}
                        className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                        <Check size={12} /> {item.completed ? 'Mark Not Posted' : 'Mark Posted'}
                      </button>
                      <button onClick={() => deleteScheduleItem(item.id)} disabled={deletingScheduleId === item.id}
                        className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-[#E8191A]/50 text-white/40 hover:text-[#E8191A] text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-50">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ARTICLES TAB */}
        {tab === 'articles' && (
          <div className="space-y-8">
            <div className="bg-[#141414] border border-white/5 p-6">
              <h2 className="font-display font-black text-xl text-white uppercase mb-1"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>News & Updates Articles</h2>
              <p className="text-white/30 text-xs font-mono">
                Write a full article for any card in the homepage News & Updates section. A card with no article here just shows its excerpt and links out to the original X post — write one below to give it its own page on the site instead.
              </p>
            </div>

            {articlesLoading && (
              <div className="bg-[#141414] border border-white/5 p-8 text-center">
                <p className="text-white/30 font-mono text-sm animate-pulse">Loading articles...</p>
              </div>
            )}

            {!articlesLoading && (
              <div className="space-y-3">
                {news.map((item) => {
                  const existing = articles.find(a => a.news_id === item.id)
                  const isEditing = editingArticleId === item.id
                  return (
                    <div key={item.id} className="bg-[#141414] border border-white/5 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img src={existing?.cover_image || item.image} alt={item.title}
                            className="w-16 h-16 object-cover rounded-sm flex-shrink-0 bg-white/5" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono px-2 py-0.5 border"
                                style={{ color: '#E8191A', borderColor: '#E8191A40', background: '#E8191A10' }}>
                                {item.category}
                              </span>
                              {existing ? (
                                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 border"
                                  style={{
                                    color: existing.published ? '#00A878' : '#F0A500',
                                    borderColor: existing.published ? '#00A87840' : '#F0A50040',
                                    background: existing.published ? '#00A87810' : '#F0A50010',
                                  }}>
                                  {existing.published ? <Eye size={10} /> : <EyeOff size={10} />}
                                  {existing.published ? 'Published' : 'Draft'}
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono px-2 py-0.5 border border-white/10 text-white/30">
                                  No Article Yet
                                </span>
                              )}
                            </div>
                            <p className="font-display font-bold text-white uppercase truncate"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{item.title}</p>
                            <p className="text-white/30 text-xs font-mono">{item.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a href={`/news/${item.id}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                            <ExternalLink size={12} /> View
                          </a>
                          <button onClick={() => isEditing ? setEditingArticleId(null) : openArticleEditor(item.id)}
                            className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                            <Pencil size={12} /> {isEditing ? 'Close' : existing ? 'Edit' : 'Write'}
                          </button>
                          {existing && (
                            <button onClick={() => deleteArticleRow(item.id)}
                              className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-[#E8191A]/50 text-white/40 hover:text-[#E8191A] text-xs font-mono uppercase tracking-widest transition-all">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-5 pt-5 border-t border-white/5 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Author</label>
                              <input value={articleDraft.author} onChange={e => setArticleDraft({ ...articleDraft, author: e.target.value })}
                                className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Cover Image URL (blank = use card's image)</label>
                              <input value={articleDraft.cover_image} onChange={e => setArticleDraft({ ...articleDraft, cover_image: e.target.value })}
                                placeholder={item.image}
                                className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                            </div>
                          </div>
                          <div>
                            <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Article Body (separate paragraphs with a blank line)</label>
                            <textarea value={articleDraft.body} onChange={e => setArticleDraft({ ...articleDraft, body: e.target.value })}
                              rows={10}
                              placeholder="Write the full article here..."
                              className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white text-sm leading-relaxed outline-none transition-colors resize-y" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest cursor-pointer">
                              <input type="checkbox" checked={articleDraft.published}
                                onChange={e => setArticleDraft({ ...articleDraft, published: e.target.checked })} />
                              Published (live on site)
                            </label>
                            <button onClick={saveArticleDraft} disabled={savingArticle}
                              className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner disabled:opacity-50"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                              {savingArticle ? <><Clock size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Article</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TEAMS TAB */}
        {tab === 'teams' && (
          <div className="space-y-8">
            <div className="bg-[#141414] border border-white/5 p-6">
              <h2 className="font-display font-black text-xl text-white uppercase mb-1"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Team Competitive Stats</h2>
              <p className="text-white/30 text-xs font-mono">
                Neither HLTV nor Liquipedia offer a public way to pull this automatically (no HLTV API, and Liquipedia's official API needs a registered key), so this is filled in by hand from those pages. A team with nothing entered here just shows its static roster on the public site with no rank/match info.
              </p>
            </div>

            {teamStatsLoading && (
              <div className="bg-[#141414] border border-white/5 p-8 text-center">
                <p className="text-white/30 font-mono text-sm animate-pulse">Loading team stats...</p>
              </div>
            )}

            {!teamStatsLoading && (
              <div className="space-y-3">
                {teams.map((team: any) => {
                  const existing = teamStats.find(t => t.team_id === team.id)
                  const isEditing = editingTeamId === team.id
                  return (
                    <div key={team.id} className="bg-[#141414] border border-white/5 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                            style={{ background: `${team.color}15`, border: `1px solid ${team.color}40` }}>
                            <Swords size={20} style={{ color: team.color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono px-2 py-0.5 border"
                                style={{ color: team.color, borderColor: `${team.color}40`, background: `${team.color}10` }}>
                                {team.game}
                              </span>
                              {existing?.rank_label && (
                                <span className="text-[10px] font-mono px-2 py-0.5 border border-[#00D4FF]/40 text-[#00D4FF] bg-[#00D4FF]/10">
                                  {existing.rank_label}
                                </span>
                              )}
                              {!existing && (
                                <span className="text-[10px] font-mono px-2 py-0.5 border border-white/10 text-white/30">
                                  No Stats Yet
                                </span>
                              )}
                            </div>
                            <p className="font-display font-bold text-white uppercase truncate"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{team.tag} {team.game}</p>
                            <p className="text-white/30 text-xs font-mono">{team.roster.length} on roster{existing?.updated_at ? ` · Updated ${new Date(existing.updated_at).toLocaleDateString()}` : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {existing?.source_url && (
                            <a href={existing.source_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                              <ExternalLink size={12} /> Source
                            </a>
                          )}
                          <button onClick={() => isEditing ? setEditingTeamId(null) : openTeamEditor(team.id)}
                            className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-all">
                            <Pencil size={12} /> {isEditing ? 'Close' : existing ? 'Edit' : 'Add Stats'}
                          </button>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-5 pt-5 border-t border-white/5 space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Source (e.g. HLTV.org)</label>
                              <input value={teamDraft.source_label} onChange={e => setTeamDraft({ ...teamDraft, source_label: e.target.value })}
                                placeholder="HLTV.org"
                                className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Source URL</label>
                              <input value={teamDraft.source_url} onChange={e => setTeamDraft({ ...teamDraft, source_url: e.target.value })}
                                placeholder="https://www.hltv.org/team/..."
                                className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Rank Label</label>
                              <input value={teamDraft.rank_label} onChange={e => setTeamDraft({ ...teamDraft, rank_label: e.target.value })}
                                placeholder="#125 World"
                                className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Rank Sub-label</label>
                              <input value={teamDraft.rank_sub} onChange={e => setTeamDraft({ ...teamDraft, rank_sub: e.target.value })}
                                placeholder="Peak #102"
                                className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                            </div>
                          </div>
                          <div>
                            <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1">Record</label>
                            <input value={teamDraft.record_text} onChange={e => setTeamDraft({ ...teamDraft, record_text: e.target.value })}
                              placeholder="e.g. 14-6 this split, or Group Stage — NAL Season 3"
                              className="w-full max-w-md bg-[#0D0D0D] border border-white/10 focus:border-[#E8191A]/50 px-4 py-3 text-white font-mono text-sm outline-none transition-colors" />
                          </div>

                          {/* Roster match counts */}
                          <div>
                            <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Matches Played (per roster member)</p>
                            <div className="space-y-2">
                              {teamDraft.roster_stats.map((r, i) => (
                                <div key={r.name} className="flex flex-wrap items-center gap-3 bg-[#0D0D0D] border border-white/5 px-4 py-2.5">
                                  <span className="font-display font-bold text-white uppercase w-32 flex-shrink-0"
                                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{r.name}</span>
                                  <input type="number" min={0} value={r.matches_played}
                                    onChange={e => updateRosterStat(i, 'matches_played', e.target.value)}
                                    className="w-20 bg-transparent border-b border-white/20 focus:border-[#E8191A]/60 text-white font-mono text-sm outline-none" />
                                  <span className="text-white/25 text-[10px] font-mono uppercase">matches</span>
                                  <input value={r.note} onChange={e => updateRosterStat(i, 'note', e.target.value)}
                                    placeholder="optional note, e.g. IGL"
                                    className="flex-1 min-w-[140px] bg-transparent border-b border-white/10 focus:border-[#E8191A]/60 text-white/60 text-xs font-mono outline-none" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recent matches */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Recent Matches</p>
                              <button onClick={addRecentMatch}
                                className="flex items-center gap-1 px-2 py-1 border border-white/10 hover:border-white/30 text-white/40 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-all">
                                <Plus size={10} /> Add Match
                              </button>
                            </div>
                            <div className="space-y-2">
                              {teamDraft.recent_matches.length === 0 && (
                                <p className="text-white/20 text-xs font-mono">No recent matches added.</p>
                              )}
                              {teamDraft.recent_matches.map((m, i) => (
                                <div key={i} className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-[#0D0D0D] border border-white/5 px-4 py-3 items-center">
                                  <input value={m.opponent} onChange={e => updateRecentMatch(i, 'opponent', e.target.value)}
                                    placeholder="Opponent"
                                    className="bg-transparent border-b border-white/10 focus:border-[#E8191A]/60 text-white text-xs font-mono outline-none col-span-2 sm:col-span-2" />
                                  <select value={m.result} onChange={e => updateRecentMatch(i, 'result', e.target.value)}
                                    className="bg-[#141414] border border-white/10 text-white text-xs font-mono px-2 py-1 outline-none">
                                    <option value="W">W</option>
                                    <option value="L">L</option>
                                    <option value="D">D</option>
                                  </select>
                                  <input value={m.score} onChange={e => updateRecentMatch(i, 'score', e.target.value)}
                                    placeholder="Score"
                                    className="bg-transparent border-b border-white/10 focus:border-[#E8191A]/60 text-white text-xs font-mono outline-none" />
                                  <input value={m.event} onChange={e => updateRecentMatch(i, 'event', e.target.value)}
                                    placeholder="Event"
                                    className="bg-transparent border-b border-white/10 focus:border-[#E8191A]/60 text-white text-xs font-mono outline-none" />
                                  <div className="flex items-center gap-2">
                                    <input value={m.date} onChange={e => updateRecentMatch(i, 'date', e.target.value)}
                                      placeholder="Date"
                                      className="flex-1 bg-transparent border-b border-white/10 focus:border-[#E8191A]/60 text-white text-xs font-mono outline-none" />
                                    <button onClick={() => removeRecentMatch(i)}
                                      className="text-white/30 hover:text-[#E8191A] transition-colors flex-shrink-0">
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button onClick={saveTeamDraft} disabled={savingTeam}
                              className="flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white clip-corner disabled:opacity-50"
                              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                              {savingTeam ? <><Clock size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Team Stats</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
