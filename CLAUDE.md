# MASTER PROMPT — PREMIUM APPLE STORE-STYLE MULTI-BRAND ECOMMERCE WEBSITE

## ROLE

Act as a senior frontend engineer, UI/UX designer, ecommerce architect, motion designer, accessibility specialist, performance engineer, and QA engineer.

Transform the existing project into a premium, production-quality technology ecommerce website inspired by the design philosophy and shopping experience of the Apple Store.

The goal is NOT to create only an Apple product website.

Build a **multi-brand premium electronics marketplace** with an Apple Store-style experience that can sell:

* Apple
* Samsung
* Sony
* Microsoft
* Google
* ASUS
* Lenovo
* Dell
* HP
* Logitech
* JBL
* Bose
* Canon
* Nikon
* Nintendo
* PlayStation
* Xbox
* Other major technology brands

The experience should combine:

**Apple-level simplicity + premium ecommerce UX + multi-brand product discovery.**

The final result should feel like a real premium electronics retailer.

---

# CRITICAL BRAND LOGO REQUIREMENT

## USE REAL OFFICIAL BRAND LOGOS

The website MUST use the **real official logos** for brands represented in the store.

Examples:

* Apple logo
* Samsung logo
* Sony logo
* Microsoft logo
* Google logo
* ASUS logo
* Lenovo logo
* Dell logo
* HP logo
* Logitech logo
* JBL logo
* Bose logo
* Canon logo
* Nikon logo
* Nintendo logo
* PlayStation logo
* Xbox logo

Do NOT create:

* Fake logos
* AI-generated logos
* CSS-drawn logos
* Text replacements
* Generic icon replacements
* Modified brand marks
* Look-alike logos

Use authentic official brand assets where available and appropriate.

Preferred order:

1. Official SVG
2. Official transparent PNG
3. High-quality authorized brand asset

Store brand logos separately:

```text
src/assets/brands/apple.svg
src/assets/brands/samsung.svg
src/assets/brands/sony.svg
src/assets/brands/google.svg
src/assets/brands/microsoft.svg
```

Maintain:

* Correct proportions
* Original appearance
* Proper clear space
* Sharp rendering
* No distortion
* No accidental recoloring
* Responsive sizing

Do not manually redraw logos.

---

# CRITICAL PRODUCT REQUIREMENT

## USE REAL PRODUCTS

The store should use **real product names and real product models** from supported brands.

Examples:

Apple:

* iPhone
* MacBook Air
* MacBook Pro
* iPad
* Apple Watch
* AirPods

Samsung:

* Galaxy S series
* Galaxy Z series
* Galaxy Tab
* Galaxy Watch
* Galaxy Buds

Sony:

* PlayStation
* WH-series headphones
* BRAVIA TVs
* Alpha cameras

Microsoft:

* Surface
* Xbox

Google:

* Pixel
* Pixel Buds
* Pixel Watch

ASUS:

* ROG
* Zenbook
* Vivobook

Lenovo:

* ThinkPad
* Yoga
* Legion

Use genuine product names and models when displaying real products.

Do not invent nonexistent models and present them as real.

---

# PRODUCT DATA RULE

Product information should be stored in structured data.

Each product should support:

```ts
export interface Product {
  id: string;
  brand: string;
  brandLogo?: string;
  name: string;
  model?: string;
  category: string;
  description: string;
  image: string;
  gallery?: string[];
  price?: number;
  currency?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  specifications?: Record<string, string>;
  badge?: string;
  featured?: boolean;
  inStock?: boolean;
}
```

Do not duplicate product markup manually.

Render the entire catalog from structured data.

---

# IMPORTANT REAL-DATA RULE

When using real products:

* Use accurate product names.
* Do not invent specifications.
* Do not invent prices and present them as current.
* Do not invent stock status.
* Do not claim an offer is currently active unless it is actually implemented with real data.
* Keep demo ecommerce functions clearly separated from real information.

Where live commerce APIs are unavailable, use:

* Demo pricing
* Demo availability
* Sample inventory
* Mock checkout

but clearly structure the app so the backend/API can be integrated later.

---

# CORE OBJECTIVE

Build a premium electronics marketplace containing:

