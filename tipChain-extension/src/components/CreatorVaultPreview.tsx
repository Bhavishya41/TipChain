type CreatorVaultPreviewProps = {
  amountUsd: number
  creatorName: string
  totalUsd: number
  loading?: boolean  // show skeleton while live data is fetching
}

export function CreatorVaultPreview({
  amountUsd,
  creatorName,
  totalUsd,
  loading = false
}: CreatorVaultPreviewProps) {
  const projectedTotal = totalUsd + amountUsd

  // Apple progress width calculation
  const progressPercent = Math.min(Math.round((projectedTotal / 600) * 100), 100)

  return (
    <div className="apple-glass-inset apple-squircle-14 relative overflow-hidden p-3.5">

      <div className="relative flex items-center justify-between">
        <div className="min-w-0">
          <div className="mb-0.5 text-xs font-semibold text-white/95">
            Creator Vault
          </div>
          <div className="truncate text-[11px] text-[#8E8E93]">
            {creatorName}'s onchain support pool
          </div>
        </div>

        <div className="text-right">
          {loading ? (
            <div className="h-7 w-16 rounded bg-white/10 animate-pulse" />
          ) : (
            <>
              <div className="text-xl font-semibold leading-none text-white tracking-tight">
                ${projectedTotal.toFixed(2)}
              </div>
              <div className="mt-1.5 text-[9px] font-bold text-[#8E8E93] uppercase tracking-wide">
                projected balance
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress track */}
      <div className="relative mt-3.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        {loading ? (
          <div className="h-full rounded-full bg-white/10 animate-pulse" style={{ width: '40%' }} />
        ) : (
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full rounded-full bg-[#007AFF] transition-all duration-300 ease-out"
          />
        )}
      </div>
    </div>
  )
}

export default CreatorVaultPreview
