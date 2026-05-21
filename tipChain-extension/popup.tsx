import "./style.css"

const platforms = [
  { 
    label: "YouTube", 
    status: "Live",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.517 0-9.388.553a3.002 3.002 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: "text-[#FF0000]"
  },
  { 
    label: "X / Twitter", 
    status: "Live",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: "text-white"
  }
]

function IndexPopup() {
  return (
    <main className="tipchain-ui">
      <section className="relative w-[360px] overflow-hidden bg-[#0A0A0C] p-5 text-white">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[9px] bg-[#007AFF]">
              <span className="text-white text-xl font-bold tracking-tight">T</span>
            </div>
            <div>
              <h1 className="m-0 text-base font-semibold leading-tight tracking-tight">
                TipChain
              </h1>
              <p className="m-0 text-[11px] font-medium text-[#8E8E93]">
                Gasless creator tipping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#1C1C1E] px-2.5 py-1 text-[11px] font-medium border border-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#30D158] pulse-green" />
            <span className="text-[#30D158]">Active</span>
          </div>
        </div>

        {/* Main Content Card (Apple glass widget style) */}
        <div className="apple-glass apple-squircle-16 p-4 shadow-xl shadow-black/25">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="m-0 text-[10px] font-bold tracking-wider uppercase text-[#0A84FF]">
                Demo Mode
              </p>
              <h2 className="m-0 mt-1 text-sm font-semibold leading-snug tracking-tight text-white/95">
                Creators become tip-able as you browse.
              </h2>
            </div>
            <div className="rounded-full bg-white/5 border border-white/5 px-2.5 py-0.5 text-[9px] font-semibold text-[#AEAEB2] whitespace-nowrap">
              Base Sepolia
            </div>
          </div>

          {/* Platform Status List */}
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div
                key={platform.label}
                className="apple-glass-inset apple-squircle-12 flex items-center justify-between p-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 ${platform.color}`}>
                    {platform.icon}
                  </div>
                  <span className="text-xs font-medium text-white/90">{platform.label}</span>
                </div>
                <span className="text-[11px] font-medium text-[#8E8E93] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                  {platform.status}
                </span>
              </div>
            ))}
          </div>

          {/* Gas Abstraction status */}
          <div className="mt-3.5 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0A84FF]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Gas Abstraction Active</span>
            </div>
            <p className="m-0 mt-1 text-[11px] leading-relaxed text-[#AEAEB2]">
              Tipping requires no gas setup or ETH wallet balances.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="apple-glass-inset apple-squircle-12 p-2.5">
            <div className="text-base font-bold text-white">$5</div>
            <div className="text-[9px] font-semibold text-[#8E8E93] mt-0.5 uppercase tracking-wide">
              Default
            </div>
          </div>
          <div className="apple-glass-inset apple-squircle-12 p-2.5">
            <div className="text-base font-bold text-white">2</div>
            <div className="text-[9px] font-semibold text-[#8E8E93] mt-0.5 uppercase tracking-wide">
              Networks
            </div>
          </div>
          <div className="apple-glass-inset apple-squircle-12 p-2.5">
            <div className="text-base font-bold text-white">0</div>
            <div className="text-[9px] font-semibold text-[#8E8E93] mt-0.5 uppercase tracking-wide">
              Gas Fee
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="m-0 text-[10px] font-medium text-[#48484A] tracking-tight">
            Designed by TipChain on Base
          </p>
        </footer>
      </section>
    </main>
  )
}

export default IndexPopup

