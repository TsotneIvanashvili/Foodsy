import { RotateCcw, ChevronRight, Star } from 'lucide-react'
import { useStore, fmt } from '../store'
import { Img, LangToggle } from '../ui'

export function OrderRow({ o, compact }) {
  const { dishById, restById, L, t, push, reorder: doReorder, lang } = useStore()
  const r = restById(o.restaurantId)
  const d0 = dishById(o.items[0].dishId)
  const m = d0.media[0]
  const done = o.status === 'delivered'
  const dt = new Date(o.createdAt)
  const KA_M = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ']
  const date = lang === 'ka' ? `${dt.getDate()} ${KA_M[dt.getMonth()]}` : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const reorder = () => doReorder(o)
  const statusLabel = done ? (o.mode === 'pickup' ? t('st_pickedUp') : t('st_delivered')) : t(`st_${o.status}`)
  return (
    <div className="rounded-2xl bg-white/[.06] p-3">
      <button onClick={() => push({ type: 'tracking', orderId: o.id })} className="flex w-full items-center gap-3 text-left">
        <Img src={m.type === 'video' ? m.poster : m.src} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-extrabold">{L(r.name)}</div>
          <div className="truncate text-[12px] text-white/55">{o.items.map((it) => `${it.qty}× ${L(dishById(it.dishId).name)}`).join(', ')}</div>
          <div className="mt-0.5 flex items-center gap-2 text-[11.5px] font-bold">
            <span className={done ? 'text-green-400' : 'text-amber-300'}>{statusLabel}</span>
            <span className="text-white/35">· {date} · {fmt(o.total)}</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-white/30" />
      </button>
      {done && !compact && (
        <div className="mt-2.5 flex gap-2">
          <button onClick={reorder} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-white text-[13px] font-extrabold text-black active:scale-[.97]">
            <RotateCcw size={15} /> {t('reorder')}
          </button>
          {!o.reviewed && (
            <button onClick={() => push({ type: 'review', orderId: o.id })} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-[13px] font-extrabold active:scale-[.97]">
              <Star size={15} className="fill-white" /> {t('review')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const { orders, t } = useStore()
  const mine = orders.filter((o) => o.mine).sort((a, b) => b.createdAt - a.createdAt)
  const active = mine.filter((o) => o.status !== 'delivered')
  const past = mine.filter((o) => o.status === 'delivered')
  return (
    <div className="no-scrollbar h-full overflow-y-auto px-3 pb-10 pt-[calc(var(--safe-top)+8px)]">
      <div className="flex items-center justify-between px-1">
        <div className="text-[26px] font-black">{t('myOrders')}</div>
        <LangToggle />
      </div>
      <div className="mt-4 px-1 text-[13px] font-extrabold uppercase tracking-wide text-white/45">{t('active')}</div>
      <div className="mt-2 space-y-2">
        {active.length ? active.map((o) => <OrderRow key={o.id} o={o} />) : <div className="rounded-2xl bg-white/[.04] p-4 text-center text-[13px] text-white/45">{t('noActive')}</div>}
      </div>
      <div className="mt-6 px-1 text-[13px] font-extrabold uppercase tracking-wide text-white/45">{t('history')}</div>
      <div className="mt-2 space-y-2">
        {past.map((o) => <OrderRow key={o.id} o={o} />)}
      </div>
    </div>
  )
}
