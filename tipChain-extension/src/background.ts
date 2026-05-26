// src/background.ts — Plasmo background service worker
// ALL backend communication goes through here because YouTube's CSP
// blocks fetch() to localhost from both MAIN and isolated world scripts.

const BACKEND_API = process.env.PLASMO_PUBLIC_API_URL;

export { }

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "API_FETCH") {
    const { method, path, body } = message

    fetch(`${BACKEND_API}${path}`, {
      method: method || "GET",
      headers: { "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {})
    })
      .then(async (res) => {
        const text = await res.text()
        let data: any = null
        try { data = JSON.parse(text) } catch { data = text }
        console.log(`[BG] ${method || "GET"} ${path} → ${res.status}`)
        sendResponse({ ok: res.ok, status: res.status, data })
      })
      .catch((err) => {
        console.error(`[BG] ${method || "GET"} ${path} FAILED:`, err.message)
        sendResponse({ ok: false, status: 0, error: err.message })
      })

    return true // keep channel open for async response
  }
})
