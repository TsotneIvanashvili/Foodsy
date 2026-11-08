import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Music2, Link2, Check, RefreshCw } from 'lucide-react'
import { useStore } from '../store'
import { TIKTOK_MOCK } from '../data'
import { Media, Seg, Img, Btn, Spinner, SectionTitle, still } from '../ui'
import RHeader from './RHeader'

export default function RUpload() {
  const { dishes, myRid, restById, L, t, publishMedia, showToast, setTab } = useStore()
  const r = restById(myRid)
  const my = dishes.filter((d) => d.r === myRid)
  const [src, setSrc] = useState('file')
  const [media, setMedia] = useState(null)
  const [url, setUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [dishId, setDishId] = useState(my[0].id)
  const [price, setPrice] = useState(String(my[0].price))
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    setDishId(my[0].id)
    setPrice(String(my[0].price))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRid])

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const u = URL.createObjectURL(f)
    setMedia(f.type.startsWith('video') ? { type: 'video', src: u, poster: null } : { type: 'photo', src: u })
    e.target.value = ''
  }
  const doImport = () => {
    setImporting(true)
    setTimeout(() => {
      setMedia({ ...TIKTOK_MOCK[r.cat], fromTikTok: true })
      setImporting(false)
    }, 1500)
  }
  const pickDish = (id) => {
    setDishId(id)
    setPrice(String(my.find((d) => d.id === id).price))
  }
  const publish = () => {
    setBusy(true)
    setTimeout(() => {
      publishMedia({ dishId, media, price: Number(price) || undefined, caption })
      setBusy(false)
      setMedia(null)
      setCaption('')
      setUrl('')
      showToast(t('published'))
      setTab('rPromote')
    }, 900)
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      <RHeader title={t('uploadTitle')} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-28">
        <Seg
          value={src}
          onChange={(v) => { setSrc(v); setMedia(null) }}
          options={[
            { value: 'file', label: t('fromFile'), icon: <UploadCloud size={15} /> },
            { value: 'tiktok', label: t('fromTikTok'), icon: <Music2 size={15} /> },
          ]}
        />

        <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={onFile} />
        {media ? (
          <div className="relative mx-auto mt-4 aspect-[9/16] w-[56%] overflow-hidden rounded-2xl bg-soft shadow-[var(--shadow-card)]">
            <Media m={media} active />
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-ok px-2 py-0.5 text-[11px] font-semibold text-white"><Check size={12} strokeWidth={3} /> {t('mediaReady')}</div>
            {media.fromTikTok && <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">TikTok</div>}
            <button onClick={() => setMedia(null)} className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-canvas/90 px-3 py-1.5 text-[12px] font-semibold shadow">
              <RefreshCw size={12} /> {t('change')}
            </button>
          </div>
        ) : src === 'file' ? (
          <button onClick={() => fileRef.current?.click()} className="mt-4 flex h-52 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line active:scale-[.99]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent"><UploadCloud size={22} /></span>
            <span className="text-[15px] font-semibold">{t('chooseFile')}</span>
            <span className="text-[12.5px] text-muted">{t('fileHint')}</span>
          </button>
        ) : (
          <div className="mt-4">
            <div className="mb-1.5 text-[13px] font-semibold">{t('tiktokUrl')}</div>
            <div className="flex items-center gap-2 rounded-xl border border-line px-3 focus-within:border-ink">
              <Link2 size={16} className="text-faint" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.tiktok.com/@restaurant/video/…" className="h-12 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-faint" />
            </div>
            <Btn variant="dark" className="mt-3 w-full" onClick={doImport} disabled={importing}>
              {importing ? (<><Spinner light /> {t('importing')}</>) : (<><Music2 size={16} /> {t('import')}</>)}
            </Btn>
          </div>
        )}

        <SectionTitle className="mt-6">{t('linkDish')}</SectionTitle>
        <div className="no-scrollbar -mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4">
          {my.map((d) => (
            <button key={d.id} onClick={() => pickDish(d.id)} className={`w-[92px] shrink-0 rounded-2xl border-2 p-1 text-left transition ${dishId === d.id ? 'border-ink' : 'border-transparent'}`}>
              <Img src={still(d.media[0])} className="aspect-square w-full rounded-xl object-cover" />
              <div className="mt-1 line-clamp-2 px-0.5 text-[11.5px] font-semibold leading-tight">{L(d.name)}</div>
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-[110px_1fr] gap-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold">{t('price')}</span>
            <input type="number" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 w-full rounded-xl border border-line px-3 text-[16px] font-semibold outline-none focus:border-ink" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold">{t('caption')}</span>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={t('captionPh')} className="h-12 w-full rounded-xl border border-line px-3 text-[13.5px] outline-none placeholder:text-faint focus:border-ink" />
          </label>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-line bg-canvas px-4 py-3">
        <Btn size="lg" className="w-full" disabled={!media || busy} onClick={publish}>
          {busy ? <Spinner light /> : <UploadCloud size={18} />}
          {t('publish')}
        </Btn>
      </div>
    </div>
  )
}
