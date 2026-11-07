import { useState } from 'react'
import { Minus, Plus, Store, Bike, CreditCard, Banknote, Smartphone, Lock, MapPin, Check } from 'lucide-react'
import { useStore, fmt } from '../store'
import { SERVICE_FEE, matchScore } from '../data'
import { Header, Img, Sheet, MatchPill, Cert } from '../ui'

export default function Checkout() {
  const { cart, setQty, dishById, restById, L, t, checkout, replaceTop, pop, showToast } = useStore()
  const [mode, setMode] = useState('pickup')
  const [pay, setPay] = useState('card')
  const [busy, setBusy] = useState(false)

  if (!cart.items.length) {
    return (
      <Sheet>
        <Header title={t('checkout')} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/50">
          <div className="text-5xl">🛒</div>
          {t('emptyCart')}
          <button onClick={pop} className="mt-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white">{t('backToFeed')}</button>
        </div>
      </Sheet>
    )
  }

  const r = restById(cart.rid)
  const effMode = r.delivery ? mode : 'pickup'
  const itemsTotal = cart.items.reduce((s, i) => s + i.qty * i.price, 0)
  const deliveryFee = effMode === 'delivery' ? r.deliveryFee : 0
  const total = itemsTotal + SERVICE_FEE + deliveryFee
  const prep = Math.max(...cart.items.map((i) => dishById(i.dishId).prep))

  const onPay = () => {
    setBusy(true)
    setTimeout(() => {
      const o = checkout(effMode)
      showToast(t('orderPlaced'))
      replaceTop({ type: 'tracking', orderId: o.id })
    }, 1300)
  }

  return (
    <Sheet>
      <Header title={t('checkout')} sub={<span className="flex items-center gap-1">{L(r.name)} <Cert size={12} /></span>} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-36 pt-3">
        {/* items */}
        <div className="space-y-2">
          {cart.items.map((it) => {
            const d = dishById(it.dishId)
            const m = d.media[0]
            return (
              <div key={it.dishId} className="flex items-center gap-3 rounded-2xl bg-white/[.06] p-2.5">
                <Img src={m.type === 'video' ? m.poster : m.src} className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-extrabold">{L(d.name)}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[13px] font-bold text-white/70">{fmt(d.price)}</span>
                    <MatchPill score={matchScore(d.reviews)} />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                  <button onClick={() => setQty(it.dishId, it.qty - 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 active:scale-90"><Minus size={14} /></button>
                  <span className="w-4 text-center text-sm font-extrabold">{it.qty}</span>
                  <button onClick={() => setQty(it.dishId, it.qty + 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 active:scale-90"><Plus size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
        <button onClick={pop} className="mt-2 text-[13px] font-bold text-[#ff6b7f]">{t('addMore')}</button>

        {/* mode */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ModeCard on={effMode === 'pickup'} onClick={() => setMode('pickup')} icon={<Store size={20} />} title={t('pickup')} desc={t('pickupDesc', { m: prep })} price={t('free')} />
          <ModeCard
            on={effMode === 'delivery'}
            disabled={!r.delivery}
            onClick={() => r.delivery && setMode('delivery')}
            icon={<Bike size={20} />}
            title={t('delivery')}
            desc={r.delivery ? t('deliveryDesc', { m: prep + 15 }) : t('noDelivery')}
            price={r.delivery ? fmt(r.deliveryFee) : '—'}
          />
        </div>
        {effMode === 'pickup' && (
          <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/[.04] px-3 py-2.5 text-[12.5px] text-white/70">
            <MapPin size={15} className="shrink-0 text-[#ff6b7f]" />
            <span><b className="text-white/90">{t('pickupAt')}:</b> {L(r.address)} · {r.distance} {t('km')}</span>
          </div>
        )}

        {/* summary */}
        <div className="mt-4 space-y-2 rounded-2xl bg-white/[.06] p-4 text-[13.5px]">
          <Row k={t('itemsTotal')} v={fmt(itemsTotal)} />
          <Row k={t('serviceFee')} v={fmt(SERVICE_FEE)} />
          <Row k={t('deliveryFee')} v={effMode === 'delivery' ? fmt(deliveryFee) : t('free')} />
          <div className="my-1 h-px bg-white/10" />
          <Row k={<b className="text-[15px] text-white">{t('total')}</b>} v={<b className="text-[17px] text-white">{fmt(total)}</b>} />
        </div>
        <div className="mt-2 px-1 text-[11.5px] text-white/45">{t('directNote')}</div>

        {/* payment */}
        <div className="mt-4 text-[13px] font-extrabold text-white/70">{t('payment')}</div>
        <div className="mt-2 space-y-1.5">
          {[
            { id: 'card', icon: <CreditCard size={18} />, label: t('card') },
            { id: 'apple', icon: <Smartphone size={18} />, label: t('applePay') },
            { id: 'cash', icon: <Banknote size={18} />, label: t('cash') },
          ].map((p) => (
            <button key={p.id} onClick={() => setPay(p.id)} className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-[14px] font-bold transition ${pay === p.id ? 'border-white bg-white/10' : 'border-white/10'}`}>
              {p.icon}
              <span className="flex-1 text-left">{p.label}</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${pay === p.id ? 'border-white bg-white text-black' : 'border-white/30'}`}>{pay === p.id && <Check size={12} strokeWidth={4} />}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f] to-transparent px-3 pb-[calc(var(--safe-bottom)+10px)] pt-6">
        <button
          disabled={busy}
          onClick={onPay}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-[16px] font-black shadow-lg shadow-[#ff3d57]/30 active:scale-[.98] disabled:opacity-80"
        >
          {busy ? (<><span className="spin h-5 w-5 rounded-full border-[3px] border-white/30 border-t-white" /> {t('processing')}</>) : (<><Lock size={17} /> {t('pay', { p: fmt(total) })}</>)}
        </button>
        <div className="mt-1.5 text-center text-[10.5px] text-white/40">{t('mockPay')}</div>
      </div>
    </Sheet>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between text-white/70">
      <span>{k}</span>
      <span className="font-bold text-white/90">{v}</span>
    </div>
  )
}

function ModeCard({ on, onClick, icon, title, desc, price, disabled }) {
  return (
    <button onClick={onClick} className={`rounded-2xl border-2 p-3 text-left transition ${on ? 'border-[#ff3d57] bg-[#ff3d57]/10' : 'border-white/10'} ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-[12px] font-extrabold">{price}</span>
      </div>
      <div className="mt-2 text-[15px] font-extrabold">{title}</div>
      <div className="mt-0.5 text-[11px] leading-snug text-white/55">{desc}</div>
    </button>
  )
}