* Premium global navigation
* Official Apple logo
* Real brand logos
* Real product names/models
* Search
* Categories
* Brand explorer
* Featured products
* Product grid
* Product detail experience
* Product comparison
* Shopping bag
* Wishlist
* Deals
* New arrivals
* Store locator
* Account UI
* Checkout-ready architecture
* Responsive mobile navigation
* Apple-inspired product storytelling
* Smooth animations
* Accessibility
* Performance optimization
* Data-driven catalog
* Automated testing
* Production QA

---

# DESIGN PHILOSOPHY

The website should be inspired by:

* Apple Store
* Premium electronics retailers
* Modern luxury ecommerce
* Editorial product showcases

Visual characteristics:

* Minimal
* Clean
* Spacious
* Premium
* Product-focused
* Image-driven
* High-quality typography
* Subtle motion
* Strong hierarchy
* Excellent whitespace

Avoid:

* Generic ecommerce dashboard
* Cheap marketplace appearance
* Excessive borders
* Excessive shadows
* Excessive rounded cards
* Glassmorphism everywhere
* Huge gradients
* Clutter
* Too many badges
* Too many competing colors
* Generic template UI

The interface should feel expensive.

---

# COLOR SYSTEM

Base:

* White
* Black
* Near-black
* Soft gray
* Light gray

Suggested:

```text
White: #FFFFFF
Black: #000000
Dark: #1D1D1F
Gray: #6E6E73
Light Gray: #F5F5F7
Border: #D2D2D7
```

Use brand colors only where necessary.

For example:

* Apple product visuals may use neutral Apple-style presentation.
* Samsung sections may use Samsung-inspired accents.
* Sony sections may use dark editorial treatment.

Do not allow every brand color to dominate the entire site.

---

# TYPOGRAPHY

Use:

* Inter
* System Sans
* SF Pro-style system typography where legally/technically appropriate
* Clean modern sans-serif

Typography should feel:

* Premium
* Minimal
* Technical
* Elegant
* Highly readable

Use:

* Large product headlines
* Medium supporting text
* Compact metadata
* Clear prices
* Strong CTAs

---

# PAGE STRUCTURE

HEADER
→ HERO
→ BRAND NAVIGATION
→ FEATURED PRODUCT
→ CATEGORY EXPLORER
→ NEW ARRIVALS
→ BEST SELLERS
→ DEALS
→ BRAND SHOWCASE
→ PRODUCT COMPARISON
→ SERVICES / SUPPORT
→ STORE LOCATOR
→ FOOTER

---

# GLOBAL CONTAINER SYSTEM

Use a reusable:

`Container.tsx`

Requirements:

* Central max-width
* Responsive padding
* Consistent alignment
* Good spacing rhythm

Do not let product grids become excessively wide.

---

# HEADER

## DESKTOP

At approximately >=1024px.

Left:

* REAL STORE LOGO
* Store
* Mac
* iPhone
* iPad
* Watch
* Audio
* Gaming
* Accessories

Middle/right:

* Search
* Wishlist
* Account
* Shopping Bag

The primary store branding should be your **own ecommerce store identity**, while the Apple logo belongs only within relevant Apple brand/product areas.

Do NOT make the entire marketplace look officially owned by Apple.

---

# STORE BRANDING

Create an original store name.

Example:

**NEXORA**

or:

**TECHORA**

or:

**NOVA TECH**

Use an original ecommerce logo for the store itself.

Then use official manufacturer logos inside brand-specific sections and product cards.

This creates a multi-brand store rather than falsely presenting the website as Apple's official store.

---

# MOBILE HEADER

Below approximately 768px:

Show:

* Store logo
* Search
* Wishlist
* Bag
* Hamburger

Drawer:

* Smooth animation
* Backdrop
* Close button
* Escape support
* Outside-click close
* Body scroll lock
* Focus management
* Keyboard support

Sections:

* Shop
* Brands
* Categories
* Deals
* New Arrivals
* Support

---

# HERO

Create a premium hero focused on technology.

Possible design:

FULL-WIDTH PRODUCT IMAGE

PLUS

Large editorial typography.

Example original copy:

"THE NEXT ERA OF TECHNOLOGY"

"Discover the devices, entertainment, and tools designed for the way you live, work, and create."

Buttons:

* Shop New Arrivals
* Explore Brands

