import type { PlasmoCSConfig } from "plasmo"
import { connectWallet, executeGaslessTip } from "~src/lib/web3"

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*", "https://twitter.com/*", "https://www.youtube.com/*"],
  world: "MAIN",
  run_at: "document_idle"
}

window.addEventListener("message", async (event) => {
  if (event.source !== window || !event.data) return
  if (event.data.target !== "tipchain-main-world") return

  const { id, action, payload } = event.data

  try {
    if (action === "CONNECT_WALLET") {
      const address = await connectWallet()
      window.postMessage({ target: "tipchain-isolated-world", id, result: address }, "*")
    } 
    
    else if (action === "EXECUTE_TIP") {
      const result = await executeGaslessTip(payload.handle, payload.amount, payload.wallet)
      window.postMessage({ target: "tipchain-isolated-world", id, result }, "*")
    }
  } catch (err) {
    window.postMessage({ target: "tipchain-isolated-world", id, error: err instanceof Error ? err.message : String(err) }, "*")
  }
})
