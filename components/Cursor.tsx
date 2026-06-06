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
    <>
      {/* Large faded cloud */}
      <div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: pos.x,
          top: pos.y,
          width: '300px',
          height: '300px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 75%)',
          borderRadius: '50%',
          filter: 'blur(18px)',
          transition: 'left 0.08s ease, top 0.08s ease',
        }}
      />
      {/* Small center dot */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: pos.x,
          top: pos.y,
          width: '8px',
          height: '8px',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.6)',
          borderRadius: '50%',
        }}
      />
    </>
  )
}