Do not use Apple's official campaign copy.

---

# HERO PRODUCT

The hero should feature a real product.

Example:

* iPhone
* MacBook
* Galaxy phone
* PlayStation
* Sony headphones

Use an actual product image from an appropriate source.

The product should be clearly labeled with:

* Brand
* Product name
* CTA

---

# HERO ANIMATION

Use subtle premium motion:

1. Image fade/reveal
2. Product text fade
3. Headline movement
4. CTA entrance

Duration:

Approximately 0.5–1.2 seconds.

Use:

* opacity
* transform

Avoid distracting motion.

---

# BRAND NAVIGATION

Create a premium brand explorer.

Display brand logos:

* Apple
* Samsung
* Sony
* Google
* Microsoft
* ASUS
* Lenovo
* Dell
* HP
* Logitech
* JBL
* Bose
* Canon
* Nikon
* Nintendo
* PlayStation
* Xbox

Each brand tile should contain:

* Real logo
* Brand name
* Optional short category description

Desktop:

* Horizontal or grid layout

Mobile:

* Horizontally scrollable

The actual logo assets should remain sharp and correctly proportioned.

---

# CATEGORY NAVIGATION

Main categories:

* Phones
* Laptops
* Tablets
* Smartwatches
* Headphones
* Cameras
* Gaming
* Monitors
* TVs
* Accessories

Use clean category icons/images.

Category controls should be easy to scan.

---

# FEATURED PRODUCT SECTION

Create:

`FeaturedProduct.tsx`

Feature 1–3 premium products.

Layout:

Large image
+
Product information

Include:

* Brand logo
* Product image
* Product name
* Short description
* Price
* Colors
* CTA

Buttons:

* View product
* Buy now
* Compare

---

# PRODUCT GRID

Create:

`ProductGrid.tsx`

and:

`ProductCard.tsx`

Display at least 12 real products across multiple brands.

Every product card should support:

* Official brand logo
* Real product name
* Model
* Product image
* Price
* Discount if applicable
* Rating
* Availability
* Wishlist
* View details

---

# PRODUCT CARD DESIGN

The card must be premium and minimal.

Layout:

IMAGE

BRAND

PRODUCT NAME

DESCRIPTION

PRICE

ACTION

Use consistent image ratios.

Hover:

* Subtle image zoom
* Smooth shadow/elevation
* Wishlist transition
* Secondary CTA reveal

Do not overanimate.

---

# PRODUCT FILTERING

Implement:

* Brand filter
* Category filter
* Price filter
* Rating filter
* Availability filter

Desktop:

* Sidebar or horizontal filter controls

Mobile:

* Filter button
* Slide-over filter drawer
* Reset filters

---

# PRODUCT SEARCH

Create a polished search experience.

Support:

* Search field
* Search icon
* Keyboard interaction
* Recent searches UI
* Product suggestions
* Brand suggestions
* Category suggestions

Example:

Search:

`iPhone`

Results:

Apple
→ iPhone models

---

# PRODUCT DETAIL PAGE

Create:

`ProductDetail.tsx`

Include:

* Official brand logo
* Large product image
* Image gallery
* Product name
* Model
* Price
* Availability
* Color options
* Specifications
* Add to bag
* Buy now
* Wishlist
* Compare
* Delivery/store pickup demo

Use a premium Apple-style layout.

---

# PRODUCT GALLERY

Desktop:

* Large main image
* Thumbnail rail

Mobile:

* Horizontal image carousel
* Swipe support

Use smooth transitions.

---

# PRODUCT SPECIFICATIONS

Organize specifications cleanly.

Example:

Display
Processor
Memory
Storage
Camera
Battery
Connectivity

Use real specs when available.

If using demo specs, label the data appropriately.

---

# PRODUCT COMPARISON

Create:

`CompareProducts.tsx`

Allow comparing 2–4 products.

Example:

iPhone vs Galaxy vs Pixel

Compare:

* Price
* Display
* Processor
* Storage
* Camera
* Battery
* Weight
* Operating system

Desktop:

Comparison table.

Mobile:

Horizontally scrollable comparison.

---

# SHOPPING BAG

Create:

`CartDrawer.tsx`

Requirements:

