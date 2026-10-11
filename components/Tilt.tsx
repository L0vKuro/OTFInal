'use client'

import { useRef, type HTMLAttributes, type ReactNode, type CSSProperties, type PointerEvent as RPointerEvent } from 'react'

type TiltProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode
  /** Max tilt in degrees on each axis. */
  max?: number
  /** Scale applied while hovered. */
  scale?: number
  /** Cursor-following light sheen over the surface. */
  sheen?: boolean
  /** Brand-red/gold holographic foil layer that shifts with the cursor. */
  foil?: boolean
  /** Make the tilting layer fill the wrapper's height (good for grid cards). */
  fill?: boolean
  innerClassName?: string
  innerStyle?: CSSProperties
}

// One shared hover-tilt for the whole site. The wrapper never moves (so the
// pointer hit-area stays stable and doesn't flicker at card edges); only the
// inner layer rotates. Values are written straight to CSS variables instead of
// React state, so tilting never re-renders anything. Disabled on touch devices
// and when the visitor prefers reduced motion.
export default function Tilt({
  children,
  max = 7,
  scale = 1.02,
  sheen = true,
  foil = false,
  fill = true,
  className = '',
  innerClassName = '',
  innerStyle,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...rest
}: TiltProps) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const pt = useRef({ x: 0, y: 0 })
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enabled = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const apply = () => {
    raf.current = 0
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const r = o.getBoundingClientRect()
    if (!r.width || !r.height) return
    const nx = Math.min(1, Math.max(0, (pt.current.x - r.left) / r.width))
    const ny = Math.min(1, Math.max(0, (pt.current.y - r.top) / r.height))
    i.style.setProperty('--ry', `${((nx - 0.5) * 2 * max).toFixed(2)}deg`)
    i.style.setProperty('--rx', `${((0.5 - ny) * 2 * max).toFixed(2)}deg`)
    i.style.setProperty('--mx', `${(nx * 100).toFixed(1)}%`)
    i.style.setProperty('--my', `${(ny * 100).toFixed(1)}%`)
    i.style.setProperty('--mxn', nx.toFixed(3))
    i.style.setProperty('--myn', ny.toFixed(3))
  }

  const handleEnter = (e: RPointerEvent<HTMLDivElement>) => {
    onPointerEnter?.(e)
    if (e.pointerType !== 'mouse' || !enabled()) return
    const i = inner.current
    if (!i) return
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    i.style.setProperty('--ts', String(scale))
    i.setAttribute('data-tilt', 'on')
    pt.current = { x: e.clientX, y: e.clientY }
    apply()
  }

  const handleMove = (e: RPointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e)
    if (e.pointerType !== 'mouse' || !enabled()) return
    pt.current = { x: e.clientX, y: e.clientY }
    if (!raf.current) raf.current = requestAnimationFrame(apply)
  }

  const handleLeave = (e: RPointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e)
    const i = inner.current
    if (!i || i.getAttribute('data-tilt') !== 'on') return
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = 0 }
    i.style.setProperty('--rx', '0deg')
    i.style.setProperty('--ry', '0deg')
    i.style.setProperty('--ts', '1')
    i.setAttribute('data-tilt', 'out')
    // Once the ease-back finishes, drop the transform entirely so the card
    // isn't left as a permanent transformed/containing-block element.
    leaveTimer.current = setTimeout(() => {
      if (i.getAttribute('data-tilt') === 'out') i.removeAttribute('data-tilt')
    }, 700)
  }

  return (
    <div
      ref={outer}
      className={`tilt-outer ${fill ? 'h-full' : ''} ${className}`}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}>
      <div ref={inner} className={`tilt-inner ${fill ? 'h-full' : ''} ${innerClassName}`} style={innerStyle}>
        {children}
        {foil && <div className="tilt-foil" aria-hidden />}
        {sheen && <div className="tilt-sheen" aria-hidden />}
      </div>
    </div>
  )
}
