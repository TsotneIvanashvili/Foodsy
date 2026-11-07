import { useEffect, useRef, useState } from 'react'
import { Star, ImagePlus, Sparkles, X, Check, ShieldCheck, ScanLine, FlaskConical, Camera } from 'lucide-react'
import { useStore } from '../store'
import { REJECT_PHOTO } from '../data'
import { Header, Img, Sheet, MatchRing } from '../ui'

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
  const demoPhoto = () => setPhoto(d.demoPhoto || (d.media[0].type === 'video' ? d.media[0].poster : d.media[0].src))

  const submit = () => {
    setTestReject(false)
    setPhase('checking')
  }
  const runReject = () => {
    setTestReject(true)
    setPhase('checking')
  }

  const onChecked = (ok) => {
    if (!ok) { setPhase('rejected'); return }
    const res = addReview({ orderId, dishId, stars, match, photo, text: text.trim() })
    setResult(res)
    setPhase('approved')
  }

  if (phase === 'checking') {
    return <Moderation photo={testReject ? REJECT_PHOTO : photo} dishName={L(d.name)} reject={testReject} onDone={onChecked} />
  }

  if (phase === 'rejected') {
    return (
      <Sheet>
        <Header title={t('aiTitle')} onBack={() => setPhase('form')} />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="relative h-44 w-36 overflow-hidden rounded-2xl opacity-70 grayscale">
            <Img src={REJECT_PHOTO} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-red-500/30"><X size={64} strokeWidth={3} /></div>
          </div>
          <div className="anim-pop mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-500"><X size={30} strokeWidth={3.5} /></div>
          <div className="mt-4 text-[22px] font-black">{t('rejected')}</div>
          <div className="mt-1.5 text-[14px] text-white/60">{t('rejectReason')}</div>
          <button onClick={() => { setPhase('form'); setTestReject(false) }} className="mt-6 h-12 rounded-2xl bg-white px-6 text-[14px] font-extrabold text-black active:scale-95">{t('tryAgain')}</button>
        </div>
      </Sheet>
    )
  }

  if (phase === 'approved' && result) {
    return (
      <Sheet>
        <div className="flex flex-1 flex-col items-center justify-center px-6 pt-[var(--safe-top)] text-center">
          <div className="anim-pop flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-[0_0_60px_rgba(34,197,94,.5)]"><Check size={44} strokeWidth={3.5} /></div>
          <div className="mt-5 text-[24px] font-black">{photo ? t('approved') : t('reviewAdded')}</div>
          <div className="mt-1 text-[14px] text-white/60">{t('approvedSub')}</div>
          {photo && <Img src={photo} className="anim-fade-up mt-5 h-36 w-28 rounded-2xl border-2 border-green-500 object-cover" />}
          <div className="anim-fade-up mt-6 flex items-center gap-4 rounded-3xl bg-white/[.06] px-5 py-4" style={{ animationDelay: '.3s' }}>
            <MatchRing score={result.newScore} from={result.oldScore} size={74} stroke={7} />
            <div className="text-left">
              <div className="text-[12px] font-bold uppercase text-white/50">{t('scoreUpdated')}</div>
              <div className="text-[22px] font-black">
                {result.oldScore}% → <span className={result.newScore >= result.oldScore ? 'text-green-400' : 'text-red-400'}>{result.newScore}%</span>
              </div>
              <div className="text-[12px] text-white/50">{L(d.name)}</div>
            </div>
          </div>
        </div>
        <div className="space-y-2 px-3 pb-[calc(var(--safe-bottom)+10px)]">
          <button onClick={() => replaceTop({ type: 'reality', dishId, fromScore: result.oldScore })} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-[16px] font-black shadow-lg shadow-[#ff3d57]/30 active:scale-[.98]">
            <Sparkles size={18} /> {t('openReality')}
          </button>
          <button onClick={() => setTab(tab)} className="h-12 w-full rounded-2xl bg-white/10 text-[14px] font-bold">{t('backToFeed')}</button>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet>
      <Header title={t('leaveReview')} sub={t('orderNo', { n: o.no })} onBack={() => setTab(tab)} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-4">
        {o.items.length > 1 && (
          <>
            <div className="text-[12px] font-bold text-white/50">{t('selectDish')}</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {o.items.map((it) => (
                <button key={it.dishId} onClick={() => { setDishId(it.dishId); setPhoto(null) }} className={`rounded-full px-3 py-1.5 text-[12.5px] font-bold ${dishId === it.dishId ? 'bg-white text-black' : 'bg-white/10'}`}>
                  {L(dishById(it.dishId).name)}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/[.06] p-2.5">
          <Img src={d.media[0].type === 'video' ? d.media[0].poster : d.media[0].src} className="h-16 w-14 rounded-xl object-cover" />
          <div>
            <div className="text-[11px] font-bold text-white/50">{t('inVideo')}</div>
            <div className="text-[16px] font-extrabold">{L(d.name)}</div>
            <div className="text-[11px] font-bold text-green-400">✅ {t('verifiedOrder')} #{o.no}</div>
          </div>
        </div>

        <div className="mt-5 text-center text-[17px] font-extrabold">{t('rateTitle')}</div>
        <div className="mt-2 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setStars(i)} className="active:scale-90">
              <Star size={38} className={i <= stars ? 'fill-amber-400 text-amber-400' : 'text-white/20'} />
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-[17px] font-extrabold">{t('looksLike')}</div>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {[
            { k: 'yes', e: '✅', c: 'border-green-500 bg-green-500/15' },
            { k: 'partly', e: '🤏', c: 'border-amber-500 bg-amber-500/15' },
            { k: 'no', e: '❌', c: 'border-red-500 bg-red-500/15' },
          ].map((x) => (
            <button key={x.k} onClick={() => setMatch(x.k)} className={`flex h-[74px] flex-col items-center justify-center gap-1 rounded-2xl border-2 transition active:scale-95 ${match === x.k ? x.c : 'border-white/10 bg-white/[.04]'}`}>
              <span className="text-2xl">{x.e}</span>
              <span className="text-[13px] font-extrabold">{t(`a_${x.k}`)}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 text-[15px] font-extrabold">{t('yourPhoto')}</div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        {photo ? (
          <div className="relative mt-2 h-52 overflow-hidden rounded-2xl">
            <Img src={photo} className="h-full w-full object-cover" />
            <button onClick={() => setPhoto(null)} className="absolute right-2 top-2 flex h-8 items-center gap-1 rounded-full bg-black/60 px-3 text-[12px] font-bold backdrop-blur"><X size={14} /> {t('remove')}</button>
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => fileRef.current?.click()} className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 text-[13px] font-bold text-white/80 active:scale-[.98]">
              <ImagePlus size={26} /> {t('addPhoto')}
            </button>
            <button onClick={demoPhoto} className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sky-400/40 bg-sky-500/5 text-[13px] font-bold text-sky-300 active:scale-[.98]">
              <Camera size={26} /> {t('demoPhoto')}
            </button>
          </div>
        )}

        <div className="mt-5 text-[15px] font-extrabold">{t('comment')}</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t('commentPh')} rows={3} className="mt-2 w-full resize-none rounded-2xl bg-white/[.06] p-3 text-[14px] outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/20" />

        <button onClick={runReject} className="mx-auto mt-3 flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[12px] font-bold text-white/55 active:scale-95">
          <FlaskConical size={14} /> {t('rejectDemo')}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f] to-transparent px-3 pb-[calc(var(--safe-bottom)+10px)] pt-6">
        <button disabled={!match} onClick={submit} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-[16px] font-black shadow-lg shadow-[#ff3d57]/30 active:scale-[.98] disabled:opacity-40">
          {match ? t('submit') : t('needAnswer')}
        </button>
      </div>
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
        <div className="relative h-60 w-48 overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl">
          {photo ? <Img src={photo} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-5xl">⭐</div>}
          <div className="absolute inset-0 bg-sky-500/10" />
          <div className="scanline absolute inset-x-0 h-1 bg-sky-400 shadow-[0_0_24px_6px_rgba(56,189,248,.8)]" />
          <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-sky-300/50" />
        </div>
        <div className="mt-6 flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wide text-sky-300">
          <ScanLine size={16} /> {t('aiTitle')}
        </div>
        <div className="mt-1 text-[22px] font-black">{t('checking')}</div>
        <div className="mt-5 w-full max-w-[290px] space-y-2.5">
          {checks.map((c, i) => {
            const shown = i < n
            const pending = i === n
            return (
              <div key={c.k} className={`flex items-center gap-2.5 text-[14px] font-semibold transition-opacity duration-300 ${shown || pending ? 'opacity-100' : 'opacity-30'}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${shown ? (c.ok ? 'bg-green-500' : 'bg-red-500') : 'bg-white/10'}`}>
                  {shown ? (c.ok ? <Check size={14} strokeWidth={3.5} /> : <X size={14} strokeWidth={3.5} />) : pending ? <span className="spin h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white" /> : null}
                </span>
                <span className={shown && !c.ok ? 'text-red-300' : ''}>{t(c.k, { d: dishName })}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex items-center gap-1.5 text-[11.5px] text-white/40">
          <ShieldCheck size={13} /> {t('onlyVerified')}
        </div>
      </div>
    </Sheet>
  )
}
