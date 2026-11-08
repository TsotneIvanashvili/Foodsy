import { useEffect, useState } from 'react'
import { PlaySquare, Zap, ReceiptText, User, LayoutDashboard, Upload, Rocket, ClipboardList } from 'lucide-react'
import { StoreProvider, useStore } from './store'
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
import Tour from './screens/Tour'
import Auth from './screens/Auth'

const CUSTOMER_TABS = [
  { id: 'feed', icon: PlaySquare, C: Feed },
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

function BottomNav({ dark }) {
  const { role, tab, setTab, t, orders, myRid } = useStore()
  const tabs = role === 'customer' ? CUSTOMER_TABS : RESTAURANT_TABS
  const activeMine = orders.filter((o) => o.mine && o.status !== 'delivered').length
  const newForMe = orders.filter((o) => o.restaurantId === myRid && o.status === 'new').length
  return (
    <nav className={`relative z-30 flex shrink-0 border-t pb-[var(--safe-bottom)] transition-colors ${dark ? 'border-white/10 bg-black' : 'border-line bg-canvas'}`}>
      {tabs.map(({ id, icon: Icon }) => {
        const on = tab === id
        const badge = id === 'orders' ? activeMine : id === 'rOrders' ? newForMe : 0
        const color = on ? (dark ? 'text-white' : 'text-accent') : dark ? 'text-white/50' : 'text-faint'
        return (
          <button key={id} data-tour={`nav-${id}`} onClick={() => setTab(id)} className={`relative flex h-[56px] flex-1 flex-col items-center justify-center gap-1 transition ${color}`}>
            <Icon size={22} strokeWidth={on ? 2.3 : 1.8} />
            <span className={`text-[10.5px] leading-none ${on ? 'font-semibold' : 'font-medium'}`}>{t(`nav_${id}`)}</span>
            {badge > 0 && (
              <span className="absolute right-[calc(50%-20px)] top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">{badge}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div key={toast.id} className="anim-toast pointer-events-none absolute left-1/2 top-[calc(var(--safe-top)+10px)] z-[90] max-w-[90%] rounded-full bg-ink px-4 py-2.5 text-center text-[13px] font-semibold text-white shadow-[var(--shadow-float)]">
      {toast.msg}
    </div>
  )
}

function Confirm() {
  const { confirm, setConfirm, t } = useStore()
  if (!confirm) return null
  return (
    <div className="anim-fade absolute inset-0 z-[80] flex items-end bg-black/40 p-3 pb-[calc(var(--safe-bottom)+12px)]" onClick={() => setConfirm(null)}>
      <div className="anim-slide-up w-full rounded-3xl bg-canvas p-5 text-ink" onClick={(e) => e.stopPropagation()}>
        <div className="text-[18px] font-bold">{confirm.title}</div>
        <div className="mt-1 text-[14px] text-muted">{confirm.text}</div>
        <div className="mt-5 flex gap-2">
          <button onClick={() => setConfirm(null)} className="h-12 flex-1 rounded-xl bg-soft font-semibold">{t('cancel')}</button>
          <button onClick={() => { confirm.onOk(); setConfirm(null) }} className="h-12 flex-1 rounded-xl bg-accent font-semibold text-white">{confirm.ok}</button>
        </div>
      </div>
    </div>
  )
}

function Screen({ authView, setAuthView }) {
  const { role, tab, stack, user } = useStore()
  if (!user) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-canvas text-ink">
        <Auth view={authView} setView={setAuthView} />
        <Toast />
      </div>
    )
  }
  const tabs = role === 'customer' ? CUSTOMER_TABS : RESTAURANT_TABS
  const Cur = (tabs.find((x) => x.id === tab) || tabs[0]).C
  const darkNav = role === 'customer' && tab === 'feed'
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-canvas text-ink">
      <div className="relative min-h-0 flex-1">
        <Cur key={role + tab} />
      </div>
      <BottomNav dark={darkNav} />
      {stack.map((o, i) => {
        const O = OVERLAYS[o.type]
        const { key, ...props } = o
        return <O key={key} {...props} isTop={i === stack.length - 1} />
      })}
      <Toast />
      <Confirm />
      <Tour />
    </div>
  )
}

function StatusBar({ light }) {
  const [time, setTime] = useState('9:41')
  useEffect(() => {
    const f = () => { const d = new Date(); setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`) }
    f()
    const i = setInterval(f, 15000)
    return () => clearInterval(i)
  }, [])
  const c = light ? 'white' : '#16181d'
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[95] flex h-[47px] items-center justify-between px-8 pt-1 text-[15px] font-semibold transition-colors" style={{ color: c }}>
      <span className="w-14 text-center">{time}</span>
      <div className="absolute left-1/2 top-[11px] h-[30px] w-[118px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c}><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={c}><path d="M8 2.5c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .7 10.4 10.4 0 0 0 .8 3.6L2 4.9a8.6 8.6 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4.3a6.7 6.7 0 0 0-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5c-.6 0-1.1.2-1.5.6L8 11.8l1.5-1.6c-.4-.4-.9-.6-1.5-.6Z" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke={c} strokeOpacity=".4" /><rect x="2" y="2" width="17" height="8" rx="2" fill={c} /><rect x="23.5" y="4" width="1.8" height="4" rx=".9" fill={c} fillOpacity=".4" /></svg>
      </span>
    </div>
  )
}

function useLayout() {
  const calc = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    return { mobile: w <= 520, scale: Math.min(1, (h - 24) / 868, (w - 24) / 414) }
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
  const { user, role, tab, stack, onboard } = useStore()
  const [authView, setAuthView] = useState('welcome')
  useEffect(() => { if (!user) setAuthView('welcome') }, [user])
  // white status-bar text over dark media (video feed, welcome hero), dark text on light screens
  const lightStatus = (!user && authView === 'welcome') || (user && role === 'customer' && tab === 'feed' && !stack.length) || !!onboard

  const screen = <Screen authView={authView} setAuthView={setAuthView} />
  if (mobile) {
    return (
      <div className="h-[100dvh] w-full" style={{ '--safe-top': 'env(safe-area-inset-top, 0px)', '--safe-bottom': 'env(safe-area-inset-bottom, 0px)' }}>
        {screen}
      </div>
    )
  }
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#eef0f3]">
      <div className="pointer-events-none absolute left-10 top-8 hidden select-none lg:block">
        <div className="text-[30px] font-extrabold tracking-tight text-ink">food<span className="text-accent">sy</span></div>
        <div className="mt-1 max-w-[260px] text-[14px] text-muted">რეკლამა vs რეალობა — Ad vs reality</div>
      </div>
      <div style={{ transform: `scale(${scale})` }} className="shrink-0">
        <div className="relative h-[868px] w-[414px] rounded-[62px] bg-[#111214] p-3 shadow-[0_40px_100px_-30px_rgba(16,24,40,.45),0_0_0_1px_#2a2b2f]">
          <div className="relative h-full w-full overflow-hidden rounded-[50px] bg-canvas" style={{ '--safe-top': '44px', '--safe-bottom': '14px', transform: 'translateZ(0)' }}>
            {screen}
            <StatusBar light={lightStatus} />
            <div className={`pointer-events-none absolute bottom-[6px] left-1/2 z-[95] h-[5px] w-[134px] -translate-x-1/2 rounded-full ${lightStatus ? 'bg-white/80' : 'bg-ink/80'}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
