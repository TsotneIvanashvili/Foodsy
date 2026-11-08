import { User, Store, ShieldCheck, ChevronDown, Globe, HelpCircle, ChevronRight, LogOut } from 'lucide-react'
import { useStore } from '../store'
import { RESTAURANTS, matchScore } from '../data'
import { Img, MatchPill, Seg, Cert, SectionTitle, still } from '../ui'
import { OrderRow } from './Orders'

export default function Profile() {
  const { role, setRole, showGuide, t, L, lang, setLang, saved, dishById, orders, dishes, push, myRid, setMyRid, restById, me, user, signOut } = useStore()
  const mine = orders.filter((o) => o.mine).sort((a, b) => b.createdAt - a.createdAt)
  const myReviews = dishes.reduce((s, d) => s + d.reviews.filter((r) => r.mine).length, 0)
  const savedList = [...saved].map(dishById).filter(Boolean)
  const r = restById(myRid)

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-canvas px-4 pb-10 pt-[calc(var(--safe-top)+10px)]">
      <h1 className="text-[26px] font-bold">{t('profile')}</h1>

      {/* identity */}
      {role === 'customer' ? (
        <div className="mt-4 flex items-center gap-3.5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-[24px] font-bold text-accent">{L(me)[0]}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[18px] font-bold">{L(me)}</div>
            <div className="truncate text-[13px] text-muted">{user?.email}</div>
            <div className="mt-0.5 flex items-center gap-1 text-[12px] font-semibold text-ok"><ShieldCheck size={13} /> {t('verifiedCustomer')}</div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[22px] font-bold text-white" style={{ background: r.color }}>{L(r.name)[0]}</div>
          <div className="relative min-w-0 flex-1">
            <div className="text-[12px] text-muted">{t('actingAs')}</div>
            <select value={myRid} onChange={(e) => setMyRid(e.target.value)} className="w-full appearance-none bg-transparent pr-7 text-[17px] font-bold outline-none">
              {RESTAURANTS.map((x) => <option key={x.id} value={x.id}>{L(x.name)}</option>)}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-0 top-[26px]" />
            <div className="flex items-center gap-1 text-[12px] text-muted"><Cert size={12} /> {t('certified')} · {L(r.address)}</div>
          </div>
        </div>
      )}

      {role === 'customer' && (
        <div className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl bg-soft py-3 text-center">
          {[[mine.length, 'ordersCount'], [myReviews, 'reviewsCount'], [saved.size, 'savedCount']].map(([n, k]) => (
            <div key={k}>
              <div className="text-[18px] font-bold">{n}</div>
              <div className="text-[11.5px] text-muted">{t(k)}</div>
            </div>
          ))}
        </div>
      )}

      {/* role switch */}
      <SectionTitle className="mt-6">{t('switchRole')}</SectionTitle>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {[
          { id: 'customer', icon: User, desc: t('roleCustomerDesc') },
          { id: 'restaurant', icon: Store, desc: t('roleRestaurantDesc') },
        ].map(({ id, icon: Icon, desc }) => (
          <button key={id} onClick={() => role !== id && setRole(id)} className={`rounded-2xl border-2 p-3.5 text-left transition active:scale-[.97] ${role === id ? 'border-ink' : 'border-line'}`}>
            <Icon size={21} className={role === id ? 'text-accent' : 'text-muted'} />
            <div className="mt-2 text-[15px] font-semibold">{t(id)}</div>
            <div className="text-[11.5px] leading-snug text-muted">{desc}</div>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11.5px] text-faint">{t('demoTip')}</p>

      {/* settings list */}
      <div className="mt-5 divide-y divide-line rounded-2xl border border-line">
        <div className="flex items-center gap-3 px-4 py-3">
          <Globe size={18} className="text-muted" />
          <span className="flex-1 text-[14.5px] font-medium">{t('language')}</span>
          <Seg className="w-40" value={lang} onChange={setLang} options={[{ value: 'ka', label: 'ქართული' }, { value: 'en', label: 'English' }]} />
        </div>
        <button onClick={() => showGuide(role)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-soft">
          <HelpCircle size={18} className="text-muted" />
          <span className="flex-1">
            <span className="block text-[14.5px] font-medium">{t('howItWorks')}</span>
            <span className="block text-[12px] text-muted">{t('howItWorksSub')}</span>
          </span>
          <ChevronRight size={18} className="text-faint" />
        </button>
        <button onClick={signOut} className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-bad active:bg-soft">
          <LogOut size={18} />
          <span className="flex-1 text-[14.5px] font-medium">{t('logout')}</span>
        </button>
      </div>

      {role === 'customer' && (
        <>
          <SectionTitle className="mt-7">{t('savedDishes')}</SectionTitle>
          {savedList.length ? (
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {savedList.map((d) => (
                <button key={d.id} onClick={() => push({ type: 'reality', dishId: d.id })} className="text-left active:scale-[.97]">
                  <Img src={still(d.media[0])} className="aspect-[3/4] w-full rounded-xl object-cover" />
                  <div className="mt-1 truncate text-[12.5px] font-semibold">{L(d.name)}</div>
                  <MatchPill score={matchScore(d.reviews)} />
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-2.5 rounded-2xl bg-soft p-4 text-center text-[13px] text-muted">{t('noSaved')}</div>
          )}

          <SectionTitle className="mt-7">{t('orderHistory')}</SectionTitle>
          <div className="divide-y divide-line">{mine.map((o) => <OrderRow key={o.id} o={o} />)}</div>
        </>
      )}
    </div>
  )
}
