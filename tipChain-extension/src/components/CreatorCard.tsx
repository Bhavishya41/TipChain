type CreatorCardProps = {
  amountUsd: number
  creatorName: string
}

export function CreatorCard({ amountUsd, creatorName }: CreatorCardProps) {
  return (
    <div className="apple-glass-inset apple-squircle-14 flex items-center gap-3 p-3.5">
      {/* iOS style user icon */}
      <div
        aria-hidden="true"
        className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#007AFF] text-base font-bold text-white">
        {creatorName.slice(0, 1).toUpperCase()}
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
          Supporting Creator
        </div>
        <div className="truncate text-sm font-semibold leading-tight text-white/95">
          {creatorName}
        </div>
      </div>
      
      <div className="whitespace-nowrap text-base font-semibold tracking-tight text-[#30D158] bg-[#30D158]/10 px-2.5 py-1 rounded-full border border-[#30D158]/15">
        ${amountUsd}
      </div>
    </div>
  )
}

export default CreatorCard

