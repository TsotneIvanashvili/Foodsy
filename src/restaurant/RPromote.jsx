import { useState } from 'react'
import { Rocket, Check, Eye, Calendar, Lock, Megaphone } from 'lucide-react'
import { useStore, fmt } from '../store'
import { PROMO_PACKAGES, matchScore } from '../data'
import { Img, MatchPill } from '../ui'
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
    <div className="flex h-full flex-col">
      <RHeader title={t('promoteTitle')} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-32">
        {active.length > 0 && (
          <>
            <div className="mt-1 px-1 text-[13px] font-extrabold text-white/70">{t('promoActive')}</div>
            <div className="mt-2 space-y-2">
              {active.map((p) => {
                const d = dishes.find((x) => x.id === p.dishId)
                const m = d.media[0]
                const prog = 0.08
                return (
                  <div key={p.id} className="anim-fade flex items-center gap-3 rounded-2xl bg-amber-400/10 p-2.5 ring-1 ring-amber-400/40">
                    <Img src={m.type === 'video' ? m.poster : m.thumb || m.src} className="h-14 w-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate text-[14px] font-extrabold"><Megaphone size={13} className="text-amber-300" /> {L(d.name)}</div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-amber-400" style={{ width: `${prog * 100}%` }} /></div>
                      <div className="mt-1 text-[11px] font-bold text-white/55">{t('running')} · {t('viewsSoFar', { n: n(Math.round(p.pkg.views * prog)) })} / {n(p.pkg.views)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <button onClick={() => setRole('customer')} className="mt-2 w-full rounded-2xl bg-white/[.06] py-2.5 text-[12.5px] font-bold text-white/70">👀 {t('customer')} → {t('nav_feed')}</button>
          </>
        )}

        <div className="mt-4 px-1 text-[13px] font-extrabold text-white/70">{t('chooseDish')}</div>
        <div className="no-scrollbar -mx-3 mt-2 flex gap-2 overflow-x-auto px-3">
          {sorted.map((d) => {
            const m = d.media[0]
            const on = dishId === d.id
            return (
              <button key={d.id} onClick={() => setDishId(d.id)} className={`relative w-[112px] shrink-0 rounded-2xl border-2 p-1 text-left transition ${on ? 'border-amber-400 bg-amber-400/10' : 'border-transparent bg-white/[.05]'}`}>
                <div className="relative">
                  <Img src={m.type === 'video' ? m.poster : m.thumb || m.src} className="aspect-[3/4] w-full rounded-xl object-cover" />
                  {m.type === 'video' && <span className="absolute left-1 top-1 rounded-full bg-black/60 px-1.5 text-[9px] font-extrabold">▶ {t('restaurantVideo')}</span>}
                  {on && <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black"><Check size={13} strokeWidth={3.5} /></span>}
                </div>
                <div className="mt-1 truncate px-0.5 text-[11.5px] font-bold">{L(d.name)}</div>
                <div className="px-0.5"><MatchPill score={matchScore(d.reviews)} /></div>
              </button>
            )
          })}
        </div>

        <div className="mt-5 px-1 text-[13px] font-extrabold text-white/70">{t('choosePackage')}</div>
        <div className="mt-2 space-y-2">
          {PROMO_PACKAGES.map((p) => {
            const on = p.id === pkgId
            return (
              <button key={p.id} onClick={() => setPkgId(p.id)} className={`relative flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition active:scale-[.99] ${on ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-white/[.03]'}`}>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${on ? 'bg-amber-400 text-black' : 'bg-white/10'}`}><Rocket size={20} /></span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[15px] font-extrabold">
                    {L(p.name)}
                    {p.best && <span className="rounded-full bg-amber-400 px-2 py-px text-[10px] font-black text-black">{t('best')}</span>}
                  </div>
                  <div className="mt-0.5 flex gap-3 text-[12px] font-semibold text-white/60">
                    <span className="flex items-center gap-1"><Eye size={12} /> {t('viewsApprox', { n: n(p.views) })}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {t('daysN', { n: p.days })}</span>
                  </div>
                </div>
                <span className="text-[18px] font-black">{fmt(p.price)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f] to-transparent px-3 pb-3 pt-6">
        <button disabled={busy} onClick={buy} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 text-[16px] font-black text-black shadow-lg shadow-amber-400/25 active:scale-[.98] disabled:opacity-70">
          {busy ? <span className="spin h-5 w-5 rounded-full border-[3px] border-black/20 border-t-black" /> : <Lock size={17} />}
          {t('buy', { p: fmt(pkg.price) })}
        </button>
        <div className="mt-1.5 text-center text-[10.5px] text-white/40">{t('promoNote')}</div>
      </div>
    </div>
  )
}
