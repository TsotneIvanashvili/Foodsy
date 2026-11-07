import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Music2, Link2, Check, RefreshCw } from 'lucide-react'
import { useStore } from '../store'
import { TIKTOK_MOCK } from '../data'
import { Media, Seg, Img } from '../ui'
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
    <div className="flex h-full flex-col">
      <RHeader title={t('uploadTitle')} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-28">
        <Seg
          className="mt-1"
          value={src}
          onChange={(v) => { setSrc(v); setMedia(null) }}
          options={[
            { value: 'file', label: t('fromFile'), icon: <UploadCloud size={15} /> },
            { value: 'tiktok', label: t('fromTikTok'), icon: <Music2 size={15} /> },
          ]}
        />

        <input ref={fileRef} type="file" accept="video/*,image/*" className="hidden" onChange={onFile} />
        {media ? (
          <div className="relative mx-auto mt-3 aspect-[9/14] w-[62%] overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl">
            <Media m={media} active />
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10.5px] font-extrabold"><Check size={12} strokeWidth={3} /> {t('mediaReady')}</div>
            {media.fromTikTok && <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10.5px] font-extrabold">TikTok</div>}
            <button onClick={() => setMedia(null)} className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-[11.5px] font-bold backdrop-blur">
              <RefreshCw size={12} /> {t('change')}
            </button>
          </div>
        ) : src === 'file' ? (
          <button onClick={() => fileRef.current?.click()} className="mt-3 flex h-56 w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-white/20 bg-white/[.03] active:scale-[.99]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3d57] to-[#ff7a1a]"><UploadCloud size={26} /></span>
            <span className="text-[15px] font-extrabold">{t('chooseFile')}</span>
            <span className="text-[12px] text-white/45">{t('fileHint')}</span>
          </button>
        ) : (
          <div className="mt-3 rounded-3xl bg-white/[.06] p-4">
            <div className="text-[13px] font-bold text-white/70">{t('tiktokUrl')}</div>
            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-black/40 px-3">
              <Link2 size={16} className="text-white/40" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.tiktok.com/@restaurant/video/…" className="h-12 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-white/30" />
            </div>
            <button onClick={doImport} disabled={importing} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-[14px] font-extrabold text-black active:scale-[.98] disabled:opacity-70">
              {importing ? (<><span className="spin h-4 w-4 rounded-full border-2 border-black/20 border-t-black" /> {t('importing')}</>) : (<><Music2 size={16} /> {t('import')}</>)}
            </button>
          </div>
        )}

        <div className="mt-5 text-[13px] font-extrabold text-white/70">{t('linkDish')}</div>
        <div className="no-scrollbar -mx-3 mt-2 flex gap-2 overflow-x-auto px-3">
          {my.map((d) => {
            const m = d.media[0]
            return (
              <button key={d.id} onClick={() => pickDish(d.id)} className={`w-[92px] shrink-0 rounded-2xl border-2 p-1 text-left transition ${dishId === d.id ? 'border-[#ff3d57] bg-[#ff3d57]/10' : 'border-transparent bg-white/[.05]'}`}>
                <Img src={m.type === 'video' ? m.poster : m.thumb || m.src} className="aspect-square w-full rounded-xl object-cover" />
                <div className="mt-1 line-clamp-2 px-0.5 text-[11px] font-bold leading-tight">{L(d.name)}</div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 grid grid-cols-[110px_1fr] gap-2">
          <label className="block">
            <span className="text-[12px] font-bold text-white/55">{t('price')}</span>
            <input type="number" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 h-12 w-full rounded-2xl bg-white/[.07] px-3 text-[16px] font-extrabold outline-none focus:ring-2 focus:ring-white/20" />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-white/55">{t('caption')}</span>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={t('captionPh')} className="mt-1 h-12 w-full rounded-2xl bg-white/[.07] px-3 text-[13px] outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/20" />
          </label>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f] to-transparent px-3 pb-3 pt-6">
        <button disabled={!media || busy} onClick={publish} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff3d57] to-[#ff7a1a] text-[16px] font-black shadow-lg shadow-[#ff3d57]/30 active:scale-[.98] disabled:opacity-40">
          {busy ? <span className="spin h-5 w-5 rounded-full border-[3px] border-white/30 border-t-white" /> : <UploadCloud size={19} />}
          {t('publish')}
        </button>
      </div>
    </div>
  )
}
