# TipChain Design Decisions (ADR Log)

## ADR-001: Next.js over Vite

**Date:** 2024-11-15
**Status:** Accepted

**Decision:** Use Next.js 16 App Router instead of Vite + React Router.

**Reasoning:**
- Project was already initialized with Next.js 16
- App Router provides file-system routing (reduces boilerplate)
- Built-in font optimization via `next/font`
- Server Components available for static sections
- Easy to add API routes later for backend integration
- Better SEO with SSR/SSG capabilities

**Trade-offs:**
- Heavier framework for a frontend-only app
- Most pages use `'use client'` due to Framer Motion
- But still benefits from prefetching, code splitting, and font optimization

---

## ADR-002: TailwindCSS v4 Design Tokens

**Date:** 2024-11-15
**Status:** Accepted

**Decision:** Use `@theme inline` in `globals.css` for all design tokens instead of a `tailwind.config` file.

**Reasoning:**
- TailwindCSS v4 uses CSS-first configuration
- All tokens defined in `globals.css` are immediately available
- No config file needed — simpler setup
- Custom CSS utilities (`.card-brutal`, `.skeleton`) coexist cleanly

---

## ADR-003: Client Components for All Pages

**Date:** 2024-11-15
**Status:** Accepted

**Decision:** Mark all page components as `'use client'`.

**Reasoning:**
- Every page uses Framer Motion animations (`motion.div`)
- Every page uses React state or event handlers
- Converting to server components would require extracting all animated sections
- Acceptable trade-off for a frontend-only prototype

**Future consideration:**
- Could extract static sections into Server Components
- Could use dynamic imports for motion-heavy sections

---

## ADR-004: SVG Mini Charts over Chart Libraries

**Date:** 2024-11-15
**Status:** Accepted

**Decision:** Build custom SVG sparkline charts instead of using Recharts/Chart.js.

**Reasoning:**
- Keeps bundle size small (no chart library dependency)
- Full visual control matching neo-brutalist aesthetic
- Simple data visualization needs (sparklines only)
- Can be easily replaced with a chart library later if needed

**Trade-offs:**
- No interactivity (tooltips, zoom) out of the box
- Limited to line/area charts

---

## ADR-005: No Global State Management

**Date:** 2024-11-15
**Status:** Accepted

**Decision:** Use local React state only. No Zustand/Redux/Context.

**Reasoning:**
- Frontend-only prototype — no shared auth/wallet state
- Each page is self-contained with mock data
- Reduces complexity for initial build

**Future consideration:**
- Add Zustand when wallet connection is integrated
- Add React Query when backend API is connected

---

## ADR-006: Neo-Brutalist Design Over Glassmorphism

**Date:** 2024-11-15
**Status:** Accepted

**Decision:** Use neo-brutalist design principles with hard shadows, sharp borders, zero blur.

**Reasoning:**
- Differentiates from generic crypto dashboards
- Aligns with bags.fm / Linear / Raycast aesthetic
- Creates a memorable, bold visual identity
- Easier to maintain consistency (fewer subtle effects)

**Specific rules:**
- No `border-radius` (everything square)
- No `backdrop-blur` or `box-shadow` with blur
- No gradients on surfaces
- Hard offset shadows only (`4px 4px 0px 0px #COLOR`)

---

## ADR-007: Dynamic Import for Lenis

**Date:** 2024-11-15
**Status:** Accepted

**Decision:** Use dynamic import (`import('lenis')`) inside `useEffect` instead of top-level import.

**Reasoning:**
- Lenis accesses `window` and DOM APIs
- Top-level import would fail during SSR
- Dynamic import inside `useEffect` ensures client-only execution
- No need for `next/dynamic` wrapper

---

## ADR-008: Outfit as Primary Font

**Date:** 2024-11-15
**Status:** Accepted

**Decision:** Use Outfit as the primary display font with Geist as fallback.

**Reasoning:**
- Outfit provides excellent extra-bold weights needed for brutalist typography
- Geist (already in the project) serves as a clean fallback
- Both are variable fonts — optimized for performance
- Available via `next/font/google` for self-hosting
