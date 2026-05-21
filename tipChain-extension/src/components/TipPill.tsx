type TipPillProps = {
  creatorName?: string
  onClick?: () => void
}

export function TipPill({ creatorName = "this creator", onClick }: TipPillProps) {
  return (
    <button
      type="button"
      aria-label={`Tip ${creatorName} with TipChain`}
      title={`Tip ${creatorName}`}
      onClick={onClick}
      className="group relative z-20 ml-3 inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full border-0 bg-[#007AFF] px-4 font-sans text-xs font-bold tracking-tight text-white outline-none transition-all duration-200 hover:bg-[#0A84FF] active:bg-[#0066CC]">
      <svg 
        className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:scale-110 fill-current" 
        viewBox="0 0 24 24" 
        fill="currentColor">
        <path d="M12 2C6.48 2 2 4.02 2 6.5s4.48 4.5 10 4.5 10-2.02 10-4.5S17.52 2 12 2zm0 18c-5.52 0-10-2.02-10-4.5v-3c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v3c0 2.48-4.48 4.5-10 4.5zm0-5c-5.52 0-10-2.02-10-4.5v-3c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v3c0 2.48-4.48 4.5-10 4.5z" />
      </svg>
      <span>Tip</span>
    </button>
  )
}

export default TipPill