* Add product
* Remove product
* Quantity
* Price
* Subtotal
* Estimated total
* Continue shopping
* Checkout CTA

Use local state or localStorage for demo.

Do not process real payment.

---

# WISHLIST

Create:

`Wishlist.tsx`

Allow:

* Add
* Remove
* View product
* Move to bag

Use localStorage for demo persistence.

---

# DEALS SECTION

Create:

`DealsSection.tsx`

Use real products where appropriate.

Show:

* Product
* Original price if legitimately known
* Demo/current price
* Savings
* CTA

Do not invent "official sale" claims.

For demonstration, label sample promotions clearly.

---

# NEW ARRIVALS

Create:

`NewArrivals.tsx`

Use real recent products only when current product information is available.

Otherwise use clearly labeled sample catalog content.

Display:

* New badge
* Brand
* Product
* Price
* CTA

---

# BEST SELLERS

Create:

`BestSellers.tsx`

Use data-driven rendering.

Display multiple brands.

Do not claim a product is actually a bestseller without supporting real data.

For a demo project, use:

"Popular Picks"

instead.

---

# BRAND SHOWCASE

Create major sections for individual brands.

Example:

## APPLE

Large product showcase.

Real:

* Apple logo
* Product images
* Product names

## SAMSUNG

Similar structure.

## SONY

Similar structure.

Use distinct visual treatments while maintaining global site consistency.

---

# BRAND SECTION RULE

Each brand section should contain:

* Real official logo
* Real product names
* Real products
* Brand-appropriate imagery
* CTA

Do not combine different brands into a misleading official brand page.

---

# SERVICES SECTION

Create:

`ServicesSection.tsx`

Include:

* Free shipping
* Store pickup
* Technical support
* Warranty information
* Easy returns
* Device setup
* Trade-in placeholder/demo

Clearly identify which services are actual and which are demo features.

---

# STORE LOCATOR

Create:

`StoreSection.tsx`

Include:

* Location icon
* Store search
* City/location field
* Map-style visual
* Store list

If no real store API exists:

* Use demo locations
* Clearly label them as sample
* Do not fake user geolocation

---

# FOOTER

Desktop:

Shop

* Phones
* Laptops
* Tablets
* Audio
* Gaming
* Accessories

Brands

* Apple
* Samsung
* Sony
* Google
* Microsoft
* ASUS

Support

* Contact
* Shipping
* Returns
* Warranty
* Help

Company

* About
* Careers
* Privacy
* Terms

Then:

* Social icons
* Store logo
* Copyright

---

# BUTTON SYSTEM

Create:

`Button.tsx`

Variants:

* Primary
* Secondary
* Outline
* Ghost
* Buy

States:

* Default
* Hover
* Active
* Focus
* Disabled

Primary purchase CTA should be visually clear without dominating every section.

---

# ICON SYSTEM

Use Lucide React for interface icons:

* Search
* Menu
* X
* User
* Heart
* ShoppingBag
* MapPin
* SlidersHorizontal
* ArrowRight
* ChevronLeft
* ChevronRight
* Plus
* Minus

Never use these icons as replacements for official brand logos.

---

# ACCESSIBILITY

Use:

* Semantic HTML
* Correct heading hierarchy
* Keyboard navigation
* Visible focus
* Accessible buttons
* Accessible forms
* Alt text
* Screen-reader labels
* Accessible dialogs/drawers
* Proper color contrast

---

# REDUCED MOTION

Support:

`prefers-reduced-motion: reduce`

Reduce:

* Hero animation
* Product hover scaling
* Drawer animation
* Scroll animations

Keep all content and controls functional.

---

# PERFORMANCE

Optimize:

* Product images
* Logo SVGs
* Product galleries
* Lazy loading
* Responsive images
* Code splitting
* Rendering

Prefer:

* transform
* opacity

Avoid expensive layout animation.

Use appropriate image dimensions to prevent layout shifts.

---

# COMPONENT ARCHITECTURE

Required:

