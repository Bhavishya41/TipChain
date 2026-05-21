# TipChain UI Guidelines

## Design Philosophy

TipChain's visual language combines:
- **Neo-Brutalism** — Hard borders, offset shadows, no blur/glass
- **Editorial Typography** — Oversized, bold, tight-tracked headings
- **Modern Dashboard Systems** — Dense, structured, functional
- **Dark Internet-Native Interfaces** — Deep blacks, restrained color

The result should feel: **bold, sharp, structured, premium, intentional.**

## DO NOT

- ❌ Glow effects
- ❌ Blurred glass cards / backdrop-blur
- ❌ Floating gradient blobs
- ❌ Excessive transparency
- ❌ Rounded bubbly UI
- ❌ Neon cyberpunk aesthetic
- ❌ Generic AI startup look
- ❌ Soft drop shadows

## Color Palette

### Backgrounds
| Token                    | Hex       | Usage                          |
|--------------------------|-----------|--------------------------------|
| `bg-primary`             | `#0B0B0C` | Page background                |
| `bg-secondary`           | `#111113` | Card/surface background        |
| `bg-tertiary`            | `#18181B` | Nested elements, inputs        |
| `bg-quaternary`          | `#202024` | Hover states, elevated surface |

### Text
| Token                    | Hex       | Usage                          |
|--------------------------|-----------|--------------------------------|
| `text-primary`           | `#F5F5F5` | Primary content, headings      |
| `text-secondary`         | `#A1A1AA` | Body text, descriptions        |
| Various zinc shades      | `#71717A` | Muted text                     |
|                          | `#52525B` | Labels, meta info              |
|                          | `#3F3F46` | Disabled, very muted           |

### Accents (Use SPARINGLY)
| Token                    | Hex       | Usage                          |
|--------------------------|-----------|--------------------------------|
| `accent`                 | `#6D28FF` | Primary CTA, links, highlights |
| `accent-muted`           | `#7C3AED` | Secondary accent               |
| `accent-green`           | `#4ADE80` | Positive change, tips, success |
| `accent-orange`          | `#F97316` | Negative change, warnings      |

### Borders
| Token                    | Hex       | Usage                          |
|--------------------------|-----------|--------------------------------|
| `border-hard`            | `#27272A` | Standard borders               |
| `border-subtle`          | `#1E1E22` | Inner dividers                 |

## Typography

### Fonts
- **Primary**: Outfit (headings, UI)
- **Secondary**: Geist Sans (body, UI)
- **Mono**: Geist Mono (numbers, code)

### Heading Scale
```
Hero:        text-5xl to text-[5.5rem], font-black, tracking-tighter
Section:     text-3xl to text-4xl, font-black, tracking-tight
Card Title:  text-sm to text-lg, font-extrabold
```

### Labels
```
Dashboard labels:  text-[10px] or text-[11px]
                   font-bold
                   uppercase
                   tracking-[0.12em] to tracking-[0.14em]
                   text-[#52525B] or text-[#A1A1AA]
```

### Numbers
```
All numeric values: tabular-nums
                    font-bold to font-black
                    Use formatCurrency() / formatNumber() helpers
```

## Layout

### Container
- Max width: `max-w-7xl`
- Horizontal padding: `px-4 sm:px-6 lg:px-8`

### Spacing
- Section spacing: `py-20` to `py-28`
- Internal card padding: `p-5` to `p-6`
- Grid gaps: `gap-4` to `gap-6`

### Grid
- Use CSS Grid for layouts
- 1-col mobile, 2-col tablet, 3-4-col desktop
- Dashboard: 3-col grid (2+1 split)

## Borders & Shadows

### Borders
- Standard: `border-2 border-[#27272A]`
- Cards always have `border-2`
- No border-radius (square/brutalist)

### Shadows (Brutalist)
```css
/* Small */  shadow-[2px_2px_0px_0px_#6D28FF]
/* Medium */ shadow-[4px_4px_0px_0px_#6D28FF]
/* Large */  shadow-[6px_6px_0px_0px_#6D28FF]
/* Dark */   shadow-[4px_4px_0px_0px_#27272A]
```

- NO blur on shadows
- Shadows are hard offset only
- Used on hover for displacement effect

## Interactive States

### Hover Displacement
The signature interaction: element moves up-left, shadow appears bottom-right.
```
transition-all
hover:translate-x-[-2px] hover:translate-y-[-2px]
hover:shadow-[4px_4px_0px_0px_#6D28FF]
```

### Buttons
```
Primary:   bg-[#6D28FF] text-white border-2 border-[#6D28FF]
Secondary: bg-transparent border-2 border-[#27272A] text-[#A1A1AA]
Success:   bg-[#4ADE80] text-[#0B0B0C] border-2 border-[#4ADE80]
```

All buttons:
- `text-sm font-bold uppercase tracking-wider`
- Displacement hover
- No border-radius

### Form Inputs
```
bg-[#0B0B0C]
border-2 border-[#27272A]
focus:border-[#6D28FF] focus:outline-none
text-sm text-[#F5F5F5]
placeholder-[#52525B]
```

## Animation Guidelines

### Entrance Animations
- Fade up: `opacity: 0, y: 20` → `opacity: 1, y: 0`
- Stagger: `delay: index * 0.06`
- Scroll reveal: Use `whileInView` with `viewport={{ once: true }}`

### Transitions
- Duration: 150ms-300ms
- Easing: `ease` or spring
- Transform-based only (no opacity flash)

### What NOT to animate
- No floating/bobbing
- No parallax
- No spinning
- No glowing/pulsing
- No continuous motion

## Iconography

- Use **Lucide React** exclusively
- Icon sizes: `h-3 w-3` to `h-5 w-5`
- Stroke width: default or `strokeWidth={2.5}` for emphasis
- Icons always paired with text labels in navigation
- Decorative icons get `aria-hidden`
