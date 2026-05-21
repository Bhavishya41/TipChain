# TipChain Coding Conventions

## File Organization

### Naming
- **Files**: kebab-case (`creator-card.tsx`, `mock-data.ts`)
- **Components**: PascalCase (`CreatorCard`, `StatCard`)
- **Interfaces**: PascalCase, noun-based (`Creator`, `Transaction`, `DashboardStats`)
- **Constants**: camelCase or UPPER_SNAKE_CASE for truly static values

### Structure per component file
```tsx
'use client'; // Only if client-side features are used

// 1. External imports
import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

// 2. Internal imports
import { someHelper } from '@/lib/mock-data';
import type { SomeType } from '@/lib/types';

// 3. Types/interfaces (if local to this component)
interface ComponentProps {
  // ...
}

// 4. Constants
const ANIMATION_CONFIG = { ... };

// 5. Component
export default function Component({ ...props }: ComponentProps) {
  // state
  // effects
  // handlers
  // render
}
```

## TypeScript

- Use strict TypeScript (`"strict": true`)
- All component props must be typed
- Prefer interfaces over types for object shapes
- Use `type` for unions, intersections, and aliases
- Import types using `import type { ... }` syntax

## Styling

### TailwindCSS v4
- Use `@theme inline` for design tokens in `globals.css`
- Use utility classes in components
- No inline `style` attributes except for dynamic values
- Use the custom CSS utilities (`.card-brutal`, `.skeleton`, `.label-uppercase`)

### Color Usage
- Never use raw hex codes in components — always use the design system values
- Accent colors used SPARINGLY:
  - `#6D28FF` — Primary accent (CTAs, highlights)
  - `#4ADE80` — Positive/success/tips
  - `#F97316` — Warning/negative/sells
  - `#7C3AED` — Muted accent

### Border Pattern
- Always use `border-2` for consistency
- Standard border: `border-[#27272A]`
- Subtle border: `border-[#1E1E22]`
- Accent border: `border-[#6D28FF]`

## Animation

### Framer Motion Conventions
```tsx
// Page entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Scroll reveal
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}

// Staggered children
transition={{ delay: index * 0.06 }}

// Hover displacement (brutalist)
whileHover={{
  boxShadow: '4px 4px 0px 0px #6D28FF',
}}
```

### CSS Hover Displacement
```
hover:translate-x-[-2px] hover:translate-y-[-2px]
hover:shadow-[4px_4px_0px_0px_#6D28FF]
```

## Component Patterns

### Stat Card
All stats follow the pattern:
- Uppercase label (tracking-wider, tiny font)
- Large bold value (font-black, tabular-nums)
- Change indicator (green up / orange down)

### Card Pattern
- `bg-[#111113]` background
- `border-2 border-[#27272A]` border
- Hover: displacement + brutalist shadow
- Content: label → value structure

### Labels
```
text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]
```

### Values
```
text-sm font-bold text-[#F5F5F5] tabular-nums
```

## Routing

- Use Next.js `<Link>` component for all internal navigation
- Dynamic routes use `params: Promise<{ slug: string }>` pattern (Next.js 16)
- Route params must be `await`ed

## Data Layer

- All mock data lives in `lib/mock-data.ts`
- TypeScript interfaces in `lib/types.ts`
- Use `TODO` comments at every integration point:
  ```tsx
  // TODO: Connect to backend API
  // TODO: Replace with actual wallet connection
  // TODO: Integrate UGF SDK for gas abstraction
  ```

## Accessibility
- All interactive elements must be focusable
- Use semantic HTML (`nav`, `main`, `section`, `article`)
- Icons should have `aria-hidden` when decorative
- Form inputs must have labels

## Performance
- Use `viewport={{ once: true }}` on scroll animations
- Lazy load heavy components where possible
- Use `next/font` for font optimization
- Prefer CSS transitions over JS for simple hover effects
