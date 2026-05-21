/**
 * Isolated World client to communicate with the MAIN world web3-provider.
 * Backend sync is routed through background.ts service worker.
 */

function sendMessage<T>(action: string, payload?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substring(2, 9)

    const handler = (event: MessageEvent) => {
      if (event.source !== window || !event.data) return
      if (event.data.target !== "tipchain-isolated-world" || event.data.id !== id) return

      window.removeEventListener("message", handler)

      if (event.data.error) {
        reject(new Error(event.data.error))
      } else {
        resolve(event.data.result)
      }
    }

    window.addEventListener("message", handler)
    window.postMessage({ target: "tipchain-main-world", id, action, payload }, "*")
  })
}

export async function connectWalletBridge(): Promise<string> {
  return sendMessage<string>("CONNECT_WALLET")
}

export async function executeGaslessTipBridge(
  handle: string,
  amountUsd: number,
  walletAddress: string
): Promise<{ txHash: string; explorerUrl: string }> {
  const result = await sendMessage<{ txHash: string; explorerUrl: string }>(
    "EXECUTE_TIP",
    { handle, amount: amountUsd, wallet: walletAddress }
  )

  // ── Sync tip to backend via background service worker ─────────────────────
  const platform = window.location.hostname.includes("youtube") ? "youtube"
    : window.location.hostname.includes("twitter") || window.location.hostname.includes("x.com") ? "twitter"
    : "other"

  try {
    chrome.runtime.sendMessage({
      type: "API_FETCH",
      method: "POST",
      path: "/api/tips",
      body: {
        txHash: result.txHash,
        creatorHandle: handle,
        fanWallet: walletAddress,
        rawAmount: String(amountUsd * 1e6),
        formattedAmount: `$${amountUsd}`,
        timestamp: new Date().toISOString(),
        platform
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("[TipChain] Tip sync error:", chrome.runtime.lastError.message)
      } else {
        console.log("[TipChain] Tip synced to backend:", response)
      }
    })
  } catch (err) {
    console.error("[TipChain] Failed to sync tip:", err)
  }

  return result
}
