import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, BadgeCheck, Star, ShoppingBag } from 'lucide-react'
import { useStore } from './store'

/* ---------- media ---------- */

export function Img({ src, className = '', alt = '', eager = false }) {
  const [err, setErr] = useState(false)
  useEffect(() => setErr(false), [src])
  if (err || !src) return <div className={`${className} flex items-center justify-center bg-soft text-2xl`}>🍽️</div>
  return <img src={src} alt={alt} draggable={false} loading={eager ? 'eager' : 'lazy'} onError={() => setErr(true)} className={className} />
}

// Full-bleed media: photo with Ken Burns, or video over its poster (falls back to the poster on error)
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
    } else v.pause()
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

export const still = (m) => (m.type === 'video' ? m.poster : m.thumb || m.src)

/* ---------- match score ---------- */

export function scoreColor(s) {
  if (s >= 85) return { ring: '#16a34a', text: 'text-ok', bg: 'bg-ok', soft: 'bg-ok-soft' }
  if (s >= 70) return { ring: '#d97706', text: 'text-warn', bg: 'bg-warn', soft: 'bg-warn-soft' }
  return { ring: '#dc2626', text: 'text-bad', bg: 'bg-bad', soft: 'bg-bad-soft' }
}

export function useAnimatedNumber(target, duration = 900, initial = target) {
  const [val, setVal] = useState(initial)
  const from = useRef(initial)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf
    const step = (now) => {
      const p = Math.min(1, Math.max(0, (now - start) / duration))
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

// dark = drawn over video; otherwise for white surfaces
export function MatchRing({ score, size = 56, stroke = 5, label = true, from, dark = false }) {
  const shown = useAnimatedNumber(score, from != null ? 1600 : 1, from ?? score)
  const c = scoreColor(shown)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={dark ? 'rgba(255,255,255,.22)' : '#eceef1'} strokeWidth={stroke} fill={dark ? 'rgba(0,0,0,.35)' : '#fff'} />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={c.ring} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - shown / 100)} />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center leading-none ${dark ? 'text-white' : 'text-ink'}`}>
        <span className="font-bold" style={{ fontSize: size * 0.27 }}>{shown}%</span>
        {label && <span className={`mt-0.5 font-semibold uppercase tracking-wide ${dark ? 'text-white/75' : 'text-muted'}`} style={{ fontSize: Math.max(8, size * 0.13) }}>Match</span>}
      </div>
    </div>
  )
}

export function MatchPill({ score, className = '' }) {
  const c = scoreColor(score)
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.soft} ${c.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.bg}`} />
      {score}% Match
    </span>
  )
}

export function Stars({ n, size = 12, className = '', dark }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= n ? 'fill-amber-400 text-amber-400' : dark ? 'text-white/25' : 'text-line'} />
      ))}
    </span>
  )
}

export function Cert({ size = 14 }) {
  return <BadgeCheck size={size} className="inline shrink-0 fill-info text-white" />
}

/* ---------- layout ---------- */

export function Header({ title, onBack, right, sub }) {
  const { pop } = useStore()
  return (
    <div className="relative z-20 flex shrink-0 items-center gap-2 border-b border-line bg-canvas px-3 pb-2.5 pt-[calc(var(--safe-top)+8px)]">
      <button onClick={onBack || pop} className="flex h-9 w-9 items-center justify-center rounded-full bg-soft text-ink active:scale-90" aria-label="back">
        <ChevronLeft size={21} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[16px] font-bold text-ink">{title}</div>
        {sub && <div className="truncate text-[12px] text-muted">{sub}</div>}
      </div>
      {right}
    </div>
  )
}

export function Sheet({ children, className = '' }) {
  return <div className={`anim-slide-up absolute inset-0 z-40 flex flex-col bg-canvas text-ink ${className}`}>{children}</div>
}

// Sticky bottom action area for sheets/screens
export function BottomBar({ children, className = '' }) {
  return <div className={`absolute inset-x-0 bottom-0 z-10 border-t border-line bg-canvas/95 px-4 pb-[calc(var(--safe-bottom)+12px)] pt-3 backdrop-blur ${className}`}>{children}</div>
}

