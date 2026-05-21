export type SendTipPayload = {
  amountUsd: number
  creatorName: string
  message?: string
  platform: "youtube" | "twitter"
  sourceUrl: string
}

export type SendTipResult = {
  explorerUrl: string
  gasSponsored: boolean
  status: "success"
  txHash: string
  vaultTotalUsd: number
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export async function sendTip(payload: SendTipPayload): Promise<SendTipResult> {
  await wait(1450)

  const seed = `${payload.creatorName}-${payload.amountUsd}-${Date.now()}`
  const txHash = `0x${Array.from(seed)
    .map((char) => char.charCodeAt(0).toString(16))
    .join("")
    .slice(0, 64)
    .padEnd(64, "0")}`

  return {
    explorerUrl: `https://sepolia.basescan.org/tx/${txHash}`,
    gasSponsored: true,
    status: "success",
    txHash,
    vaultTotalUsd: getMockVaultTotal(payload.creatorName) + payload.amountUsd
  }
}

export function getMockVaultTotal(creatorName: string) {
  const seed = Array.from(creatorName).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  )

  return 120 + (seed % 380)
}
