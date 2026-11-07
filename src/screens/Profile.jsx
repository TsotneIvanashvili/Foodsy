import { User, Store, ShieldCheck, ChevronDown, Bookmark, Globe, HelpCircle, ChevronRight } from 'lucide-react'
import { useStore } from '../store'
import { ME, RESTAURANTS, matchScore } from '../data'
import { Img, MatchPill, Seg, Cert } from '../ui'
import { OrderRow } from './Orders'

export default function Profile() {
  const { role, setRole, showGuide, t, L, lang, setLang, saved, dishById, orders, dishes, push, myRid, setMyRid, restById } = useStore()
  const mine = orders.filter((o) => o.mine).sort((a, b) => b.createdAt - a.createdAt)
  const myReviews = dishes.reduce((s, d) => s + d.reviews.filter((r) => r.mine).length, 0) + 6
  const savedList = [...saved].map(dishById).filter(Boolean)
  const r = restById(myRid)

  return (
    <div className="no-scrollbar h-full overflow-y-auto px-3 pb-10 pt-[calc(var(--safe-top)+8px)]">
      <div className="px-1 text-[26px] font-black">{t('profile')}</div>

      {/* identity */}
      {role === 'customer' ? (
        <div className="mt-3 flex items-center gap-3 rounded-3xl bg-white/[.06] p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3d57] to-[#ff7a1a] text-2xl font-black">{L(ME.name)[0]}</div>
          <div className="min-w-0 flex-1">
            <div className="text-[18px] font-extrabold">{L(ME.name)}</div>
            <div className="flex items-center gap-1 text-[12px] font-bold text-green-400"><ShieldCheck size={13} /> {t('verifiedCustomer')}</div>
            <div className="mt-1.5 flex gap-4 text-[12px] text-white/55">
              <span><b className="text-white">{mine.length}</b> {t('ordersCount')}</span>
              <span><b className="text-white">{myReviews}</b> {t('reviewsCount')}</span>
              <span><b className="text-white">{saved.size}</b> {t('savedCount')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-3xl bg-white/[.06] p-4">
          <div className="text-[12px] font-bold text-white/50">{t('actingAs')}</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black" style={{ background: r.color }}>{L(r.name)[0]}</div>
            <div className="relative min-w-0 flex-1">
              <select
                value={myRid}
                onChange={(e) => setMyRid(e.target.value)}
                className="w-full appearance-none rounded-xl bg-white/10 py-2.5 pl-3 pr-8 text-[15px] font-extrabold outline-none"
              >
                {RESTAURANTS.map((x) => (
                  <option key={x.id} value={x.id} className="bg-neutral-900">{L(x.name)}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
              <div className="mt-1 flex items-center gap-1 text-[11.5px] font-bold text-sky-300"><Cert size={12} /> {t('certified')} · {L(r.address)}</div>
            </div>
          </div>
        </div>
      )}

      {/* role switch */}
      <div className="mt-3 rounded-3xl bg-white/[.06] p-4">
        <div className="text-[13px] font-extrabold">{t('switchRole')}</div>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {[
            { id: 'customer', icon: User, desc: t('roleCustomerDesc') },
            { id: 'restaurant', icon: Store, desc: t('roleRestaurantDesc') },
          ].map(({ id, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => role !== id && setRole(id)}
              className={`rounded-2xl border-2 p-3 text-left transition active:scale-[.97] ${role === id ? 'border-[#ff3d57] bg-[#ff3d57]/12' : 'border-white/10 bg-white/[.03]'}`}
            >
              <Icon size={22} className={role === id ? 'text-[#ff6b7f]' : 'text-white/60'} />
              <div className="mt-1.5 text-[15px] font-extrabold">{t(id)}</div>
              <div className="text-[11px] leading-snug text-white/50">{desc}</div>
            </button>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-white/40">{t('demoTip')}</div>
      </div>

      {/* language */}
      <div className="mt-3 flex items-center gap-3 rounded-3xl bg-white/[.06] p-4">
        <Globe size={18} className="text-white/60" />
        <span className="flex-1 text-[14px] font-bold">{t('language')}</span>
        <Seg className="w-40" value={lang} onChange={setLang} options={[{ value: 'ka', label: 'ქართული' }, { value: 'en', label: 'English' }]} />
      </div>

      {/* replay guide */}
      <button onClick={() => showGuide(role)} className="mt-3 flex w-full items-center gap-3 rounded-3xl bg-white/[.06] p-4 text-left active:scale-[.99]">
        <HelpCircle size={18} className="text-[#ff6b7f]" />
        <span className="flex-1">
          <span className="block text-[14px] font-bold">{t('howItWorks')}</span>
          <span className="block text-[11.5px] text-white/45">{t('howItWorksSub')}</span>
        </span>
        <ChevronRight size={18} className="text-white/30" />
      </button>

      {role === 'customer' && (
        <>
          <div className="mt-6 flex items-center gap-1.5 px-1 text-[15px] font-extrabold"><Bookmark size={16} className="fill-amber-400 text-amber-400" /> {t('savedDishes')}</div>
          {savedList.length ? (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {savedList.map((d) => {
                const m = d.media[0]
                return (
                  <button key={d.id} onClick={() => push({ type: 'reality', dishId: d.id })} className="text-left active:scale-[.97]">
                    <Img src={m.type === 'video' ? m.poster : m.thumb || m.src} className="aspect-[3/4] w-full rounded-xl object-cover" />
                    <div className="mt-1 truncate text-[12px] font-bold">{L(d.name)}</div>
                    <MatchPill score={matchScore(d.reviews)} />
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-2 rounded-2xl bg-white/[.04] p-4 text-center text-[13px] text-white/45">{t('noSaved')}</div>
          )}

          <div className="mt-6 px-1 text-[15px] font-extrabold">{t('orderHistory')}</div>
          <div className="mt-2 space-y-2">
            {mine.map((o) => <OrderRow key={o.id} o={o} />)}
          </div>
        </>
      )}
    </div>
  )
}
