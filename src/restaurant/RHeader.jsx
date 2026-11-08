import { useStore } from '../store'
import { Cert, LangToggle } from '../ui'

export default function RHeader({ title }) {
  const { myRid, restById, L, setTab } = useStore()
  const r = restById(myRid)
  return (
    <div className="flex shrink-0 items-center gap-3 bg-canvas px-4 pb-3 pt-[calc(var(--safe-top)+10px)]">
      <button onClick={() => setTab('profile')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[16px] font-bold text-white" style={{ background: r.color }}>
        {L(r.name)[0]}
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[21px] font-bold leading-tight">{title}</h1>
        <div className="flex items-center gap-1 truncate text-[12.5px] text-muted">{L(r.name)} <Cert size={12} /></div>
      </div>
      <LangToggle />
    </div>
  )
}
