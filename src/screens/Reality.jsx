import { useEffect, useState } from 'react'
import { ShieldCheck, Clock, MapPin, Star, TrendingUp, TrendingDown, Sparkles, Info } from 'lucide-react'
import { useStore, fmt } from '../store'
import { matchScore } from '../data'
import { Header, Media, MatchRing, Stars, Cert, Img, Sheet, BottomBar, SectionTitle, still } from '../ui'

export default function Reality({ dishId, fromScore, isTop }) {
  const { dishById, restById, L, t, addToCart, tourSignal } = useStore()
  const d = dishById(dishId)
  const r = restById(d.r)
  const score = matchScore(d.reviews)
  const photos = d.reviews.filter((x) => x.photo)
  const [sel, setSel] = useState(0)
  const [mediaIdx, setMediaIdx] = useState(0)
  const [ringScore, setRingScore] = useState(fromScore ?? score)

  useEffect(() => { tourSignal('reality') }, [tourSignal])

  useEffect(() => {
    if (fromScore == null) { setRingScore(score); return }
    const tm = setTimeout(() => setRingScore(score), 700)
    return () => clearTimeout(tm)
  }, [score, fromScore])

  // auto-cycle customer photos (unless the user just added one)
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
      <Header title={L(d.name)} sub={<span className="flex items-center gap-1">{L(r.name)} <Cert size={12} /></span>} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-28">
        {/* ad vs reality */}
        <div data-tour="vs" className="relative mx-4 mt-4 grid grid-cols-2 gap-2 rounded-2xl">
          <div>
            <div className="mb-1.5 text-[12px] font-semibold text-muted">{t('adSide')}</div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-soft">
              <Media m={m} active={isTop} />
              <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10.5px] font-medium text-white backdrop-blur">
                {m.type === 'video' ? t('restaurantVideo') : t('restaurantPhoto')}
              </span>
            </div>
            {d.media.length > 1 && (
              <div className="mt-1.5 flex gap-1">
                {d.media.map((x, i) => (
                  <button key={i} onClick={() => setMediaIdx(i)} className={`h-10 w-10 overflow-hidden rounded-lg ring-2 ${i === mediaIdx ? 'ring-ink' : 'opacity-60 ring-transparent'}`}>
                    <Img src={still(x)} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1 text-[12px] font-semibold text-ok"><ShieldCheck size={13} /> {t('realSide')}</div>
            <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-soft ${cur?.isNew ? 'anim-glow' : ''}`}>
              {cur && <Img key={cur.id} src={cur.photo} className="anim-fade h-full w-full object-cover" />}
              {cur?.isNew && <span className="anim-pop absolute left-2 top-2 rounded-full bg-info px-2 py-0.5 text-[10.5px] font-semibold text-white">✨ {t('newBadge')}</span>}
              {cur && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/75 to-transparent p-2 pt-6 text-[11px] font-semibold text-white">
                  <span className="truncate">{L(cur.author)}</span>
                  <AnswerChip a={cur.match} small onDark />
                </div>
              )}
            </div>
            <div className="no-scrollbar mt-1.5 flex gap-1 overflow-x-auto">
              {photos.map((x, i) => (
                <button key={x.id} onClick={() => setSel(i)} className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-2 ${i === sel ? 'ring-ok' : 'opacity-60 ring-transparent'}`}>
                  <Img src={x.photo} className="h-full w-full object-cover" />
                  {x.isNew && <span className="absolute inset-x-0 bottom-0 bg-info text-[8px] font-bold text-white">{t('newBadge')}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-[calc(50%-10px)] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-canvas bg-ink text-[11px] font-bold text-white">VS</div>
        </div>

        {fromScore != null && (
          <div className="anim-pop mx-4 mt-4 flex items-center gap-2 rounded-xl bg-info-soft px-3 py-2.5 text-[13px] font-semibold text-info">
            <Sparkles size={16} />
            {t('scoreUpdated')}: {fromScore}% → {score}%
            {delta !== 0 && (delta > 0 ? <TrendingUp size={16} className="text-ok" /> : <TrendingDown size={16} className="text-bad" />)}
          </div>
        )}

        {/* match score */}
        <div className="mx-4 mt-4 rounded-2xl bg-soft p-4">
          <div className="flex items-center gap-4">
            <MatchRing score={ringScore} from={fromScore} size={84} stroke={7} />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-muted">{t('matchScore')}</div>
              <div className="mt-0.5 text-[15px] font-semibold leading-snug">{t('matchExplain', { t: total, y: counts.yes })}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {['yes', 'partly', 'no'].map((k) => (
              <div key={k} className="flex items-center gap-2 text-[12.5px] font-medium">
                <span className="w-[86px] shrink-0 text-muted">{t(`ans_${k}`)}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                  <div className={`h-full rounded-full transition-all duration-1000 ${k === 'yes' ? 'bg-ok' : k === 'partly' ? 'bg-warn' : 'bg-bad'}`} style={{ width: `${(counts[k] / total) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-muted">{counts[k]}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-1.5 text-[11.5px] leading-snug text-faint">
            <Info size={13} className="mt-px shrink-0" /> {t('howCalc')}
          </div>
        </div>

        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-ok-soft px-3 py-2.5 text-[12.5px] font-medium text-ok">
          <ShieldCheck size={16} className="shrink-0" /> {t('onlyVerified')}
        </div>

        {/* dish info */}
        <div className="mx-4 mt-5 flex items-center gap-4 text-[13px] font-medium text-muted">
          <span className="flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /> {d.rating}</span>
          <span className="flex items-center gap-1"><Clock size={13} /> {d.prep} {t('min')}</span>
          <span className="flex items-center gap-1"><MapPin size={13} /> {r.distance} {t('km')}</span>
        </div>
        <div className="mx-4 mt-1 text-[14px] text-ink/80">{L(d.desc)}</div>

        {/* photos */}
        <SectionTitle className="mx-4 mt-6">{t('customerPhotos')} · {photos.length}</SectionTitle>
        <div className="mx-4 mt-2.5 grid grid-cols-3 gap-1.5">
          {photos.map((x, i) => (
            <button key={x.id} onClick={() => setSel(i)} className={`relative aspect-square overflow-hidden rounded-xl ${x.isNew ? 'anim-glow' : ''}`}>
              <Img src={x.photo} className="h-full w-full object-cover" />
              {x.isNew && <span className="absolute right-1 top-1 rounded-full bg-info px-1.5 text-[9px] font-semibold text-white">{t('newBadge')}</span>}
            </button>
          ))}
        </div>

        {/* reviews */}
        <SectionTitle className="mx-4 mt-6">{t('reviews')} · {total}</SectionTitle>
        <div className="mx-4 mt-1 divide-y divide-line">
          {d.reviews.map((x) => (
            <div key={x.id} className={`py-3.5 ${x.isNew ? 'anim-glow -mx-2 rounded-xl px-2' : ''}`}>
              <div className="flex items-center gap-2.5">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${x.mine ? 'bg-info text-white' : 'bg-soft text-ink'}`}>{L(x.author)[0]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[13.5px] font-semibold">
                    {L(x.author)}
                    <ShieldCheck size={13} className="text-ok" />
                  </div>
                  <div className="flex items-center gap-2 text-[11.5px] text-faint">
                    <Stars n={x.stars} size={10} />
                    {x.daysAgo === 0 ? t('justNow') : t('daysAgo', { n: x.daysAgo })}
                  </div>
                </div>
                <AnswerChip a={x.match} />
              </div>
              {(x.text || x.photo) && (
                <div className="mt-2 flex gap-2.5 pl-[42px]">
                  {x.text && <div className="flex-1 text-[13.5px] leading-snug text-ink/85">{L(x.text)}</div>}
                  {x.photo && <Img src={x.photo} className="h-14 w-14 shrink-0 rounded-lg object-cover" />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomBar>
        <button
          data-tour="sheet-order"
          onClick={() => addToCart(d.id)}
          className="flex h-[52px] w-full items-center justify-between rounded-xl bg-accent px-5 text-[15px] font-semibold text-white active:scale-[.98]"
        >
          <span>{t('order')}</span>
          <span className="font-bold">{fmt(d.price)}</span>
        </button>
      </BottomBar>
    </Sheet>
  )
}

export function AnswerChip({ a, small, onDark }) {
  const { t } = useStore()
  const cls = onDark
    ? a === 'yes' ? 'bg-ok text-white' : a === 'partly' ? 'bg-warn text-white' : 'bg-bad text-white'
    : a === 'yes' ? 'bg-ok-soft text-ok' : a === 'partly' ? 'bg-warn-soft text-warn' : 'bg-bad-soft text-bad'
  const ic = a === 'yes' ? '✓' : a === 'partly' ? '≈' : '✕'
  return <span className={`shrink-0 rounded-full font-semibold ${small ? 'px-1.5 py-px text-[9.5px]' : 'px-2 py-0.5 text-[11px]'} ${cls}`}>{ic} {t(`ans_${a}`)}</span>
}
