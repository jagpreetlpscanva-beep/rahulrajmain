# Rahul Raj — Vedic Astrologer

A single-page premium astrology landing site recreated pixel-for-pixel from the
provided designs. Built with **Next.js 15 (App Router)**, **TypeScript**,
**Tailwind CSS**, and **Framer Motion**.

## Sections (single scrolling page)

1. **Hero** — rotating zodiac wheel, floating "Vedic Wisdom" book, drifting
   particles, count-up stats, dual CTAs.
2. **Testimonials** — responsive carousel (1 / 2 / 4 per view) with arrows + dots.
3. **Services** — four cards with mandala-backed icons, badges, scroll reveal,
   hover-lift.
4. **Free Tools** — six cards that slide in on scroll, icon glow + animated arrow
   on hover.
5. **Footer** (`#contact`) — brand, quick links, contact details.

## Features

- **Sticky, scroll-aware navbar** — transparent over the hero, solid cream once
  scrolled; active-section highlight via `IntersectionObserver`; smooth-scroll
  anchors; animated mobile menu.
- **Animations** — wheel rotation, book float, particle drift, count-up,
  staggered scroll reveals, hover micro-interactions. All respect
  `prefers-reduced-motion`.
- **SEO** — rich metadata, Open Graph/Twitter tags, JSON-LD `ProfessionalService`
  schema, `robots.txt`, and `sitemap.xml`.
- **Performance** — static prerender, ~157 kB First Load JS, GPU-friendly
  transform/opacity animations, `next/font` self-hosted Google fonts.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

> **This machine only:** the C: drive is full. Run npm commands with the cache
> and temp on D: — `npm config set cache "D:\npm-cache"` and set
> `TEMP`/`TMP` to `D:\tmp` before `npm install` / `npm run build`.

## Structure

```
app/
  layout.tsx            # fonts, metadata, JSON-LD
  page.tsx              # section composition
  globals.css           # theme tokens, base styles
  components/
    Navbar.tsx
    icons/index.tsx      # all custom SVG icons + registry
    sections/            # Hero, Testimonials, Services, Tools, Footer
    ui/                  # Logo, Dividers, Mandala, ZodiacWheel, FloatingBook,
                         # Particles, CountUp, Button, Reveal, ScrollToTop
lib/
  content.ts            # all copy/data (services, tools, testimonials, stats…)
  hooks.ts              # useScrolled, useActiveSection
```
