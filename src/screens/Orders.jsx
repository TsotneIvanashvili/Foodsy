import { RotateCcw, ChevronRight, Star, ReceiptText } from 'lucide-react'
import { useStore, fmt } from '../store'
import { Img, LangToggle, SectionTitle, still } from '../ui'

const KA_M = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ']

export function OrderRow({ o }) {
  const { dishById, restById, L, t, push, reorder, lang } = useStore()
  const r = restById(o.restaurantId)
  const d0 = dishById(o.items[0].dishId)
  const done = o.status === 'delivered'
  const dt = new Date(o.createdAt)
  const date = lang === 'ka' ? `${dt.getDate()} ${KA_M[dt.getMonth()]}` : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const statusLabel = done ? (o.mode === 'pickup' ? t('st_pickedUp') : t('st_delivered')) : t(`st_${o.status}`)
  return (
    <div className="py-3.5">
      <button onClick={() => push({ type: 'tracking', orderId: o.id })} className="flex w-full items-center gap-3 text-left">
        <Img src={still(d0.media[0])} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold">{L(r.name)}</div>
          <div className="truncate text-[12.5px] text-muted">{o.items.map((it) => `${it.qty}× ${L(dishById(it.dishId).name)}`).join(', ')}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[12px]">
            <span className={`font-semibold ${done ? 'text-ok' : 'text-accent'}`}>{statusLabel}</span>
            <span className="text-faint">· {date} · {fmt(o.total)}</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-faint" />
      </button>
      {done && (
        <div className="mt-2.5 flex gap-2 pl-[68px]">
          <button onClick={() => reorder(o)} className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-soft px-3.5 text-[12.5px] font-semibold active:scale-[.97]">
            <RotateCcw size={14} /> {t('reorder')}
          </button>
          {!o.reviewed && (
            <button onClick={() => push({ type: 'review', orderId: o.id })} className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-accent-soft px-3.5 text-[12.5px] font-semibold text-accent active:scale-[.97]">
              <Star size={14} className="fill-accent" /> {t('review')}
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
    <div className="no-scrollbar h-full overflow-y-auto bg-canvas px-4 pb-10 pt-[calc(var(--safe-top)+10px)]">
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold">{t('myOrders')}</h1>
        <LangToggle />
      </div>
      <SectionTitle className="mt-5">{t('active')}</SectionTitle>
      {active.length ? (
        <div className="divide-y divide-line">{active.map((o) => <OrderRow key={o.id} o={o} />)}</div>
      ) : (
        <div className="mt-2.5 flex items-center gap-3 rounded-2xl bg-soft p-4 text-[13.5px] text-muted">
          <ReceiptText size={18} /> {t('noActive')}
        </div>
      )}
      <SectionTitle className="mt-6">{t('history')}</SectionTitle>
      <div className="divide-y divide-line">{past.map((o) => <OrderRow key={o.id} o={o} />)}</div>
    </div>
  )
}
