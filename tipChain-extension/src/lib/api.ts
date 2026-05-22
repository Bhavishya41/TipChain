// src/lib/api.ts — TipChain backend client for the browser extension
// Routes ALL requests through background.ts service worker to bypass YouTube CSP.

export interface ExtApiCreator {
  handle: string
  platform: string
  tokenAddress: string | null
  totalReserveUSD: number
  isClaimed: boolean
  creatorWallet: string | null
  youtubeChannelId: string | null
}

/**
 * Generic fetch-via-background helper.
 * Sends a message to the background service worker which has
 * unrestricted network access (no page CSP).
 */
async function bgFetch<T>(path: string, method = "GET", body?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "API_FETCH", method, path, body },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        if (!response || !response.ok) {
          reject(new Error(response?.data?.error ?? `API ${response?.status ?? "unknown"}`))
          return
        }
        resolve(response.data as T)
      }
    )
  })
}

/**
 * Fetch live creator stats including vault reserve total.
 * Returns null if the creator hasn't been indexed yet.
 */
export async function getCreatorStats(handle: string): Promise<ExtApiCreator | null> {
  const normalized = handle
    .replace(/^@/, "")   // strip leading @
    .toLowerCase()
    .trim()

  return bgFetch<ExtApiCreator>(`/api/creator/${encodeURIComponent(normalized)}`).catch(
    () => null
  )
}

/**
 * Get the live USD vault total for a creator.
 * Returns the real on-chain reserve for indexed creators,
 * or 0 for creators who haven't been registered on TipChain yet.
 */
export async function getCreatorVaultTotal(creatorName: string): Promise<number> {
  const creator = await getCreatorStats(creatorName)
  if (creator !== null) return creator.totalReserveUSD

  // Creator not yet in DB → they have no vault/tips yet
  return 0
}
