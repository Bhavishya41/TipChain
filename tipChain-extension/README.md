# TipChain
(disclaimer: this is just the  demo, nothing is connected to any blockchain)


TipChain turns any creator on the internet into a tip-able onchain destination.
The MVP is a Plasmo Chrome extension that injects a polished `Tip` pill beside creator surfaces on platforms like YouTube and X. Clicking the pill opens a premium tipping modal where a viewer can choose an amount, add a short message, connect a wallet, and send a gasless tip using UGF on Base Sepolia.

For the hackathon demo, the blockchain flow can be mocked until the UGF integration is ready. The priority is a magical, smooth creator tipping experience that feels like Stripe for onchain support.

## Demo Goal

The highest-value demo moment:

1. Open a YouTube video.
2. A floating `Tip` pill appears beside the channel/creator section.
3. Click the pill.
4. A glassy modal opens with fast preset amounts, optional message, and wallet CTA.
5. Confirm a mock gasless transaction.
6. Show a success state and optimistic creator vault update.

## Tech Stack

- Plasmo Framework
- React
- TypeScript
- TailwindCSS
- Chrome Extension APIs
- Base Sepolia with UGF integration planned

## Current Repo Shape

```txt
.
├── assets/
│   └── icon.png
├── popup.tsx
├── style.css
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── tsconfig.json
├── PRD.md
├── IMPLEMENTATION_PLAN.md
├── TASKS.md
└── TASKS_DONE.md
```

Target extension structure as the MVP grows:

```txt
src/
├── contents/
│   ├── youtube.tsx
│   └── twitter.tsx
├── components/
│   ├── TipPill.tsx
│   ├── TipModal.tsx
│   ├── CreatorCard.tsx
│   ├── WalletButton.tsx
│   └── SuccessState.tsx
├── hooks/
│   ├── useCreator.ts
│   └── useInjection.ts
├── utils/
│   ├── detectCreator.ts
│   ├── injectElement.ts
│   └── observer.ts
├── styles/
│   └── globals.css
└── lib/
    └── mockApi.ts
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start Plasmo development mode:

```bash
npm run dev
```

Load the development extension in Chrome:

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Click Load unpacked.
4. Select the generated Plasmo dev build, usually `build/chrome-mv3-dev`.

Keep `npm run dev` running while using `build/chrome-mv3-dev`. Plasmo dev builds connect to a local HMR WebSocket, so Chrome can show connection errors if the dev server is stopped.

If Chrome says it could not load a generated JavaScript file such as `youtube.<hash>.js`, restart `npm run dev`, wait for `Extension re-packaged`, then click Reload on the extension in `chrome://extensions`. For a non-HMR build, run `npm run build` and load `build/chrome-mv3-prod` instead.

When adding a brand-new content script, Plasmo dev mode may keep an older manifest until the dev server is fully restarted. If a platform does not appear in `build/chrome-mv3-dev/manifest.json`, use `npm run build` and load `build/chrome-mv3-prod` for testing.

Build production assets:

```bash
npm run build
```

Package the extension:

```bash
npm run package
```

## MVP Scope

In scope for the hackathon:

- YouTube content script injection.
- Beautiful floating `Tip` pill.
- Modal with amount presets, custom amount, optional note, wallet CTA, and transaction state.
- Mock API for creator lookup and tip submission.
- UGF integration handoff points.
- Lightweight X support.

Out of scope for the initial demo:

- Production creator onboarding.
- Full backend vault accounting.
- Multi-wallet edge-case handling.
- Enterprise-grade security.
- Complex analytics or tokenomics.

## Docs

- [PRD.md](./PRD.md): product requirements and demo story.
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md): phase-by-phase build plan.
- [TASKS.md](./TASKS.md): prioritized execution checklist.
- [TASKS_DONE.md](./TASKS_DONE.md): progress log for the team and judges.