```text
src/components/layout/
├── Header.tsx
├── MobileMenu.tsx
├── Footer.tsx
└── CartDrawer.tsx

src/components/brands/
├── BrandLogo.tsx
├── BrandCard.tsx
└── BrandShowcase.tsx

src/components/products/
├── ProductCard.tsx
├── ProductGrid.tsx
├── ProductGallery.tsx
├── ProductFilters.tsx
├── ProductSearch.tsx
├── ProductDetail.tsx
└── CompareProducts.tsx

src/components/sections/
├── Hero.tsx
├── BrandNavigation.tsx
├── CategoryNavigation.tsx
├── FeaturedProduct.tsx
├── NewArrivals.tsx
├── PopularPicks.tsx
├── DealsSection.tsx
├── ServicesSection.tsx
└── StoreSection.tsx

src/components/ui/
├── Button.tsx
├── Container.tsx
├── SectionHeading.tsx
├── ScrollReveal.tsx
├── Modal.tsx
└── Badge.tsx
```

Keep components:

* Small
* Typed
* Reusable
* Maintainable

---

# DATA ARCHITECTURE

Create:

```text
src/data/
├── brands.ts
├── products.ts
├── categories.ts
├── deals.ts
├── navigation.ts
├── services.ts
└── footer.ts
```

Example:

```ts
export interface Brand {
  id: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  model?: string;
  category: string;
  image: string;
  gallery?: string[];
  price?: number;
  currency?: string;
  originalPrice?: number;
  description: string;
  specifications?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  badge?: string;
  inStock?: boolean;
}
```

Everything should render from data.

---

# STATE MANAGEMENT

For this demo marketplace, support:

* Cart
* Wishlist
* Search
* Filters
* Compare
* Mobile menu

Use lightweight state management.

Prefer React state/context unless the project already has Redux/Zustand/etc.

Persist appropriate demo state using localStorage.

---

# ROUTING

Recommended routes:

```text
/
 /products
 /products/:id
 /category/:category
 /brand/:brand
 /deals
 /new-arrivals
 /compare
 /wishlist
 /cart
 /support
 /stores
```

Implement routes using the project's existing router or React Router.

---

# GLOBAL STYLES

Use:

```text
src/styles/
├── globals.css
├── variables.css
└── animations.css
```

Centralize:

* Colors
* Typography
* Spacing
* Breakpoints
* Motion
* Focus styles
* Design tokens

---

# REQUIRED LOGO VALIDATION

Before completion verify:

* Store's own logo exists
* Official Apple logo exists where Apple products/brand sections are shown
* Official Samsung logo exists
* Official Sony logo exists
* Official Google logo exists
* Official Microsoft logo exists
* Official ASUS logo exists
* Official Lenovo logo exists
* Other displayed brands use authentic logos
* No fake brand logos remain
* No text replacement is used where an official logo is required
* Logos maintain correct aspect ratio
* Logos render sharply
* Logos are responsive
* Logos are not distorted

---

# REQUIRED PRODUCT VALIDATION

Before completion verify:

* Product names are real
* Models are real
* Brand association is correct
* Product images correspond to displayed products
* Product pages match product cards
* Specifications are accurate or clearly marked as demo
* Prices are clearly marked as demo where not connected to live commerce data
* No fictional product is presented as a real current product
* Product comparison data is consistent

---

# BUILD PLAN

Follow exactly:

## PHASE 1 — INSPECT

Inspect the existing project.

Understand:

* Framework
* Dependencies
* Routes
* Components
* Styling
* Assets

---

## PHASE 2 — BRAND ASSETS

Collect/organize approved official brand logos.

Verify:

* SVG quality
* Transparency
* aspect ratio
* naming

---

## PHASE 3 — PRODUCT DATA

Create structured product and brand data.

Verify product relationships.

---

## PHASE 4 — DESIGN SYSTEM

Build:

* Colors
* Typography
* Spacing
* Buttons
* Cards
* Containers
* Badges

---

## PHASE 5 — HEADER

Build desktop/mobile navigation.

---

## PHASE 6 — HERO

Build premium hero.

---

## PHASE 7 — BRAND NAVIGATION

Build brand logo explorer.

---

## PHASE 8 — CATEGORIES

Build category navigation.

---

## PHASE 9 — FEATURED PRODUCTS

Build featured product showcase.

---

## PHASE 10 — PRODUCT GRID

Build multi-brand catalog.

---

## PHASE 11 — FILTER / SEARCH

Implement:

* Search
* Filters
* Brand/category filtering

---

## PHASE 12 — PRODUCT DETAIL

