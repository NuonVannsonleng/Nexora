import { expect, test } from '@playwright/test';

/** Adds the first grid product to the bag and returns the open drawer. */
async function addFirstProduct(page: import('@playwright/test').Page) {
  await page.goto('/products');
  const card = page.getByRole('list', { name: 'Product results' }).getByRole('listitem').first();
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Add to bag' }).click();
  return page.getByRole('dialog', { name: /Shopping bag/ });
}

test.describe('Shopping bag', () => {
  test('starts empty', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Shopping bag/ }).click();

    await expect(page.getByText('Your bag is empty')).toBeVisible();
  });

  test('adds a product and updates the header count', async ({ page }) => {
    const drawer = await addFirstProduct(page);

    await expect(drawer).toBeVisible();
    await expect(page.getByRole('button', { name: /Shopping bag, 1 item/ })).toBeVisible();
  });

  test('changes quantity and recalculates the subtotal', async ({ page }) => {
    const drawer = await addFirstProduct(page);

    const increase = drawer.getByRole('button', { name: /^Increase Quantity/ });
    await increase.click();

    await expect(page.getByRole('button', { name: /Shopping bag, 2 items/ })).toBeVisible();
    const group = drawer.getByRole('group', { name: /^Quantity for/ });
    await expect(group).toContainText('2');
  });

  test('removes a product', async ({ page }) => {
    const drawer = await addFirstProduct(page);

    await drawer.getByRole('button', { name: /from bag$/ }).click();

    await expect(page.getByText('Your bag is empty')).toBeVisible();
    await expect(page.getByRole('button', { name: /Shopping bag, 0 items/ })).toBeVisible();
  });

  test('survives a page reload', async ({ page }) => {
    await addFirstProduct(page);
    await page.reload();

    await expect(page.getByRole('button', { name: /Shopping bag, 1 item/ })).toBeVisible();
  });

  test('shows a full order summary on the bag page', async ({ page }) => {
    const drawer = await addFirstProduct(page);
    await drawer.getByRole('link', { name: 'Check out' }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Shopping bag' })).toBeVisible();
    // <aside> exposes the complementary role, not region.
    const summary = page.getByRole('complementary', { name: 'Order summary' });
    await expect(summary.getByText('Subtotal')).toBeVisible();
    await expect(summary.getByText('Delivery')).toBeVisible();
    await expect(summary.getByText('Estimated tax')).toBeVisible();
    await expect(summary.getByText('Estimated total')).toBeVisible();
  });

  test('does not process payment and says so', async ({ page }) => {
    const drawer = await addFirstProduct(page);
    await drawer.getByRole('link', { name: 'Check out' }).click();

    // The checkout control exists but is deliberately inert.
    await expect(page.getByRole('button', { name: /Checkout unavailable/ })).toBeDisabled();
    await expect(page.getByText(/no payment method is\s+collected/)).toBeVisible();
    // No payment fields anywhere.
    await expect(page.locator('input[autocomplete*="cc-"]')).toHaveCount(0);
  });

  test('empties the bag from the bag page', async ({ page }) => {
    const drawer = await addFirstProduct(page);
    await drawer.getByRole('link', { name: 'Check out' }).click();

    await page.getByRole('button', { name: 'Empty bag' }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Your bag is empty' })).toBeVisible();
  });

  test('closes the drawer with Escape', async ({ page }) => {
    const drawer = await addFirstProduct(page);
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  });
});

test.describe('Wishlist', () => {
  test('saves, persists and moves a product to the bag', async ({ page }) => {
    await page.goto('/products');
    const card = page.getByRole('list', { name: 'Product results' }).getByRole('listitem').first();
    await expect(card).toBeVisible();

    await card.getByRole('button', { name: /to wishlist$/ }).click();
    await expect(page.getByRole('link', { name: /Wishlist, 1 item/ })).toBeVisible();

    // Persistence across a reload.
    await page.reload();
    await expect(page.getByRole('link', { name: /Wishlist, 1 item/ })).toBeVisible();

    await page.getByRole('link', { name: /Wishlist, 1 item/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Wishlist' })).toBeVisible();

    await page.getByRole('button', { name: 'Move to bag' }).click();
    await expect(page.getByRole('button', { name: /Shopping bag, 1 item/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your wishlist is empty' })).toBeVisible();
  });

  test('removes a saved product', async ({ page }) => {
    await page.goto('/products');
    const card = page.getByRole('list', { name: 'Product results' }).getByRole('listitem').first();
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: /to wishlist$/ }).click();

    await page.goto('/wishlist');
    await page.getByRole('button', { name: /from wishlist$/ }).click();

    await expect(page.getByRole('heading', { name: 'Your wishlist is empty' })).toBeVisible();
  });
});

test.describe('Comparison', () => {
  test('compares three flagships loaded from the homepage', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Compare these three' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Compare these three' }).click();

    await page.getByRole('link', { name: 'Open comparison' }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Compare products' })).toBeVisible();
    await expect(page.getByText('Comparing 3 of 4 products')).toBeVisible();

    const table = page.getByRole('table');
    for (const row of ['Price', 'Display', 'Processor', 'Camera', 'Battery']) {
      await expect(table.getByRole('rowheader', { name: row })).toBeVisible();
    }
  });

  test('adds and removes a product from a product page', async ({ page }) => {
    await page.goto('/products/iphone-15-pro');
    await page.getByRole('button', { name: 'Add to compare' }).click();
    await expect(page.getByRole('button', { name: /In comparison/ })).toBeVisible();

    await page.goto('/products/galaxy-s24-ultra');
    await page.getByRole('button', { name: 'Add to compare' }).click();

    await page.goto('/compare');
    await expect(page.getByText('Comparing 2 of 4 products')).toBeVisible();

    await page.getByRole('button', { name: /Remove Galaxy S24 Ultra from comparison/ }).click();
    await expect(page.getByText('Comparing 1 of 4 products')).toBeVisible();
  });

  test('invites a selection when empty', async ({ page }) => {
    await page.goto('/compare');

    await expect(page.getByRole('heading', { name: 'Nothing to compare yet' })).toBeVisible();
  });
});
