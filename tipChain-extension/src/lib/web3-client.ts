/**
 * Isolated World client to communicate with the MAIN world web3-provider.
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
  return sendMessage("EXECUTE_TIP", { handle, amount: amountUsd, wallet: walletAddress })
}