Implement product page.

---

## PHASE 13 — COMPARISON

Implement product comparison.

---

## PHASE 14 — CART

Implement shopping bag.

---

## PHASE 15 — WISHLIST

Implement wishlist.

---

## PHASE 16 — DEALS / NEW ARRIVALS

Implement promotional sections.

---

## PHASE 17 — BRAND SHOWCASES

Build dedicated brand sections.

---

## PHASE 18 — SERVICES

Build support/service section.

---

## PHASE 19 — STORE LOCATOR

Implement demo store finder if API unavailable.

---

## PHASE 20 — FOOTER

Build footer.

---

## PHASE 21 — ANIMATION

Add restrained motion after layout is stable.

---

## PHASE 22 — ACCESSIBILITY

Run full accessibility QA.

---

## PHASE 23 — RESPONSIVE

Test all required viewports.

---

## PHASE 24 — PERFORMANCE

Optimize images, rendering, and animation.

---

## PHASE 25 — FINAL POLISH

Review:

* Does it feel premium?
* Does it feel like a serious electronics retailer?
* Are products the visual focus?
* Are official brand logos accurate?
* Does the marketplace identity remain clear?
* Does mobile feel intentionally designed?
* Is the shopping experience intuitive?
* Are animations smooth?
* Is anything cluttered?

Redesign anything that feels generic.

---

# REQUIRED PROJECT STRUCTURE

