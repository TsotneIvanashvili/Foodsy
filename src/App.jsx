import { useEffect, useState } from 'react'
import { Flame, Zap, ReceiptText, User, LayoutDashboard, Upload, Rocket, ClipboardList, ShoppingBag } from 'lucide-react'
import { StoreProvider, useStore, fmt } from './store'
import Feed from './screens/Feed'
import Reality from './screens/Reality'
import Hungry from './screens/Hungry'
import Checkout from './screens/Checkout'
import Tracking from './screens/Tracking'
import Review from './screens/Review'
import Orders from './screens/Orders'
import Profile from './screens/Profile'
import ROrders from './restaurant/ROrders'
import RDashboard from './restaurant/RDashboard'
import RUpload from './restaurant/RUpload'
import RPromote from './restaurant/RPromote'

const CUSTOMER_TABS = [
  { id: 'feed', icon: Flame, C: Feed },
  { id: 'hungry', icon: Zap, C: Hungry },
  { id: 'orders', icon: ReceiptText, C: Orders },
  { id: 'profile', icon: User, C: Profile },
]
const RESTAURANT_TABS = [
  { id: 'rOrders', icon: ClipboardList, C: ROrders },
  { id: 'rDash', icon: LayoutDashboard, C: RDashboard },
  { id: 'rUpload', icon: Upload, C: RUpload },
  { id: 'rPromote', icon: Rocket, C: RPromote },
  { id: 'profile', icon: User, C: Profile },
]
const OVERLAYS = { reality: Reality, checkout: Checkout, tracking: Tracking, review: Review }