export function SectionTitle({ children, right, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h3 className="text-[17px] font-bold text-ink">{children}</h3>
      {right}
    </div>
  )
}

export function Card({ children, className = '', ...rest }) {
  return <div className={`rounded-2xl border border-line bg-canvas ${className}`} {...rest}>{children}</div>
}

/* ---------- controls ---------- */

export function Btn({ children, onClick, className = '', variant = 'primary', disabled, size = 'md', ...rest }) {
  const v = {
    primary: 'bg-accent text-white hover:bg-accent-dark',
    secondary: 'bg-soft text-ink',
    outline: 'border border-line bg-canvas text-ink',
    dark: 'bg-ink text-white',
    ok: 'bg-ok text-white',
    info: 'bg-info text-white',
  }[variant]
  const s = { lg: 'h-[52px] text-[15px]', md: 'h-11 text-[14px]', sm: 'h-9 px-3 text-[13px]' }[size]
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[.98] disabled:opacity-40 disabled:active:scale-100 ${s} ${v} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Spinner({ light }) {
  return <span className={`spin h-5 w-5 rounded-full border-[2.5px] ${light ? 'border-white/30 border-t-white' : 'border-ink/15 border-t-ink'}`} />
}

export function Seg({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex rounded-xl bg-soft p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold transition ${value === o.value ? 'bg-canvas text-ink shadow-[0_1px_3px_rgba(16,24,40,.12)]' : 'text-muted'}`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Chip({ on, children, onClick, dark }) {
  const cls = dark
    ? on ? 'bg-white text-ink' : 'bg-black/30 text-white backdrop-blur'
    : on ? 'bg-ink text-white' : 'bg-soft text-ink'
  return (
    <button onClick={onClick} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${cls}`}>
      {children}
    </button>
  )
}

export function Field({ label, error, right, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>}
      <span className={`flex items-center rounded-xl border bg-canvas px-3.5 transition focus-within:border-ink ${error ? 'border-bad' : 'border-line'}`}>
        <input {...props} className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint" />
        {right}
      </span>
      {error && <span className="mt-1 block text-[12px] font-medium text-bad">{error}</span>}
    </label>
  )
}

export function LangToggle({ dark, className = '' }) {
  const { lang, setLang } = useStore()
  return (
    <button
      onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')}
      className={`flex h-8 items-center rounded-full p-0.5 text-[11px] font-bold ${dark ? 'bg-black/35 backdrop-blur' : 'bg-soft'} ${className}`}
      aria-label="language"
    >
      {['ka', 'en'].map((l) => (
        <span key={l} className={`rounded-full px-2 py-1 ${lang === l ? (dark ? 'bg-white text-ink' : 'bg-canvas text-ink shadow-sm') : dark ? 'text-white/75' : 'text-muted'}`}>
          {l === 'ka' ? 'ქა' : 'EN'}
        </span>
      ))}
    </button>
  )
}

// Icon-only cart button with item-count badge; hidden while the cart is empty
export function CartButton({ dark }) {
  const { cart, push, t } = useStore()
  const n = cart.items.reduce((s, i) => s + i.qty, 0)
  if (!n) return null
  return (
    <button
      key={n}
      onClick={() => push({ type: 'checkout' })}
      aria-label={t('cart')}
      className={`anim-pop relative flex h-8 w-8 items-center justify-center rounded-full active:scale-90 ${dark ? 'bg-black/35 text-white backdrop-blur' : 'bg-soft text-ink'}`}
    >
      <ShoppingBag size={17} />
      <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">{n}</span>
    </button>
  )
}

export function Logo({ className = '', dark }) {
  return <span className={`font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink'} ${className}`}>food<span className="text-accent">sy</span></span>
}

export function timeAgo(t, ms) {
  const m = Math.max(1, Math.round((Date.now() - ms) / 60000))
  return t('minsAgo', { n: m })
}
