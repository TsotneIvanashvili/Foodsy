import { Eye, ShoppingBag, Wallet, Target, Gift, PiggyBank, Lightbulb } from 'lucide-react'
import { useStore, fmt } from '../store'
import { matchScore } from '../data'
import { Img, MatchRing, scoreColor } from '../ui'
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
  const week = [0.62, 0.78, 0.7, 0.95, 1, 0.84, 0.9].map((k, i) => Math.round((ordersMonth / 30) * k * (i === 6 ? 1 : 1)) + (i === 6 ? myOrders.filter((o) => !o.id.startsWith('seed') && !o.id.startsWith('my-')).length : 0))
  const maxW = Math.max(...week)
  const dayNames = lang === 'ka' ? ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const n = (x) => x.toLocaleString('en-US')

  const photos = my
    .flatMap((d) => d.reviews.filter((r) => r.photo).map((r) => ({ ...r, dish: d })))
    .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || a.daysAgo - b.daysAgo)
    .slice(0, 9)

  return (
    <div className="flex h-full flex-col">
      <RHeader title={t('dashboard')} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-10">
        {/* subscription */}
        <div className="mt-1 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-transparent p-4 ring-1 ring-emerald-400/30">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-extrabold"><Gift size={12} /> {t('freePeriod')}</span>
          </div>
          <div className="mt-2 text-[28px] font-black leading-none">{t('daysLeft', { n: DAYS_LEFT })}</div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${((FREE_DAYS - DAYS_LEFT) / FREE_DAYS) * 100}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10.5px] font-bold text-white/45">
            <span>{FREE_DAYS - DAYS_LEFT} / {FREE_DAYS}</span>
            <span>{t('afterFree')}</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <CompBar label="Foodsy" pct={15} cls="bg-emerald-400" />
            <CompBar label={t('vsOthers').split(':')[0]} pct={30} cls="bg-white/35" />
          </div>
        </div>

        {/* what you got */}
        <div className="mt-5 px-1 text-[15px] font-extrabold">{t('youGot')}</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Stat icon={<Eye size={16} />} label={t('views')} value={n(views)} delta="+18%" />
          <Stat icon={<ShoppingBag size={16} />} label={t('ordersStat')} value={n(ordersMonth)} delta="+12%" />
          <Stat icon={<Wallet size={16} />} label={t('revenue')} value={`${n(revenue)} ₾`} delta="+9%" />
          <Stat icon={<Target size={16} />} label={t('avgMatch')} value={`${avgMatch}%`} valueCls={scoreColor(avgMatch).text} />
        </div>
        <div className="mt-2 flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-3">
          <PiggyBank size={22} className="text-emerald-300" />
          <div className="flex-1 text-[12.5px] font-bold text-emerald-200">{t('savedComm')}</div>
          <div className="text-[18px] font-black text-emerald-300">{n(saved)} ₾</div>
        </div>

        {/* chart */}
        <div className="mt-3 rounded-3xl bg-white/[.06] p-4">
          <div className="text-[13px] font-extrabold text-white/70">{t('last7')}</div>
          <div className="mt-3 flex h-28 items-end gap-2">
            {week.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-white/55">{v}</span>
                <div className={`w-full rounded-t-lg ${i === 6 ? 'bg-gradient-to-t from-[#ff3d57] to-[#ff7a1a]' : 'bg-white/20'}`} style={{ height: `${(v / maxW) * 80}px` }} />
                <span className="text-[10px] font-bold text-white/40">{dayNames[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* per dish */}
        <div className="mt-5 px-1 text-[15px] font-extrabold">{t('perDish')}</div>
        <div className="mt-2 space-y-2">
          {my.map((d) => {
            const s = matchScore(d.reviews)
            const c = scoreColor(s)
            const m = d.media[0]
            return (
              <button key={d.id} onClick={() => push({ type: 'reality', dishId: d.id })} className="flex w-full items-center gap-3 rounded-2xl bg-white/[.06] p-2.5 text-left active:scale-[.99]">
                <Img src={m.type === 'video' ? m.poster : m.thumb || m.src} className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-extrabold">{L(d.name)}</div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${s}%` }} />
                  </div>
                  <div className="mt-1 flex gap-2 text-[10.5px] font-bold text-white/45">
                    <span>{t('reviewsN', { n: d.reviews.length })}</span>
                    <span>· <Eye size={10} className="inline" /> {n(d.views)}</span>
                    <span>· {fmt(d.price)}</span>
                  </div>
                  {s < 70 && <div className="mt-1 flex items-center gap-1 text-[10.5px] font-bold text-amber-300"><Lightbulb size={11} /> {t('lowMatchTip')}</div>}
                </div>
                <MatchRing score={s} size={46} stroke={4} label={false} />
              </button>
            )
          })}
        </div>

        {/* latest photos */}
        <div className="mt-5 px-1 text-[15px] font-extrabold">{t('latestPhotos')}</div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {photos.map((p) => (
            <button key={p.id} onClick={() => push({ type: 'reality', dishId: p.dish.id })} className={`relative aspect-square overflow-hidden rounded-xl ${p.isNew ? 'anim-glow' : ''}`}>
              <Img src={p.photo} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 pt-4">
                <AnswerChip a={p.match} small />
              </div>
              {p.isNew && <span className="absolute right-1 top-1 rounded-full bg-sky-500 px-1.5 text-[9px] font-extrabold">{t('newBadge')}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, delta, valueCls = '' }) {
  return (
    <div className="rounded-2xl bg-white/[.06] p-3">
      <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-white/55">{icon} {label}</div>
      <div className={`mt-1 text-[21px] font-black ${valueCls}`}>{value}</div>
      {delta && <div className="text-[10.5px] font-bold text-green-400">{delta}</div>}
    </div>
  )
}

function CompBar({ label, pct, cls }) {
  return (
    <div className="flex items-center gap-2 text-[11.5px] font-bold">
      <span className="w-[120px] shrink-0 truncate text-white/70">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${cls}`} style={{ width: `${(pct / 30) * 100}%` }} />
      </div>
      <span className="w-9 text-right">{pct}%</span>
    </div>
  )
}
