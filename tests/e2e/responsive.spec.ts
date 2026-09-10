import { expect, test } from '@playwright/test';
import { brokenImages, hasHorizontalOverflow, loadLazyImages, revealAll, waitForImages } from './utils';

/** The viewports the brief calls for. */
const VIEWPORTS = [
  { name: '320x800', width: 320, height: 800 },
  { name: '375x812', width: 375, height: 812 },
  { name: '390x844', width: 390, height: 844 },
  { name: '414x896', width: 414, height: 896 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
] as const;

const PAGES = ['/', '/products', '/products/iphone-15-pro', '/compare', '/cart', '/brand/sony'];

// One project is enough for pure layout assertions.
test.use({ viewport: { width: 1280, height: 800 } });
test.describe.configure({ mode: 'parallel' });

test.describe('Responsive layout', () => {
  for (const viewport of VIEWPORTS) {
    test(`no horizontal overflow at ${viewport.name}`, async ({ page }) => {
      // Six pages, each fully scrolled to trigger its reveals — past the default
      // budget on WebKit when the suite runs in parallel.
      test.slow();
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const path of PAGES) {
        await page.goto(path);
        await revealAll(page);

        expect(
          await hasHorizontalOverflow(page),
          `${path} overflows horizontally at ${viewport.name}`,
        ).toBe(false);
      }
    });
  }

  test('the header stays usable from the narrowest viewport up', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');

    // Utility actions must remain reachable even at 320px.
    await expect(page.getByRole('button', { name: 'Search the store' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Shopping bag/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Wishlist/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });

  test('the desktop nav replaces the hamburger at wide widths', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
    await expect(
      page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Store' }),
    ).toBeVisible();
  });

  test('the filter drawer replaces the sidebar on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/products');

    await expect(page.getByRole('complementary', { name: 'Product filters' })).toBeHidden();

    await page.getByRole('button', { name: /Filters/ }).click();
    const drawer = page.getByRole('dialog', { name: 'Filters' });
    await expect(drawer).toBeVisible();

    // Filtering from the drawer narrows the grid behind it.
    await drawer.getByRole('checkbox', { name: /^Apple/ }).check();
    await expect(drawer.getByRole('button', { name: /^Show \d+$/ })).toBeVisible();
    await drawer.getByRole('button', { name: /^Show \d+$/ }).click();
    await expect(drawer).not.toBeVisible();

    const cards = page.getByRole('list', { name: 'Product results' }).getByRole('listitem');
    for (const card of await cards.all()) {
      await expect(card).toContainText('Apple');
    }
  });

  test('the comparison table scrolls inside itself, not the page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Compare these three' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Compare these three' }).click();
    await page.goto('/compare');

    await expect(page.getByRole('table')).toBeVisible();
    // The wide table is wider than the phone, but the page must not scroll.
    expect(await hasHorizontalOverflow(page)).toBe(false);

    const scrollable = await page.evaluate(() => {
      const table = document.querySelector('table');
      let node = table?.parentElement ?? null;
      while (node) {
        const overflowX = getComputedStyle(node).overflowX;
        if (overflowX === 'auto' || overflowX === 'scroll') return node.scrollWidth > node.clientWidth;
        node = node.parentElement;
      }
      return false;
    });
    expect(scrollable).toBe(true);
  });

  test('product imagery and logos render at every breakpoint', async ({ page }) => {
    for (const { width, height, name } of [VIEWPORTS[0], VIEWPORTS[4], VIEWPORTS[7]]) {
      await page.setViewportSize({ width, height });
      await page.goto('/products/galaxy-s24-ultra');
      await revealAll(page);
      await loadLazyImages(page);
      await waitForImages(page);

      expect(await brokenImages(page), `broken images at ${name}`).toEqual([]);
    }
  });
});

test.describe('Reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('all content is visible and shopping still works', async ({ page }) => {
    await page.goto('/');

    // Nothing may be left stuck at opacity 0 when animations are suppressed.
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('.reveal')].filter(
        (el) => getComputedStyle(el).opacity === '0',
      ).length,
    );
    expect(hidden).toBe(0);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // The full purchase path still functions.
    await page.goto('/products');
    const card = page.getByRole('list', { name: 'Product results' }).getByRole('listitem').first();
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: 'Add to bag' }).click();
    await expect(page.getByRole('dialog', { name: /Shopping bag/ })).toBeVisible();
  });

  test('drawers still open and close', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Search the store' }).click();
    await expect(page.getByRole('dialog', { name: 'Search' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Search' })).not.toBeVisible();
  });
});
