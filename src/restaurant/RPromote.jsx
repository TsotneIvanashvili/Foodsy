import { useState } from 'react'
import { Rocket, Check, Eye, Calendar, Lock, Megaphone } from 'lucide-react'
import { useStore, fmt } from '../store'
import { PROMO_PACKAGES, matchScore } from '../data'
import { Img, MatchPill, SectionTitle, Btn, Spinner, still } from '../ui'
import RHeader from './RHeader'

export default function RPromote() {
  const { dishes, myRid, L, t, buyPromo, promos, showToast, setRole } = useStore()
  const my = dishes.filter((d) => d.r === myRid)
  const sorted = [...my].sort((a, b) => (b.media[0].isNew ? 1 : 0) - (a.media[0].isNew ? 1 : 0) || (b.media[0].type === 'video') - (a.media[0].type === 'video'))
  const [dishId, setDishId] = useState(sorted[0].id)
  const [pkgId, setPkgId] = useState('p2')
  const [busy, setBusy] = useState(false)
  const pkg = PROMO_PACKAGES.find((p) => p.id === pkgId)
  const active = promos.filter((p) => my.some((d) => d.id === p.dishId))
  const n = (x) => x.toLocaleString('en-US')

  const buy = () => {
    setBusy(true)
    setTimeout(() => {
      buyPromo(dishId, pkg)
      setBusy(false)
      showToast(t('promoBought'))
    }, 1200)
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      <RHeader title={t('promoteTitle')} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-32">
        {active.length > 0 && (
          <>
            <SectionTitle>{t('promoActive')}</SectionTitle>
            <div className="mt-2.5 space-y-2">
              {active.map((p) => {
                const d = dishes.find((x) => x.id === p.dishId)
                const prog = 0.08
                return (
                  <div key={p.id} className="anim-fade flex items-center gap-3 rounded-2xl bg-warn-soft p-3">
                    <Img src={still(d.media[0])} className="h-12 w-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate text-[14px] font-semibold"><Megaphone size={13} className="text-warn" /> {L(d.name)}</div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-warn/15"><div className="h-full rounded-full bg-warn" style={{ width: `${prog * 100}%` }} /></div>
                      <div className="mt-1 text-[11.5px] text-muted">{t('running')} · {t('viewsSoFar', { n: n(Math.round(p.pkg.views * prog)) })} / {n(p.pkg.views)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <Btn variant="secondary" size="sm" className="mt-2 w-full" onClick={() => setRole('customer')}>👀 {t('customer')} → {t('nav_feed')}</Btn>
          </>
        )}

        <SectionTitle className={active.length ? 'mt-6' : ''}>{t('chooseDish')}</SectionTitle>
        <div className="no-scrollbar -mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4">
          {sorted.map((d) => {
            const on = dishId === d.id
            return (
              <button key={d.id} onClick={() => setDishId(d.id)} className={`relative w-[112px] shrink-0 rounded-2xl border-2 p-1 text-left transition ${on ? 'border-ink' : 'border-transparent'}`}>
                <div className="relative">
                  <Img src={still(d.media[0])} className="aspect-[3/4] w-full rounded-xl object-cover" />
                  {d.media[0].type === 'video' && <span className="absolute left-1 top-1 rounded-full bg-black/55 px-1.5 text-[9px] font-semibold text-white">▶ {t('restaurantVideo')}</span>}
                  {on && <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"><Check size={12} strokeWidth={3.5} /></span>}
                </div>
                <div className="mt-1 truncate px-0.5 text-[12px] font-semibold">{L(d.name)}</div>
                <div className="px-0.5"><MatchPill score={matchScore(d.reviews)} /></div>
              </button>
            )
          })}
        </div>

        <SectionTitle className="mt-6">{t('choosePackage')}</SectionTitle>
        <div className="mt-2.5 space-y-2">
          {PROMO_PACKAGES.map((p) => {
            const on = p.id === pkgId
            return (
              <button key={p.id} onClick={() => setPkgId(p.id)} className={`relative flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition active:scale-[.99] ${on ? 'border-ink' : 'border-line'}`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${on ? 'bg-accent text-white' : 'bg-soft text-muted'}`}><Rocket size={18} /></span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[15px] font-semibold">
                    {L(p.name)}
                    {p.best && <span className="rounded-full bg-accent-soft px-2 py-px text-[10.5px] font-semibold text-accent">{t('best')}</span>}
                  </div>
                  <div className="mt-0.5 flex gap-3 text-[12px] text-muted">
                    <span className="flex items-center gap-1"><Eye size={12} /> {t('viewsApprox', { n: n(p.views) })}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {t('daysN', { n: p.days })}</span>
                  </div>
                </div>
                <span className="text-[17px] font-bold">{fmt(p.price)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-line bg-canvas px-4 py-3">
        <Btn size="lg" className="w-full" disabled={busy} onClick={buy}>
          {busy ? <Spinner light /> : <Lock size={16} />}
          {t('buy', { p: fmt(pkg.price) })}
        </Btn>
        <div className="mt-1.5 text-center text-[11px] text-faint">{t('promoNote')}</div>
      </div>
    </div>
  )
}
