type WalletButtonProps = {
  walletAddress: string | null
  onConnect: () => void
}

export function WalletButton({ walletAddress, onConnect }: WalletButtonProps) {
  const connected = !!walletAddress
  return (
    <button
      type="button"
      onClick={connected ? undefined : onConnect}
      disabled={connected}
      className={[
        "apple-btn apple-squircle-12 h-[34px] px-3 text-xs font-semibold leading-none border transition-all duration-200",
        connected
          ? "border-white/5 bg-[#30D158]/10 text-[#30D158] cursor-default"
          : "border-white/10 bg-white/5 text-white/95 hover:bg-white/10 active:bg-white/5"
      ].join(" ")}>
      
      {/* Wallet icon or status dot */}
      {connected ? (
        <>
          <span
            aria-hidden="true"
            className="mr-2 h-1.5 w-1.5 rounded-full bg-[#30D158] pulse-green"
          />
          {walletAddress?.slice(0, 5)}...{walletAddress?.slice(-4)}
        </>
      ) : (
        <>
          <svg 
            className="mr-2 w-3.5 h-3.5 text-white/80" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round">
            <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-3" />
            <circle cx="18" cy="12" r="1" />
          </svg>
          Connect Wallet
        </>
      )}
    </button>
  )
}

export default WalletButton

