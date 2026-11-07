import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useStore } from '../store'

// Spotlight product tour: dims the screen, highlights one element, explains it.
// Targets are elements with data-tour="<id>"; a step without target is a centered card.
const STEPS = {
  customer: [
    { id: 'welcome' },
    { id: 'dish', target: 'dish' },
    { id: 'match', target: 'match' },
    { id: 'reality', target: 'reality' },
    { id: 'order', target: 'order' },
    { id: 'cats', target: 'cats' },
    { id: 'hungry', target: 'nav-hungry' },
    { id: 'profile', target: 'nav-profile' },
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
const CARD_W = 290

export default function Tour() {
  const { onboard, finishOnboard, t } = useStore()
  const [i, setI] = useState(0)
  const [box, setBox] = useState(null) // spotlight rect in screen coords
  const [screen, setScreen] = useState({ w: 390, h: 844 })
  const rootRef = useRef(null)

  const steps = onboard ? STEPS[onboard] : []
  const step = steps[i]

  useEffect(() => { setI(0) }, [onboard])

  const measure = useCallback(() => {
    const overlay = rootRef.current
    if (!overlay || !step) return
    const root = overlay.parentElement
    const rr = root.getBoundingClientRect()
    const scale = rr.width / root.offsetWidth || 1 // phone frame may be CSS-scaled
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
    const iv = setInterval(measure, 300) // follow layout changes/animations
    window.addEventListener('resize', measure)
    return () => { clearInterval(iv); window.removeEventListener('resize', measure) }
  }, [measure])

  const next = useCallback(() => (i < steps.length - 1 ? setI(i + 1) : finishOnboard()), [i, steps.length, finishOnboard])
  const prev = useCallback(() => setI((x) => Math.max(0, x - 1)), [])

  useEffect(() => {
    if (!onboard) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'Escape') finishOnboard()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onboard, next, prev, finishOnboard])

  if (!onboard || !step) return null

  const last = i === steps.length - 1
  const cardW = Math.min(CARD_W, screen.w - 24)
  // place card below the target if it sits in the upper half, above otherwise
  let cardStyle
  let caret = null
  if (box) {
    const cx = box.x + box.w / 2
    const left = Math.max(12, Math.min(screen.w - 12 - cardW, cx - cardW / 2))
    const below = box.y + box.h / 2 < screen.h / 2
    cardStyle = below ? { left, top: box.y + box.h + 12 } : { left, bottom: screen.h - box.y + 12 }
    caret = { left: Math.max(16, Math.min(cardW - 16, cx - left)), below }
  } else {
    cardStyle = { left: (screen.w - cardW) / 2, top: '50%', transform: 'translateY(-50%)' }
  }

  return (
    <div ref={rootRef} className="anim-fade absolute inset-0 z-[75]" onClick={(e) => e.stopPropagation()}>
      {/* dim + spotlight hole */}
      {box ? (
        <div
          className="pointer-events-none absolute transition-all duration-300 ease-out"
          style={{ left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.radius, boxShadow: '0 0 0 9999px rgba(0,0,0,.72), 0 0 0 2px rgba(255,255,255,.9)' }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/72" />
      )}

      {/* explanation card */}
      <div key={step.id} className="anim-fade-up absolute rounded-2xl bg-white p-4 text-black shadow-2xl" style={{ width: cardW, ...cardStyle }}>
        {caret && (
          <span
            className="absolute h-3 w-3 rotate-45 bg-white"
            style={caret.below ? { top: -6, left: caret.left - 6 } : { bottom: -6, left: caret.left - 6 }}
          />
        )}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-black/40">{i + 1} / {steps.length}</span>
          {!last && <button onClick={finishOnboard} className="text-[12px] font-bold text-black/45 active:scale-95">{t('skip')}</button>}
        </div>
        <div className="mt-1 text-[16px] font-black leading-snug">{t(`tour_${step.id}_t`)}</div>
        <div className="mt-1 text-[13px] leading-snug text-black/65">{t(`tour_${step.id}_d`)}</div>
        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-4 bg-[#ff3d57]' : 'w-1.5 bg-black/15'}`} />)}
          </div>
          <div className="flex items-center gap-2">
            {i > 0 && (
              <button onClick={prev} aria-label={t('back')} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[.07] active:scale-90">
                <ArrowLeft size={17} />
              </button>
            )}
            {last ? (
              <button onClick={finishOnboard} className="h-9 rounded-full bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] px-4 text-[13px] font-extrabold text-white active:scale-95">{t('tourDone')}</button>
            ) : (
              <button onClick={next} aria-label={t('next')} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-white active:scale-90">
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
