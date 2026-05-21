# TipChain Implementation Plan

## Guiding Principle

Ship the demo path first: YouTube pill, modal, mock gasless tip, success state. Everything else supports that moment.

## Phase 1: Extension Foundation and YouTube Pill

Goal: a visible, stable `Tip` pill on YouTube.

Tasks:

- Confirm Plasmo dev build runs.
- Add Tailwind globals for extension UI.
- Create `src/contents/youtube.tsx`.
- Detect the YouTube creator area using pragmatic selectors.
- Inject a single root container near the channel name or owner row.
- Render `TipPill`.
- Add duplicate guards with `data-tipchain-injected`.
- Add MutationObserver for YouTube SPA navigation.

Acceptance criteria:

- Open a YouTube video page and see the pill beside the creator section.
- Navigate to another video and see the pill update without page reload.
- No duplicate pills after route changes.

## Phase 2: Modal and Mock Tip Flow

Goal: the demo feels real, even before blockchain integration.

Tasks:

- Create reusable components:
  - `TipPill`
  - `TipModal`
  - `CreatorCard`
  - `WalletButton`
  - `SuccessState`
- Add amount presets: `$1`, `$5`, `$10`, custom.
- Add optional message input.
- Add fake wallet connection state.
- Add mock `sendTip` function in `src/lib/mockApi.ts`.
- Show loading, success, and reset states.
- Add polished transitions and modal backdrop.

Acceptance criteria:

- Click pill to open modal.
- Select amount, enter message, connect wallet, confirm.
- Success state appears with gasless confirmation copy.

## Phase 3: UGF and Base Sepolia Integration Handoff

Goal: make the frontend ready for real transaction wiring.

Tasks:

- Define a stable `sendTip` interface.
- Keep UI independent of blockchain implementation details.
- Add placeholder fields:
  - `creatorId`
  - `creatorWallet`
  - `amount`
  - `message`
  - `platform`
  - `sourceUrl`
- Add transaction result shape:
  - `status`
  - `txHash`
  - `explorerUrl`
  - `gasSponsored`
- Document where UGF code plugs in.

Acceptance criteria:

- Teammate can replace mock implementation without rewriting UI.
- Modal can show a real transaction hash when provided.

## Phase 4: X Lightweight Support

Goal: broaden the story without risking the main demo.

Tasks:

- Add `src/contents/twitter.tsx` with profile/header injection.
- Reuse `TipPill` and modal components.
- Use fallback creator names when detection is uncertain.

Acceptance criteria:

- Pill appears on at least one X profile page layout.
- YouTube remains the most polished flow.

## Phase 5: Demo Polish

Goal: make the final demo memorable.

Tasks:

- Add subtle hover glow to the pill.
- Add glass modal with gradient border.
- Add transaction progress copy.
- Add success animation.
- Add a tiny creator vault preview or confirmation stat.
- Prepare a short demo script.

Acceptance criteria:

- The flow feels polished from first click to success.
- Judges immediately understand gasless onchain tipping.

## Suggested Build Order

1. YouTube content script with static pill.
2. React pill component.
3. Modal component with local state.
4. Mock wallet and mock transaction.
5. Styling and animation polish.
6. UGF handoff interface.
7. X support polish if time remains.
