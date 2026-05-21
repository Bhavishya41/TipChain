# TipChain Frontend Architecture

## Overview

TipChain is a frontend-only creator economy platform built with **Next.js 16** (App Router), **TypeScript**, **TailwindCSS v4**, **Framer Motion**, **Lenis**, and **Lucide React**.

## Directory Structure

```
tipchain-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, nav, footer, lenis)
│   ├── page.tsx                  # Landing page (/)
│   ├── globals.css               # TailwindCSS v4 design system
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard (/dashboard)
│   ├── launch-token/
│   │   └── page.tsx              # Token launch flow (/launch-token)
│   ├── marketplace/
│   │   └── page.tsx              # Creator marketplace (/marketplace)
│   ├── creator/
│   │   └── [username]/
│   │       └── page.tsx          # Creator profile (/creator/[username])
│   └── extension/
│       └── page.tsx              # Extension showcase (/extension)
├── components/
│   ├── providers/
│   │   └── lenis-provider.tsx    # Smooth scroll context
│   └── ui/
│       ├── navbar.tsx            # Global nav
│       ├── footer.tsx            # Global footer
│       ├── stat-card.tsx         # Reusable stat card
│       ├── creator-card.tsx      # Creator discovery card
│       ├── mini-chart.tsx        # SVG sparkline chart
│       └── skeleton.tsx          # Loading skeletons
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   └── mock-data.ts              # Mock data + utility formatters
├── docs/
│   └── ai/
│       ├── architecture.md       # This file
│       ├── conventions.md        # Coding conventions
│       ├── ui-guidelines.md      # Design system reference
│       ├── decisions.md          # ADRs
│       ├── tasks.md              # Pending tasks
│       └── tasks-done.md         # Completed tasks
└── public/
    └── avatars/                  # (Placeholder avatar directory)
```

## Tech Stack

| Layer        | Technology             | Version |
|-------------|------------------------|---------|
| Framework   | Next.js (App Router)   | 16.2.6  |
| Language    | TypeScript             | ^5      |
| UI Library  | React                  | 19.2.4  |
| CSS         | TailwindCSS v4         | ^4      |
| Animation   | Framer Motion          | ^12     |
| Scrolling   | Lenis                  | ^1.1    |
| Icons       | Lucide React           | ^0.500  |

## Data Flow

```
Mock Data (lib/mock-data.ts)
    │
    ├──> Server Components (pages) ──> Static content
    │
    └──> Client Components ('use client')
         ├── Interactive UI (hover, click, state)
         ├── Animations (Framer Motion)
         └── TODO: API integration points
```

## Component Architecture

### Server vs Client Components

- **Server Components** (default): Pages that primarily render data. However, since most pages use Framer Motion and interactive state, most pages are currently `'use client'`.
- **Client Components** (`'use client'`): All interactive components — navbar, forms, animated elements.

### Component Hierarchy

```
RootLayout (Server)
├── LenisProvider (Client) — smooth scrolling
├── Navbar (Client) — route-aware nav
├── Page Content (Client) — per-route page
└── Footer (Server) — static footer
```

## State Management

Currently using React `useState` for local component state. No global state management is needed for the frontend-only version.

**Future considerations:**
- Zustand for wallet connection state
- React Query for API data fetching
- Context providers for user session

## Integration Points

All integration points are marked with `TODO` comments in the codebase:

- `TODO: Connect wallet` — Wallet connection (ethers.js / wagmi)
- `TODO: Connect smart contract deployment` — Token factory contract
- `TODO: Integrate UGF SDK` — Gas abstraction
- `TODO: Backend endpoint` — REST API calls
- `TODO: Replace with API call` — Data fetching replacements

## Routing

| Route                       | Page           | Description                    |
|----------------------------|----------------|--------------------------------|
| `/`                        | Landing        | Marketing homepage             |
| `/dashboard`               | Dashboard      | Creator dashboard              |
| `/launch-token`            | Launch Token   | Multi-step token creation      |
| `/marketplace`             | Marketplace    | Creator discovery              |
| `/creator/[username]`      | Creator Profile| Individual creator page        |
| `/extension`               | Extension      | Browser extension showcase     |
