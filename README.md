# Mintledger

Free, private financial and banking calculators. Next.js App Router + Tailwind
CSS, server-rendered for SEO, with small `"use client"` islands for the
interactive parts.

## Principles

- **SSR by default.** Every page is a Server Component rendered to complete HTML.
  Marketing pages ship almost no JavaScript. Each calculator is a server shell
  (heading, SEO copy, formula explanation, FAQ, related links) wrapping one
  client island for sliders, live results and charts.
- **No API, no database, no third-party services.** No analytics, ads, chat
  widgets, auth or CMS. Reference data (tax brackets, currency display
  metadata) ships as static files under `data/` and is read at render time.
  Saved comparison scenarios live in `localStorage`.
- **Pure calculation logic.** All maths is in `lib/calculators/*.ts` — plain
  functions, no I/O — so the same code produces the server's example figures and
  the client's live updates.

## Stack

| Concern     | Choice |
|-------------|--------|
| Framework   | Next.js 15 (App Router) |
| Styling     | Tailwind CSS 3 with `tailwind.config.ts` design tokens (Mint Ledger palette) |
| Fonts       | Lora + Inter, self-hosted at build time via `next/font` (no runtime CDN) |
| Animation   | Framer Motion (client islands only) |
| Charts      | Recharts, lazy-loaded via `next/dynamic({ ssr: false })` |
| Forms       | React Hook Form + Zod (see `components/calculators/LoanEmiCalculator.tsx`) |
| Icons       | Lucide React |

> The spec asked for `next/font/local` with checked-in variable font files.
> Those binaries aren't in the repo, so `next/font/google` is used instead — it
> downloads and self-hosts the files at build time, so served pages still make
> no runtime font request. See `app/fonts.ts` to switch to true local files.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Structure

```
app/
  (marketing)/            home, about — fully server-rendered
  calculators/            hub + one folder per calculator (server shells)
  fonts.ts  icon.svg  sitemap.ts  robots.ts
components/
  calculators/            the "use client" islands
  charts/                 Recharts wrappers + lazy entrypoints
  ui/                     sliders, animated numbers, breakdown bar, shell parts
lib/
  calculators/            pure calculation functions + Zod schemas
  calculators-meta.ts     catalogue: routes, copy, icons, cross-links
data/
  currencies.ts           currency symbols / decimals for display formatting
  tax-brackets.ts         simplified local tax schedules
```

## Adding a calculator

1. Add a pure function in `lib/calculators/`.
2. Add an entry to `CALCULATORS` in `lib/calculators-meta.ts` (and an icon key in
   `components/icons.tsx`).
3. Build the client island in `components/calculators/`.
4. Add `app/calculators/<slug>/page.tsx` with `metadata`, an intro, the formula
   explanation and an FAQ, wrapping the island in `<CalculatorScaffold>`.

## Disclaimer

For education and rough planning only. Not financial, tax or investment advice.
