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
      className="fixed pointer-events-none z-[9999] rounded-full"
      style={{
        left: pos.x,
        top: pos.y,
        width: '32px',
        height: '32px',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(2px)',
      }}
    />
  )
}
