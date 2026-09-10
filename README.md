# NEXORA

A premium, Apple Store-inspired storefront for a **multi-brand** electronics retailer,
built with React, TypeScript, Vite and Tailwind.

NEXORA is the store's own identity. The manufacturers' **official logos** appear only
inside brand sections and on product cards, so the site reads as an independent
retailer that carries these brands — never as any manufacturer's official store.

> **This is a demonstration build.** Product names, models, colourways, release years
> and headline specifications describe real hardware, and every product photo is a real
> photograph of that product. Prices, stock, ratings, store locations and checkout are
> **sample data**; there is no backend and no payment is ever processed. The UI states
> this wherever money, availability or a store address appears.

---

## Quick start

```bash
npm install      # approve the esbuild + sharp install scripts if prompted
npm run assets   # builds the brand logos and downloads product photography (needs network)
npm run dev      # http://localhost:5173
```

Everything under `public/assets/` is generated, so it is not committed — `npm run assets`
rebuilds it from the sources described below. Run it once after cloning, or any time an
image or logo is missing.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check both TS projects, then build to `dist/` |
| `npm run preview` | Serve the production build on :4173 |
| `npm run lint` | ESLint |
| `npm run test:run` | Unit tests (Vitest + React Testing Library) |
| `npm run test:coverage` | Unit tests with a V8 coverage report |
| `npm run test:e2e` | Playwright E2E, against the **production** build |
| `npm run test:e2e:ui` | Playwright in UI mode |
| `npm run assets` | Build brand logos **and** download/optimise product photography |
| `npm run assets:brands` | Brand marks only, into `public/assets/brands` |
| `npm run assets:products` | Product photos only (`-- --force` to re-download) |

---

## Where the assets come from

This was the most constrained part of the brief — real logos and real products, with
nothing fabricated — so the provenance is worth stating precisely.

### Brand logos (17)

All are the manufacturers' own artwork. None is redrawn, and no brand is ever
represented by a text label where a logo belongs.

