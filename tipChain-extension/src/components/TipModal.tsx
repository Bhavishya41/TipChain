import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"

import { getCreatorVaultTotal } from "~src/lib/api"
import { type SendTipResult } from "~src/lib/mockApi"
import { connectWalletBridge, executeGaslessTipBridge } from "~src/lib/web3-client"

import CreatorCard from "./CreatorCard"
import CreatorVaultPreview from "./CreatorVaultPreview"
import SuccessState from "./SuccessState"
import WalletButton from "./WalletButton"

type TipModalProps = {
  creatorName: string
  onClose: () => void
  open: boolean
  platform: "youtube" | "twitter"
  sourceUrl: string
}

const presetAmounts = [1, 5, 10, 25]

export function TipModal({
  creatorName,
  onClose,
  open,
  platform,
  sourceUrl
}: TipModalProps) {
  const [amountUsd, setAmountUsd] = useState(5)
  const [customAmount, setCustomAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const connected = !!walletAddress
  const [message, setMessage] = useState("")
  const [result, setResult] = useState<SendTipResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // ── Live vault total from backend ──────────────────────────────────────────
  const [vaultTotalUsd, setVaultTotalUsd] = useState(0)
  const [vaultLoading, setVaultLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setVaultLoading(true)

    getCreatorVaultTotal(creatorName)
      .then((total) => { if (!cancelled) setVaultTotalUsd(total) })
      .catch(() => { /* fallback already handled inside getCreatorVaultTotal */ })
      .finally(() => { if (!cancelled) setVaultLoading(false) })

    return () => { cancelled = true }
  }, [open, creatorName])

  // ── Active amount (preset or custom) ──────────────────────────────────────
  const activeAmount = useMemo(() => {
    const parsed = Number(customAmount)
    if (customAmount && Number.isFinite(parsed) && parsed > 0) {
      return Math.min(parsed, 999)
    }
    return amountUsd
  }, [amountUsd, customAmount])

  // ── Keyboard + scroll lock ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onClose, open])

  useEffect(() => {
    if (!open) {
      setSubmitting(false)
      setResult(null)
    }
  }, [open])

  if (!open) return null

  // ── Submit tip ─────────────────────────────────────────────────────────────
  async function handleConnect() {
    try {
      const address = await connectWalletBridge()
      setWalletAddress(address)
    } catch (err) {
      console.error("Wallet connection failed:", err)
      alert(err instanceof Error ? err.message : "Connection failed")
    }
  }

  async function onSubmit() {
    if (!walletAddress || activeAmount <= 0) return
    setSubmitting(true)
    try {
      const { txHash, explorerUrl } = await executeGaslessTipBridge(
        creatorName,
        activeAmount,
        walletAddress
      )
      setResult({
        status: "success",
        explorerUrl,
        gasSponsored: true,
        txHash,
        vaultTotalUsd: vaultTotalUsd + activeAmount
      })
    } catch (err) {
      console.error("Gasless tip execution failed:", err)
      alert(err instanceof Error ? err.message : "Transaction failed")
    }
    setSubmitting(false)
  }

  return createPortal(
    <div className="tipchain-ui fixed inset-0 z-[2147483647] pointer-events-none">
      {/* Backdrop */}
      <div
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !submitting) onClose()
        }}
        className="fixed inset-0 flex items-center justify-center bg-black/65 p-4 font-sans text-white pointer-events-auto animate-fade-in">

        {/* Modal Container */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Tip ${creatorName}`}
          className="apple-glass apple-squircle-24 relative w-[min(400px,100vw-32px)] max-w-[400px] overflow-hidden p-6 shadow-2xl animate-ios-slide-up">

          {result ? (
            <SuccessState
              amountUsd={activeAmount}
              creatorName={creatorName}
              result={result}
              message={message}
              onClose={onClose}
            />
          ) : (
            <>
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#0A84FF]">
                    TipChain Support
                  </div>
                  <h2 className="m-0 mt-0.5 text-lg font-semibold leading-none tracking-tight text-white/95">
                    Send Gasless Tip
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close TipChain modal"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 text-[#AEAEB2] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="space-y-[18px]">
                {/* Creator + live vault preview */}
                <div className="space-y-3">
                  <CreatorCard amountUsd={activeAmount} creatorName={creatorName} />
                  <CreatorVaultPreview
                    amountUsd={activeAmount}
                    creatorName={creatorName}
                    totalUsd={vaultTotalUsd}
                    loading={vaultLoading}
                  />
                </div>

                {/* Amount Selector */}
                <div className="space-y-3">
                  <div>
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
                      Amount
                    </div>
                    <div className="apple-segmented-control">
                      {presetAmounts.map((amount) => {
                        const selected = !customAmount && amountUsd === amount
                        return (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              setCustomAmount("")
                              setAmountUsd(amount)
                            }}
                            className={[
                              "apple-segmented-item",
                              selected ? "active" : ""
                            ].join(" ")}>
                            ${amount}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
                      Custom Amount
                    </div>
                    <input
                      inputMode="decimal"
                      min="1"
                      placeholder="Enter custom support amount"
                      type="number"
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      className="apple-input w-[94%]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
                    Message (Optional)
                  </div>
                  <textarea
                    maxLength={120}
                    placeholder="Add an encouraging note to your tip"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="apple-input w-[94%] h-[64px] resize-none"
                  />
                </div>

                {/* Footer Controls */}
                <div className="pt-4.5 border-t border-white/5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <WalletButton
                      walletAddress={walletAddress}
                      onConnect={handleConnect}
                    />
                    <div className="text-[11px] font-semibold text-[#0A84FF] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Gas Abstraction Active</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting || activeAmount <= 0 || !connected}
                    className={[
                      "apple-btn apple-squircle-14 h-[50px] w-full text-[15px] font-bold tracking-wide border",
                      (submitting || activeAmount <= 0 || !connected)
                        ? "bg-[#2C2C2E] text-white/20 border-white/5 cursor-not-allowed"
                        : "apple-btn-blue border-transparent"
                    ].join(" ")}>
                    {submitting ? "Routing through Base..." : "Send Tip"}
                  </button>
                </div>
              </div>

              {/* Subtitle */}
              <div className="mt-3.5 text-center text-[10px] text-[#8E8E93]">
                Settling instantly on Base Sepolia • Zero gas fees
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TipModal
