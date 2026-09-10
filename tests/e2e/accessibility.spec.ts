import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { revealAll, settleAnimations } from './utils';

const PAGES = [
  { path: '/', name: 'homepage' },
  { path: '/products', name: 'catalogue' },
  { path: '/products/iphone-15-pro', name: 'product detail' },
  { path: '/category/laptops', name: 'category' },
  { path: '/brand/sony', name: 'brand (dark treatment)' },
  { path: '/cart', name: 'bag' },
  { path: '/wishlist', name: 'wishlist' },
  { path: '/compare', name: 'comparison' },
  { path: '/deals', name: 'offers' },
  { path: '/new-arrivals', name: 'new arrivals' },
  { path: '/stores', name: 'store finder' },
  { path: '/support', name: 'support' },
];

const scan = (page: import('@playwright/test').Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

test.describe('Accessibility', () => {
  for (const { path, name } of PAGES) {
    test(`${name} has no axe violations`, async ({ page }) => {
      await page.goto(path);
      await revealAll(page);

      const results = await scan(page);
      expect(
        results.violations.map((v) => `${v.id}: ${v.description}`),
      ).toEqual([]);
    });
  }

  test('the open bag drawer has no violations', async ({ page }) => {
    await page.goto('/products');
    const card = page.getByRole('list', { name: 'Product results' }).getByRole('listitem').first();
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: 'Add to bag' }).click();
    await expect(page.getByRole('dialog', { name: /Shopping bag/ })).toBeVisible();
    await settleAnimations(page);

    const results = await scan(page);
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('the open search overlay has no violations', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search the store' }).click();
    await page.getByRole('combobox', { name: 'Search the store' }).fill('apple');
    await expect(page.getByRole('option').first()).toBeVisible();
    await settleAnimations(page);

    const results = await scan(page);
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('the open mobile menu has no violations', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    await settleAnimations(page);

    const results = await scan(page);
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('the open filter drawer has no violations', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/products');
    await page.getByRole('button', { name: /Filters/ }).click();
    await expect(page.getByRole('dialog', { name: 'Filters' })).toBeVisible();
    await settleAnimations(page);

    const results = await scan(page);
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe('Keyboard operation', () => {
  // Tab traversal and focus rings are desktop concerns; the emulated iOS device
  // has no hardware keyboard, so these assertions do not apply there.
  test.skip(({ isMobile }) => Boolean(isMobile), 'keyboard navigation is desktop-only');

  test('a skip link jumps past the navigation', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeVisible();
  });

  test('the whole header is reachable by Tab', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const reached: string[] = [];
    for (let i = 0; i < 18; i++) {
      await page.keyboard.press('Tab');
      reached.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          return el ? (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40) : '';
        }),
      );
    }

    expect(reached.some((l) => l.includes('Search the store'))).toBe(true);
    expect(reached.some((l) => l.includes('Shopping bag'))).toBe(true);
    expect(reached.some((l) => l.includes('Wishlist'))).toBe(true);
  });

  test('focus returns to the trigger after a drawer closes', async ({ page }) => {
    await page.goto('/');

    const searchButton = page.getByRole('button', { name: 'Search the store' });
    await searchButton.click();
    await expect(page.getByRole('dialog', { name: 'Search' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(searchButton).toBeFocused();
  });

  test('Tab stays inside an open drawer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search the store' }).click();

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return dialog?.contains(document.activeElement) ?? false;
      });
      expect(inside).toBe(true);
    }
  });

  test('the whole purchase flow works without a mouse', async ({ page }) => {
    await page.goto('/products/airpods-pro-2');

    // Focus the add-to-bag control by name, then activate it from the keyboard.
    // Scoped to the main product region: related-product cards repeat the label.
    const main = page.getByRole('region', { name: /AirPods Pro/ });
    await main.getByRole('button', { name: 'Add to bag' }).focus();
    await page.keyboard.press('Enter');

    const drawer = page.getByRole('dialog', { name: /Shopping bag/ });
    await expect(drawer).toBeVisible();

    await drawer.getByRole('button', { name: /^Increase Quantity/ }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: /Shopping bag, 2 items/ })).toBeVisible();
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/products');

    await page.getByRole('checkbox', { name: /^Apple/ }).focus();
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const cs = getComputedStyle(el);
      return { width: cs.outlineWidth, style: cs.outlineStyle };
    });
    expect(outline.style).not.toBe('none');
    expect(parseFloat(outline.width)).toBeGreaterThan(0);
  });
});

test.describe('Document structure', () => {
  test('every page has exactly one h1', async ({ page }) => {
    test.slow(); // twelve navigations in one test

    for (const { path, name } of PAGES) {
      await page.goto(path);
      // Lazy route chunks mount after navigation; wait for the heading to appear.
      await expect(page.locator('h1')).toBeVisible();
      const count = await page.locator('h1').count();
      expect(count, `${name} (${path}) should have one h1, found ${count}`).toBe(1);
    }
  });

  test('heading levels never skip a level', async ({ page }) => {
    // Walks every page and waits for its reveals; well past the default budget
    // on WebKit when the suite runs in parallel.
    test.slow();

    for (const { path, name } of PAGES) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      await revealAll(page);

      const levels = await page.evaluate(() =>
        [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1])),
      );

      let previous = levels[0] ?? 1;
      for (const level of levels) {
        expect(level - previous, `${name} (${path}) skips from h${previous} to h${level}`)
          .toBeLessThanOrEqual(1);
        previous = level;
      }
    }
  });

  test('every product and brand image carries alt text', async ({ page }) => {
    await page.goto('/products');
    await revealAll(page);

    const missing = await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter((img) => !img.hasAttribute('alt'))
        .map((img) => img.currentSrc || img.src),
    );
    expect(missing).toEqual([]);
  });

  test('every form control has a label', async ({ page }) => {
    await page.goto('/products');

    const unlabelled = await page.evaluate(() =>
      [...document.querySelectorAll('input, select, textarea')]
        .filter((el) => {
          const id = el.getAttribute('id');
          return (
            !el.getAttribute('aria-label') &&
            !el.getAttribute('aria-labelledby') &&
            !(id && document.querySelector(`label[for="${id}"]`)) &&
            !el.closest('label')
          );
        })
        .map((el) => el.outerHTML.slice(0, 80)),
    );
    expect(unlabelled).toEqual([]);
  });

  test('the page title changes with the route', async ({ page }) => {
    await page.goto('/');
    const home = await page.title();

    await page.goto('/products/iphone-15-pro');
    await expect(page).toHaveTitle(/iPhone 15 Pro/);
    expect(await page.title()).not.toBe(home);
  });
});