```text
project-root/
├── public/
│   └── assets/
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── products/
│   │   └── brands/
│   │       ├── apple.svg
│   │       ├── samsung.svg
│   │       ├── sony.svg
│   │       ├── google.svg
│   │       ├── microsoft.svg
│   │       └── ...
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── brands/
│   │   ├── products/
│   │   ├── sections/
│   │   └── ui/
│   │
│   ├── data/
│   │   ├── brands.ts
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── deals.ts
│   │   ├── navigation.ts
│   │   ├── services.ts
│   │   └── footer.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Brand.tsx
│   │   ├── Category.tsx
│   │   ├── Compare.tsx
│   │   ├── Wishlist.tsx
│   │   ├── Cart.tsx
│   │   └── Stores.tsx
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

# REQUIRED DELIVERABLES

Deliver:

* Premium homepage
* Multi-brand catalog
* Official brand logos
* Real product names/models
* Search
* Filters
* Brand pages
* Category pages
* Product detail pages
* Product comparison
* Cart
* Wishlist
* Deals
* New arrivals
* Store locator
* Services
* Mobile navigation
* Responsive layouts
* Smooth animations
* Accessibility
* Performance optimization
* Unit tests
* E2E tests
* README
* Production build

---

# CONCRETE ACCEPTANCE CRITERIA

## APPLICATION

AC-01 — `npm install` succeeds.

AC-02 — `npm run dev` starts.

AC-03 — `npm run build` succeeds.

AC-04 — No unresolved imports.

AC-05 — No fatal TypeScript errors.

AC-06 — No uncaught runtime errors.

---

# BRANDING

AC-07 — Store logo exists.

AC-08 — Real official Apple logo is used where required.

AC-09 — Real official Samsung logo is used where required.

AC-10 — Real official Sony logo is used where required.

AC-11 — Other displayed brands use appropriate official logos.

AC-12 — No fake logos.

AC-13 — No distorted logos.

---

# PRODUCTS

AC-14 — At least 12 real products.

AC-15 — Multiple brands represented.

AC-16 — Product names are correct.

AC-17 — Brand/product relationship is correct.

AC-18 — Product cards display correct imagery.

AC-19 — Product details match cards.

AC-20 — No invented products presented as real.

---

# SEARCH

AC-21 — Search field works.

AC-22 — Search filters results.

AC-23 — Suggestions can be displayed.

AC-24 — Keyboard interaction works.

---

# FILTERS

AC-25 — Brand filtering works.

AC-26 — Category filtering works.

AC-27 — Price filtering works when data exists.

AC-28 — Reset filters works.

AC-29 — Mobile filter drawer works.

---

# PRODUCT DETAIL

AC-30 — Product detail page renders.

AC-31 — Gallery works.

AC-32 — Product information is visible.

AC-33 — Specifications render.

AC-34 — Add to bag works.

AC-35 — Wishlist works.

AC-36 — Compare works.

---

# CART

AC-37 — Add item works.

AC-38 — Remove works.

AC-39 — Quantity works.

AC-40 — Subtotal updates.

AC-41 — Checkout CTA exists.

AC-42 — No fake payment processing.

---

# WISHLIST

AC-43 — Products can be added.

AC-44 — Products can be removed.

AC-45 — State persists appropriately.

---

# COMPARISON

AC-46 — 2–4 products can be compared.

AC-47 — Specifications align.

AC-48 — Mobile comparison scrolls correctly.

---

# RESPONSIVE

Test:

* 320x800
* 375x812
* 390x844
* 414x896
* 768x1024
* 1024x768
* 1280x800
* 1440x900
* 1920x1080

AC-49 — No horizontal overflow.

AC-50 — No overlap.

AC-51 — No clipping.

AC-52 — Product images remain correct.

AC-53 — Logos remain sharp.

AC-54 — Navigation remains usable.

---

# ACCESSIBILITY

AC-55 — Keyboard navigation works.

AC-56 — Focus states visible.

AC-57 — Semantic HTML used.

AC-58 — Images have appropriate alt text.

AC-59 — Forms are labeled.

AC-60 — Drawers/dialogs are accessible.

AC-61 — Reduced motion supported.

---

# PERFORMANCE

AC-62 — Product images optimized.

AC-63 — Lazy loading where appropriate.

AC-64 — No obvious layout shifts.

AC-65 — Efficient animation.

AC-66 — No unnecessary dependencies.

---

# CODE QUALITY

AC-67 — Reusable components.

AC-68 — Typed interfaces.

AC-69 — Data-driven products.

AC-70 — Data-driven brands.

AC-71 — No giant component.

AC-72 — Maintainable architecture.

---

# VISUAL QUALITY

AC-73 — Premium Apple Store-inspired layout.

AC-74 — Multi-brand identity remains clear.

AC-75 — Product imagery is dominant.

AC-76 — Typography is sophisticated.

AC-77 — Spacing is intentional.

AC-78 — UI is cohesive.

AC-79 — Store feels premium.

AC-80 — Website does not look like a generic ecommerce template.

---

# TESTING TOOLS

Use:

* Vitest
* React Testing Library
* Playwright
* @axe-core/playwright
* ESLint
* TypeScript
* Vite

---

# NPM SCRIPTS

Use/adapt:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

# UNIT TESTS

Create:

```text
tests/
├── Header.test.tsx
├── MobileMenu.test.tsx
├── BrandCard.test.tsx
├── ProductCard.test.tsx
├── ProductFilters.test.tsx
├── ProductDetail.test.tsx
├── Cart.test.tsx
├── Wishlist.test.tsx
└── CompareProducts.test.tsx
```

Test:

* Rendering
* Props
* Search
* Filtering
* Cart
* Wishlist
* Compare
* Keyboard navigation
* Accessibility

Run:

```bash
npm run test:run
```

---

# PLAYWRIGHT E2E

Create:

```text
tests/
├── home.spec.ts
├── products.spec.ts
├── navigation.spec.ts
├── cart.spec.ts
├── wishlist.spec.ts
├── compare.spec.ts
├── responsive.spec.ts
└── accessibility.spec.ts
```

Run:

```bash
npm run test:e2e
```

---

# RESPONSIVE E2E

Check all viewports.

Example:

```ts
const hasHorizontalOverflow = await page.evaluate(() => {
  return document.documentElement.scrollWidth >
         document.documentElement.clientWidth;
});

expect(hasHorizontalOverflow).toBe(false);
```

---

# ACCESSIBILITY E2E

Use:

```ts
const accessibilityScanResults = await new AxeBuilder({
  page
}).analyze();

