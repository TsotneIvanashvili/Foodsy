import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, BadgeCheck, Star } from 'lucide-react'
import { useStore } from './store'

export function Img({ src, className = '', alt = '', eager = false }) {
  const [err, setErr] = useState(false)
  useEffect(() => setErr(false), [src])
  if (err || !src)
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-3xl`}>🍽️</div>
    )
  return <img src={src} alt={alt} draggable={false} loading={eager ? 'eager' : 'lazy'} onError={() => setErr(true)} className={className} />
}

// Full-bleed media: photo with Ken Burns, or video over a Ken Burns poster (falls back to poster on error)
export function Media({ m, active = true, near = false, kb = true, eager = false }) {
  const [vidErr, setVidErr] = useState(false)
  const [playing, setPlaying] = useState(false)
  const vref = useRef(null)
  const isVideo = m.type === 'video' && !vidErr
  const still = m.type === 'video' ? m.poster : m.src

  useEffect(() => {
    const v = vref.current
    if (!v) return
    if (active) {
      const p = v.play()
      if (p && p.catch) p.catch(() => {})
    } else {
      v.pause()
    }
  }, [active, isVideo])

  useEffect(() => { if (!active) setPlaying(false) }, [active])

  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-900">
      {still && <Img src={still} eager={eager} className={`h-full w-full object-cover ${kb ? 'kenburns' : ''} ${active ? '' : 'paused'}`} />}
      {isVideo && (active || near) && (
        <video
          ref={vref}
          src={m.src}
          muted
          loop
          playsInline
          autoPlay={active}
          preload={active ? 'auto' : 'metadata'}
          onPlaying={() => setPlaying(true)}
          onError={() => setVidErr(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing && active ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}

export function scoreColor(s) {
  if (s >= 85) return { ring: '#22c55e', text: 'text-green-400', bg: 'bg-green-500', soft: 'bg-green-500/15' }
  if (s >= 70) return { ring: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500', soft: 'bg-amber-500/15' }
  return { ring: '#ef4444', text: 'text-red-400', bg: 'bg-red-500', soft: 'bg-red-500/15' }
}

export function useAnimatedNumber(target, duration = 900, initial = target) {
  const [val, setVal] = useState(initial)
  const from = useRef(initial)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(a + (target - a) * e))
      if (p < 1) raf = requestAnimationFrame(step)
      else from.current = target
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

export function MatchRing({ score, size = 56, stroke = 5, label = true, from, dark = true }) {
  const shown = useAnimatedNumber(score, from != null ? 1600 : 1, from ?? score)
  const c = scoreColor(shown)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.1)'} strokeWidth={stroke} fill={dark ? 'rgba(0,0,0,.45)' : 'none'} />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={c.ring} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - shown / 100)} style={{ transition: 'stroke 0.4s' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-black text-white" style={{ fontSize: size * 0.27 }}>{shown}%</span>
        {label && <span className="mt-0.5 font-bold uppercase tracking-wide text-white/75" style={{ fontSize: Math.max(8, size * 0.14) }}>Match</span>}
      </div>
    </div>
  )
}

export function MatchPill({ score, className = '' }) {
  const c = scoreColor(score)
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${c.soft} ${c.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.bg}`} />
      {score}% Match
    </span>
  )
}

export function Stars({ n, size = 12, className = '' }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= n ? 'fill-amber-400 text-amber-400' : 'text-white/25'} />
      ))}
    </span>
  )
}

export function Cert({ size = 14 }) {
  return <BadgeCheck size={size} className="inline shrink-0 fill-sky-500 text-white" />
}

export function Header({ title, onBack, right, transparent = false, sub }) {
  const { pop } = useStore()
  return (
    <div className={`relative z-20 flex shrink-0 items-center gap-2 px-3 pb-2 pt-[calc(var(--safe-top)+6px)] ${transparent ? '' : 'border-b border-white/5 bg-[#0b0b0f]/95 backdrop-blur'}`}>
      <button onClick={onBack || pop} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 active:scale-90" aria-label="back">
        <ChevronLeft size={22} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[17px] font-extrabold">{title}</div>
        {sub && <div className="truncate text-xs text-white/50">{sub}</div>}
      </div>
      {right}
    </div>
  )
}

export function Btn({ children, onClick, className = '', variant = 'brand', disabled, big }) {
  const v = {
    brand: 'bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-white shadow-lg shadow-[#ff3d57]/30',
    white: 'bg-white text-black',
    ghost: 'bg-white/10 text-white',
    green: 'bg-green-500 text-white shadow-lg shadow-green-500/25',
    dark: 'bg-neutral-800 text-white',
  }[variant]
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl font-extrabold transition active:scale-[.97] disabled:opacity-40 disabled:active:scale-100 ${big ? 'h-14 text-[16px]' : 'h-11 text-sm'} ${v} ${className}`}
    >
      {children}
    </button>
  )
}

export function Seg({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex rounded-2xl bg-white/[.07] p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-bold transition ${value === o.value ? 'bg-white text-black shadow' : 'text-white/70'}`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function LangToggle({ className = '' }) {
  const { lang, setLang } = useStore()
  return (
    <button
      onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')}
      className={`flex h-8 items-center rounded-full bg-black/40 p-0.5 text-[11px] font-extrabold backdrop-blur ${className}`}
      aria-label="language"
    >
      <span className={`rounded-full px-2 py-1 ${lang === 'ka' ? 'bg-white text-black' : 'text-white/70'}`}>ქა</span>
      <span className={`rounded-full px-2 py-1 ${lang === 'en' ? 'bg-white text-black' : 'text-white/70'}`}>EN</span>
    </button>
  )
}

export function Sheet({ children, className = '' }) {
  return <div className={`anim-slide-up absolute inset-0 z-40 flex flex-col bg-[#0b0b0f] ${className}`}>{children}</div>
}

export function timeAgo(t, ms) {
  const m = Math.max(1, Math.round((Date.now() - ms) / 60000))
  return t('minsAgo', { n: m })
}
