import type { SendTipResult } from "~src/lib/mockApi"

type SuccessStateProps = {
  amountUsd: number
  creatorName: string
  result: SendTipResult
  message?: string
  onClose: () => void
}

export function SuccessState({
  amountUsd,
  creatorName,
  result,
  message,
  onClose
}: SuccessStateProps) {
  // Truncate transaction hash
  const shortHash = result.txHash.slice(0, 10) + "..." + result.txHash.slice(-8)

  const recentSupporters = [
    { address: "You (0x71C...9A2)", amount: amountUsd, message: message || "Sent support!", isUser: true },
    { address: "0x3B...a8F", amount: 10, message: "Keep up the great videos!" },
    { address: "0x7F...c1D", amount: 5, message: "Super clean web3 hack!" }
  ]

  return (
    <div className="text-center animate-ios-slide-up">
      {/* Animated Success Checkmark Ring with Confetti Particles */}
      <div className="relative mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#30D158]/10 text-[#30D158]">
        <span className="confetti-particle confetti-1" />
        <span className="confetti-particle confetti-2" />
        <span className="confetti-particle confetti-3" />
        <span className="confetti-particle confetti-4" />
        <span className="confetti-particle confetti-5" />
        <span className="confetti-particle confetti-6" />

        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3">
          <path
            className="check-animation"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="m-0 mb-1 text-xl font-semibold leading-none tracking-tight text-white">
        Transaction Complete
      </h2>

      <p className="mx-auto mb-5 mt-1.5 max-w-[280px] text-s leading-relaxed text-[#AEAEB2]">
        Successfully sent ${amountUsd} to {creatorName}. Gas sponsored by TipChain on Base Sepolia.
      </p>

      {/* Vault Balance Display Widget */}
      <div className="apple-glass-inset apple-squircle-14 mb-4.5 p-4">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
          Creator Vault Balance
        </div>
        <div className="text-2xl font-bold leading-none text-white tracking-tight">
          ${result.vaultTotalUsd}
        </div>
      </div>

      {/* Recent Supporters */}
      <div className="p-5 text-left">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] text-center">
          Recent Supporters
        </div>
        <div className="space-y-1.5 max-h-[150px] overflow-y-auto apple-scrollbar pr-0.5">
          {recentSupporters.map((supporter, idx) => (
            <div
              key={idx}
              className={[
                "apple-glass-inset apple-squircle-10 flex items-center justify-between p-2 text-[11px] border",
                supporter.isUser ? "border-[#007AFF]/35 bg-[#007AFF]/5" : "border-white/5"
              ].join(" ")}>
              <div className="min-w-0 flex-1 pr-2">
                <div className="font-semibold text-white/90 truncate">{supporter.address}</div>
                <div className="text-[#AEAEB2] truncate text-[10px] mt-0.5 font-medium">"{supporter.message}"</div>
              </div>
              <span className="font-bold text-[#30D158] flex-none">${supporter.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Hash */}
      <div className="apple-glass-inset apple-squircle-12 mb-5 flex items-center justify-between px-3.5 py-2.5 text-[11px] text-[#8E8E93]">
        <span className="font-medium">Transaction ID</span>
        <a
          href={result.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-white/95 hover:text-[#007AFF] transition-colors duration-150">
          {shortHash}
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onClose}
          className="apple-btn apple-btn-blue apple-squircle-12 h-11 w-full text-sm font-semibold">
          Done
        </button>

        <a
          href={result.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="apple-btn apple-btn-gray apple-squircle-12 h-10 w-full text-xs font-semibold text-white/90">
          View on Explorer
        </a>
      </div>
    </div>
  )
}
export default SuccessState

