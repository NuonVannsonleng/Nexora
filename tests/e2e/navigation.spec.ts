import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('reaches every primary route from the header', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Main' });
    // Only the desktop rail carries these; skip where it is collapsed.
    if (!(await nav.getByRole('link', { name: 'Store' }).isVisible())) test.skip();

    for (const [label, heading] of [
      ['Store', 'All products'],
      ['Laptops', 'Laptops'],
      ['Phones', 'Phones'],
      ['Gaming', 'Gaming'],
    ] as const) {
      await nav.getByRole('link', { name: label }).click();
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    }
  });

  test('every footer link resolves to a real page', async ({ page }) => {
    await page.goto('/');

    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('footer a[href^="/"]')].map(
        (a) => (a as HTMLAnchorElement).getAttribute('href')!,
      ),
    );
    expect(hrefs.length).toBeGreaterThan(15);

    // Visit the distinct destinations and confirm none lands on the 404 page.
    for (const href of [...new Set(hrefs)]) {
      await page.goto(href);
      await expect(
        page.getByRole('heading', { name: 'This page doesn’t exist' }),
        `${href} is a dead link`,
      ).toHaveCount(0);
    }
  });

  test('shows a 404 page for an unknown route', async ({ page }) => {
    await page.goto('/no-such-page');

    await expect(page.getByRole('heading', { name: 'This page doesn’t exist' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse the store' })).toBeVisible();
  });

  test('scrolls to the top on navigation', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => window.scrollTo(0, 800));

    await page.getByRole('link', { name: /NEXORA home/ }).first().click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });

  test('honours an in-page anchor from the footer', async ({ page }) => {
    await page.goto('/support#returns');

    await expect(page.getByRole('heading', { name: 'Returns', exact: true })).toBeVisible();
    // The anchored section is scrolled into view rather than left at the top.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test('opens the mobile drawer and navigates from it', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: 'Open menu' });
    if (!(await menuButton.isVisible())) test.skip();

    await menuButton.click();
    const drawer = page.getByRole('dialog', { name: 'Menu' });
    await expect(drawer).toBeVisible();

    await drawer.getByRole('link', { name: 'All products' }).click();
    await expect(drawer).not.toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'All products' })).toBeVisible();
  });

  test('closes the mobile drawer on Escape', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: 'Open menu' });
    if (!(await menuButton.isVisible())) test.skip();

    await menuButton.click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Menu' })).not.toBeVisible();
  });
});

test.describe('Search', () => {
  test('suggests products, brands and categories as you type', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search the store' }).click();

    const field = page.getByRole('combobox', { name: 'Search the store' });
    await expect(field).toBeFocused();
    await field.fill('apple');

    const options = page.getByRole('option');
    await expect.poll(() => options.count()).toBeGreaterThan(1);
    // The brand itself is suggested first.
    await expect(options.first()).toContainText('Apple');
  });

  test('opens a suggestion with the keyboard', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search the store' }).click();

    const field = page.getByRole('combobox', { name: 'Search the store' });
    await field.fill('iphone');
    await expect.poll(() => page.getByRole('option').count()).toBeGreaterThan(0);

    await field.press('ArrowDown');
    await expect(page.getByRole('option').first()).toHaveAttribute('aria-selected', 'true');

    await field.press('Enter');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('iPhone');
  });

  test('runs a full search on Enter and filters the catalogue', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search the store' }).click();

    const field = page.getByRole('combobox', { name: 'Search the store' });
    await field.fill('galaxy');
    await field.press('Enter');

    await expect(page).toHaveURL(/\/products\?q=galaxy/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('galaxy');

    const cards = page.getByRole('list', { name: 'Product results' }).getByRole('listitem');
    await expect(cards.first()).toBeVisible();
    for (const card of await cards.all()) {
      await expect(card).toContainText('Samsung');
    }
  });

  test('reports when nothing matches', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search the store' }).click();

    await page.getByRole('combobox', { name: 'Search the store' }).fill('zzzznothing');

    await expect(page.getByText(/No matches for/)).toBeVisible();
  });

  test('remembers recent searches', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search the store' }).click();

    const field = page.getByRole('combobox', { name: 'Search the store' });
    await field.fill('pixel');
    await field.press('Enter');

    await page.getByRole('button', { name: 'Search the store' }).click();
    await expect(page.getByRole('heading', { name: 'Recent searches' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'pixel', exact: true })).toBeVisible();
  });

  test('clears the field with Escape before closing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search the store' }).click();

    const field = page.getByRole('combobox', { name: 'Search the store' });
    await field.fill('ipad');
    await field.press('Escape');

    await expect(field).toHaveValue('');
    // The dialog is still open — a second Escape closes it.
    await expect(page.getByRole('dialog', { name: 'Search' })).toBeVisible();
    await field.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Search' })).not.toBeVisible();
  });
});

test.describe('Store finder', () => {
  test('filters sample locations by city', async ({ page }) => {
    await page.goto('/stores');

    await expect(page.getByRole('heading', { level: 1, name: 'Find a store' })).toBeVisible();
    // The footer carries a similar disclosure, so scope to the locator's own copy.
    await expect(page.getByText(/^NEXORA is a demonstration store\./)).toBeVisible();

    await page.getByLabel('Search by city or region').fill('London');

    await expect(page.getByText('1 store matching “London”')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'NEXORA Regent Street' })).toBeVisible();
  });

  test('reports when no sample store matches', async ({ page }) => {
    await page.goto('/stores');

    await page.getByLabel('Search by city or region').fill('Atlantis');

    await expect(page.getByText('No sample stores match that search.')).toBeVisible();
  });
});
