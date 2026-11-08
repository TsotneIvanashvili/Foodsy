import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Heart, Bookmark, Share2, Clock, MapPin, Star, ChevronUp, Eye, Megaphone, Sparkles, Play, Camera } from 'lucide-react'
import { useStore, fmt } from '../store'
import { CATEGORIES, matchScore } from '../data'
import { Media, MatchRing, Cert, Stars, LangToggle, Img, CartButton, Chip, Logo, still } from '../ui'

export default function Feed() {
  const { feed, t, L, stack, dishById, onboard, tourSignal } = useStore()
  const [cat, setCat] = useState('all')
  const [idx, setIdx] = useState(0)
  const [touched, setTouched] = useState(false)
  const ref = useRef(null)
  const lock = useRef(0)
  const drag = useRef(null)
  const suppress = useRef(0)
  const paused = stack.length > 0

  const cards = useMemo(() => (cat === 'all' ? feed : feed.filter((c) => dishById(c.dishId).cat === cat)), [feed, cat, dishById])

  const go = useCallback(
    (i) => {
      const el = ref.current
      if (!el) return
      const n = Math.max(0, Math.min(cards.length - 1, i))
      el.scrollTo({ top: n * el.clientHeight, behavior: 'smooth' })
    },
    [cards.length],
  )

  const onScroll = () => {
    const el = ref.current
    const i = Math.round(el.scrollTop / el.clientHeight)
    if (i !== idx) {
      setIdx(i)
      setTouched(true)
      tourSignal('swipe')
    }
  }

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
    setIdx(0)
  }, [cat])

  // desktop: one wheel gesture = one card
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lock.current < 650 || Math.abs(e.deltaY) < 8) return
      lock.current = now
      const cur = Math.round(el.scrollTop / el.clientHeight)
      go(cur + (e.deltaY > 0 ? 1 : -1))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [go])

  // desktop: ↑/↓ keys
  useEffect(() => {
    if (paused) return
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowDown') { e.preventDefault(); go(idx + 1) }
      if (e.key === 'ArrowUp') { e.preventDefault(); go(idx - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, go, paused])

  // desktop: mouse drag to swipe
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { y: e.clientY, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (d && Math.abs(e.clientY - d.y) > 6) d.moved = true
  }
  const onPointerUp = (e) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const dy = e.clientY - d.y
    if (Math.abs(dy) > 35) {
      suppress.current = Date.now()
      go(idx + (dy < 0 ? 1 : -1))
    } else if (d.moved) suppress.current = Date.now()
  }
  const canClick = () => Date.now() - suppress.current > 250

  return (
    <div className="relative h-full w-full bg-black text-white">
      <div
        ref={ref}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => (drag.current = null)}
        className="snap-feed no-scrollbar h-full w-full select-none overflow-y-scroll"
      >
        {cards.map((c, i) => (
          <FeedCard key={c.key} c={c} active={!paused && i === idx} near={Math.abs(i - idx) === 1} eager={i < 2} canClick={canClick} />
        ))}
      </div>

      {/* top bar */}
      <div className="shade-top pointer-events-none absolute inset-x-0 top-0 z-10 pb-8 pt-[calc(var(--safe-top)+6px)]">
        <div className="pointer-events-auto flex h-9 items-center justify-between px-4">
          <Logo dark className="text-[24px]" />
          <div className="flex items-center gap-2">
            <CartButton dark />
            <LangToggle dark />
          </div>
        </div>
        <div data-tour="cats" className="no-scrollbar pointer-events-auto mt-2.5 flex gap-1.5 overflow-x-auto px-4">
          {CATEGORIES.map((c) => (
            <Chip key={c.id} dark on={cat === c.id} onClick={() => setCat(c.id)}>
              {L(c.name)}
            </Chip>
          ))}
        </div>
      </div>

      {!touched && idx === 0 && !paused && !onboard && (
        <button onClick={() => go(1)} className="anim-bounce-y absolute left-1/2 top-[44%] z-10 flex -translate-x-1/2 flex-col items-center rounded-full bg-black/30 px-3 py-1.5 text-[11.5px] font-medium text-white/90 backdrop-blur">
          <ChevronUp size={18} />
          {t('swipeHint')}
        </button>
      )}
    </div>
  )
}

