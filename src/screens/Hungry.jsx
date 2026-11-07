import { useMemo, useState } from 'react'
import { Clock, MapPin, Zap, Star } from 'lucide-react'
import { useStore, fmt } from '../store'
import { CATEGORIES, matchScore } from '../data'
import { Img, MatchPill, Cert, LangToggle } from '../ui'

const PRICES = [10, 15, 25, 0]
const WAITS = [15, 20, 30, 0]

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
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-4 pb-2 pt-[calc(var(--safe-top)+8px)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[26px] font-black leading-tight">{t('hungryTitle')}</div>
            <div className="text-[13px] text-white/50">{t('hungrySub')}</div>
          </div>
          <LangToggle />
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4">
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-bold ${cat === c.id ? 'bg-white text-black' : 'bg-white/[.08]'}`}>
              {c.emoji} {L(c.name)}
            </button>
          ))}
        </div>
        <FilterRow label={t('maxPrice')} values={PRICES} value={maxPrice} onChange={setMaxPrice} fmtV={(v) => (v ? `≤ ${v} ₾` : t('any'))} />
        <FilterRow label={t('maxWait')} values={WAITS} value={maxWait} onChange={setMaxWait} fmtV={(v) => (v ? `≤ ${v} ${t('min')}` : t('any'))} />
        <div className="mt-3 flex items-center justify-between text-[12px] font-bold text-white/45">
          <span>{t('results', { n: list.length })}</span>
          <span className="flex items-center gap-1"><Zap size={12} className="fill-amber-400 text-amber-400" />{t('oneTapNote')}</span>
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-24">
        {list.length === 0 && <div className="py-16 text-center text-[14px] text-white/45">{t('noResults')}</div>}
        {list.map(({ d, r, wait, score }) => {
          const m = d.media[0]
          return (
            <div key={d.id} className="anim-fade flex items-center gap-3 rounded-2xl bg-white/[.06] p-2">
              <button onClick={() => push({ type: 'reality', dishId: d.id })} className="relative shrink-0">
                <Img src={m.type === 'video' ? m.poster : m.thumb || m.src} className="h-[76px] w-[76px] rounded-xl object-cover" />
                <span className="absolute bottom-1 left-1 rounded-md bg-black/70 px-1 text-[9.5px] font-extrabold">👁 {d.reviews.filter((x) => x.photo).length}</span>
              </button>
              <div className="min-w-0 flex-1" onClick={() => push({ type: 'reality', dishId: d.id })}>
                <div className="truncate text-[14.5px] font-extrabold">{L(d.name)}</div>
                <div className="flex items-center gap-1 truncate text-[12px] text-white/55">
                  <span className="truncate">{L(r.name)}</span> <Cert size={12} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11.5px] font-semibold text-white/70">
                  <span className="flex items-center gap-0.5 text-amber-300"><Clock size={12} />{t('readyIn', { m: wait })}</span>
                  <span className="flex items-center gap-0.5"><MapPin size={11} />{r.distance}</span>
                  <span className="flex items-center gap-0.5"><Star size={11} className="fill-amber-400 text-amber-400" />{d.rating}</span>
                </div>
                <MatchPill score={score} className="mt-1" />
              </div>
              <button
                onClick={() => oneTap(d)}
                disabled={!!busy}
                className="flex h-[64px] w-[74px] shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#ff3d57] to-[#ff7a1a] font-black shadow-lg shadow-[#ff3d57]/25 active:scale-95 disabled:opacity-60"
              >
                {busy === d.id ? (
                  <span className="spin h-5 w-5 rounded-full border-[3px] border-white/30 border-t-white" />
                ) : (
                  <>
                    <span className="text-[15px]">{fmt(d.price)}</span>
                    <span className="flex items-center gap-0.5 text-[9.5px] font-bold opacity-90"><Zap size={10} className="fill-white" />{t('oneTap')}</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FilterRow({ label, values, value, onChange, fmtV }) {
  return (
    <div className="mt-2.5 flex items-center gap-2">
      <span className="w-[86px] shrink-0 text-[12px] font-bold text-white/50">{label}</span>
      <div className="flex flex-1 gap-1">
        {values.map((v) => (
          <button key={v} onClick={() => onChange(v)} className={`flex-1 rounded-lg py-1.5 text-[11.5px] font-bold transition ${value === v ? 'bg-[#ff3d57] text-white' : 'bg-white/[.06] text-white/70'}`}>
            {fmtV(v)}
          </button>
        ))}
      </div>
    </div>
  )
}
