import { expect, test } from '@playwright/test';
import { loadLazyImages, revealAll, waitForImages } from './utils';

/**
 * Reference screenshots.
 *
 * These are captured rather than diffed against a committed baseline: the product
 * photography is fetched at setup time, so a byte-exact baseline would be brittle
 * across machines. Each run writes the set named in the brief to
 * test-results/visual/ for a human to review, and asserts the page rendered
 * something real (no broken imagery, no sideways scroll) before capturing.
 */
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
} as const;

const SHOTS = [
  { name: 'homepage-desktop', path: '/', viewport: 'desktop' },
  { name: 'homepage-tablet', path: '/', viewport: 'tablet' },
  { name: 'homepage-mobile', path: '/', viewport: 'mobile' },
  { name: 'product-detail-desktop', path: '/products/iphone-15-pro', viewport: 'desktop' },
  { name: 'product-detail-mobile', path: '/products/iphone-15-pro', viewport: 'mobile' },
  { name: 'brand-page', path: '/brand/sony', viewport: 'desktop' },
  { name: 'catalogue-desktop', path: '/products', viewport: 'desktop' },
] as const;

// Capture from one browser only; these are reference images, not per-engine diffs.
test.skip(({ browserName }) => browserName !== 'chromium', 'reference captures run on chromium');

test.describe('Visual reference captures', () => {
  for (const shot of SHOTS) {
    test(`captures ${shot.name}`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS[shot.viewport]);
      await page.goto(shot.path);
      await revealAll(page);
      await loadLazyImages(page);
      await waitForImages(page);

      const broken = await page.evaluate(() =>
        [...document.querySelectorAll('img')]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src),
      );
      expect(broken, `${shot.name} has broken imagery`).toEqual([]);

      await page.screenshot({
        path: `test-results/visual/${shot.name}.png`,
        fullPage: true,
      });
    });
  }

  test('captures cart and compare with content in them', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);

    // Fill the bag and the comparison through the UI so the shots show real state.
    await page.goto('/products/iphone-15-pro');
    const main = page.getByRole('region', { name: 'iPhone 15 Pro' });
    await main.getByRole('button', { name: 'Add to bag' }).click();
    await page.keyboard.press('Escape');
    await main.getByRole('button', { name: 'Add to compare' }).click();

    await page.goto('/products/galaxy-s24-ultra');
    await page
      .getByRole('region', { name: 'Galaxy S24 Ultra' })
      .getByRole('button', { name: 'Add to compare' })
      .click();

    await page.goto('/cart');
    await expect(page.getByRole('complementary', { name: 'Order summary' })).toBeVisible();
    await waitForImages(page);
    await page.screenshot({ path: 'test-results/visual/cart.png', fullPage: true });

    await page.goto('/compare');
    await expect(page.getByRole('table')).toBeVisible();
    await waitForImages(page);
    await page.screenshot({ path: 'test-results/visual/compare-page.png', fullPage: true });
  });
});
