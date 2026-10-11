'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

// Fades/rises its children in the first time they scroll into view. Uses the
// same easing curve as everything else on the site. Content is always shown if
// IntersectionObserver is unavailable or the visitor prefers reduced motion.
export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    )
    io.observe(el)
    // Safety net: never leave content hidden if the observer never fires.
    const t = setTimeout(() => setShown(true), 2500)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])

  return (
    <div
      ref={ref}
      className={`fx-reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}>
      {children}
    </div>
  )
}
