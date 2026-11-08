import { useState } from 'react'
import { ChevronLeft, PlayCircle, ShieldCheck, Store } from 'lucide-react'
import { useStore } from '../store'
import { Btn, Field, LangToggle, Logo, Media, Spinner } from '../ui'

// Mock auth: any valid-looking email + 6-char password works. Nothing leaves the browser.
export default function Auth({ view, setView }) {
  if (view === 'welcome') return <Welcome setView={setView} />
  return <Form key={view} mode={view} setView={setView} />
}

function Welcome({ setView }) {
  const { t, dishById } = useStore()
  const hero = dishById('d1').media[0]
  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="relative h-[46%] shrink-0 overflow-hidden">
        <Media m={hero} active eager />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-canvas to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[calc(var(--safe-top)+10px)]">
          <Logo dark className="text-[26px]" />
          <LangToggle dark />
        </div>
      </div>

      <div className="anim-fade-up -mt-6 flex min-h-0 flex-1 flex-col px-6">
        <h1 className="text-[26px] font-bold leading-tight text-ink">{t('welcomeTitle')}</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{t('welcomeSub')}</p>
        <div className="mt-4 space-y-2.5">
          {[
            [PlayCircle, 'feat1'],
            [ShieldCheck, 'feat2'],
            [Store, 'feat3'],
          ].map(([Icon, k]) => (
            <div key={k} className="flex items-center gap-3 text-[13.5px] font-medium text-ink">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"><Icon size={16} /></span>
              {t(k)}
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-2.5 pb-[calc(var(--safe-bottom)+16px)] pt-5">
          <Btn size="lg" className="w-full" onClick={() => setView('register')}>{t('signUp')}</Btn>
          <Btn size="lg" variant="secondary" className="w-full" onClick={() => setView('login')}>{t('logIn')}</Btn>
          <button onClick={() => setView('partner')} className="w-full pt-1 text-center text-[13px] font-semibold text-muted underline-offset-2 hover:underline">
            {t('partnerLogin')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Form({ mode, setView }) {
  const { t, lang, signIn, showToast } = useStore()
  const isReg = mode === 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)

  const title = isReg ? t('createAccount') : mode === 'partner' ? t('partnerTitle') : t('welcomeBack')
  const sub = isReg ? t('createSub') : mode === 'partner' ? t('partnerSub') : t('loginSub')

  const fillDemo = () => {
    setErr({})
    if (mode === 'partner') { setEmail('sakhli@foodsy.ge'); setPass('foodsy123'); return }
    setName(lang === 'ka' ? 'ნინო' : 'Nino')
    setEmail('nino@foodsy.ge')
    setPass('foodsy123')
  }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (isReg && !name.trim()) er.name = t('errName')
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) er.email = t('errEmail')
    if (pass.length < 6) er.pass = t('errPass')
    setErr(er)
    if (Object.keys(er).length) return
    setBusy(true)
    setTimeout(() => {
      signIn({ name: isReg ? name : mode === 'partner' ? 'Partner' : '', email: email.trim(), asRole: mode === 'partner' ? 'restaurant' : 'customer', isNew: isReg })
    }, 800)
  }

  return (
    <form onSubmit={submit} className="anim-slide-in flex h-full flex-col bg-canvas" noValidate>
      <div className="flex items-center justify-between px-4 pt-[calc(var(--safe-top)+8px)]">
        <button type="button" onClick={() => setView('welcome')} className="flex h-9 w-9 items-center justify-center rounded-full bg-soft text-ink active:scale-90" aria-label={t('back')}>
          <ChevronLeft size={21} />
        </button>
        <LangToggle />
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pt-6">
        <Logo className="text-[22px]" />
        <h1 className="mt-4 text-[26px] font-bold leading-tight text-ink">{title}</h1>
        <p className="mt-1.5 text-[14px] text-muted">{sub}</p>

        <div className="mt-7 space-y-4">
          {isReg && <Field label={t('name')} placeholder={t('namePh')} value={name} onChange={(e) => setName(e.target.value)} error={err.name} autoComplete="given-name" />}
          <Field label={t('email')} type="email" inputMode="email" placeholder={t('emailPh')} value={email} onChange={(e) => setEmail(e.target.value)} error={err.email} autoComplete="email" />
          <Field
            label={t('password')}
            type={show ? 'text' : 'password'}
            placeholder={t('passwordPh')}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            error={err.pass}
            autoComplete={isReg ? 'new-password' : 'current-password'}
            right={
              <button type="button" onClick={() => setShow((x) => !x)} className="pl-2 text-[12.5px] font-semibold text-muted">
                {show ? t('hidePass') : t('showPass')}
              </button>
            }
          />
          {!isReg && (
            <button type="button" onClick={() => showToast(t('forgotToast'))} className="text-[13px] font-semibold text-accent">{t('forgot')}</button>
          )}
        </div>

        <button type="button" onClick={fillDemo} className="mt-6 text-[12.5px] font-semibold text-muted underline underline-offset-2">{t('demoFill')}</button>
      </div>

      <div className="space-y-3 px-6 pb-[calc(var(--safe-bottom)+16px)] pt-3">
        {isReg && <p className="text-center text-[11.5px] leading-snug text-faint">{t('terms')}</p>}
        <Btn type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? <Spinner light /> : isReg ? t('signUp') : t('logIn')}
        </Btn>
        {mode !== 'partner' && (
          <p className="text-center text-[13px] text-muted">
            {isReg ? t('haveAccount') : t('noAccount')}{' '}
            <button type="button" onClick={() => setView(isReg ? 'login' : 'register')} className="font-semibold text-ink">
              {isReg ? t('logIn') : t('signUp')}
            </button>
          </p>
        )}
      </div>
    </form>
  )
}
