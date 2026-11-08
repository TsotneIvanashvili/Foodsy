import { Eye, ShoppingBag, Wallet, Target, Gift, PiggyBank, Lightbulb } from 'lucide-react'
import { useStore, fmt } from '../store'
import { matchScore } from '../data'
import { Img, MatchRing, scoreColor, SectionTitle, still } from '../ui'
import RHeader from './RHeader'
import { AnswerChip } from '../screens/Reality'

const FREE_DAYS = 60
const DAYS_LEFT = 23

export default function RDashboard() {
  const { dishes, orders, myRid, L, t, lang, push, promos } = useStore()
  const my = dishes.filter((d) => d.r === myRid)
  const seed = Number(myRid.slice(1))
  const myOrders = orders.filter((o) => o.restaurantId === myRid)
  const promoBoost = promos.filter((p) => my.some((d) => d.id === p.dishId)).reduce((s, p) => s + Math.round(p.pkg.views * 0.08), 0)
  const views = my.reduce((s, d) => s + d.views, 0) + promoBoost
  const ordersMonth = 120 + seed * 9 + myOrders.length
  const avgTicket = my.reduce((s, d) => s + d.price, 0) / my.length + 4
  const revenue = Math.round(ordersMonth * avgTicket)
  const avgMatch = Math.round(my.reduce((s, d) => s + matchScore(d.reviews), 0) / my.length)
  const saved = Math.round(revenue * 0.3)
  const sessionOrders = myOrders.filter((o) => !o.id.startsWith('seed') && !o.id.startsWith('my-')).length
  const week = [0.62, 0.78, 0.7, 0.95, 1, 0.84, 0.9].map((k, i) => Math.round((ordersMonth / 30) * k) + (i === 6 ? sessionOrders : 0))
  const maxW = Math.max(...week)
  const dayNames = lang === 'ka' ? ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const n = (x) => x.toLocaleString('en-US')

  const photos = my
    .flatMap((d) => d.reviews.filter((r) => r.photo).map((r) => ({ ...r, dish: d })))
    .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || a.daysAgo - b.daysAgo)
    .slice(0, 9)

  return (
    <div className="flex h-full flex-col bg-canvas">
      <RHeader title={t('dashboard')} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-10">
        {/* subscription */}
        <div className="rounded-2xl bg-ok-soft p-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-ok px-2.5 py-1 text-[11px] font-semibold text-white"><Gift size={12} /> {t('freePeriod')}</span>
          <div className="mt-2.5 text-[26px] font-bold leading-none">{t('daysLeft', { n: DAYS_LEFT })}</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ok/15">
            <div className="h-full rounded-full bg-ok" style={{ width: `${((FREE_DAYS - DAYS_LEFT) / FREE_DAYS) * 100}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] font-medium text-muted">
            <span>{FREE_DAYS - DAYS_LEFT} / {FREE_DAYS}</span>
            <span>{t('afterFree')}</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <CompBar label="Foodsy" pct={15} cls="bg-ok" />
            <CompBar label={t('vsOthers').split(':')[0]} pct={30} cls="bg-faint" />
          </div>
        </div>

        {/* what you got */}
        <SectionTitle className="mt-6">{t('youGot')}</SectionTitle>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <Stat icon={<Eye size={15} />} label={t('views')} value={n(views)} delta="+18%" />
          <Stat icon={<ShoppingBag size={15} />} label={t('ordersStat')} value={n(ordersMonth)} delta="+12%" />
          <Stat icon={<Wallet size={15} />} label={t('revenue')} value={`${n(revenue)} ₾`} delta="+9%" />
          <Stat icon={<Target size={15} />} label={t('avgMatch')} value={`${avgMatch}%`} valueCls={scoreColor(avgMatch).text} />
        </div>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-line p-3.5">
          <PiggyBank size={20} className="text-ok" />
          <div className="flex-1 text-[13px] font-medium text-muted">{t('savedComm')}</div>
          <div className="text-[17px] font-bold text-ok">{n(saved)} ₾</div>
        </div>

        {/* chart */}
        <div className="mt-3 rounded-2xl border border-line p-4">
          <div className="text-[13px] font-semibold text-muted">{t('last7')}</div>
          <div className="mt-3 flex h-28 items-end gap-2">
            {week.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10.5px] font-semibold text-muted">{v}</span>
                <div className={`w-full rounded-t-md ${i === 6 ? 'bg-accent' : 'bg-line'}`} style={{ height: `${(v / maxW) * 78}px` }} />
                <span className="text-[10.5px] text-faint">{dayNames[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* per dish */}
        <SectionTitle className="mt-6">{t('perDish')}</SectionTitle>
        <div className="divide-y divide-line">
          {my.map((d) => {
            const s = matchScore(d.reviews)
            const c = scoreColor(s)
            return (
              <button key={d.id} onClick={() => push({ type: 'reality', dishId: d.id })} className="flex w-full items-center gap-3 py-3 text-left">
                <Img src={still(d.media[0])} className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold">{L(d.name)}</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                    <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${s}%` }} />
                  </div>
                  <div className="mt-1 flex gap-2 text-[11px] text-faint">
                    <span>{t('reviewsN', { n: d.reviews.length })}</span>
                    <span>· <Eye size={10} className="inline" /> {n(d.views)}</span>
                    <span>· {fmt(d.price)}</span>
                  </div>
                  {s < 70 && <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-warn"><Lightbulb size={11} /> {t('lowMatchTip')}</div>}
                </div>
                <MatchRing score={s} size={44} stroke={4} label={false} />
              </button>
            )
          })}
        </div>

        {/* latest photos */}
        <SectionTitle className="mt-6">{t('latestPhotos')}</SectionTitle>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {photos.map((p) => (
            <button key={p.id} onClick={() => push({ type: 'reality', dishId: p.dish.id })} className={`relative aspect-square overflow-hidden rounded-xl ${p.isNew ? 'anim-glow' : ''}`}>
              <Img src={p.photo} className="h-full w-full object-cover" />
              <div className="absolute bottom-1 left-1"><AnswerChip a={p.match} small onDark /></div>
              {p.isNew && <span className="absolute right-1 top-1 rounded-full bg-info px-1.5 text-[9px] font-semibold text-white">{t('newBadge')}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, delta, valueCls = '' }) {
  return (
    <div className="rounded-2xl border border-line p-3.5">
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted">{icon} {label}</div>
      <div className={`mt-1 text-[20px] font-bold ${valueCls}`}>{value}</div>
      {delta && <div className="text-[11px] font-semibold text-ok">{delta}</div>}
    </div>
  )
}

function CompBar({ label, pct, cls }) {
  return (
    <div className="flex items-center gap-2 text-[12px] font-medium">
      <span className="w-[120px] shrink-0 truncate text-muted">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ok/10">
        <div className={`h-full rounded-full ${cls}`} style={{ width: `${(pct / 30) * 100}%` }} />
      </div>
      <span className="w-9 text-right font-semibold">{pct}%</span>
    </div>
  )
}