function BottomNav() {
  const { role, tab, setTab, t, orders, myRid } = useStore()
  const tabs = role === 'customer' ? CUSTOMER_TABS : RESTAURANT_TABS
  const activeMine = orders.filter((o) => o.mine && o.status !== 'delivered').length
  const newForMe = orders.filter((o) => o.restaurantId === myRid && o.status === 'new').length
  return (
    <nav className="relative z-30 flex shrink-0 border-t border-white/[.06] bg-[#0b0b0f] pb-[var(--safe-bottom)]">
      {tabs.map(({ id, icon: Icon }) => {
        const on = tab === id
        const badge = id === 'orders' ? activeMine : id === 'rOrders' ? newForMe : 0
        return (
          <button key={id} onClick={() => setTab(id)} className={`relative flex h-[58px] flex-1 flex-col items-center justify-center gap-1 transition ${on ? 'text-white' : 'text-white/45'}`}>
            {id === 'hungry' ? (
              <span className={`flex h-7 w-11 items-center justify-center rounded-xl ${on ? 'bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a]' : 'bg-white/10'}`}>
                <Icon size={17} className={on ? 'fill-white' : ''} />
              </span>
            ) : (
              <Icon size={22} strokeWidth={on ? 2.4 : 1.8} />
            )}
            <span className="text-[10px] font-bold leading-none">{t(`nav_${id}`)}</span>
            {badge > 0 && (
              <span className="absolute right-[calc(50%-20px)] top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ff3d57] px-1 text-[10px] font-black text-white">{badge}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

function CartPill() {
  const { cart, role, stack, tab, push, t, restById, L } = useStore()
  if (role !== 'customer' || !cart.items.length || stack.length || !['feed', 'hungry'].includes(tab)) return null
  const n = cart.items.reduce((s, i) => s + i.qty, 0)
  const sum = cart.items.reduce((s, i) => s + i.qty * i.price, 0)
  return (
    <button onClick={() => push({ type: 'checkout' })} className="anim-fade-up absolute bottom-[calc(var(--safe-bottom)+66px)] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-black shadow-2xl">
      <ShoppingBag size={17} />
      <span>{t('cart')} · {n}</span>
      <span className="max-w-[110px] truncate text-black/50">{L(restById(cart.rid).name)}</span>
      <span>{fmt(sum)}</span>
    </button>
  )
}

function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div key={toast.id} className="anim-toast pointer-events-none absolute left-1/2 top-[calc(var(--safe-top)+10px)] z-[60] max-w-[90%] rounded-2xl bg-white px-4 py-2.5 text-center text-[13px] font-bold text-black shadow-2xl">
      {toast.msg}
    </div>
  )
}

function Confirm() {
  const { confirm, setConfirm, t } = useStore()
  if (!confirm) return null
  return (
    <div className="anim-fade absolute inset-0 z-[70] flex items-end bg-black/60 p-3 pb-[calc(var(--safe-bottom)+12px)]" onClick={() => setConfirm(null)}>
      <div className="anim-slide-up w-full rounded-3xl bg-neutral-900 p-5" onClick={(e) => e.stopPropagation()}>
        <div className="text-lg font-extrabold">{confirm.title}</div>
        <div className="mt-1 text-sm text-white/60">{confirm.text}</div>
        <div className="mt-5 flex gap-2">
          <button onClick={() => setConfirm(null)} className="h-12 flex-1 rounded-2xl bg-white/10 font-bold">{t('cancel')}</button>
          <button onClick={() => { confirm.onOk(); setConfirm(null) }} className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] font-extrabold">{confirm.ok}</button>
        </div>
      </div>
    </div>
  )
}

function Screen() {
  const { role, tab, stack } = useStore()
  const tabs = role === 'customer' ? CUSTOMER_TABS : RESTAURANT_TABS
  const Cur = (tabs.find((x) => x.id === tab) || tabs[0]).C
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0b0b0f] text-white">
      <div className="relative min-h-0 flex-1">
        <Cur key={role + tab} />
      </div>
      <BottomNav />
      {stack.map((o, i) => {
        const O = OVERLAYS[o.type]
        const { key, ...props } = o
        return <O key={key} {...props} isTop={i === stack.length - 1} />
      })}
      <CartPill />
      <Toast />
      <Confirm />
    </div>
  )
}

function StatusBar() {
  const [time, setTime] = useState('9:41')
  useEffect(() => {
    const f = () => { const d = new Date(); setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`) }
    f()
    const i = setInterval(f, 15000)
    return () => clearInterval(i)
  }, [])
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[80] flex h-[47px] items-center justify-between px-8 pt-1 text-[15px] font-semibold text-white">
      <span className="w-14 text-center">{time}</span>
      <div className="absolute left-1/2 top-[11px] h-[30px] w-[118px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="white"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><path d="M8 2.5c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .7 10.4 10.4 0 0 0 .8 3.6L2 4.9a8.6 8.6 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4.3a6.7 6.7 0 0 0-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5c-.6 0-1.1.2-1.5.6L8 11.8l1.5-1.6c-.4-.4-.9-.6-1.5-.6Z" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="white" strokeOpacity=".4" /><rect x="2" y="2" width="17" height="8" rx="2" fill="white" /><rect x="23.5" y="4" width="1.8" height="4" rx=".9" fill="white" fillOpacity=".4" /></svg>
      </span>
    </div>
  )
}

function useLayout() {
  const calc = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const mobile = w <= 520
    const scale = Math.min(1, (h - 24) / 868, (w - 24) / 414)
    return { mobile, scale }
  }
  const [s, setS] = useState(calc)
  useEffect(() => {
    const f = () => setS(calc())
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return s
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}

function Shell() {
  const { mobile, scale } = useLayout()
  if (mobile) {
    return (
      <>
        <div className="h-[100dvh] w-full" style={{ '--safe-top': 'env(safe-area-inset-top, 0px)', '--safe-bottom': 'env(safe-area-inset-bottom, 0px)' }}>
          <Screen />
        </div>
      </>
    )
  }
  return (
    <>
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#2a0d14_0%,#050507_55%)]">
        <div className="pointer-events-none absolute left-8 top-7 hidden select-none lg:block">
          <div className="text-3xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] bg-clip-text text-transparent">Foodsy</span>
          </div>
          <div className="mt-1 max-w-[260px] text-sm text-white/45">რეკლამა vs რეალობა — Ad vs reality</div>
        </div>
        <div style={{ transform: `scale(${scale})` }} className="shrink-0">
          <div className="relative h-[868px] w-[414px] rounded-[62px] bg-[#1a1a1d] p-3 shadow-[0_40px_120px_-20px_rgba(255,61,87,.25),0_0_0_2px_#2c2c30,inset_0_0_0_2px_#000]">
            <div
              className="relative h-full w-full overflow-hidden rounded-[50px] bg-black"
              style={{ '--safe-top': '44px', '--safe-bottom': '14px', transform: 'translateZ(0)' }}
            >
              <Screen />
              <StatusBar />
              <div className="pointer-events-none absolute bottom-[6px] left-1/2 z-[80] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/80" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
