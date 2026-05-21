import type { PlasmoCSConfig } from "plasmo"
import { createRoot, type Root } from "react-dom/client"

import TipExperience from "~src/components/TipExperience"
import "~style.css"

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*", "https://twitter.com/*"],
  run_at: "document_idle"
}

const ROOT_ID = "tipchain-twitter-pill-root"
const INJECTED_ATTR = "data-tipchain-injected"

let reactRoot: Root | null = null
let scheduled = false
let lastUrl = window.location.href

type CreatorTarget = {
  creatorName: string
  mountTarget: HTMLElement
}

function getProfileHandleFromUrl() {
  const [, handle] = window.location.pathname.split("/")

  if (!handle || ["home", "explore", "notifications", "messages", "i"].includes(handle)) {
    return ""
  }

  return `@${handle}`
}

function getCreatorName() {
  const profileName = document
    .querySelector<HTMLElement>('div[data-testid="UserName"] span')
    ?.textContent?.trim()

  return profileName || getProfileHandleFromUrl() || "this creator"
}

function findProfileTarget(): CreatorTarget | null {
  const userName = document.querySelector<HTMLElement>('div[data-testid="UserName"]')

  if (userName?.isConnected) {
    const isHidden = userName.closest('[hidden]') !== null || 
                     (userName.offsetWidth === 0 && userName.offsetHeight === 0)
    if (!isHidden) {
      return {
        creatorName: getCreatorName(),
        mountTarget: userName
      }
    }
  }

  const profileActions = document.querySelector<HTMLElement>(
    'div[data-testid="placementTracking"]'
  )

  if (profileActions?.isConnected) {
    const isHidden = profileActions.closest('[hidden]') !== null || 
                     (profileActions.offsetWidth === 0 && profileActions.offsetHeight === 0)
    if (!isHidden) {
      return {
        creatorName: getCreatorName(),
        mountTarget: profileActions
      }
    }
  }

  return null
}

function getOrCreateRoot(target: HTMLElement) {
  const existingRoot = document.getElementById(ROOT_ID)

  if (existingRoot && target.contains(existingRoot)) {
    return existingRoot
  }

  existingRoot?.remove()
  reactRoot = null

  const root = document.createElement("span")
  root.id = ROOT_ID
  root.setAttribute(INJECTED_ATTR, "true")
  root.className = "tipchain-ui"

  target.appendChild(root)

  return root
}

function injectTipPill() {
  const target = findProfileTarget()

  if (!target) {
    return
  }

  const rootElement = getOrCreateRoot(target.mountTarget)

  if (!reactRoot) {
    reactRoot = createRoot(rootElement)
  }

  reactRoot.render(
    <TipExperience
      creatorName={target.creatorName}
      platform="twitter"
      sourceUrl={window.location.href}
    />
  )
}

function scheduleInjection() {
  if (scheduled) {
    return
  }

  scheduled = true

  window.setTimeout(() => {
    scheduled = false

    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href
      document.getElementById(ROOT_ID)?.remove()
      reactRoot = null
    }

    injectTipPill()
  }, 300)
}

scheduleInjection()

const observer = new MutationObserver(scheduleInjection)

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
})

window.addEventListener("popstate", scheduleInjection)
