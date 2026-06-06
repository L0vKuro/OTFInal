interface OvertakeLogoProps {
  size?: number
  className?: string
}

/**
 * Official Overtake crosshair logo mark.
 * Crosshair circle (4 arcs, gaps at diagonals) + directional ticks + red 4-point star.
 */
export default function OvertakeLogo({ size = 36, className = '' }: OvertakeLogoProps) {
  const id = `sg-${size}` // unique gradient id per size instance
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#FF3334" />
          <stop offset="100%" stopColor="#8C0B0C" />
        </radialGradient>
      </defs>

      {/*
        4 arc segments forming a broken circle.
        Radius 33, center 50,50, stroke 12.
        Gaps fall at the 4 diagonal corners (NE, SE, SW, NW ~45°).
        Each arc spans ~80° of the 90° quadrant.
      */}

      {/* Top arc (NW→NE: roughly 315°→45°) */}
      <path
        d="M 26.7 26.7 A 33 33 0 0 1 73.3 26.7"
        stroke="#F2F2F2"
        strokeWidth="12"
        strokeLinecap="square"
        fill="none"
      />
      {/* Right arc (NE→SE) */}
      <path
        d="M 73.3 26.7 A 33 33 0 0 1 73.3 73.3"
        stroke="#F2F2F2"
        strokeWidth="12"
        strokeLinecap="square"
        fill="none"
      />
      {/* Bottom arc (SE→SW) */}
      <path
        d="M 73.3 73.3 A 33 33 0 0 1 26.7 73.3"
        stroke="#F2F2F2"
        strokeWidth="12"
        strokeLinecap="square"
        fill="none"
      />
      {/* Left arc (SW→NW) */}
      <path
        d="M 26.7 73.3 A 33 33 0 0 1 26.7 26.7"
        stroke="#F2F2F2"
        strokeWidth="12"
        strokeLinecap="square"
        fill="none"
      />

      {/*
        Directional tick marks at N / E / S / W.
        Trapezoid shape: wider at the outer tip, narrower at the circle edge —
        creates the arrow/wedge look from the actual logo.
      */}

      {/* Top tick ↑ */}
      <polygon points="44,4 56,4 53,24 47,24" fill="#F2F2F2" />
      {/* Bottom tick ↓ */}
      <polygon points="44,96 56,96 53,76 47,76" fill="#F2F2F2" />
      {/* Left tick ← */}
      <polygon points="4,44 4,56 24,53 24,47" fill="#F2F2F2" />
      {/* Right tick → */}
      <polygon points="96,44 96,56 76,53 76,47" fill="#F2F2F2" />

      {/* 4-point star — Crimson Red gradient */}
      <path
        d="M50 37 L53.2 46.8 L63 50 L53.2 53.2 L50 63 L46.8 53.2 L37 50 L46.8 46.8 Z"
        fill={`url(#${id})`}
      />
    </svg>
  )
}
