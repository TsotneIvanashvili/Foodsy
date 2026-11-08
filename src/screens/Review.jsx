import { useEffect, useRef, useState } from 'react'
import { Star, ImagePlus, Sparkles, X, Check, ShieldCheck, ScanLine, FlaskConical, Camera } from 'lucide-react'
import { useStore } from '../store'
import { REJECT_PHOTO } from '../data'
import { Header, Img, Sheet, MatchRing, BottomBar, Btn, still } from '../ui'

export default function Review({ orderId }) {
  const { orders, dishById, L, t, addReview, replaceTop, setTab, tab } = useStore()
  const o = orders.find((x) => x.id === orderId)
  const [dishId, setDishId] = useState(o.items[0].dishId)
  const [stars, setStars] = useState(5)
  const [match, setMatch] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('form') // form | checking | approved | rejected
  const [testReject, setTestReject] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)
  const d = dishById(dishId)

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (f) setPhoto(URL.createObjectURL(f))
    e.target.value = ''
  }
  const demoPhoto = () => setPhoto(d.demoPhoto || still(d.media[0]))

  const onChecked = (ok) => {
    if (!ok) { setPhase('rejected'); return }
    setResult(addReview({ orderId, dishId, stars, match, photo, text: text.trim() }))
    setPhase('approved')
  }

  if (phase === 'checking') return <Moderation photo={testReject ? REJECT_PHOTO : photo} dishName={L(d.name)} reject={testReject} onDone={onChecked} />

  if (phase === 'rejected') {
    return (
      <Sheet>
        <Header title={t('aiTitle')} onBack={() => setPhase('form')} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="relative h-40 w-32 overflow-hidden rounded-2xl grayscale">
            <Img src={REJECT_PHOTO} className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center bg-bad/25"><X size={56} strokeWidth={2.5} className="text-white" /></div>
          </div>
          <div className="anim-pop mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-bad-soft text-bad"><X size={26} strokeWidth={3} /></div>
          <div className="mt-3 text-[21px] font-bold">{t('rejected')}</div>
          <div className="mt-1.5 text-[14px] text-muted">{t('rejectReason')}</div>
          <Btn variant="dark" className="mt-6 px-6" onClick={() => { setPhase('form'); setTestReject(false) }}>{t('tryAgain')}</Btn>
        </div>
      </Sheet>
    )
  }

  if (phase === 'approved' && result) {
    return (
      <Sheet>
        <div className="flex flex-1 flex-col items-center justify-center px-6 pt-[var(--safe-top)] text-center">
          <div className="anim-pop flex h-16 w-16 items-center justify-center rounded-full bg-ok text-white"><Check size={34} strokeWidth={3} /></div>
          <div className="mt-4 text-[22px] font-bold">{photo ? t('approved') : t('reviewAdded')}</div>
          <div className="mt-1 text-[14px] text-muted">{t('approvedSub')}</div>
          {photo && <Img src={photo} className="anim-fade-up mt-5 h-36 w-28 rounded-2xl object-cover ring-2 ring-ok" />}
          <div className="anim-fade-up mt-6 flex items-center gap-4 rounded-2xl bg-soft px-5 py-4" style={{ animationDelay: '.3s' }}>
            <MatchRing score={result.newScore} from={result.oldScore} size={70} stroke={6} />
            <div className="text-left">
              <div className="text-[12px] font-semibold text-muted">{t('scoreUpdated')}</div>
              <div className="text-[21px] font-bold">
                {result.oldScore}% → <span className={result.newScore >= result.oldScore ? 'text-ok' : 'text-bad'}>{result.newScore}%</span>
              </div>
              <div className="text-[12px] text-muted">{L(d.name)}</div>
            </div>
          </div>
        </div>
        <div className="space-y-2 px-4 pb-[calc(var(--safe-bottom)+12px)]">
          <Btn size="lg" className="w-full" onClick={() => replaceTop({ type: 'reality', dishId, fromScore: result.oldScore })}>
            <Sparkles size={17} /> {t('openReality')}
          </Btn>
          <Btn size="lg" variant="secondary" className="w-full" onClick={() => setTab(tab)}>{t('backToFeed')}</Btn>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet>
      <Header title={t('leaveReview')} sub={t('orderNo', { n: o.no })} onBack={() => setTab(tab)} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-4">
        {o.items.length > 1 && (
          <div className="mb-3">
            <div className="text-[12.5px] font-semibold text-muted">{t('selectDish')}</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {o.items.map((it) => (
                <button key={it.dishId} onClick={() => { setDishId(it.dishId); setPhoto(null) }} className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${dishId === it.dishId ? 'bg-ink text-white' : 'bg-soft'}`}>
                  {L(dishById(it.dishId).name)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 rounded-2xl bg-soft p-3">
          <Img src={still(d.media[0])} className="h-14 w-12 rounded-xl object-cover" />
          <div>
            <div className="text-[11.5px] text-muted">{t('inVideo')}</div>
            <div className="text-[15.5px] font-semibold">{L(d.name)}</div>
            <div className="flex items-center gap-1 text-[11.5px] font-semibold text-ok"><ShieldCheck size={12} /> {t('verifiedOrder')} #{o.no}</div>
          </div>
        </div>

        <div className="mt-6 text-center text-[17px] font-bold">{t('rateTitle')}</div>
        <div className="mt-2.5 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setStars(i)} className="active:scale-90" aria-label={`${i}`}>
              <Star size={36} strokeWidth={1.6} className={i <= stars ? 'fill-amber-400 text-amber-400' : 'text-line'} />
            </button>
          ))}
        </div>

        <div className="mt-7 text-center text-[17px] font-bold">{t('looksLike')}</div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { k: 'yes', e: '✅', c: 'border-ok bg-ok-soft' },
            { k: 'partly', e: '🤏', c: 'border-warn bg-warn-soft' },
            { k: 'no', e: '❌', c: 'border-bad bg-bad-soft' },
          ].map((x) => (
            <button key={x.k} onClick={() => setMatch(x.k)} className={`flex h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border-2 transition active:scale-95 ${match === x.k ? x.c : 'border-line'}`}>
              <span className="text-[22px]">{x.e}</span>
              <span className="text-[13px] font-semibold">{t(`a_${x.k}`)}</span>
            </button>
          ))}
        </div>

        <div className="mt-7 text-[15px] font-bold">{t('yourPhoto')}</div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        {photo ? (
          <div className="relative mt-2.5 h-52 overflow-hidden rounded-2xl">
            <Img src={photo} className="h-full w-full object-cover" />
            <button onClick={() => setPhoto(null)} className="absolute right-2 top-2 flex h-8 items-center gap-1 rounded-full bg-canvas/90 px-3 text-[12px] font-semibold shadow"><X size={14} /> {t('remove')}</button>
          </div>
        ) : (
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <button onClick={() => fileRef.current?.click()} className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line text-[13px] font-semibold text-ink active:scale-[.98]">
              <ImagePlus size={24} className="text-muted" /> {t('addPhoto')}
            </button>
            <button onClick={demoPhoto} className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-info/40 bg-info-soft text-[13px] font-semibold text-info active:scale-[.98]">
              <Camera size={24} /> {t('demoPhoto')}
            </button>
          </div>
        )}

        <div className="mt-6 text-[15px] font-bold">{t('comment')}</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t('commentPh')} rows={3} className="mt-2.5 w-full resize-none rounded-xl border border-line p-3 text-[14px] outline-none placeholder:text-faint focus:border-ink" />

        <button onClick={() => { setTestReject(true); setPhase('checking') }} className="mx-auto mt-4 flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[12.5px] font-semibold text-muted active:scale-95">
          <FlaskConical size={14} /> {t('rejectDemo')}
        </button>
      </div>

      <BottomBar>
        <Btn size="lg" className="w-full" disabled={!match} onClick={() => { setTestReject(false); setPhase('checking') }}>
          {match ? t('submit') : t('needAnswer')}
        </Btn>
      </BottomBar>
    </Sheet>
  )
}

function Moderation({ photo, dishName, reject, onDone }) {
  const { t } = useStore()
  const checks = reject
    ? [{ k: 'chk1', ok: true }, { k: 'chk2fail', ok: false }]
    : [{ k: 'chk1', ok: true }, ...(photo ? [{ k: 'chk2', ok: true }, { k: 'chk3', ok: true }] : []), { k: 'chk4', ok: true }]
  const [n, setN] = useState(0)
  const cb = useRef(onDone)
  cb.current = onDone
  const step = Math.round(2000 / checks.length)

  useEffect(() => {
    const tm = n < checks.length ? setTimeout(() => setN((x) => x + 1), step) : setTimeout(() => cb.current(!reject), 450)
    return () => clearTimeout(tm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  return (
    <Sheet>
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-[var(--safe-top)]">
        <div className="relative h-56 w-44 overflow-hidden rounded-3xl bg-soft shadow-[var(--shadow-card)]">
          {photo ? <Img src={photo} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-5xl">⭐</div>}
          <div className="absolute inset-0 bg-info/10" />
          <div className="scanline absolute inset-x-0 h-1 bg-info shadow-[0_0_24px_6px_rgba(37,99,235,.6)]" />
        </div>
        <div className="mt-6 flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wide text-info"><ScanLine size={15} /> {t('aiTitle')}</div>
        <div className="mt-1 text-[21px] font-bold">{t('checking')}</div>
        <div className="mt-5 w-full max-w-[290px] space-y-3">
          {checks.map((c, i) => {
            const shown = i < n
            const pending = i === n
            return (
              <div key={c.k} className={`flex items-center gap-2.5 text-[14px] transition-opacity duration-300 ${shown || pending ? 'opacity-100' : 'opacity-35'}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${shown ? (c.ok ? 'bg-ok text-white' : 'bg-bad text-white') : 'bg-soft'}`}>
                  {shown ? (c.ok ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />) : pending ? <span className="spin h-3.5 w-3.5 rounded-full border-2 border-ink/15 border-t-ink" /> : null}
                </span>
                <span className={shown && !c.ok ? 'font-medium text-bad' : 'font-medium'}>{t(c.k, { d: dishName })}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex items-center gap-1.5 text-[12px] text-faint"><ShieldCheck size={13} /> {t('onlyVerified')}</div>
      </div>
    </Sheet>
  )
}
