import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Hand, MousePointerClick } from 'lucide-react'
import { useStore } from '../store'

// Spotlight tour over the real UI. Targets are elements with data-tour="<id>".
// `action` steps wait for the user to actually do the thing (swipe / open Reality / open checkout);
// only the highlighted element stays clickable. Other steps advance with the → button.
const STEPS = {
  customer: [
    { id: 'hello', center: true },
    { id: 'order', target: 'order' },
    { id: 'swipe', action: 'swipe' },
    { id: 'match', target: 'match', action: 'reality' },
    { id: 'vs', target: 'vs' },
    { id: 'sheetOrder', target: 'sheet-order', action: 'checkout' },
    { id: 'mode', target: 'mode' },
  ],
  restaurant: [
    { id: 'rTabs', target: 'r-tabs' },
    { id: 'rAction', target: 'r-action' },
    { id: 'rDash', target: 'nav-rDash' },
    { id: 'rUpload', target: 'nav-rUpload' },
    { id: 'rPromote', target: 'nav-rPromote' },
    { id: 'rProfile', target: 'nav-profile' },
  ],
}

const PAD = 6
const DIM = 'rgba(10,12,16,.62)'

export default function Tour() {
  const { onboard, finishOnboard, t, L, me, tourEvent, stack } = useStore()
  const [i, setI] = useState(0)
  const [box, setBox] = useState(null)
  const [screen, setScreen] = useState({ w: 390, h: 844 })
  const rootRef = useRef(null)
  const stepStart = useRef(0)

  const steps = onboard ? STEPS[onboard] : []
  const step = steps[i]
  const last = i === steps.length - 1

  useEffect(() => { setI(0) }, [onboard])
  useEffect(() => { stepStart.current = Date.now() }, [i, onboard])

  const next = useCallback(() => (i < steps.length - 1 ? setI(i + 1) : finishOnboard()), [i, steps.length, finishOnboard])
  const prev = useCallback(() => setI((x) => Math.max(0, x - 1)), [])

  // advance when the user performs the step's action
  // (timer is not cancelled by re-renders; the index guard makes it a no-op if the user moved on)
  const handled = useRef(0)
  useEffect(() => {
    if (!step?.action || !tourEvent || handled.current === tourEvent.n) return
    if (tourEvent.evt === step.action && tourEvent.n >= stepStart.current) {
      handled.current = tourEvent.n
      const at = i
      setTimeout(() => setI((x) => (x === at ? x + 1 : x)), step.action === 'swipe' ? 300 : 0)
    }
  }, [tourEvent, step, i])

  // if the user already did the action (e.g. tapped quickly), don't wait for an event that has passed
  useEffect(() => {
    if (!step?.action || step.action === 'swipe') return
    const want = step.action === 'reality' ? 'reality' : 'checkout'
    if (stack.some((o) => o.type === want)) setI((x) => (x === i ? x + 1 : x))
  }, [stack, step, i])

  const measure = useCallback(() => {
    const overlay = rootRef.current
    if (!overlay || !step) return
    const root = overlay.parentElement
    const rr = root.getBoundingClientRect()
    const scale = rr.width / root.offsetWidth || 1 // the desktop phone frame is CSS-scaled
    setScreen({ w: root.offsetWidth, h: root.offsetHeight })
    if (!step.target) { setBox(null); return }
    const el = [...root.querySelectorAll(`[data-tour="${step.target}"]`)].find((e) => {
      const r = e.getBoundingClientRect()
      return r.width > 0 && r.top >= rr.top - 2 && r.bottom <= rr.bottom + 2
    })
    if (!el) { setBox(null); return }
    const r = el.getBoundingClientRect()
    const radius = parseFloat(getComputedStyle(el).borderRadius) || 12
    const x = (r.left - rr.left) / scale - PAD
    const y = (r.top - rr.top) / scale - PAD
    const w = r.width / scale + PAD * 2
    const h = r.height / scale + PAD * 2
    setBox({ x, y, w, h, radius: Math.min(radius + PAD, Math.min(w, h) / 2) })
  }, [step])

  useLayoutEffect(() => {
    measure()
    const iv = setInterval(measure, 250) // follow sheets sliding in, scrolling, resizing
    window.addEventListener('resize', measure)
    return () => { clearInterval(iv); window.removeEventListener('resize', measure) }
  }, [measure])

  useEffect(() => {
    if (!onboard) return
    const onKey = (e) => {
      if (e.key === 'Escape') { finishOnboard(); return }
      if (step?.action) return
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onboard, step, next, prev, finishOnboard])

  if (!onboard || !step) return null

  const isSwipe = step.action === 'swipe'
  const waitsForTap = step.action && !isSwipe
  const canBack = i > 0 && !step.action && !steps[i - 1].action && !steps[i - 1].center
  const cardW = Math.min(300, screen.w - 24)

  // card placement: below the target if it's in the upper half, above otherwise
  let cardStyle
  let caret = null
  if (box) {
    const cx = box.x + box.w / 2
    const left = Math.max(12, Math.min(screen.w - 12 - cardW, cx - cardW / 2))
    const below = box.y + box.h / 2 < screen.h / 2
    cardStyle = below ? { left, top: box.y + box.h + 14 } : { left, bottom: screen.h - box.y + 14 }
    caret = { left: Math.max(18, Math.min(cardW - 18, cx - left)), below }
  } else if (isSwipe) {
    cardStyle = { left: (screen.w - cardW) / 2, top: '17%' }
  } else {
    cardStyle = { left: (screen.w - cardW) / 2, top: '50%', transform: 'translateY(-50%)' }
  }

  const title = t(`tour_${step.id}_t`, { name: L(me) })

  return (
    <div ref={rootRef} className="anim-fade pointer-events-none absolute inset-0 z-[75]">
      {/* dim layer: four panels around the hole so the highlighted element stays clickable */}
      {box ? (
        <>
          <div className="pointer-events-auto absolute inset-x-0 top-0 transition-all duration-300" style={{ height: Math.max(0, box.y), background: DIM }} />
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 transition-all duration-300" style={{ top: box.y + box.h, background: DIM }} />
          <div className="pointer-events-auto absolute left-0 transition-all duration-300" style={{ top: box.y, height: box.h, width: Math.max(0, box.x), background: DIM }} />
          <div className="pointer-events-auto absolute right-0 transition-all duration-300" style={{ top: box.y, height: box.h, left: box.x + box.w, background: DIM }} />
          {/* outline; also blocks the hole on read-only steps */}
          <div
            className={`absolute transition-all duration-300 ${waitsForTap ? 'pointer-events-none' : 'pointer-events-auto'}`}
            style={{ left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.radius, boxShadow: `0 0 0 3px #fff, 0 0 0 9999px transparent` }}
          >
            {waitsForTap && <span className="pulse-ring absolute inset-0 rounded-[inherit] border-2 border-white" />}
          </div>
        </>
      ) : (
        <div className={`absolute inset-0 ${isSwipe ? '' : 'pointer-events-auto'}`} style={{ background: isSwipe ? 'rgba(10,12,16,.35)' : DIM }} />
      )}

      {isSwipe && (
        <div className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2">
          <span className="anim-swipe flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink shadow-[var(--shadow-float)]">
            <Hand size={26} />
          </span>
        </div>
      )}

      {/* explanation card */}
      <div key={step.id} className="anim-fade-up pointer-events-auto absolute rounded-2xl bg-canvas p-4 text-ink shadow-[var(--shadow-float)]" style={{ width: cardW, ...cardStyle }}>
        {caret && <span className="absolute h-3 w-3 rotate-45 bg-canvas" style={caret.below ? { top: -6, left: caret.left - 6 } : { bottom: -6, left: caret.left - 6 }} />}
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] font-semibold text-faint">{i + 1} / {steps.length}</span>
          {!last && <button onClick={finishOnboard} className="text-[12.5px] font-semibold text-muted active:scale-95">{t('skip')}</button>}
        </div>
        <div className="mt-1 text-[17px] font-bold leading-snug">{title}</div>
        <div className="mt-1 text-[13.5px] leading-snug text-muted">{t(`tour_${step.id}_d`)}</div>

        <div className="mt-3.5 flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {steps.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-4 bg-accent' : k < i ? 'w-1.5 bg-ink/30' : 'w-1.5 bg-line'}`} />)}
          </div>
          {step.action ? (
            <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-[12px] font-semibold text-accent">
              {isSwipe ? <Hand size={14} /> : <MousePointerClick size={14} />}
              {isSwipe ? t('tourSwipeHint') : t('tourTapHint')}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              {canBack && (
                <button onClick={prev} aria-label={t('back')} className="flex h-9 w-9 items-center justify-center rounded-full bg-soft active:scale-90">
                  <ArrowLeft size={17} />
                </button>
              )}
              {step.id === 'hello' ? (
                <button onClick={next} className="h-9 rounded-full bg-accent px-4 text-[13px] font-semibold text-white active:scale-95">{t('start')}</button>
              ) : last ? (
                <button onClick={finishOnboard} className="h-9 rounded-full bg-accent px-4 text-[13px] font-semibold text-white active:scale-95">{t('tourDone')}</button>
              ) : (
                <button onClick={next} aria-label={t('next')} className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white active:scale-90">
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
