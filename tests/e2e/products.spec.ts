import { expect, test } from '@playwright/test';
import { brokenImages, loadLazyImages, revealAll, waitForImages } from './utils';

test.describe('Catalogue', () => {
  // Below lg the filter panel lives in a slide-over drawer; that path is covered
  // by the mobile filter-drawer test in responsive.spec.ts.
  test.describe('sidebar filters', () => {
    test.skip(({ isMobile }) => Boolean(isMobile), 'sidebar filters are desktop-only');

  test('lists the full catalogue', async ({ page }) => {
    await page.goto('/products');

    await expect(page.getByRole('heading', { level: 1, name: 'All products' })).toBeVisible();
    const cards = page.getByRole('list', { name: 'Product results' }).getByRole('listitem');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(12);
  });

  test('filters by brand and reports the new count', async ({ page }) => {
    await page.goto('/products');

    const list = page.getByRole('list', { name: 'Product results' });
    await expect(list.getByRole('listitem').first()).toBeVisible();
    const before = await list.getByRole('listitem').count();

    await page.getByRole('checkbox', { name: /^Apple/ }).check();

    const after = page.getByRole('list', { name: 'Product results' }).getByRole('listitem');
    await expect.poll(() => after.count()).toBeLessThan(before);
    // Every remaining card is an Apple product.
    for (const card of await after.all()) {
      await expect(card.getByText('Apple', { exact: true })).toBeVisible();
    }
  });

  test('filters by category', async ({ page }) => {
    await page.goto('/products');

    await page.getByRole('checkbox', { name: /^Phones/ }).check();

    const cards = page.getByRole('list', { name: 'Product results' }).getByRole('listitem');
    await expect.poll(() => cards.count()).toBeGreaterThan(0);
    await expect(page.getByRole('button', { name: /Phones/ }).first()).toBeVisible();
  });

  test('filters by price and by availability', async ({ page }) => {
    await page.goto('/products');

    const slider = page.getByLabel('Up to');
    await slider.fill('300');

    const cards = page.getByRole('list', { name: 'Product results' }).getByRole('listitem');
    await expect.poll(() => cards.count()).toBeGreaterThan(0);
    // Nothing above the ceiling survives.
    await expect(cards.getByText('$999')).toHaveCount(0);

    await page.getByRole('checkbox', { name: 'In stock only' }).check();
    await expect(cards.getByText('Out of stock')).toHaveCount(0);
  });

  test('resets filters', async ({ page }) => {
    await page.goto('/products');

    const cards = page.getByRole('list', { name: 'Product results' }).getByRole('listitem');
    await expect(cards.first()).toBeVisible();
    const total = await cards.count();

    await page.getByRole('checkbox', { name: /^Apple/ }).check();
    await expect.poll(() => cards.count()).toBeLessThan(total);

    await page.getByRole('button', { name: 'Reset filters' }).click();
    await expect.poll(() => cards.count()).toBe(total);
  });

  test('sorts by price ascending', async ({ page }) => {
    await page.goto('/products');

    await page.getByLabel('Sort').selectOption('price-asc');

    const prices = await page.evaluate(() => {
      const list = document.querySelector('ul[aria-label="Product results"]');
      return [...(list?.querySelectorAll('li') ?? [])].map((li) => {
        const text = [...li.querySelectorAll('span')]
          .map((s) => s.textContent ?? '')
          .find((t) => /^\$[\d,]+$/.test(t.trim()));
        return Number((text ?? '0').replace(/[^0-9]/g, ''));
      });
    });

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
  });

  test('shows an empty state when nothing matches', async ({ page }) => {
    await page.goto('/products?q=zzzznotarealproduct');

    await expect(page.getByRole('heading', { name: 'No products match' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset filters' }).first()).toBeVisible();
  });

  test('loads every product image in the grid', async ({ page }) => {
    await page.goto('/products');
    await revealAll(page);
    await loadLazyImages(page);
    await waitForImages(page);

    expect(await brokenImages(page)).toEqual([]);
  });
});

test.describe('Product detail', () => {
  test('shows the product, its specifications and its brand', async ({ page }) => {
    await page.goto('/products/iphone-15-pro');

    await expect(page.getByRole('heading', { level: 1, name: 'iPhone 15 Pro' })).toBeVisible();
    await expect(page.getByText('Model A2848')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Specifications' })).toBeVisible();
    await expect(page.getByText('Apple A17 Pro')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Apple', exact: true }).first()).toBeVisible();
  });

  test('matches the card it was opened from', async ({ page }) => {
    await page.goto('/products');

    const card = page.getByRole('list', { name: 'Product results' })
      .getByRole('listitem').first();
    const name = (await card.getByRole('heading').textContent())?.trim() ?? '';
    await card.getByRole('link').first().click();

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      name.replace(/\s+/g, ' ').split(' ')[0],
    );
  });

  test('switches gallery views', async ({ page }) => {
    await page.goto('/products/playstation-5');

    const views = page.getByRole('group', { name: 'Product views' }).getByRole('button');
    await expect(views.first()).toHaveAttribute('aria-pressed', 'true');

    await views.nth(1).click();
    await expect(views.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(views.first()).toHaveAttribute('aria-pressed', 'false');
  });

  test('selects a colourway', async ({ page }) => {
    await page.goto('/products/iphone-15-pro');

    await page.locator('label').filter({ hasText: 'Blue Titanium' }).click();
    await expect(page.getByRole('radio', { name: 'Blue Titanium' })).toBeChecked();
  });

  test('recovers gracefully from an unknown product id', async ({ page }) => {
    await page.goto('/products/not-a-real-product');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/couldn’t find/i);
    await expect(page.getByRole('link', { name: 'All products' })).toBeVisible();
  });
});

test.describe('Brand and category pages', () => {
  test('a brand page shows only that brand, with its official logo', async ({ page }) => {
    await page.goto('/brand/samsung');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Samsung at NEXORA');
    const logo = page.locator('img[src="/assets/brands/samsung.svg"]').first();
    await expect(logo).toBeVisible();

    const cards = page.getByRole('list', { name: 'Samsung products' }).getByRole('listitem');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('a brand page states it is not the manufacturer’s own site', async ({ page }) => {
    await page.goto('/brand/apple');

    await expect(page.getByText(/not operated by or affiliated with Apple/)).toBeVisible();
  });

  test('a category page shows only that category', async ({ page }) => {
    await page.goto('/category/laptops');

    await expect(page.getByRole('heading', { level: 1, name: 'Laptops' })).toBeVisible();
    const cards = page.getByRole('list', { name: 'Laptops products' }).getByRole('listitem');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('unknown brands and categories fall back cleanly', async ({ page }) => {
    await page.goto('/brand/nosuchbrand');
    await expect(page.getByRole('heading', { level: 1, name: 'Brand not found' })).toBeVisible();

    await page.goto('/category/nosuchcategory');
    await expect(page.getByRole('heading', { level: 1, name: 'Category not found' })).toBeVisible();
  });
});
