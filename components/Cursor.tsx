'use client'

import { useEffect, useState } from 'react'

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      className="fixed pointer-events-none z-[9998]"
      style={{
        left: pos.x,
        top: pos.y,
        width: '200px',
        height: '200px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 55%, transparent 75%)',
        borderRadius: '50%',
        filter: 'blur(22px)',
        transition: 'left 0.12s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.12s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    />
  )
}
