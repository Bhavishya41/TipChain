# TipChain PRD

## Product Summary

TipChain is a browser extension that makes internet creators instantly tip-able onchain. While browsing creator platforms, viewers see a sleek injected `Tip` pill near creator names or profile sections. Clicking it opens a fast, premium payment flow where users can send support without needing ETH for gas.

The product promise is simple: creator tipping should feel as easy as a Web2 checkout, but settle onchain.

## Problem

Creator support is fragmented across platform-native subscriptions, external links, crypto wallet addresses, and payment pages. Onchain tipping adds ownership and transparency, but the current UX is too heavy: wallet friction, gas management, confusing networks, and too many steps.

TipChain removes that friction by meeting users where they already are and hiding gas complexity behind UGF.

## Target Users

Viewers:

- Watch YouTube videos or browse X creator profiles.
- Want a fast way to support creators directly.
- May not understand gas or network switching.

Creators:

- Want a lightweight way to receive tips.
- Need a shareable onchain destination or vault.
- Benefit from support that works across platforms.

Hackathon Judges:

- Need to understand the innovation in under 60 seconds.
- Should see both visible UX polish and a clear Web3 technical angle.

## MVP Goals

- Inject a premium `Tip` pill into YouTube creator surfaces.
- Open a smooth modal that feels native and magical.
- Support amount selection, optional message, wallet connect, and confirmation states.
- Mock the tipping transaction while blockchain integration is in progress.
- Provide clean integration points for Base Sepolia and UGF.
- Add lightweight X injection only after YouTube demo is strong.

## Non-Goals

- Building a full creator onboarding backend.
- Production wallet and relayer hardening.
- Supporting every YouTube layout variation.
- Creating complex analytics dashboards.
- Designing tokenomics.
- Building enterprise-scale architecture.

## Core User Flow

1. Viewer opens a supported creator page or video.
2. TipChain detects the visible creator.
3. A `Tip` pill appears near the creator identity area.
4. Viewer clicks the pill.
5. Modal opens with creator context and preset tip amounts.
6. Viewer adds an optional message.
7. Viewer connects wallet or continues with connected wallet.
8. Viewer confirms the tip.
9. UGF handles gas invisibly.
10. Viewer sees a success animation and confirmation.
11. Creator vault view updates optimistically.

## Platform Priority

1. YouTube: polished, demo-critical.
2. X/Twitter: lightweight creator/profile injection.

## UX Requirements

- The injected UI should feel like it belongs on the page, but slightly more premium.
- Motion should be smooth and intentional.
- Modal should use glassmorphism, soft gradients, subtle glow, and clear hierarchy.
- The transaction flow should avoid crypto jargon where possible.
- Gas abstraction should be visible as a benefit, not a technical obstacle.

Suggested microcopy:

- Pill: `Tip`
- Gas helper: `Gas covered by TipChain`
- Primary CTA: `Send tip`
- Loading: `Routing your gasless tip...`
- Success: `Tip sent`

## Functional Requirements

- Detect creator display name and platform.
- Prevent duplicate pill injection.
- Re-run detection on route changes and DOM mutations.
- Render React components into injected containers.
- Open and close modal without breaking host page scrolling.
- Mock creator profile and transaction response.
- Expose blockchain handoff function for the teammate integration.

## Success Metrics

For the hackathon demo:

- Tip pill appears on YouTube without manual refresh.
- Modal opens reliably.
- Mock transaction completes in under 3 seconds.
- UX clearly communicates gasless tipping.
- Demo can be explained in under 60 seconds.

## Risks

- YouTube DOM changes or SPA navigation can break selectors.
- Extension styles can conflict with host pages.
- Wallet integration may consume time late in the sprint.
- Over-polishing secondary platforms can distract from the core demo.

## Risk Mitigations

- Start with resilient, simple selectors for YouTube owner/channel sections.
- Use a single injected root and duplicate guards.
- Keep blockchain integration behind a mock API-compatible interface.
- Use visual polish on the main YouTube flow before broadening platform support.