* **13 marks** — Apple, Samsung, Sony, ASUS, Lenovo, Dell, HP, Logitech, JBL, Bose,
  Nikon, Nintendo, PlayStation — come from the [`simple-icons`](https://simpleicons.org)
  package, which publishes vendor glyph data. `scripts/build-brand-logos.mjs` writes each
  one out with the brand's own hex baked in.
* **4 marks** — Microsoft, Canon, Xbox and Google — are downloaded from Wikimedia Commons
  by `scripts/fetch-commons-logos.mjs`. The first three asked to be removed from
  `simple-icons`, and Google's real mark is multi-colour rather than the monochrome glyph
  that set ships.

Two details the build script handles, both visible in the output:

* **Tight viewBoxes.** `simple-icons` fits every glyph into a 24×24 square, which leaves a
  wide wordmark (Bose is roughly 8:1) as a thin band with large empty margins — at a shared
  render height those marks come out far smaller than a square glyph like Apple's. Each
  path's true bounding box is measured and the viewBox tightened to it, so every mark fills
  the box it is given at its own correct aspect ratio.
* **Light-background variants.** `simple-icons` records one primary hex per brand, and for
  Sony that hex is `#FFFFFF` — invisible on this store's white surfaces. Sony and Nikon use
  the dark variant those brands publish for light backgrounds. Only the fill changes; the
  artwork does not. A unit test fails if any logo would be invisible on white.

`BrandLogo` renders each mark as an `<img>` bounded on **both** axes with
`object-fit: contain`, so nothing is stretched and a very wide wordmark occupies a similar
optical area to a square glyph.

### Product photography (33 products)

Every product photo is a real photograph from **Wikimedia Commons**, whose files are freely
licensed. `scripts/product-images.json` maps each catalogue id to an exact Commons file,
curated by hand.

The important rule: **the photo and the product name always agree.** Automated search is not
reliable enough for this — a keyword search for "Pixel Buds Pro" returned a photograph of a
pear blossom, and "PlayStation 5" returned a PlayStation 1. So where Commons had no photo of
a newer variant, the catalogue names the variant that *is* pictured rather than mislabelling
it. That is why the catalogue lists a MacBook Pro 16-inch (M1 Pro) and a ThinkPad X1 Carbon
(Gen 7) — those are the machines in the photographs.

`scripts/fetch-assets.mjs` then, for each photo:

1. flattens any alpha channel onto white (several sources are transparent PNGs, which would
   otherwise encode as black in JPEG);
2. trims a uniform border and re-pads by a fixed amount, so products are not randomly scaled
   relative to each other across a grid;
3. writes 640px and 1200px renders in both WebP and JPEG;
4. records the intrinsic dimensions and the author/licence/source URL in
   `public/assets/products/credits.json`.

Those recorded dimensions are the single source of truth for `width`/`height` — swapping a
photo cannot leave a stale size behind and reintroduce layout shift. Attribution appears on
each product page and in the footer.

---

## Architecture

```text
src/
├── data/            structured catalogue — everything on screen renders from here
│   ├── types.ts       Product, Brand, Category, Specifications
│   ├── brands.ts      17 brands + logo paths and provenance notes
│   ├── products.ts    33 products; PRICING_DISCLAIMER lives here
│   ├── categories.ts  9 categories, each guaranteed non-empty
│   ├── navigation.ts  header + mobile drawer structures
│   ├── footer.ts      footer columns, store name, social links
│   └── services.ts    services + sample store locations
│
├── lib/
│   ├── catalog.ts     search, suggestions, filtering, sorting (pure functions)
│   └── format.ts      currency, review counts, text normalisation
│
├── context/StoreContext.tsx   cart · wishlist · compare · recent searches
├── hooks/                     focus trap, scroll lock, Escape, page title
│
├── components/
│   ├── layout/      Header · MobileMenu · CartDrawer · Footer
│   ├── brands/      BrandLogo · BrandCard · BrandShowcase
│   ├── products/    ProductCard · ProductGrid · ProductGallery · ProductFilters
│   │                ProductSearch · ProductDetail · CompareProducts · ProductImage
│   ├── sections/    Hero · BrandNavigation · CategoryNavigation · FeaturedProduct
│   │                NewArrivals · PopularPicks · DealsSection · CompareTeaser
│   │                ServicesSection · StoreSection
│   └── ui/          Button · Container · SectionHeading · ScrollReveal · Modal
│                    Badge · QuantityStepper · StoreLogo
│
├── pages/           Home · Products · ProductDetailPage · Brand · Category
│                    Compare · Cart · Wishlist · Deals · NewArrivalsPage
│                    Stores · Support · NotFound
└── styles/          variables.css (tokens) · globals.css · animations.css
```

### Routes

`/` · `/products` · `/products/:id` · `/category/:category` · `/brand/:brand` · `/deals`
· `/new-arrivals` · `/compare` · `/wishlist` · `/cart` · `/support` · `/stores` · `*`

Everything but the homepage is code-split. A unit test walks every navigation and footer
link and asserts it resolves to a real route, so the footer has no dead ends.

### Design tokens

`src/styles/variables.css` holds the colour, type, spacing, radius, motion and elevation
tokens. `tailwind.config.js` maps them onto **named** utilities — `text-small`, `rounded-md`,
`duration-fast`, `shadow-card`, `text-accent`.

They are registered rather than used as arbitrary values on purpose: Tailwind v3 does not
support the bare `text-[--token]` shorthand, and that syntax compiles to **nothing at all**,
silently dropping the style. Named utilities keep one source of truth and fail loudly.

Two colours were chosen against measured contrast rather than by eye: `--c-slate`
(`#636369`) clears AA on both white and the section grey, and `--c-accent` (`#0068d1`) clears
AA at 14px both as link text on grey *and* as a button fill under white text.

### State

React Context, persisted to `localStorage` (`nexora.cart`, `nexora.wishlist`,
`nexora.compare`, `nexora.recentSearches`). Reads are defensive: malformed JSON, a blocked
storage API and stale product ids are all handled, and the comparison list is clamped to its
four-product cap on read as well as on write.

---

## Accessibility

* Semantic landmarks; one `<h1>` per page and no skipped heading levels — both asserted in
  tests. Product card titles take a `headingLevel` so a grid under a page `h1` stays correct.
* Every drawer and dialog goes through one `Modal`: `role="dialog"`, `aria-modal`, Escape,
  scrim click, focus trap, focus restore and body scroll lock.
* The search field is a real combobox — `aria-activedescendant`, arrow keys, Enter, Escape —
  with options as direct listbox children, because wrapping them in list markup breaks the
  listbox/option relationship.
* Visible `:focus-visible` rings; a skip link; live regions for result counts and quantities.
* `prefers-reduced-motion` collapses the motion tokens to `0ms`, and a test asserts no
  content is left stuck at `opacity: 0`.
* The mobile image carousel is keyboard-focusable, so its scroll region is not a dead end.

**axe-core reports zero WCAG 2.1 A/AA violations** on all 12 routes and on the search, bag,
mobile-menu and filter overlays.

## Performance

Responsive `<picture>` with WebP and JPEG, explicit `width`/`height` on every product image,
lazy loading below the fold with `fetchpriority="high"` on the hero, route-level code
splitting, a separate React vendor chunk, and animation restricted to `opacity` and
`transform`.

Lighthouse on the production build (desktop, local): **Performance 87 · Accessibility 100 ·
Best Practices 100 · SEO 92**, with **CLS 0** and total blocking time under 100 ms.

---

## Testing

```bash
npm install
npx tsc --noEmit -p tsconfig.app.json
npm run lint
npm run test:run
npm run test:coverage
npm run build
npx playwright install    # first run only
npm run test:e2e
```

**Unit — 138 tests in 10 files, 92% statement coverage.**
`ProductCard`, `Header`, `MobileMenu` + `BrandCard`, `Cart`, `Wishlist`,
`CompareProducts`, `ProductDetail`, `ProductFilters` (filtering/search/sorting),
`pages` (every route), and `catalog-integrity`.

That last file is a data guard rather than a UI test: it asserts every brand logo file
exists, is real SVG artwork with a title, has a viewBox and is not too light to see on
white; that every product resolves to a real brand and category and ships all four image
variants; that recorded dimensions match the processed photos; that every photo is
attributed; and that no navigation link points anywhere the router does not define.

**E2E — 187 tests** across desktop Chromium and emulated mobile WebKit, run against
`vite preview` so the production bundle is what is exercised: `home`, `products`,
`navigation` (+ search and the store finder), `cart` (+ wishlist and comparison),
`responsive`, `accessibility` and `visual`.

`responsive.spec.ts` checks all nine required viewports from 320×800 to 1920×1080 for
horizontal overflow. `visual.spec.ts` writes the reference screenshots named in the brief to
`test-results/visual/`; they are captured rather than diffed against a committed baseline
because the photography is fetched at setup time, so a byte-exact baseline would be brittle
across machines.

Two testing notes worth knowing before adding tests here:

* Sections reveal on intersection, so a full-page screenshot or an axe scan has to scroll the
  page first **and** wait for the animations to finish — `revealAll()` and
  `settleAnimations()` in `tests/e2e/utils.ts` do both. Scanning mid-fade measures a blended
  colour and reports contrast failures that do not exist.
* Programmatic scrolling needs `scroll-behavior: smooth` suspended, or the jumps never land.

---

## Known limitations

* **No backend.** No API, no database, no authentication. Account UI is present for
  completeness but creates nothing.
* **Checkout is deliberately inert.** The bag does real arithmetic and the summary shows
  sample delivery and tax, but the checkout button is disabled and no payment method is
  collected. The data layer is shaped so a commerce API could replace it.
* **Prices, stock, ratings and review counts are sample data**, not live retail figures.
  Specifications and product names describe real hardware; the money does not.
* **Store locations are invented** for a fictional retailer. The locator filters a static
  list by text and never requests the visitor's real position.
* **Product galleries show one authentic photograph per product** at three framings, rather
  than several angles — Commons rarely has a consistent multi-angle set, and inventing extra
  views would break the rule that the imagery matches the product.
* **Photography is inconsistent in styling.** These are real photographs by many different
  contributors, so some are studio shots on white and some were taken in a room. The pipeline
  normalises scale and background where it can; it cannot restyle a photo.
* **`npm run assets` needs network access** and is rate-limited by the Commons API. Generated
  assets are gitignored, so this has to run once after cloning.
* Four `react-refresh/only-export-components` ESLint **warnings** (0 errors) remain, from
  files that export a constant or hook beside a component. Splitting them would fragment the
  code for no real benefit.

## Licensing

Brand names, logos and product names are the property of their respective owners and are used
here to identify the products offered. NEXORA is not affiliated with, endorsed by or operated
by any manufacturer shown. Product photography is used under the free licences its Wikimedia
Commons contributors chose; per-photo attribution is in
`public/assets/products/credits.json` and on each product page.
