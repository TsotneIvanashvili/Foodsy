import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { INITIAL_DISHES, RESTAURANTS, SERVICE_FEE, ME, matchScore, seedOrders, nextOrderNo } from './data'
import { STR } from './i18n'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

const NEXT = {
  pickup: { new: 'accepted', accepted: 'preparing', preparing: 'ready', ready: 'delivered' },
  delivery: { new: 'accepted', accepted: 'preparing', preparing: 'onTheWay', onTheWay: 'delivered' },
}
const AUTO_DELAY = { new: 1600, accepted: 2600, preparing: 4500, ready: 4500, onTheWay: 4500 }

export const fmt = (n) => `${Number.isInteger(n) ? n : n.toFixed(2)} ₾`

export function StoreProvider({ children }) {
  const [lang, setLang] = useState('ka')
  const [role, setRoleState] = useState('customer')
  const [tab, setTab] = useState('feed')
  const [stack, setStack] = useState([])
  const [dishes, setDishes] = useState(INITIAL_DISHES)
  const [liked, setLiked] = useState(() => new Set())
  const [saved, setSaved] = useState(() => new Set(['d3', 'd19', 'd23']))
  const [cart, setCart] = useState({ rid: null, items: [] })
  const [orders, setOrders] = useState(seedOrders)
  const [promos, setPromos] = useState([])
  const [uploads, setUploads] = useState([])
  const [toast, setToastState] = useState(null)
  const [myRid, setMyRid] = useState('r1')
  const [confirm, setConfirm] = useState(null)
  const toastTimer = useRef()

  // auth (mock): nobody is signed in on load, so every pitch starts at the welcome screen
  const [user, setUser] = useState(null)
  const me = useMemo(() => (user ? { ka: user.name, en: user.name } : ME.short), [user])

  // guidance: customer tour runs right after registration; restaurant tour on first panel visit
  const seen = (k) => { try { return localStorage.getItem(`foodsy_seen_${k}`) === '1' } catch { return false } }
  const markSeen = (k) => { try { localStorage.setItem(`foodsy_seen_${k}`, '1') } catch { /* storage blocked */ } }
  const [onboard, setOnboard] = useState(null)
  const [tourEvent, setTourEvent] = useState(null)
  const finishOnboard = useCallback(() => { setOnboard((k) => { if (k) markSeen(k); return null }) }, [])
  const showGuide = useCallback((k) => { setStack([]); setTab(k === 'restaurant' ? 'rOrders' : 'feed'); setOnboard(k) }, [])
  // screens report user actions; the interactive tour advances when its step's action happens
  const tourSignal = useCallback((evt) => setTourEvent({ evt, n: Date.now() + Math.random() }), [])

  const t = useCallback(
    (key, vars) => {
      let s = STR[lang][key] ?? STR.ka[key] ?? key
      if (vars) Object.entries(vars).forEach(([k, v]) => (s = s.replaceAll(`{${k}}`, v)))
      return s
    },
    [lang],
  )
  const L = useCallback((o) => (o == null ? '' : typeof o === 'string' ? o : o[lang] ?? o.ka), [lang])

  const showToast = useCallback((msg, kind = 'ok') => {
    clearTimeout(toastTimer.current)
    setToastState({ msg, kind, id: Date.now() })
    toastTimer.current = setTimeout(() => setToastState(null), 2200)
  }, [])

  const dishById = useCallback((id) => dishes.find((d) => d.id === id), [dishes])
  const restById = useCallback((id) => RESTAURANTS.find((r) => r.id === id), [])

  // navigation
  const push = useCallback((o) => setStack((s) => [...s, { ...o, key: Date.now() + Math.random() }]), [])
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), [])
  const replaceTop = useCallback((o) => setStack((s) => [...s.slice(0, -1), { ...o, key: Date.now() + Math.random() }]), [])
  const goTab = useCallback((tb) => {
    setStack([])
    setTab(tb)
  }, [])

  const setRole = useCallback(
    (r) => {
      setStack([])
      setRoleState(r)
      if (r === 'restaurant') {
        const lastMine = [...orders].filter((o) => o.mine).sort((a, b) => b.createdAt - a.createdAt)[0]
        const rid = lastMine ? lastMine.restaurantId : 'r1'
        setMyRid(rid)
        setTab('rOrders')
        if (!seen('restaurant')) setOnboard('restaurant')
        showToast(STR[lang].switchedTo.replace('{r}', STR[lang].restaurant))
      } else {
        setTab('feed')
        showToast(STR[lang].switchedTo.replace('{r}', STR[lang].customer))
      }
    },
    [orders, lang, showToast],
  )

  // likes / saves
  const toggleLike = useCallback((id) => setLiked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n }), [])
  const toggleSave = useCallback(
    (id) => {
      setSaved((s) => {
        const n = new Set(s)
        if (n.has(id)) { n.delete(id); showToast(STR[lang].unsavedToast) } else { n.add(id); showToast(STR[lang].savedToast) }
        return n
      })
    },
    [lang, showToast],
  )

  // cart
  const addToCart = useCallback(
    (dishId, qty = 1, { openCheckout = true } = {}) => {
      const d = dishes.find((x) => x.id === dishId)
      const doAdd = (base) => {
        const items = [...base.items]
        const ex = items.find((i) => i.dishId === dishId)
        if (ex) ex.qty += qty
        else items.push({ dishId, qty, price: d.price })
        setCart({ rid: d.r, items: items.map((i) => ({ ...i })) })
        if (openCheckout) push({ type: 'checkout' })
      }
      if (cart.rid && cart.rid !== d.r && cart.items.length) {
        setConfirm({
          title: STR[lang].replaceCartTitle,
          text: STR[lang].replaceCartText,
          ok: STR[lang].replace,
          onOk: () => doAdd({ rid: d.r, items: [] }),
        })
      } else doAdd(cart)
    },
    [cart, dishes, push, lang],
  )
  const reorder = useCallback(
    (o) => {
      const items = o.items.map((i) => ({ dishId: i.dishId, qty: i.qty, price: dishes.find((d) => d.id === i.dishId).price }))
      setCart({ rid: o.restaurantId, items })
      push({ type: 'checkout' })
    },
    [dishes, push],
  )
  const setQty = useCallback((dishId, qty) => {
    setCart((c) => {
      const items = c.items.map((i) => (i.dishId === dishId ? { ...i, qty } : i)).filter((i) => i.qty > 0)
      return { rid: items.length ? c.rid : null, items }
    })
  }, [])

  const placeOrder = useCallback(
    ({ mode, items, rid }) => {
      const r = RESTAURANTS.find((x) => x.id === rid)
      const itemsTotal = items.reduce((s, i) => s + i.qty * i.price, 0)
      const deliveryFee = mode === 'delivery' ? r.deliveryFee : 0
      const o = {
        id: `o-${Date.now()}`, no: nextOrderNo(), restaurantId: rid, items: items.map((i) => ({ ...i })), mode,
        itemsTotal, serviceFee: SERVICE_FEE, deliveryFee, total: itemsTotal + SERVICE_FEE + deliveryFee,
        status: 'new', createdAt: Date.now(), customer: me, mine: true, auto: true, reviewed: false,
      }
      setOrders((os) => [o, ...os])
      return o
    },
    [me],
  )

  const checkout = useCallback(
    (mode) => {
      const o = placeOrder({ mode, items: cart.items, rid: cart.rid })
      setCart({ rid: null, items: [] })
      return o
    },
    [cart, placeOrder],
  )

  const advanceOrder = useCallback((id, manual = false) => {
    setOrders((os) =>
      os.map((o) => {
        if (o.id !== id) return o
        const nx = NEXT[o.mode][o.status]
        if (!nx) return o
        return { ...o, status: nx, auto: manual ? false : o.auto }
      }),
    )
  }, [])

  const restaurantAction = useCallback((id) => {
    setOrders((os) =>
      os.map((o) => {
        if (o.id !== id) return o
        let st = o.status
        if (st === 'new' || st === 'accepted') st = 'preparing'
        else if (st === 'preparing') st = o.mode === 'pickup' ? 'ready' : 'onTheWay'
        else if (st === 'ready' || st === 'onTheWay') st = 'delivered'
        return { ...o, status: st, auto: false }
      }),
    )
  }, [])

  // auto-progress demo orders
  useEffect(() => {
    const timers = orders
      .filter((o) => o.auto && o.status !== 'delivered')
      .map((o) => setTimeout(() => advanceOrder(o.id), AUTO_DELAY[o.status] ?? 3000))
    return () => timers.forEach(clearTimeout)
  }, [orders, advanceOrder])

  const addTestOrder = useCallback(
    (rid) => {
      const ds = dishes.filter((d) => d.r === rid)
      const d = ds[Math.floor(Math.random() * ds.length)]
      const r = RESTAURANTS.find((x) => x.id === rid)
      const mode = r.delivery && Math.random() > 0.4 ? 'delivery' : 'pickup'
      const items = [{ dishId: d.id, qty: 1 + Math.floor(Math.random() * 2), price: d.price }]
      const itemsTotal = items.reduce((s, i) => s + i.qty * i.price, 0)
      const deliveryFee = mode === 'delivery' ? r.deliveryFee : 0
      const names = [{ ka: 'თორნიკე ა.', en: 'Tornike A.' }, { ka: 'ქეთევან რ.', en: 'Ketevan R.' }, { ka: 'ნიკოლოზ შ.', en: 'Nikoloz Sh.' }, { ka: 'სალომე ფ.', en: 'Salome P.' }]
      const o = {
        id: `t-${Date.now()}`, no: nextOrderNo(), restaurantId: rid, items, mode, itemsTotal, serviceFee: SERVICE_FEE, deliveryFee,
        total: itemsTotal + SERVICE_FEE + deliveryFee, status: 'new', createdAt: Date.now(), customer: names[Math.floor(Math.random() * names.length)],
        mine: false, auto: false, reviewed: true,
      }
      setOrders((os) => [o, ...os])
    },
    [dishes],
  )

  // reviews
  const addReview = useCallback(
    ({ orderId, dishId, stars, match, photo, text }) => {
      const d = dishes.find((x) => x.id === dishId)
      const oldScore = matchScore(d.reviews)
      const rv = {
        id: `${dishId}-new-${Date.now()}`, author: me, match, stars, text: text ? { ka: text, en: text } : null,
        photo, daysAgo: 0, verified: true, isNew: true, mine: true, createdAt: Date.now(),
      }
      const newReviews = [rv, ...d.reviews]
      setDishes((ds) => ds.map((x) => (x.id === dishId ? { ...x, reviews: newReviews } : x)))
      setOrders((os) => os.map((o) => (o.id === orderId ? { ...o, reviewed: true, reviewDishId: dishId } : o)))
      return { oldScore, newScore: matchScore(newReviews) }
    },
    [dishes, me],
  )

  // restaurant uploads
  const publishMedia = useCallback(({ dishId, media, price, caption }) => {
    setDishes((ds) => ds.map((d) => (d.id === dishId ? { ...d, price: price || d.price, media: [{ ...media, isNew: true, caption }, ...d.media] } : d)))
    setUploads((u) => [{ id: `up-${Date.now()}`, dishId, at: Date.now() }, ...u])
  }, [])

  const buyPromo = useCallback((dishId, pkg) => {
    setPromos((p) => [{ id: `pr-${Date.now()}`, dishId, pkg, at: Date.now() }, ...p.filter((x) => x.dishId !== dishId)])
  }, [])

  // feed cards (recomputed when data changes)
  const feed = useMemo(() => {
    const cards = []
    const used = new Set()
    const restCard = (d, extra = {}) => ({ key: `${d.id}-r-${extra.tag || ''}`, dishId: d.id, kind: d.media[0].type === 'video' ? 'video' : 'photo', media: d.media[0], ...extra })
    promos.forEach((p) => { const d = dishById(p.dishId); if (d) { cards.push(restCard(d, { promo: true, tag: 'promo' })); used.add(d.id) } })
    uploads.forEach((u) => { const d = dishById(u.dishId); if (d && !used.has(d.id)) { cards.push(restCard(d, { fresh: true, tag: 'up' })); used.add(d.id) } })
    const VORDER = ['d1', 'd9', 'd12', 'd19', 'd5', 'd3', 'd23', 'd20', 'd15', 'd13', 'd26', 'd17', 'd14', 'd21', 'd28', 'd24', 'd22', 'd11']
    const rank = (id) => { const i = VORDER.indexOf(id); return i < 0 ? 99 : i }
    const videos = dishes.filter((d) => d.media[0].type === 'video' && !used.has(d.id)).sort((a, b) => rank(a.id) - rank(b.id))
    const photos = dishes.filter((d) => d.media[0].type !== 'video' && !used.has(d.id))
    const custIds = ['d3', 'd9', 'd1', 'd15', 'd21', 'd23', 'd12', 'd7']
    const custCards = custIds.map((id) => {
      const d = dishById(id)
      const rv = d.reviews.find((r) => r.photo)
      return rv ? { key: `${id}-c`, dishId: id, kind: 'customer', media: { type: 'photo', src: rv.photo }, review: rv } : null
    }).filter(Boolean)
    let ci = 0
    videos.forEach((d, i) => {
      cards.push(restCard(d))
      if (i === 1 || i === 5) cards.push(custCards[ci++])
    })
    photos.forEach((d, i) => {
      cards.push(restCard(d))
      if (i % 2 === 1 && ci < custCards.length) cards.push(custCards[ci++])
    })
    while (ci < custCards.length) cards.push(custCards[ci++])
    return cards
  }, [dishes, promos, uploads, dishById])

  const signIn = useCallback(
    ({ name, email, asRole = 'customer', isNew = false }) => {
      const nm = (name || email.split('@')[0] || '').trim()
      setUser({ name: /^[a-z]/.test(nm) ? nm.charAt(0).toUpperCase() + nm.slice(1) : nm, email }) // keep Georgian as typed (uppercasing gives Mtavruli)
      setStack([])
      setRoleState(asRole)
      if (asRole === 'restaurant') {
        setTab('rOrders')
        if (!seen('restaurant')) setOnboard('restaurant')
      } else {
        setTab('feed')
        if (isNew) setOnboard('customer')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const signOut = useCallback(() => { setUser(null); setStack([]); setOnboard(null); setRoleState('customer'); setTab('feed') }, [])

  const value = {
    lang, setLang, t, L, role, setRole, tab, setTab: goTab, stack, push, pop, replaceTop,
    dishes, dishById, restById, liked, toggleLike, saved, toggleSave,
    cart, addToCart, reorder, setQty, checkout, placeOrder, orders, advanceOrder, restaurantAction, addTestOrder,
    addReview, publishMedia, buyPromo, promos, uploads, feed,
    toast, showToast, myRid, setMyRid, confirm, setConfirm,
    onboard, finishOnboard, showGuide, tourEvent, tourSignal,
    user, me, signIn, signOut,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
