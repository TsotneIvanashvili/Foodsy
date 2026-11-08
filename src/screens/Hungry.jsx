import { useMemo, useState } from 'react'
import { Clock, MapPin, Zap, Star } from 'lucide-react'
import { useStore, fmt } from '../store'
import { CATEGORIES, matchScore } from '../data'
import { Img, MatchPill, Cert, LangToggle, CartButton, Chip, Spinner, still } from '../ui'

const PRICES = [0, 10, 15, 25]
const WAITS = [0, 15, 20, 30]

export default function Hungry() {
  const { dishes, restById, L, t, placeOrder, push, showToast } = useStore()
  const [cat, setCat] = useState('all')
  const [maxPrice, setMaxPrice] = useState(0)
  const [maxWait, setMaxWait] = useState(20)
  const [busy, setBusy] = useState(null)

  const list = useMemo(() => {
    return dishes
      .map((d) => {
        const r = restById(d.r)
        return { d, r, wait: d.prep + Math.round(r.distance * 4), score: matchScore(d.reviews) }
      })
      .filter(({ d, wait }) => (cat === 'all' || d.cat === cat) && (!maxPrice || d.price <= maxPrice) && (!maxWait || wait <= maxWait))
      .sort((a, b) => a.wait - b.wait || b.score - a.score)
  }, [dishes, restById, cat, maxPrice, maxWait])

  const oneTap = (d) => {
    setBusy(d.id)
    setTimeout(() => {
      const o = placeOrder({ mode: 'pickup', items: [{ dishId: d.id, qty: 1, price: d.price }], rid: d.r })
      setBusy(null)
      showToast(t('orderPlaced'))
      push({ type: 'tracking', orderId: o.id })
    }, 700)
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="shrink-0 px-4 pb-3 pt-[calc(var(--safe-top)+10px)]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-bold leading-tight">{t('hungryTitle')}</h1>
            <p className="text-[13.5px] text-muted">{t('hungrySub')}</p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <CartButton />
            <LangToggle />
          </div>
        </div>
        <div className="no-scrollbar -mx-4 mt-4 flex gap-1.5 overflow-x-auto px-4">
          {CATEGORIES.map((c) => (
            <Chip key={c.id} on={cat === c.id} onClick={() => setCat(c.id)}>{L(c.name)}</Chip>
          ))}
        </div>
        <FilterRow label={t('maxPrice')} values={PRICES} value={maxPrice} onChange={setMaxPrice} fmtV={(v) => (v ? `≤ ${v} ₾` : t('any'))} />
        <FilterRow label={t('maxWait')} values={WAITS} value={maxWait} onChange={setMaxWait} fmtV={(v) => (v ? `≤ ${v} ${t('min')}` : t('any'))} />
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-line px-4 py-2.5 text-[12px] text-muted">
        <span className="font-semibold text-ink">{t('results', { n: list.length })}</span>
        <span className="flex items-center gap-1"><Zap size={12} className="fill-accent text-accent" />{t('oneTapNote')}</span>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 divide-y divide-line overflow-y-auto px-4 pb-6">
        {list.length === 0 && <div className="py-16 text-center text-[14px] text-muted">{t('noResults')}</div>}
        {list.map(({ d, r, wait, score }) => (
          <div key={d.id} className="anim-fade flex items-center gap-3 py-3">
            <button onClick={() => push({ type: 'reality', dishId: d.id })} className="relative shrink-0">
              <Img src={still(d.media[0])} className="h-[84px] w-[84px] rounded-xl object-cover" />
              <span className="absolute bottom-1 left-1 rounded-md bg-canvas/90 px-1 text-[10px] font-semibold">👁 {d.reviews.filter((x) => x.photo).length}</span>
            </button>
            <button className="min-w-0 flex-1 text-left" onClick={() => push({ type: 'reality', dishId: d.id })}>
              <div className="truncate text-[15px] font-semibold">{L(d.name)}</div>
              <div className="flex items-center gap-1 truncate text-[12.5px] text-muted">
                <span className="truncate">{L(r.name)}</span> <Cert size={12} />
              </div>
              <div className="mt-1 flex items-center gap-2.5 text-[12px] text-muted">
                <span className="flex items-center gap-0.5 font-semibold text-ink"><Clock size={12} />{t('readyIn', { m: wait })}</span>
                <span className="flex items-center gap-0.5"><MapPin size={11} />{r.distance}</span>
                <span className="flex items-center gap-0.5"><Star size={11} className="fill-amber-400 text-amber-400" />{d.rating}</span>
              </div>
              <MatchPill score={score} className="mt-1.5" />
            </button>
            <button
              onClick={() => oneTap(d)}
              disabled={!!busy}
              className="flex h-[60px] w-[72px] shrink-0 flex-col items-center justify-center rounded-xl bg-accent-soft text-accent active:scale-95 disabled:opacity-60"
            >
              {busy === d.id ? (
                <Spinner />
              ) : (
                <>
                  <span className="text-[15px] font-bold">{fmt(d.price)}</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold"><Zap size={10} className="fill-accent" />{t('oneTap')}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterRow({ label, values, value, onChange, fmtV }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="w-[86px] shrink-0 text-[12.5px] font-medium text-muted">{label}</span>
      <div className="flex flex-1 gap-1 rounded-xl bg-soft p-1">
        {values.map((v) => (
          <button key={v} onClick={() => onChange(v)} className={`flex-1 rounded-lg py-1.5 text-[12px] font-semibold transition ${value === v ? 'bg-canvas text-ink shadow-[0_1px_3px_rgba(16,24,40,.12)]' : 'text-muted'}`}>
            {fmtV(v)}
          </button>
        ))}
      </div>
    </div>
  )
}
