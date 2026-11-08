import { useEffect, useState } from 'react'
import { Minus, Plus, Store, Bike, CreditCard, Banknote, Smartphone, Lock, MapPin, Check, ShoppingBag } from 'lucide-react'
import { useStore, fmt } from '../store'
import { SERVICE_FEE, matchScore } from '../data'
import { Header, Img, Sheet, MatchPill, Cert, BottomBar, SectionTitle, Btn, Spinner, still } from '../ui'

export default function Checkout() {
  const { cart, setQty, dishById, restById, L, t, checkout, replaceTop, pop, showToast, tourSignal } = useStore()
  const [mode, setMode] = useState('pickup')
  const [pay, setPay] = useState('card')
  const [busy, setBusy] = useState(false)

  useEffect(() => { tourSignal('checkout') }, [tourSignal])

  if (!cart.items.length) {
    return (
      <Sheet>
        <Header title={t('checkout')} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center text-muted">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-soft"><ShoppingBag size={26} /></span>
          <span className="text-[15px] font-semibold text-ink">{t('emptyCart')}</span>
          <Btn variant="secondary" className="mt-2 px-5" onClick={pop}>{t('backToFeed')}</Btn>
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
    }, 1200)
  }

  return (
    <Sheet>
      <Header title={t('checkout')} sub={<span className="flex items-center gap-1">{L(r.name)} <Cert size={12} /></span>} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-36 pt-4">
        {/* delivery mode */}
        <div data-tour="mode" className="grid grid-cols-2 gap-2 rounded-2xl">
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
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-soft px-3 py-2.5 text-[12.5px] text-muted">
            <MapPin size={15} className="shrink-0 text-accent" />
            <span><b className="font-semibold text-ink">{t('pickupAt')}:</b> {L(r.address)} · {r.distance} {t('km')}</span>
          </div>
        )}

        {/* items */}
        <SectionTitle className="mt-6">{t('itemsTotal')}</SectionTitle>
        <div className="mt-1 divide-y divide-line">
          {cart.items.map((it) => {
            const d = dishById(it.dishId)
            return (
              <div key={it.dishId} className="flex items-center gap-3 py-3">
                <Img src={still(d.media[0])} className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-semibold">{L(d.name)}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[13px] text-muted">{fmt(d.price)}</span>
                    <MatchPill score={matchScore(d.reviews)} />
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
                  <button onClick={() => setQty(it.dishId, it.qty - 1)} className="flex h-8 w-8 items-center justify-center rounded-full active:bg-soft" aria-label="-"><Minus size={15} /></button>
                  <span className="w-5 text-center text-[14px] font-semibold">{it.qty}</span>
                  <button onClick={() => setQty(it.dishId, it.qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-full active:bg-soft" aria-label="+"><Plus size={15} /></button>
                </div>
              </div>
            )
          })}
        </div>
        <button onClick={pop} className="mt-1 text-[13.5px] font-semibold text-accent">{t('addMore')}</button>

        {/* payment */}
        <SectionTitle className="mt-6">{t('payment')}</SectionTitle>
        <div className="mt-2.5 space-y-2">
          {[
            { id: 'card', icon: <CreditCard size={18} />, label: t('card') },
            { id: 'apple', icon: <Smartphone size={18} />, label: t('applePay') },
            { id: 'cash', icon: <Banknote size={18} />, label: t('cash') },
          ].map((p) => (
            <button key={p.id} onClick={() => setPay(p.id)} className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-[14px] font-medium transition ${pay === p.id ? 'border-ink' : 'border-line'}`}>
              {p.icon}
              <span className="flex-1 text-left">{p.label}</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${pay === p.id ? 'border-ink bg-ink text-white' : 'border-line'}`}>{pay === p.id && <Check size={11} strokeWidth={4} />}</span>
            </button>
          ))}
        </div>

        {/* summary */}
        <SectionTitle className="mt-6">{t('total')}</SectionTitle>
        <div className="mt-2.5 space-y-2 text-[14px]">
          <Row k={t('itemsTotal')} v={fmt(itemsTotal)} />
          <Row k={t('serviceFee')} v={fmt(SERVICE_FEE)} />
          <Row k={t('deliveryFee')} v={effMode === 'delivery' ? fmt(deliveryFee) : t('free')} />
          <div className="!mt-3 flex items-center justify-between border-t border-line pt-3 text-[16px] font-bold">
            <span>{t('total')}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-faint">{t('directNote')}</p>
      </div>

      <BottomBar>
        <button
          disabled={busy}
          onClick={onPay}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-accent text-[15px] font-semibold text-white active:scale-[.98] disabled:opacity-80"
        >
          {busy ? (<><Spinner light /> {t('processing')}</>) : (<><Lock size={16} /> {t('pay', { p: fmt(total) })}</>)}
        </button>
        <div className="mt-1.5 text-center text-[11px] text-faint">{t('mockPay')}</div>
      </BottomBar>
    </Sheet>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between text-muted">
      <span>{k}</span>
      <span className="font-medium text-ink">{v}</span>
    </div>
  )
}

function ModeCard({ on, onClick, icon, title, desc, price, disabled }) {
  return (
    <button onClick={onClick} className={`rounded-2xl border-2 p-3.5 text-left transition ${on ? 'border-ink' : 'border-line'} ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-center justify-between text-ink">
        {icon}
        <span className="text-[12.5px] font-semibold">{price}</span>
      </div>
      <div className="mt-2 text-[15px] font-semibold">{title}</div>
      <div className="mt-0.5 text-[11.5px] leading-snug text-muted">{desc}</div>
    </button>
  )
}
