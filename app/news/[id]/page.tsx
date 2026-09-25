'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, ExternalLink, ChevronRight } from 'lucide-react'
import { news } from '@/lib/data'

type Article = {
  news_id: number
  body: string
  cover_image: string
  author: string
  published: boolean
  updated_at: string
}

// Wraps a navigation in the browser's View Transitions API when the browser
// supports it (Chrome/Edge today, Safari catching up) — gives a real cross-fade
// "open"/"close" animation between pages for free, no extra library needed.
// Falls back to an instant nav on browsers that don't support it.
function navigateWithTransition(fn: () => void) {
  const doc = document as any
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(() => fn())
  } else {
    fn()
  }
}

export default function ArticlePage() {
  const router = useRouter()
  const params = useParams()
  const newsId = parseInt(String(params?.id ?? ''), 10)

  const item = news.find(n => n.id === newsId)
  const otherItems = news.filter(n => n.id !== newsId).slice(0, 3)

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!newsId) return
    fetch(`/api/articles/${newsId}`)
      .then(res => res.json())
      .then(data => setArticle(data.article || null))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [newsId])

  const handleClose = () => {
    navigateWithTransition(() => router.back())
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/30 font-mono text-sm uppercase tracking-widest mb-4">// Article Not Found</p>
        <Link href="/" className="text-[#E8191A] hover:text-white text-sm font-medium">Back to Home</Link>
      </div>
    )
  }

  const coverImage = article?.cover_image || item.image
  const bodyParagraphs = (article?.body || '').split(/\n\s*\n/).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative" style={{ viewTransitionName: 'root' as any }}>
      {/* ─── View Transition + entrance animation styles ─── */}
      <style>{`
        ::view-transition-old(root) {
          animation: article-fade-out 0.35s cubic-bezier(0.4, 0, 1, 1) both;
        }
        ::view-transition-new(root) {
          animation: article-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes article-fade-out {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.97); }
        }
        @keyframes article-fade-in {
          from { opacity: 0; transform: scale(1.03); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes article-content-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes article-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      {/* ─── Ambient grid + scanline backdrop ─── */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
        <div className="w-full h-40 bg-gradient-to-b from-transparent via-[#E8191A] to-transparent"
          style={{ animation: 'article-scan 6s linear infinite' }} />
      </div>

      {/* ─── Close button ─── */}
      <button onClick={handleClose}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-[#141414]/80 backdrop-blur border border-white/10 hover:border-[#E8191A]/50 text-white/50 hover:text-white px-4 py-2.5 text-xs font-mono uppercase tracking-widest transition-all"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease 0.1s' }}>
        <ArrowLeft size={14} /> Close
      </button>

      {/* ─── Hero ─── */}
      <div className="relative h-[60vh] min-h-[380px] w-full overflow-hidden">
        <img src={coverImage} alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.4)', animation: mounted ? 'article-fade-in 1s cubic-bezier(0.16,1,0.3,1) both' : 'none' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/60 via-transparent to-[#0D0D0D]/60" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <div style={{ animation: mounted ? 'article-content-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both' : 'none' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-mono font-black px-3 py-1.5 bg-[#E8191A] text-white uppercase tracking-widest">
                {item.category}
              </span>
              <span className="w-1.5 h-1.5 bg-[#E8191A] rounded-full animate-pulse" />
              <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Overtake // News</span>
            </div>
            <h1 className="font-display font-black uppercase text-white leading-[0.95] text-[clamp(32px,6.5vw,72px)]"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {item.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ─── Meta bar ─── */}
      <div className="relative border-y border-white/5 bg-[#141414]"
        style={{ animation: mounted ? 'article-content-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both' : 'none' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-white/40 text-sm font-mono">
            <Calendar size={14} className="text-[#E8191A]" /> {item.date}
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm font-mono">
            <User size={14} className="text-[#E8191A]" /> {article?.author || 'Overtake Staff'}
          </div>
          <a href={item.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-[#E8191A] text-sm font-mono ml-auto transition-colors">
            Original Post on X <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="relative max-w-3xl mx-auto px-6 py-16"
        style={{ animation: mounted ? 'article-content-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both' : 'none' }}>
        {loading ? (
          <p className="text-white/30 font-mono text-sm animate-pulse">Loading article...</p>
        ) : bodyParagraphs.length > 0 ? (
          <div className="space-y-6">
            {bodyParagraphs.map((p, i) => (
              <p key={i} className="text-white/60 text-lg leading-relaxed">{p}</p>
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-[#141414] p-8 text-center">
            <p className="text-white/50 text-base leading-relaxed mb-2">{item.excerpt}</p>
            <p className="text-white/25 text-sm font-mono mb-6">The full write-up for this one isn't posted yet — here's the original announcement.</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#E8191A] hover:bg-[#B81011] px-6 py-3 font-black tracking-widest uppercase text-sm transition-all text-white"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Read on X <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>

      {/* ─── More From Overtake ─── */}
      {otherItems.length > 0 && (
        <div className="relative border-t border-white/5 bg-[#141414] py-16">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-[#E8191A] text-xs font-mono tracking-widest uppercase mb-6">// More From Overtake</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherItems.map(o => (
                <Link key={o.id} href={`/news/${o.id}`}
                  onClick={e => {
                    e.preventDefault()
                    navigateWithTransition(() => router.push(`/news/${o.id}`))
                  }}
                  className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#E8191A]/30 overflow-hidden block transition-colors">
                  <div className="h-28 relative overflow-hidden">
                    <img src={o.image} alt={o.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ filter: 'brightness(0.4)' }} />
                  </div>
                  <div className="p-4">
                    <p className="text-white/30 text-[11px] font-mono mb-1">{o.date}</p>
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-[#E8191A] uppercase leading-tight transition-colors"
                      style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      {o.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-white/30 group-hover:text-white/60 transition-colors">
                      Read More <ChevronRight size={10} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
