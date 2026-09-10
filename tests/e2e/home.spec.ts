import { expect, test } from '@playwright/test';
import { brokenImages, collectPageErrors, hasHorizontalOverflow, revealAll, waitForImages } from './utils';

test.describe('Homepage', () => {
  test('renders the hero with the store identity and a real featured product', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('The next era');
    // The store's own logo, not a manufacturer's.
    await expect(page.getByRole('link', { name: /NEXORA home/ }).first()).toBeVisible();
    // The hero product is named with its brand.
    await expect(page.getByText('iPhone 15 Pro').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Shop new arrivals' })).toBeVisible();
  });

  test('shows every homepage section', async ({ page }) => {
    await page.goto('/');
    await revealAll(page);

    for (const heading of [
      'Shop by brand',
      'In the spotlight',
      'Browse by category',
      'New arrivals',
      'Popular picks',
      'Sample offers',
      'Compare across brands',
      'Shopping with NEXORA',
      'Find a store',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
  });

  test('shows a dedicated showcase per brand', async ({ page }) => {
    await page.goto('/');
    await revealAll(page);

    await expect(page.getByRole('heading', { name: /The Apple lineup/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Galaxy, built to fold/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Sony, for the people/ })).toBeVisible();
  });

  test('loads every image, including all brand logos', async ({ page }) => {
    await page.goto('/');
    await revealAll(page);
    await waitForImages(page);

    expect(await brokenImages(page)).toEqual([]);

    // Each official mark that appears must have real pixels behind it.
    const logos = await page.evaluate(() =>
      [...document.querySelectorAll('img[src^="/assets/brands/"]')].map((img) => ({
        src: (img as HTMLImageElement).src,
        width: (img as HTMLImageElement).naturalWidth,
      })),
    );
    expect(logos.length).toBeGreaterThan(10);
    for (const logo of logos) expect(logo.width, logo.src).toBeGreaterThan(0);
  });

  test('does not scroll sideways', async ({ page }) => {
    await page.goto('/');
    await revealAll(page);

    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test('raises no console errors', async ({ page }) => {
    const errors = collectPageErrors(page);

    await page.goto('/');
    await revealAll(page);
    await waitForImages(page);

    expect(errors).toEqual([]);
  });

  test('discloses that it is not an official manufacturer store', async ({ page }) => {
    await page.goto('/');
    await revealAll(page);

    await expect(
      page.getByText(/not affiliated with, endorsed by or operated by Apple/),
    ).toBeVisible();
    await expect(page.getByText(/sample data for demonstration only/).first()).toBeVisible();
  });

  test('sets a descriptive document title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NEXORA/);
  });
});
