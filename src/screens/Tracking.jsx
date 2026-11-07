import { Check, Lock, Star, FastForward } from 'lucide-react'
import { useStore, fmt } from '../store'
import { Header, Img, Sheet, Cert } from '../ui'

const STEPS = {
  pickup: ['accepted', 'preparing', 'ready', 'delivered'],
  delivery: ['accepted', 'preparing', 'onTheWay', 'delivered'],
}
const EMOJI = { new: '📨', accepted: '👍', preparing: '👨‍🍳', ready: '🛍️', onTheWay: '🛵', delivered: '🎉' }

export default function Tracking({ orderId }) {
  const { orders, dishById, restById, L, t, advanceOrder, replaceTop, setTab, tab } = useStore()
  const o = orders.find((x) => x.id === orderId)
  if (!o) return null
  const r = restById(o.restaurantId)
  const steps = STEPS[o.mode]
  const curIdx = o.status === 'new' ? -1 : steps.indexOf(o.status)
  const done = o.status === 'delivered'
  const label = (s) => (s === 'delivered' && o.mode === 'pickup' ? t('st_pickedUp') : t(`st_${s}`))
  const prep = Math.max(...o.items.map((i) => dishById(i.dishId).prep))
  const eta = new Date(o.createdAt + (prep + (o.mode === 'delivery' ? 15 : 0)) * 60000)

  return (
    <Sheet>
      <Header title={t('orderNo', { n: o.no })} sub={<span className="flex items-center gap-1">{L(r.name)} <Cert size={12} /> · {o.mode === 'pickup' ? t('pickup') : t('delivery')}</span>} onBack={() => setTab(tab)} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-5">
        {/* hero */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            {!done && <span className="pulse-ring absolute inset-0 rounded-full bg-[#ff3d57]/40" />}
            <div key={o.status} className={`anim-pop relative flex h-28 w-28 items-center justify-center rounded-full text-5xl ${done ? 'bg-green-500' : 'bg-gradient-to-br from-[#ff3d57] to-[#ff7a1a]'}`}>
              {EMOJI[o.status]}
            </div>
          </div>
          <div key={'t' + o.status} className="anim-fade-up mt-4 text-[24px] font-black">{label(o.status)}</div>
          <div className="mt-1 text-[13.5px] text-white/60">{t(`sd_${o.status}`)}</div>
          {!done && (
            <div className="mt-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold">
              {t('eta')}: {eta.getHours()}:{String(eta.getMinutes()).padStart(2, '0')}
            </div>
          )}
        </div>

        {/* stepper */}
        <div className="mt-6 rounded-3xl bg-white/[.05] p-4">
          {steps.map((s, i) => {
            const isDone = i <= curIdx
            const isCur = i === curIdx + 1 && !done
            return (
              <div key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500 ${isDone ? 'bg-green-500' : isCur ? 'bg-[#ff3d57]' : 'bg-white/10'}`}>
                    {isDone ? <Check size={15} strokeWidth={3.5} /> : isCur ? <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> : <span className="h-2 w-2 rounded-full bg-white/30" />}
                  </div>
                  {i < steps.length - 1 && <div className={`my-1 h-6 w-0.5 transition-colors duration-500 ${i < curIdx ? 'bg-green-500' : 'bg-white/10'}`} />}
                </div>
                <div className={`pt-0.5 text-[14px] font-bold ${isDone ? 'text-white' : isCur ? 'text-white' : 'text-white/35'}`}>{label(s)}</div>
              </div>
            )
          })}
        </div>

        {/* summary */}
        <div className="mt-3 space-y-2 rounded-3xl bg-white/[.05] p-4">
          {o.items.map((it) => {
            const d = dishById(it.dishId)
            const m = d.media[0]
            return (
              <div key={it.dishId} className="flex items-center gap-3">
                <Img src={m.type === 'video' ? m.poster : m.src} className="h-11 w-11 rounded-lg object-cover" />
                <div className="flex-1 text-[13.5px] font-bold">{it.qty}× {L(d.name)}</div>
                <div className="text-[13px] font-bold text-white/70">{fmt(it.qty * it.price)}</div>
              </div>
            )
          })}
          <div className="flex justify-between border-t border-white/10 pt-2 text-[14px] font-extrabold">
            <span>{t('total')}</span>
            <span>{fmt(o.total)}</span>
          </div>
        </div>

        {!done && (
          <button onClick={() => advanceOrder(o.id)} className="mx-auto mt-4 flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[12px] font-bold text-white/60 active:scale-95">
            <FastForward size={14} /> {t('fastForward')}
          </button>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f] to-transparent px-3 pb-[calc(var(--safe-bottom)+10px)] pt-6">
        {done && !o.reviewed ? (
          <button onClick={() => replaceTop({ type: 'review', orderId: o.id })} className="anim-pop flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-[16px] font-black shadow-lg shadow-[#ff3d57]/30 active:scale-[.98]">
            <Star size={19} className="fill-white" /> {t('leaveReview')}
          </button>
        ) : done ? (
          <div className="flex h-14 items-center justify-center rounded-2xl bg-green-500/15 font-extrabold text-green-400">{t('reviewedDone')}</div>
        ) : (
          <div className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white/[.06] px-4 text-center text-[12.5px] font-bold text-white/45">
            <Lock size={15} className="shrink-0" /> {t('reviewLocked')}
          </div>
        )}
      </div>
    </Sheet>
  )
}
