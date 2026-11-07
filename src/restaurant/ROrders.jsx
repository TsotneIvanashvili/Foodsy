import { useState } from 'react'
import { Store, Bike, Check, Smartphone, Plus, Star } from 'lucide-react'
import { useStore, fmt } from '../store'
import { Img, timeAgo } from '../ui'
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
    <div className="flex h-full flex-col">
      <RHeader title={t('incoming')} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-10">
        <div className="mt-1 flex items-center gap-2 rounded-2xl bg-sky-500/10 px-3 py-2 text-[11.5px] font-semibold text-sky-300">
          <Smartphone size={15} className="shrink-0" /> {t('phoneFriendly')}
        </div>

        {demoOrder && (
          <div className="mt-3">
            <OrderCard o={demoOrder} highlight />
          </div>
        )}

        <div className="sticky top-0 z-10 -mx-3 mt-3 bg-[#0b0b0f] px-3 pb-2 pt-1">
          <div className="flex rounded-2xl bg-white/[.07] p-1">
            {['new', 'active', 'done'].map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-extrabold transition ${tab === k ? 'bg-white text-black' : 'text-white/65'}`}>
                {t(k === 'new' ? 'tabNew' : k === 'active' ? 'tabActive' : 'tabDone')}
                <span className={`rounded-full px-1.5 text-[11px] ${tab === k ? 'bg-black text-white' : k === 'new' && groups.new.length ? 'bg-[#ff3d57] text-white' : 'bg-white/15'}`}>{groups[k].length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {groups[tab].length === 0 && <div className="rounded-2xl bg-white/[.04] p-6 text-center text-[13px] text-white/45">{t('noOrders')}</div>}
          {groups[tab].map((o) => (o === demoOrder ? null : <OrderCard key={o.id} o={o} />))}
        </div>

        {tab === 'new' && (
          <button onClick={() => { addTestOrder(myRid); setTab('new') }} className="mx-auto mt-4 flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[12px] font-bold text-white/60 active:scale-95">
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
      ? { label: t('accept'), cls: 'bg-green-500 shadow-green-500/25' }
      : st === 'preparing'
        ? { label: o.mode === 'pickup' ? t('markReady') : `${t('markReady')} · ${t('markSent')}`, cls: 'bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] shadow-[#ff3d57]/25' }
        : st === 'ready'
          ? { label: t('markPickedUp'), cls: 'bg-sky-500 shadow-sky-500/25' }
          : st === 'onTheWay'
            ? { label: t('markDelivered'), cls: 'bg-sky-500 shadow-sky-500/25' }
            : null
  const statusText = st === 'delivered' ? (o.mode === 'pickup' ? t('st_pickedUp') : t('st_delivered')) : st === 'ready' ? t('waitingPickup') : st === 'new' ? t('newOrder') : t(`st_${st}`)
  const review = o.reviewDishId ? dishById(o.reviewDishId).reviews.find((r) => r.mine) : null

  return (
    <div className={`anim-fade rounded-2xl p-3.5 ${highlight ? 'bg-gradient-to-br from-[#ff3d57]/20 to-[#ff7a1a]/10 ring-1 ring-[#ff3d57]/50' : 'bg-white/[.06]'}`}>
      <div className="flex items-center gap-2">
        <span className="text-[18px] font-black">#{o.no}</span>
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${o.mode === 'pickup' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'}`}>
          {o.mode === 'pickup' ? <Store size={12} /> : <Bike size={12} />} {o.mode === 'pickup' ? t('pickup') : t('delivery')}
        </span>
        <span className="ml-auto text-[11.5px] font-semibold text-white/45">{timeAgo(t, o.createdAt)}</span>
      </div>
      <div className="mt-1 text-[13px] font-bold text-white/70">{L(o.customer)}</div>
      <div className="mt-2 space-y-1.5">
        {o.items.map((it) => {
          const d = dishById(it.dishId)
          const m = d.media[0]
          return (
            <div key={it.dishId} className="flex items-center gap-2.5">
              <Img src={m.type === 'video' ? m.poster : m.thumb || m.src} className="h-10 w-10 rounded-lg object-cover" />
              <span className="flex-1 text-[15px] font-extrabold">{it.qty}× {L(d.name)}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2.5 text-[13px]">
        <span className={`font-extrabold ${st === 'delivered' ? 'text-green-400' : st === 'new' ? 'text-[#ff8a9a]' : 'text-amber-300'}`}>{statusText}</span>
        <span className="font-black">{fmt(o.total)}</span>
      </div>
      {action && (
        <button onClick={() => restaurantAction(o.id)} className={`mt-2.5 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-black shadow-lg active:scale-[.98] ${action.cls}`}>
          <Check size={19} strokeWidth={3} /> {action.label}
        </button>
      )}
      {review && (
        <div className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-black/30 p-2">
          {review.photo && <Img src={review.photo} className="h-12 w-12 rounded-lg object-cover" />}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[12px] font-extrabold"><Star size={12} className="fill-amber-400 text-amber-400" /> {t('newReview')} · {review.stars}/5</div>
            <div className="mt-0.5"><AnswerChip a={review.match} small /></div>
          </div>
        </div>
      )}
    </div>
  )
}
