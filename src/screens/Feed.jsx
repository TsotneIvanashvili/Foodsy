import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Heart, Bookmark, Share2, Clock, MapPin, Star, ChevronUp, Eye, Megaphone, Sparkles, Film, Camera } from 'lucide-react'
import { useStore, fmt } from '../store'
import { CATEGORIES, matchScore } from '../data'
import { Media, MatchRing, Cert, Stars, LangToggle, Img } from '../ui'

export default function Feed() {
  const { feed, t, L, stack, dishById } = useStore()
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
    }
  }

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
    setIdx(0)
  }, [cat])

  // desktop: one wheel gesture = one card, arrow keys
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
    drag.current = { y: e.clientY, top: ref.current.scrollTop, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dy = e.clientY - d.y
    if (Math.abs(dy) > 6) d.moved = true
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
    <div className="relative h-full w-full bg-black">
      <div
        ref={ref}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => (drag.current = null)}
        className="snap-feed no-scrollbar h-full w-full overflow-y-scroll select-none"
      >
        {cards.map((c, i) => (
          <FeedCard key={c.key} c={c} active={!paused && i === idx} near={Math.abs(i - idx) === 1} eager={i < 2} canClick={canClick} />
        ))}
      </div>

      {/* top bar */}
      <div className="shade-top pointer-events-none absolute inset-x-0 top-0 z-10 pb-6 pt-[calc(var(--safe-top)+4px)]">
        <div className="pointer-events-auto flex items-center justify-between px-4">
          <div className="text-[22px] font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#ff3d57] to-[#ff9a3d] bg-clip-text text-transparent">Foodsy</span>
          </div>
          <div className="flex items-center gap-1 text-[15px] font-extrabold">
            <span className="border-b-2 border-white pb-0.5">{t('forYou')}</span>
          </div>
          <LangToggle />
        </div>
        <div className="no-scrollbar pointer-events-auto mt-2.5 flex gap-1.5 overflow-x-auto px-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-bold backdrop-blur transition ${cat === c.id ? 'bg-white text-black' : 'bg-black/35 text-white/90'}`}
            >
              {c.emoji} {L(c.name)}
            </button>
          ))}
        </div>
      </div>

      {!touched && idx === 0 && !paused && (
        <button onClick={() => go(1)} className="anim-bounce-y absolute left-1/2 top-[46%] z-10 flex -translate-x-1/2 flex-col items-center rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-bold text-white/90 backdrop-blur">
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
    return <span className="rounded-full bg-green-500 px-2.5 py-1 text-[11.5px] font-extrabold text-white shadow-lg">{t('realOrder')}</span>
  return (
    <div className="flex flex-col items-start gap-1.5">
      {c.promo && (
        <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-extrabold text-black"><Megaphone size={12} /> {t('sponsored')}</span>
      )}
      {c.fresh && (
        <span className="flex items-center gap-1 rounded-full bg-sky-500 px-2.5 py-1 text-[11px] font-extrabold text-white"><Sparkles size={12} /> {t('newBadge')}</span>
      )}
      <span className="flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11.5px] font-bold text-white backdrop-blur">
        {c.kind === 'video' ? <Film size={13} /> : <Camera size={13} />}
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
    if (!canClick()) return
    fn()
  }
  const pip = c.kind === 'customer' ? { src: d.media[0].type === 'video' ? d.media[0].poster : d.media[0].src, label: t('restaurant') } : photos[0] ? { src: photos[0].photo, label: '✅ ' + t('reality') } : null

  return (
    <section className="snap-card relative h-full w-full cursor-pointer overflow-hidden" onClick={openReality}>
      <Media m={c.media} active={active} near={near} eager={eager} />
      <div className="shade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[64%]" />

      {/* label + match */}
      <div className="absolute left-3 right-3 top-[calc(var(--safe-top)+88px)] flex items-start justify-between">
        <Label c={c} />
        <div className="flex flex-col items-center gap-2">
          <button onClick={openReality} className="rounded-full active:scale-95">
            <MatchRing score={score} size={64} />
          </button>
          {pip && (
            <button onClick={openReality} className="relative h-[86px] w-[64px] overflow-hidden rounded-xl border-2 border-white/90 shadow-xl active:scale-95">
              <Img src={pip.src} className="h-full w-full object-cover" />
              <span className={`absolute inset-x-0 bottom-0 py-0.5 text-center text-[9px] font-extrabold ${c.kind === 'customer' ? 'bg-black/70' : 'bg-green-500'}`}>{pip.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* right rail */}
      <div className="absolute bottom-[132px] right-2.5 flex flex-col items-center gap-3.5">
        <RailBtn
          onClick={stop(() => { toggleLike(d.id); setPulse((p) => p + 1) })}
          label={(d.likes + (isLiked ? 1 : 0)).toLocaleString('en-US')}
          icon={<Heart key={pulse} size={26} className={isLiked ? 'anim-heart fill-[#ff3d57] text-[#ff3d57]' : ''} />}
        />
        <RailBtn onClick={stop(() => toggleSave(d.id))} label={t('save')} icon={<Bookmark size={25} className={isSaved ? 'fill-amber-400 text-amber-400' : ''} />} />
        <RailBtn
          onClick={stop(() => { navigator.clipboard?.writeText(`https://foodsy.ge/d/${d.id}`).catch(() => {}); showToast(t('linkCopied')) })}
          label={t('share')}
          icon={<Share2 size={24} />}
        />
      </div>

      {/* info */}
      <div className="absolute inset-x-0 bottom-0 px-3.5 pb-3">
        <div className="pr-16">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-white/90 text-shadow">
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black" style={{ background: r.color }}>{L(r.name)[0]}</span>
            <span className="truncate">{L(r.name)}</span>
            <Cert size={15} />
          </div>
          <h2 className="mt-1 text-[24px] font-black leading-[1.15] text-shadow">{L(d.name)}</h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-semibold text-white/85">
            <span className="flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" />{d.rating}</span>
            <span className="flex items-center gap-1"><Clock size={13} />{d.prep} {t('min')}</span>
            <span className="flex items-center gap-1"><MapPin size={13} />{r.distance} {t('km')}</span>
          </div>
          {c.kind === 'customer' && c.review && (
            <div className="mt-2.5 rounded-2xl bg-black/45 p-2.5 backdrop-blur">
              <div className="flex items-center gap-2 text-[12px] font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[11px] font-black">{L(c.review.author)[0]}</span>
                {L(c.review.author)}
                <Stars n={c.review.stars} size={11} />
              </div>
              {c.review.text && <div className="mt-1 text-[13px] leading-snug text-white/90">„{L(c.review.text)}“</div>}
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={openReality} className="flex h-[50px] items-center gap-1.5 rounded-2xl bg-white/15 px-3.5 text-[13px] font-extrabold backdrop-blur active:scale-95">
            <Eye size={17} />
            {t('reality')}
            <span className="rounded-full bg-green-500 px-1.5 text-[11px]">{photos.length}</span>
          </button>
          <button
            onClick={stop(() => addToCart(d.id))}
            className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-[15px] font-black shadow-lg shadow-[#ff3d57]/30 active:scale-[.97]"
          >
            {t('order')} · {fmt(d.price)}
          </button>
        </div>
      </div>
    </section>
  )
}

function RailBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 active:scale-90">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur">{icon}</span>
      <span className="text-[11px] font-bold text-shadow">{label}</span>
    </button>
  )
}
