import { Check, Lock, Star, FastForward } from 'lucide-react'
import { useStore, fmt } from '../store'
import { Header, Img, Sheet, Cert, BottomBar, still } from '../ui'

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
  const progress = done ? 100 : Math.max(8, ((curIdx + 1) / steps.length) * 100)

  return (
    <Sheet>
      <Header
        title={t('orderNo', { n: o.no })}
        sub={<span className="flex items-center gap-1">{L(r.name)} <Cert size={12} /> · {o.mode === 'pickup' ? t('pickup') : t('delivery')}</span>}
        onBack={() => setTab(tab)}
      />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-6">
        {/* status hero */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            {!done && <span className="pulse-ring absolute inset-0 rounded-full bg-accent/25" />}
            <div key={o.status} className={`anim-pop relative flex h-24 w-24 items-center justify-center rounded-full text-[42px] ${done ? 'bg-ok-soft' : 'bg-accent-soft'}`}>
              {EMOJI[o.status]}
            </div>
          </div>
          <div key={'t' + o.status} className="anim-fade-up mt-4 text-[22px] font-bold">{label(o.status)}</div>
          <div className="mt-1 text-[14px] text-muted">{t(`sd_${o.status}`)}</div>
          {!done && <div className="mt-3 rounded-full bg-soft px-3 py-1 text-[12.5px] font-semibold">{t('eta')}: {eta.getHours()}:{String(eta.getMinutes()).padStart(2, '0')}</div>}
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-line">
          <div className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-ok' : 'bg-accent'}`} style={{ width: `${progress}%` }} />
        </div>

        {/* stepper */}
        <div className="mt-5">
          {steps.map((s, i) => {
            const isDone = i <= curIdx
            const isCur = i === curIdx + 1 && !done
            return (
              <div key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500 ${isDone ? 'bg-ok text-white' : isCur ? 'border-2 border-accent bg-canvas' : 'border-2 border-line bg-canvas'}`}>
                    {isDone ? <Check size={15} strokeWidth={3} /> : isCur ? <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> : null}
                  </div>
                  {i < steps.length - 1 && <div className={`my-1 h-6 w-0.5 transition-colors duration-500 ${i < curIdx ? 'bg-ok' : 'bg-line'}`} />}
                </div>
                <div className={`pt-1 text-[14.5px] ${isDone || isCur ? 'font-semibold text-ink' : 'text-faint'}`}>{label(s)}</div>
              </div>
            )
          })}
        </div>

        {/* summary */}
        <div className="mt-5 rounded-2xl border border-line p-4">
          <div className="space-y-2.5">
            {o.items.map((it) => {
              const d = dishById(it.dishId)
              return (
                <div key={it.dishId} className="flex items-center gap-3">
                  <Img src={still(d.media[0])} className="h-11 w-11 rounded-lg object-cover" />
                  <div className="flex-1 text-[14px] font-medium">{it.qty}× {L(d.name)}</div>
                  <div className="text-[13.5px] text-muted">{fmt(it.qty * it.price)}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 text-[15px] font-bold">
            <span>{t('total')}</span>
            <span>{fmt(o.total)}</span>
          </div>
        </div>

        {!done && (
          <button onClick={() => advanceOrder(o.id)} className="mx-auto mt-5 flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[12.5px] font-semibold text-muted active:scale-95">
            <FastForward size={14} /> {t('fastForward')}
          </button>
        )}
      </div>

      <BottomBar>
        {done && !o.reviewed ? (
          <button onClick={() => replaceTop({ type: 'review', orderId: o.id })} className="anim-pop flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-accent text-[15px] font-semibold text-white active:scale-[.98]">
            <Star size={18} className="fill-white" /> {t('leaveReview')}
          </button>
        ) : done ? (
          <div className="flex h-[52px] items-center justify-center rounded-xl bg-ok-soft text-[14.5px] font-semibold text-ok">{t('reviewedDone')}</div>
        ) : (
          <div className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-soft px-4 text-center text-[12.5px] font-medium text-muted">
            <Lock size={15} className="shrink-0" /> {t('reviewLocked')}
          </div>
        )}
      </BottomBar>
    </Sheet>
  )
}
