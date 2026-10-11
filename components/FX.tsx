'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Site-wide atmosphere, mounted once in the root layout:
//  - film grain + vignette (grain pauses when idle, hidden on touch devices)
//  - thin red scroll-progress bar
//  - red wipe on every route change
// Everything is pointer-events:none and honours prefers-reduced-motion
// (see the .fx-* rules in globals.css).
export default function FX() {
  const pathname = usePathname()
  const bar = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  const [wipe, setWipe] = useState<number | null>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0
      bar.current?.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pathname])

  // Pause the grain animation when the visitor goes idle.
  useEffect(() => {
    const root = document.documentElement
    let t: ReturnType<typeof setTimeout>
    const wake = () => {
      root.removeAttribute('data-idle')
      clearTimeout(t)
      t = setTimeout(() => root.setAttribute('data-idle', '1'), 5000)
    }
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'pointerdown'] as const
    events.forEach(ev => window.addEventListener(ev, wake, { passive: true }))
    wake()
    return () => {
      events.forEach(ev => window.removeEventListener(ev, wake))
      clearTimeout(t)
      root.removeAttribute('data-idle')
    }
  }, [])

  // Layout effect so the wipe is in place before the new page ever paints.
  useIsoLayoutEffect(() => {
    if (first.current) { first.current = false; return }
    setWipe(w => (w ?? 0) + 1)
  }, [pathname])

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <div ref={bar} className="fx-progress" aria-hidden />
      <div className="fx-vignette" aria-hidden />
      <div className="fx-grain" aria-hidden />
      {wipe !== null && (
        <div key={wipe} className="fx-wipe" aria-hidden onAnimationEnd={() => setWipe(null)} />
      )}
    </>
  )
}
