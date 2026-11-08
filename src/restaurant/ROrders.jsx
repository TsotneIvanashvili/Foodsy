import { useState } from 'react'
import { Store, Bike, Check, Smartphone, Plus, Star } from 'lucide-react'
import { useStore, fmt } from '../store'
import { Img, timeAgo, still } from '../ui'
import RHeader from './RHeader'
import { AnswerChip } from '../screens/Reality'

export default function ROrders() {
  const { orders, myRid, t, addTestOrder } = useStore()
  const mineHere = orders.filter((o) => o.restaurantId === myRid).sort((a, b) => b.createdAt - a.createdAt)
  const groups = {
    new: mineHere.filter((o) => o.status === 'new'),
    active: mineHere.filter((o) => ['accepted', 'preparing', 'ready', 'onTheWay'].includes(o.status)),
    done: mineHere.filter((o) => o.status === 'delivered'),
  }
  const [tab, setTab] = useState(groups.new.length ? 'new' : 'active')
  const demoOrder = mineHere.find((o) => o.mine && o.id.startsWith('o-'))

  return (
    <div className="flex h-full flex-col bg-canvas">
      <RHeader title={t('incoming')} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-10">
        <div className="flex items-center gap-2 rounded-xl bg-info-soft px-3 py-2.5 text-[12px] font-medium text-info">
          <Smartphone size={15} className="shrink-0" /> {t('phoneFriendly')}
        </div>

        {demoOrder && <div className="mt-3"><OrderCard o={demoOrder} highlight /></div>}

        <div className="sticky top-0 z-10 -mx-4 mt-3 bg-canvas px-4 pb-3 pt-1">
          <div data-tour="r-tabs" className="flex rounded-xl bg-soft p-1">
            {['new', 'active', 'done'].map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-semibold transition ${tab === k ? 'bg-canvas text-ink shadow-[0_1px_3px_rgba(16,24,40,.12)]' : 'text-muted'}`}>
                {t(k === 'new' ? 'tabNew' : k === 'active' ? 'tabActive' : 'tabDone')}
                <span className={`min-w-[20px] rounded-full px-1.5 text-[11px] font-bold ${k === 'new' && groups.new.length ? 'bg-accent text-white' : 'bg-line text-ink'}`}>{groups[k].length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {groups[tab].length === 0 && <div className="rounded-2xl bg-soft p-6 text-center text-[13.5px] text-muted">{t('noOrders')}</div>}
          {groups[tab].map((o) => (o === demoOrder ? null : <OrderCard key={o.id} o={o} />))}
        </div>

        {tab === 'new' && (
          <button onClick={() => addTestOrder(myRid)} className="mx-auto mt-4 flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[12.5px] font-semibold text-muted active:scale-95">
            <Plus size={14} /> {t('simulateOrder')}
          </button>
        )}
      </div>
    </div>
  )
}

function OrderCard({ o, highlight }) {
  const { dishById, L, t, restaurantAction } = useStore()
  const st = o.status
  const action =
    st === 'new' || st === 'accepted'
      ? { label: t('accept'), cls: 'bg-ok' }
      : st === 'preparing'
        ? { label: o.mode === 'pickup' ? t('markReady') : `${t('markReady')} · ${t('markSent')}`, cls: 'bg-accent' }
        : st === 'ready'
          ? { label: t('markPickedUp'), cls: 'bg-ink' }
          : st === 'onTheWay'
            ? { label: t('markDelivered'), cls: 'bg-ink' }
            : null
  const statusText = st === 'delivered' ? (o.mode === 'pickup' ? t('st_pickedUp') : t('st_delivered')) : st === 'ready' ? t('waitingPickup') : st === 'new' ? t('newOrder') : t(`st_${st}`)
  const statusCls = st === 'delivered' ? 'text-ok' : st === 'new' ? 'text-accent' : 'text-warn'
  const review = o.reviewDishId ? dishById(o.reviewDishId).reviews.find((r) => r.mine) : null

  return (
    <div className={`anim-fade rounded-2xl border p-4 ${highlight ? 'border-accent/40 bg-accent-soft/50' : 'border-line bg-canvas'}`}>
      <div className="flex items-center gap-2">
        <span className="text-[17px] font-bold">#{o.no}</span>
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${o.mode === 'pickup' ? 'bg-warn-soft text-warn' : 'bg-info-soft text-info'}`}>
          {o.mode === 'pickup' ? <Store size={12} /> : <Bike size={12} />} {o.mode === 'pickup' ? t('pickup') : t('delivery')}
        </span>
        <span className="ml-auto text-[12px] text-faint">{timeAgo(t, o.createdAt)}</span>
      </div>
      <div className="mt-0.5 text-[13px] text-muted">{L(o.customer)}</div>
      <div className="mt-3 space-y-2">
        {o.items.map((it) => {
          const d = dishById(it.dishId)
          return (
            <div key={it.dishId} className="flex items-center gap-2.5">
              <Img src={still(d.media[0])} className="h-10 w-10 rounded-lg object-cover" />
              <span className="flex-1 text-[15px] font-semibold">{it.qty}× {L(d.name)}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[13.5px]">
        <span className={`font-semibold ${statusCls}`}>{statusText}</span>
        <span className="font-bold">{fmt(o.total)}</span>
      </div>
      {action && (
        <button data-tour="r-action" onClick={() => restaurantAction(o.id)} className={`mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white active:scale-[.98] ${action.cls}`}>
          <Check size={18} strokeWidth={2.6} /> {action.label}
        </button>
      )}
      {review && (
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-soft p-2.5">
          {review.photo && <Img src={review.photo} className="h-11 w-11 rounded-lg object-cover" />}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold"><Star size={12} className="fill-amber-400 text-amber-400" /> {t('newReview')} · {review.stars}/5</div>
            <div className="mt-0.5"><AnswerChip a={review.match} small /></div>
          </div>
        </div>
      )}
    </div>
  )
}
