@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-barlow: 'Barlow Condensed', sans-serif;
  --font-outfit: 'Outfit', sans-serif;
  --font-space-mono: 'Space Mono', monospace;

  /* Official Overtake Brand Colors */
  --obsidion-fog:    #0D0D0D;   /* 01 primary bg */
  --crimson-red:     #E8191A;   /* 02 primary accent */
  --crimson-dark:    #B81011;   /* 02 hover variant */
  --crimson-deep:    #8C0B0C;   /* 02 deep / watermark */
  --onyx-grey:       #1A1A1A;   /* 03 card surfaces */
  --onyx-mid:        #2A2A2A;   /* 03 mid surfaces */
  --onyx-border:     #333333;   /* 03 border lines */
  --lucent-white:    #F2F2F2;   /* 04 text & light */
  --lucent-dim:      #BFBFBF;   /* 04 muted */
  --lucent-faint:    #737373;   /* 04 very muted */

  /* Shorthand aliases */
  --red:      #E8191A;
  --red-glow: rgba(232, 25, 26, 0.3);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--obsidion-fog);
  color: var(--lucent-white);
  font-family: var(--font-outfit);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--obsidion-fog); }
::-webkit-scrollbar-thumb { background: var(--crimson-red); border-radius: 2px; }

/* Selection */
::selection { background: rgba(232, 25, 26, 0.3); color: #fff; }

.font-display { font-family: var(--font-barlow); }
.font-mono    { font-family: var(--font-space-mono); }

.text-gradient-red {
  background: linear-gradient(135deg, #FF3334 0%, #E8191A 50%, #B81011 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-white {
  background: linear-gradient(180deg, #F2F2F2 0%, rgba(242,242,242,0.55) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Grid background — subtler red tint matching Crimson Red */
.bg-grid {
  background-image:
    linear-gradient(rgba(232,25,26,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232,25,26,0.06) 1px, transparent 1px);
  background-size: 40px 40px;
}

.glow-red {
  box-shadow: 0 0 30px rgba(232,25,26,0.3), 0 0 60px rgba(232,25,26,0.1);
}

.glow-red-text {
  text-shadow: 0 0 20px rgba(232,25,26,0.5);
}

.border-glow {
  border: 1px solid rgba(232,25,26,0.3);
  box-shadow: 0 0 20px rgba(232,25,26,0.1), inset 0 0 20px rgba(232,25,26,0.05);
}

.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(232,25,26,0.15);
}

.clip-diagonal {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
}
.clip-corner {
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
}
.clip-hero {
  clip-path: polygon(0 0, 100% 0, 100% 90%, 80% 100%, 0 100%);
}

/* Nav link underline */
.nav-link {
  position: relative;
  overflow: hidden;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--crimson-red);
  transition: width 0.3s ease;
}
.nav-link:hover::after,
.nav-link.active::after { width: 100%; }

/* Inputs */
.input-dark {
  background: rgba(242,242,242,0.03);
  border: 1px solid rgba(242,242,242,0.08);
  color: var(--lucent-white);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-dark:focus {
  outline: none;
  border-color: rgba(232,25,26,0.5);
  box-shadow: 0 0 0 3px rgba(232,25,26,0.1);
}
.input-dark::placeholder { color: rgba(242,242,242,0.22); }

/* Stagger delays */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
.stagger-6 { animation-delay: 0.6s; }
