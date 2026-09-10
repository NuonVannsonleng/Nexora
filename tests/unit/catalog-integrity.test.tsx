import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { brands } from '../../src/data/brands';
import { categories } from '../../src/data/categories';
import { allPhotoCredits, products } from '../../src/data/products';
import { footerGroups } from '../../src/data/footer';
import { mobileNav, primaryNav } from '../../src/data/navigation';

const ROOT = resolve(__dirname, '../..');
const publicPath = (webPath: string) => resolve(ROOT, 'public', webPath.replace(/^\//, ''));

/**
 * Guards the two rules the brief treats as non-negotiable: every brand shows a
 * real logo file, and every product's imagery, brand and category actually line
 * up. These are data assertions, so they fail loudly if the catalogue is edited
 * carelessly later.
 */
describe('brand assets', () => {
  it('carries at least the brands the store advertises', () => {
    const required = [
      'apple', 'samsung', 'sony', 'google', 'microsoft',
      'asus', 'lenovo', 'dell', 'hp', 'logitech',
      'jbl', 'bose', 'canon', 'nikon', 'nintendo',
      'playstation', 'xbox',
    ];
    const ids = brands.map((b) => b.id);

    for (const id of required) expect(ids).toContain(id);
  });

  it('points every brand at a logo file that exists on disk', () => {
    for (const brand of brands) {
      expect(existsSync(publicPath(brand.logo)), `${brand.id} logo missing`).toBe(true);
    }
  });

  it('serves every brand logo as a real SVG with a title', () => {
    for (const brand of brands) {
      const svg = readFileSync(publicPath(brand.logo), 'utf8');
      expect(svg, `${brand.id}`).toContain('<svg');
      expect(svg, `${brand.id}`).toContain('<title>');
      // A logo must be artwork, not a text substitute.
      expect(svg, `${brand.id} uses <text> instead of artwork`).not.toContain('<text');
    }
  });

  it('never fills a logo with a colour too light to see on white', () => {
    for (const brand of brands) {
      const svg = readFileSync(publicPath(brand.logo), 'utf8');
      const fills = [...svg.matchAll(/fill="#([0-9a-fA-F]{6})"/g)].map((m) => m[1]);
      if (fills.length === 0) continue; // multi-colour vendor artwork with named fills

      const visible = fills.some((hex) => {
        const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.85;
      });
      expect(visible, `${brand.id} logo would be invisible on white`).toBe(true);
    }
  });

  it('gives each logo a viewBox so it scales without distortion', () => {
    for (const brand of brands) {
      const svg = readFileSync(publicPath(brand.logo), 'utf8');
      expect(svg, `${brand.id}`).toMatch(/viewBox="[-\d. ]+"/);
    }
  });
});

describe('product catalogue', () => {
  it('carries at least twelve products', () => {
    expect(products.length).toBeGreaterThanOrEqual(12);
  });

  it('spans multiple brands', () => {
    expect(new Set(products.map((p) => p.brandId)).size).toBeGreaterThanOrEqual(8);
  });

  it('uses unique product ids', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });

  it('associates every product with a brand the store carries', () => {
    const brandIds = new Set(brands.map((b) => b.id));
    for (const p of products) {
      expect(brandIds.has(p.brandId), `${p.id} -> ${p.brandId}`).toBe(true);
    }
  });

  it('associates every product with a real category', () => {
    const categoryIds = new Set(categories.map((c) => c.id));
    for (const p of products) {
      expect(categoryIds.has(p.category), `${p.id} -> ${p.category}`).toBe(true);
    }
  });

  it('ships every responsive image variant referenced by a product', () => {
    for (const p of products) {
      for (const variant of ['-640.webp', '-640.jpg', '-1200.webp', '-1200.jpg']) {
        expect(
          existsSync(publicPath(`${p.image}${variant}`)),
          `${p.id}${variant} missing`,
        ).toBe(true);
      }
    }
  });

  it('records intrinsic image dimensions so layout can be reserved', () => {
    for (const p of products) {
      expect(p.imageWidth, `${p.id} width`).toBeGreaterThan(0);
      expect(p.imageHeight, `${p.id} height`).toBeGreaterThan(0);
    }
  });

  it('matches each product’s dimensions to its processed photo', () => {
    for (const p of products) {
      const credit = allPhotoCredits[p.id];
      if (!credit?.width || !credit?.height) continue;
      expect(p.imageWidth, `${p.id}`).toBe(credit.width);
      expect(p.imageHeight, `${p.id}`).toBe(credit.height);
    }
  });

  it('attributes every product photograph to its source', () => {
    for (const p of products) {
      const credit = allPhotoCredits[p.id];
      expect(credit, `${p.id} has no photo credit`).toBeDefined();
      expect(credit.descriptionUrl).toMatch(/^https:\/\//);
      expect(credit.license.length).toBeGreaterThan(0);
    }
  });

  it('gives every product a name, description, price and colourway', () => {
    for (const p of products) {
      expect(p.name.trim().length, `${p.id} name`).toBeGreaterThan(0);
      expect(p.description.trim().length, `${p.id} description`).toBeGreaterThan(10);
      expect(p.price, `${p.id} price`).toBeGreaterThan(0);
      expect(p.colors.length, `${p.id} colors`).toBeGreaterThan(0);
    }
  });

  it('publishes at least one specification per product', () => {
    for (const p of products) {
      const specs = Object.values(p.specifications).filter(Boolean);
      expect(specs.length, `${p.id} has no specifications`).toBeGreaterThan(0);
    }
  });

  it('keeps ratings and review counts in a sane range', () => {
    for (const p of products) {
      expect(p.rating, `${p.id} rating`).toBeGreaterThanOrEqual(0);
      expect(p.rating, `${p.id} rating`).toBeLessThanOrEqual(5);
      expect(p.reviewCount, `${p.id} reviews`).toBeGreaterThanOrEqual(0);
    }
  });

  it('gives every product a plausible real release year', () => {
    const nextYear = new Date().getFullYear() + 1;
    for (const p of products) {
      expect(p.releaseYear, `${p.id}`).toBeGreaterThan(2000);
      expect(p.releaseYear, `${p.id}`).toBeLessThanOrEqual(nextYear);
    }
  });

  it('only ever discounts below the reference price', () => {
    for (const p of products) {
      if (p.originalPrice === undefined) continue;
      expect(p.originalPrice, `${p.id}`).toBeGreaterThan(p.price);
    }
  });
});

describe('navigation integrity', () => {
  const routePatterns = [
    /^\/$/,
    /^\/products$/,
    /^\/products\/[\w-]+$/,
    /^\/category\/[\w-]+$/,
    /^\/brand\/[\w-]+$/,
    /^\/deals$/,
    /^\/new-arrivals$/,
    /^\/compare$/,
    /^\/wishlist$/,
    /^\/cart$/,
    /^\/support(#[\w-]+)?$/,
    /^\/stores$/,
  ];
  const isKnownRoute = (to: string) => routePatterns.some((r) => r.test(to));

  const allLinks = [
    ...primaryNav,
    ...mobileNav.flatMap((g) => g.links),
    ...footerGroups.flatMap((g) => g.links),
  ];

  it('points every navigation link at a route the app defines', () => {
    for (const link of allLinks) {
      expect(isKnownRoute(link.to), `${link.label} -> ${link.to}`).toBe(true);
    }
  });

  it('points every category link at a category that exists', () => {
    const ids = new Set<string>(categories.map((c) => c.id));
    for (const link of allLinks.filter((l) => l.to.startsWith('/category/'))) {
      expect(ids.has(link.to.replace('/category/', '')), link.to).toBe(true);
    }
  });

  it('points every brand link at a brand that exists', () => {
    const ids = new Set(brands.map((b) => b.id));
    for (const link of allLinks.filter((l) => l.to.startsWith('/brand/'))) {
      expect(ids.has(link.to.replace('/brand/', '')), link.to).toBe(true);
    }
  });
});

describe('categories', () => {
  it('gives every category at least one product, so no page renders empty', () => {
    for (const category of categories) {
      const count = products.filter((p) => p.category === category.id).length;
      expect(count, `${category.id} has no products`).toBeGreaterThan(0);
    }
  });

  it('uses a real catalogue product as each category’s representative image', () => {
    const ids = new Set(products.map((p) => p.id));
    for (const category of categories) {
      expect(ids.has(category.representativeProduct), category.id).toBe(true);
    }
  });
});