expect(accessibilityScanResults.violations).toEqual([]);
```

---

# REDUCED MOTION

Use:

```ts
await page.emulateMedia({
  reducedMotion: "reduce"
});
```

Verify content and ecommerce interaction remain functional.

---

# BROKEN IMAGE TEST

Verify:

```js
naturalWidth > 0
```

for important product and brand images.

---

# PRODUCTION QA

Run:

```bash
npm run build
npm run preview
npm run test:e2e
```

Test the production build rather than only the development server.

---

# FULL QA COMMAND

```bash
npm install
npx tsc --noEmit
npm run lint
npm run test:run
npm run test:coverage
npm run build
npx playwright install
npm run test:e2e
```

If Playwright browsers are already installed, do not reinstall unnecessarily.

---

# VISUAL REGRESSION

Create:

* homepage-desktop.png
* homepage-tablet.png
* homepage-mobile.png
* product-detail-desktop.png
* product-detail-mobile.png
* cart.png
* brand-page.png
* compare-page.png

Recommended:

* 1440x900
* 768x1024
* 390x844

Check:

* Logos
* Product imagery
* Typography
* Spacing
* Navigation
* Filters
* Cards
* Buttons
* Footer

---

# LIGHTHOUSE

When available:

Performance: 85+

Accessibility: 90+

Best Practices: 90+

SEO: 90+

---

# TEST FAILURE POLICY

FAIL
→ Identify
→ Fix
→ Retest
→ Verify
→ Run related tests
→ Full QA

Never:

* Delete tests
* Skip tests
* Disable tests
* Suppress real errors
* Lower requirements just to pass

---

# FINAL QA CHECKLIST

Verify:

* npm install
* npm run dev
* TypeScript
* ESLint
* Unit tests
* Coverage
* Build
* Production preview
* E2E
* Accessibility
* Desktop
* Tablet
* Mobile
* Store logo
* Official brand logos
* Real product names
* Real product models
* Hero
* Brand navigation
* Categories
* Featured products
* Product grid
* Search
* Filters
* Product details
* Comparison
* Cart
* Wishlist
* Deals
* New arrivals
* Brand showcases
* Services
* Store locator
* Footer
* Hover
* Focus
* Keyboard
* Reduced motion
* Image loading
* No overflow
* No console errors
* Data-driven architecture
* README
* Final polish

---

# ACCEPTANCE SCORE

## CRITICAL — MUST PASS

* Build
* Runtime
* Official brand logos
* Real product data
* Header
* Mobile navigation
* Search
* Product catalog
* Product details
* Cart
* Responsive design
* Accessibility basics
* No horizontal overflow

## IMPORTANT

* Wishlist
* Comparison
* Filters
* Deals
* New arrivals
* Brand pages
* Store locator
* Services
* Animations
* Performance

## POLISH

* Typography
* Product photography
* Image cropping
* Spacing
* Micro-interactions
* Motion timing
* Premium feel

If any Critical item fails:

**PROJECT IS NOT COMPLETE.**

---

# FINAL REPORT

After implementation, report actual results.

## PROJECT STATUS

PASS / FAIL:

* Store Branding
* Apple Logo
* Samsung Logo
* Other Brand Logos
* Header
* Mobile Navigation
* Hero
* Brand Navigation
* Categories
* Featured Products
* Product Grid
* Search
* Filters
* Product Detail
* Cart
* Wishlist
* Comparison
* Deals
* New Arrivals
* Brand Showcases
* Services
* Store Finder
* Footer
* Responsive Design
* Animations
* Accessibility
* Performance
* Production Build

## FILES CREATED / MODIFIED

Only list actual files.

## DEPENDENCIES ADDED

Only actual dependencies.

## VALIDATION PERFORMED

Report actual:

* Commands
* Viewports
* Browsers
* Unit tests
* E2E tests
* Accessibility tests
* Production build

## KNOWN LIMITATIONS

Only actual limitations, such as:

* Demo checkout
* No payment gateway
* Demo inventory
* Sample store locations
* Placeholder product pricing
* No live retailer APIs

Never claim a live feature that does not exist.

---

# FINAL COMPLETION RULE

Do not declare complete until the Critical acceptance criteria pass.

If something fails:

**IDENTIFY → FIX → RETEST → VERIFY → CONTINUE**

Final engineering loop:

**INSPECT → PLAN → BUILD → RUN → TEST → INSPECT → FIX → RETEST → POLISH → FINAL QA**

---

# OBJECTIVE

Build a **premium Apple Store-inspired multi-brand technology ecommerce platform** that sells real products from major technology brands, uses authentic brand logos, provides a polished shopping experience, and feels like a serious high-end electronics retailer rather than a generic ecommerce template.
