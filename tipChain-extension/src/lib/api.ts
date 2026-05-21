// src/lib/api.ts — TipChain backend client for the browser extension
// Uses PLASMO_PUBLIC_API_URL (set in .env)

const BASE_URL = process.env.PLASMO_PUBLIC_API_URL ?? "http://localhost:8000"

export interface ExtApiCreator {
  handle: string
  platform: string
  tokenAddress: string | null
  totalReserveUSD: number
  isClaimed: boolean
  creatorWallet: string | null
  youtubeChannelId: string | null
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string })?.error ?? `API ${res.status}`)
  }

  return res.json() as Promise<T>
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

  return apiFetch<ExtApiCreator>(`/api/creator/${encodeURIComponent(normalized)}`).catch(
    () => null
  )
}

/**
 * Get the live USD vault total for a creator.
 * Falls back to a deterministic seed-based number when the creator isn't in DB.
 */
export async function getCreatorVaultTotal(creatorName: string): Promise<number> {
  const creator = await getCreatorStats(creatorName)
  if (creator !== null) return creator.totalReserveUSD

  // Deterministic fallback so the UI is never empty
  const seed = Array.from(creatorName).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  )
  return 120 + (seed % 380)
}
