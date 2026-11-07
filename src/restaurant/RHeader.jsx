import { useStore } from '../store'
import { Cert, LangToggle } from '../ui'

export default function RHeader({ title }) {
  const { myRid, restById, L, setTab } = useStore()
  const r = restById(myRid)
  return (
    <div className="flex shrink-0 items-center gap-3 px-4 pb-2 pt-[calc(var(--safe-top)+8px)]">
      <button onClick={() => setTab('profile')} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-black" style={{ background: r.color }}>
        {L(r.name)[0]}
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[21px] font-black leading-tight">{title}</div>
        <div className="flex items-center gap-1 truncate text-[12px] font-bold text-white/55">{L(r.name)} <Cert size={12} /></div>
      </div>
      <LangToggle />
    </div>
  )
}
