# TipChain — Pending Tasks

## Priority: High

### P0 — Blockers

- [ ] **Install dependencies** — Run `npm install` to install framer-motion, lenis, and lucide-react
- [ ] **Test all routes** — Verify all pages render correctly after dependency install
- [ ] **Fix any TypeScript errors** — Resolve any type issues from strict mode

### P1 — Core Features

- [ ] **Wallet connection** — Integrate wagmi/ethers.js for wallet connect
- [ ] **Smart contract integration** — Connect token factory contract for launch flow
- [ ] **UGF SDK integration** — Gas abstraction for tipping and buying
- [ ] **Backend API integration** — Replace mock data with actual API calls
- [ ] **Authentication flow** — User login/signup via wallet or social

## Priority: Medium

### P2 — UI Enhancements

- [ ] **Responsive chart component** — Make MiniChart responsive (currently fixed width)
- [ ] **Real avatar images** — Generate or source avatar images for mock data
- [ ] **Loading states** — Add loading.tsx files for each route
- [ ] **Error boundaries** — Add error.tsx files for error handling
- [ ] **404 page** — Create not-found.tsx
- [ ] **Toast notifications** — Add success/error toast system
- [ ] **Form validation** — Add Zod validation to launch-token form
- [ ] **Mobile optimization** — Fine-tune responsive layouts for small screens

### P3 — Features

- [ ] **Search functionality** — Full-text search across creators and tokens
- [ ] **Infinite scroll** — Paginated marketplace with load more
- [ ] **Creator leaderboard** — Top creators by various metrics
- [ ] **Token comparison** — Side-by-side token comparison view
- [ ] **Portfolio view** — User's held tokens and tipping history
- [ ] **Notifications** — In-app notification system

## Priority: Low

### P4 — Polish

- [ ] **Page transitions** — Add view transitions between routes
- [ ] **Keyboard navigation** — Full keyboard accessibility
- [ ] **Metadata per page** — SEO meta tags for each route
- [ ] **OG images** — Dynamic OG image generation
- [ ] **Analytics integration** — Track user interactions
- [ ] **PWA support** — Service worker, manifest
- [ ] **Dark/light mode** — Currently dark-only, add light theme option
- [ ] **i18n** — Internationalization support
- [ ] **Performance audit** — Lighthouse, bundle analysis, optimization

## Technical Debt

- [ ] Extract repeated color values into Tailwind theme tokens
- [ ] Create a shared Button component with variants
- [ ] Create a shared Input component
- [ ] Add unit tests for utility functions
- [ ] Add Storybook for component documentation
- [ ] Set up CI/CD pipeline
