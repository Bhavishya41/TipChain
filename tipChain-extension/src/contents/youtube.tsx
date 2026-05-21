import type { PlasmoCSConfig } from "plasmo"
import { createRoot, type Root } from "react-dom/client"

import TipExperience from "~src/components/TipExperience"
import "~style.css"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"],
  run_at: "document_idle"
}

const ROOT_ID = "tipchain-youtube-pill-root"
const INJECTED_ATTR = "data-tipchain-injected"

let reactRoot: Root | null = null
let scheduled = false
let lastUrl = window.location.href

type CreatorTarget = {
  creatorName: string
  mountTarget: HTMLElement
}

const creatorNameSelectors = [
  "ytd-watch-metadata ytd-channel-name a",
  "ytd-video-owner-renderer ytd-channel-name a",
  "#owner #channel-name a",
  "#upload-info #channel-name a"
]

const mountSelectors = [
  "ytd-watch-metadata #owner",
  "ytd-video-owner-renderer",
  "#owner",
  "#upload-info"
]

function getCreatorName() {
  for (const selector of creatorNameSelectors) {
    const element = document.querySelector<HTMLElement>(selector)
    const text = element?.textContent?.trim()

    if (text) {
      return text
    }
  }

  return "this creator"
}

function getCreatorNameWithin(mountTarget: HTMLElement) {
  const container = mountTarget.closest("ytd-watch-metadata") || 
                    mountTarget.closest("ytd-video-owner-renderer") || 
                    mountTarget

  for (const selector of creatorNameSelectors) {
    const element = container.querySelector<HTMLElement>(selector)
    const text = element?.textContent?.trim()

    if (text) {
      return text
    }
  }

  return getCreatorName()
}

function findCreatorTarget(): CreatorTarget | null {
  for (const selector of mountSelectors) {
    const elements = document.querySelectorAll<HTMLElement>(selector)

    for (const mountTarget of elements) {
      if (mountTarget && mountTarget.isConnected) {
        const isHidden = mountTarget.closest("[hidden]") !== null || 
                         (mountTarget.offsetWidth === 0 && mountTarget.offsetHeight === 0)

        if (!isHidden) {
          return {
            creatorName: getCreatorNameWithin(mountTarget),
            mountTarget
          }
        }
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
  const target = findCreatorTarget()

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
      platform="youtube"
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
  }, 250)
}

scheduleInjection()

const observer = new MutationObserver(scheduleInjection)

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
})

window.addEventListener("yt-navigate-finish", scheduleInjection)
window.addEventListener("yt-page-data-updated", scheduleInjection)
window.addEventListener("popstate", scheduleInjection)