function Label({ c }) {
  const { t } = useStore()
  if (c.kind === 'customer')
    return <span className="rounded-full bg-ok px-2.5 py-1 text-[11.5px] font-semibold text-white">{t('realOrder')}</span>
  return (
    <div className="flex flex-col items-start gap-1.5">
      {c.promo && <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-semibold text-ink"><Megaphone size={12} /> {t('sponsored')}</span>}
      {c.fresh && <span className="flex items-center gap-1 rounded-full bg-info px-2.5 py-1 text-[11px] font-semibold text-white"><Sparkles size={12} /> {t('newBadge')}</span>}
      <span className="flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-[11.5px] font-medium text-white backdrop-blur">
        {c.kind === 'video' ? <Play size={11} className="fill-white" /> : <Camera size={12} />}
        {c.kind === 'video' ? t('restaurantVideo') : t('restaurantPhoto')}
      </span>
    </div>
  )
}

function FeedCard({ c, active, near, eager, canClick }) {
  const { dishById, restById, L, t, liked, toggleLike, saved, toggleSave, push, addToCart, showToast } = useStore()
  const d = dishById(c.dishId)
  const r = restById(d.r)
  const score = matchScore(d.reviews)
  const photos = d.reviews.filter((x) => x.photo)
  const isLiked = liked.has(d.id)
  const isSaved = saved.has(d.id)
  const [pulse, setPulse] = useState(0)

  const openReality = (e) => {
    e?.stopPropagation()
    if (!canClick()) return
    push({ type: 'reality', dishId: d.id })
  }
  const stop = (fn) => (e) => {
    e.stopPropagation()
    if (canClick()) fn()
  }
  const pip = c.kind === 'customer' ? { src: still(d.media[0]), label: t('restaurant') } : photos[0] ? { src: photos[0].photo, label: t('reality') } : null

  return (
    <section className="snap-card relative h-full w-full cursor-pointer overflow-hidden" onClick={openReality}>
      <Media m={c.media} active={active} near={near} eager={eager} />
      <div className="shade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[60%]" />

      {/* label + match */}
      <div className="absolute left-4 right-3 top-[calc(var(--safe-top)+92px)] flex items-start justify-between">
        <Label c={c} />
        <div className="flex flex-col items-center gap-2">
          <button data-tour="match" onClick={openReality} className="rounded-full active:scale-95">
            <MatchRing score={score} size={60} stroke={5} dark />
          </button>
          {pip && (
            <button onClick={openReality} className="relative h-[80px] w-[60px] overflow-hidden rounded-xl ring-2 ring-white/90 active:scale-95">
              <Img src={pip.src} className="h-full w-full object-cover" />
              <span className={`absolute inset-x-0 bottom-0 py-0.5 text-center text-[9px] font-semibold ${c.kind === 'customer' ? 'bg-black/70' : 'bg-ok'}`}>{pip.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* right rail */}
      <div className="absolute bottom-[136px] right-3 flex flex-col items-center gap-4 text-shadow">
        <RailBtn
          onClick={stop(() => { toggleLike(d.id); setPulse((p) => p + 1) })}
          label={(d.likes + (isLiked ? 1 : 0)).toLocaleString('en-US')}
          icon={<Heart key={pulse} size={27} strokeWidth={1.8} className={isLiked ? 'anim-heart fill-accent text-accent' : ''} />}
        />
        <RailBtn onClick={stop(() => toggleSave(d.id))} label={t('save')} icon={<Bookmark size={26} strokeWidth={1.8} className={isSaved ? 'fill-amber-400 text-amber-400' : ''} />} />
        <RailBtn
          onClick={stop(() => { navigator.clipboard?.writeText(`https://foodsy.ge/d/${d.id}`).catch(() => {}); showToast(t('linkCopied')) })}
          label={t('share')}
          icon={<Share2 size={25} strokeWidth={1.8} />}
        />
      </div>

      {/* info + actions */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-3.5">
        <div data-tour="dish" className="pr-16">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-white/85">
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: r.color }}>{L(r.name)[0]}</span>
            <span className="truncate">{L(r.name)}</span>
            <Cert size={14} />
          </div>
          <h2 className="mt-1 text-[23px] font-bold leading-[1.2]">{L(d.name)}</h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-white/80">
            <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" />{d.rating}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{d.prep} {t('min')}</span>
            <span className="flex items-center gap-1"><MapPin size={12} />{r.distance} {t('km')}</span>
          </div>
          {c.kind === 'customer' && c.review && (
            <div className="mt-2.5 rounded-2xl bg-black/35 p-2.5 backdrop-blur">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ok text-[11px] font-bold">{L(c.review.author)[0]}</span>
                {L(c.review.author)}
                <Stars n={c.review.stars} size={11} dark />
              </div>
              {c.review.text && <div className="mt-1 text-[13px] leading-snug text-white/90">„{L(c.review.text)}“</div>}
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            data-tour="reality"
            onClick={openReality}
            className="flex h-[52px] items-center gap-1.5 rounded-xl bg-white/15 px-3.5 text-[13.5px] font-semibold backdrop-blur active:scale-95"
          >
            <Eye size={17} />
            {t('reality')}
            <span className="rounded-full bg-ok px-1.5 text-[11px] font-bold">{photos.length}</span>
          </button>
          <button
            data-tour="order"
            onClick={stop(() => addToCart(d.id))}
            className="flex h-[52px] flex-1 items-center justify-between rounded-xl bg-accent px-4 text-[15px] font-semibold shadow-lg shadow-black/20 active:scale-[.98]"
          >
            <span>{t('order')}</span>
            <span className="font-bold">{fmt(d.price)}</span>
          </button>
        </div>
      </div>
    </section>
  )
}

function RailBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 active:scale-90">
      {icon}
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  )
}
