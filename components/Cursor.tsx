'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const current = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', move)

    const animate = () => {
      current.current.x += (pos.current.x - current.current.x) * 0.08
      current.current.y += (pos.current.y - current.current.y) * 0.08

      if (cursorRef.current) {
        cursorRef.current.style.left = `${current.current.x}px`
        cursorRef.current.style.top = `${current.current.y}px`
      }
      requestAnimationFrame(animate)
    }
    animate()

    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9998]"
      style={{
        width: '200px',
        height: '200px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 55%, transparent 75%)',
        borderRadius: '50%',
        filter: 'blur(22px)',
      }}
    />
  )
}
