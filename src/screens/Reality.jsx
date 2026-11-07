import { useEffect, useState } from 'react'
import { ShieldCheck, Film, Camera, Clock, MapPin, TrendingUp, TrendingDown, Sparkles, Info } from 'lucide-react'
import { useStore, fmt } from '../store'
import { matchScore } from '../data'
import { Header, Media, MatchRing, Stars, Cert, Img, Sheet } from '../ui'

export default function Reality({ dishId, fromScore, isTop }) {
  const { dishById, restById, L, t, addToCart } = useStore()
  const d = dishById(dishId)
  const r = restById(d.r)
  const score = matchScore(d.reviews)
  const photos = d.reviews.filter((x) => x.photo)
  const [sel, setSel] = useState(0)
  const [mediaIdx, setMediaIdx] = useState(0)
  const [ringScore, setRingScore] = useState(fromScore ?? score)

  useEffect(() => {
    if (fromScore == null) { setRingScore(score); return }
    const tm = setTimeout(() => setRingScore(score), 700)
    return () => clearTimeout(tm)
  }, [score, fromScore])

  // auto-cycle customer photos (unless just added one)
  useEffect(() => {
    if (fromScore != null || photos.length < 2) return
    const i = setInterval(() => setSel((s) => (s + 1) % photos.length), 2800)
    return () => clearInterval(i)
  }, [photos.length, fromScore])

  const counts = { yes: 0, partly: 0, no: 0 }
  d.reviews.forEach((x) => counts[x.match]++)
  const total = d.reviews.length
  const m = d.media[mediaIdx] || d.media[0]
  const cur = photos[sel] || photos[0]
  const delta = fromScore != null ? score - fromScore : 0

  return (
    <Sheet>
      <Header title={`${t('realityTitle')} · ${L(d.name)}`} sub={<span className="flex items-center gap-1">{L(r.name)} <Cert size={12} /></span>} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-28">
        {/* side by side */}
        <div className="relative grid grid-cols-2 gap-1.5 px-3 pt-3">
          <div>
            <div className="mb-1.5 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-white/60">
              {m.type === 'video' ? <Film size={12} /> : <Camera size={12} />} {t('adSide')}
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900">
              <Media m={m} active={isTop} />
              <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold backdrop-blur">
                {m.type === 'video' ? t('restaurantVideo') : t('restaurantPhoto')}
              </span>
            </div>
            {d.media.length > 1 && (
              <div className="mt-1.5 flex gap-1">
                {d.media.map((x, i) => (
                  <button key={i} onClick={() => setMediaIdx(i)} className={`h-11 w-11 overflow-hidden rounded-lg border-2 ${i === mediaIdx ? 'border-white' : 'border-transparent opacity-60'}`}>
                    <Img src={x.type === 'video' ? x.poster : x.src} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-green-400">
              <ShieldCheck size={12} /> {t('realSide')}
            </div>
            <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 ${cur?.isNew ? 'anim-glow' : ''}`}>
              {cur && <Img key={cur.id} src={cur.photo} className="anim-fade h-full w-full object-cover" />}
              <span className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-extrabold">✅ {t('verifiedOrder')}</span>
              {cur && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 pt-6">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="truncate">{L(cur.author)}</span>
                    <AnswerChip a={cur.match} small />
                  </div>
                </div>
              )}
              {cur?.isNew && <span className="anim-pop absolute bottom-9 left-2 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-extrabold">✨ {t('newBadge')}</span>}
            </div>
            <div className="no-scrollbar mt-1.5 flex gap-1 overflow-x-auto">
              {photos.map((x, i) => (
                <button key={x.id} onClick={() => setSel(i)} className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 ${i === sel ? 'border-green-400' : 'border-transparent opacity-60'}`}>
                  <Img src={x.photo} className="h-full w-full object-cover" />
                  {x.isNew && <span className="absolute inset-x-0 bottom-0 bg-sky-500 text-[8px] font-black">{t('newBadge')}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-[calc(50%-8px)] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#0b0b0f] bg-white text-[12px] font-black text-black">VS</div>
        </div>

        {/* match score card */}
        {fromScore != null && (
          <div className="anim-pop mx-3 mt-4 flex items-center gap-2 rounded-2xl bg-sky-500/15 px-3 py-2.5 text-[13px] font-bold text-sky-300">
            <Sparkles size={16} />
            {t('scoreUpdated')}: {fromScore}% → {score}%
            {delta !== 0 && (delta > 0 ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />)}
          </div>
        )}
        <div className="mx-3 mt-3 rounded-3xl bg-white/[.06] p-4">
          <div className="flex items-center gap-4">
            <MatchRing score={ringScore} from={fromScore} size={92} stroke={8} />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-bold uppercase tracking-wide text-white/50">{t('matchScore')}</div>
              <div className="mt-0.5 text-[15px] font-extrabold leading-snug">{t('matchExplain', { t: total, y: counts.yes })}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {['yes', 'partly', 'no'].map((k) => (
              <div key={k} className="flex items-center gap-2 text-[12px] font-bold">
                <span className="w-[86px] shrink-0 text-white/70">{t(`ans_${k}`)}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full transition-all duration-1000 ${k === 'yes' ? 'bg-green-500' : k === 'partly' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${(counts[k] / total) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-white/70">{counts[k]}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-1.5 text-[11px] leading-snug text-white/45">
            <Info size={13} className="mt-px shrink-0" /> {t('howCalc')}
          </div>
        </div>

        <div className="mx-3 mt-3 flex items-center gap-2 rounded-2xl bg-green-500/10 px-3 py-2.5 text-[12px] font-semibold text-green-300">
          <ShieldCheck size={16} className="shrink-0" /> {t('onlyVerified')}
        </div>

        {/* dish info */}
        <div className="mx-3 mt-4 flex items-center gap-3 text-[12.5px] font-semibold text-white/70">
          <span className="flex items-center gap-1"><Clock size={13} /> {d.prep} {t('min')}</span>
          <span className="flex items-center gap-1"><MapPin size={13} /> {r.distance} {t('km')}</span>
          <span className="flex items-center gap-1">⭐ {d.rating}</span>
        </div>
        <div className="mx-3 mt-1 text-[13px] text-white/50">{L(d.desc)}</div>

        {/* photos grid */}
        <div className="mx-3 mt-5 text-[15px] font-extrabold">{t('customerPhotos')} · {photos.length}</div>
        <div className="mx-3 mt-2 grid grid-cols-3 gap-1.5">
          {photos.map((x, i) => (
            <button key={x.id} onClick={() => setSel(i)} className={`relative aspect-square overflow-hidden rounded-xl ${x.isNew ? 'anim-glow' : ''}`}>
              <Img src={x.photo} className="h-full w-full object-cover" />
              <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-1.5 text-[9px] font-bold">✅</span>
              {x.isNew && <span className="absolute right-1 top-1 rounded-full bg-sky-500 px-1.5 text-[9px] font-extrabold">{t('newBadge')}</span>}
            </button>
          ))}
        </div>

        {/* reviews */}
        <div className="mx-3 mt-5 text-[15px] font-extrabold">{t('reviews')} · {total}</div>
        <div className="mx-3 mt-2 space-y-2">
          {d.reviews.map((x) => (
            <div key={x.id} className={`rounded-2xl bg-white/[.05] p-3 ${x.isNew ? 'anim-glow ring-1 ring-sky-400/50' : ''}`}>
              <div className="flex items-center gap-2">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-black ${x.mine ? 'bg-sky-500' : 'bg-white/15'}`}>{L(x.author)[0]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold">
                    {L(x.author)}
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-400"><ShieldCheck size={11} /> {t('verifiedOrder')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-white/45">
                    <Stars n={x.stars} size={10} />
                    {x.daysAgo === 0 ? t('justNow') : t('daysAgo', { n: x.daysAgo })}
                  </div>
                </div>
                <AnswerChip a={x.match} />
              </div>
              {(x.text || x.photo) && (
                <div className="mt-2 flex gap-2.5">
                  {x.text && <div className="flex-1 text-[13px] leading-snug text-white/85">{L(x.text)}</div>}
                  {x.photo && <Img src={x.photo} className="h-14 w-14 shrink-0 rounded-lg object-cover" />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f] to-transparent px-3 pb-[calc(var(--safe-bottom)+10px)] pt-6">
        <button onClick={() => addToCart(d.id)} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-[16px] font-black shadow-lg shadow-[#ff3d57]/30 active:scale-[.98]">
          {t('orderNow', { p: fmt(d.price) })}
        </button>
      </div>
    </Sheet>
  )
}

export function AnswerChip({ a, small }) {
  const { t } = useStore()
  const cls = a === 'yes' ? 'bg-green-500/20 text-green-300' : a === 'partly' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
  const ic = a === 'yes' ? '✓' : a === 'partly' ? '≈' : '✕'
  return <span className={`shrink-0 rounded-full font-extrabold ${small ? 'px-1.5 py-px text-[9.5px]' : 'px-2 py-0.5 text-[10.5px]'} ${cls}`}>{ic} {t(`ans_${a}`)}</span>
}
