import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { CompareProducts } from '../../src/components/products/CompareProducts';
import { MAX_COMPARE } from '../../src/context/StoreContext';
import { renderWithProviders, screen, within } from './helpers';

/** Seeds the comparison selection through the same storage key the app uses. */
const seed = (ids: string[]) =>
  window.localStorage.setItem('nexora.compare', JSON.stringify(ids));

describe('CompareProducts', () => {
  it('invites the visitor to add products when nothing is selected', () => {
    renderWithProviders(<CompareProducts />);

    expect(screen.getByRole('heading', { name: 'Nothing to compare yet' })).toBeInTheDocument();
  });

  it('prompts for a second product when only one is selected', () => {
    seed(['iphone-15-pro']);
    renderWithProviders(<CompareProducts />);

    expect(screen.getByText(/Add at least one more product/)).toBeInTheDocument();
  });

  it('renders a column per product with the brand and real product name', () => {
    seed(['iphone-15-pro', 'galaxy-s24-ultra', 'pixel-8-pro']);
    renderWithProviders(<CompareProducts />);

    const table = screen.getByRole('table');
    for (const name of ['iPhone 15 Pro', 'Galaxy S24 Ultra', 'Pixel 8 Pro']) {
      expect(within(table).getByRole('link', { name })).toBeInTheDocument();
    }
    expect(screen.getByText('Comparing 3 of 4 products')).toBeInTheDocument();
  });

  it('aligns specification rows across products from different brands', () => {
    seed(['iphone-15-pro', 'galaxy-s24-ultra']);
    renderWithProviders(<CompareProducts />);

    const table = screen.getByRole('table');
    for (const row of ['Price', 'Rating', 'Display', 'Processor', 'Camera', 'Battery']) {
      const header = within(table).getByRole('rowheader', { name: row });
      // One header cell plus one cell per compared product.
      expect(header.closest('tr')?.querySelectorAll('td')).toHaveLength(2);
    }
  });

  it('marks an unpublished specification with a dash rather than inventing one', () => {
    // AirPods publish no display specification; the iPhone does.
    seed(['iphone-15-pro', 'airpods-pro-2']);
    renderWithProviders(<CompareProducts />);

    const displayRow = screen.getByRole('rowheader', { name: 'Display' }).closest('tr')!;
    expect(within(displayRow).getByLabelText('Not published')).toHaveTextContent('—');
  });

  it('omits a row no selected product publishes', () => {
    seed(['airpods-pro-2', 'galaxy-buds2-pro']);
    renderWithProviders(<CompareProducts />);

    // Neither earbud publishes a display spec, so the row should not appear at all.
    expect(screen.queryByRole('rowheader', { name: 'Display' })).not.toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Audio' })).toBeInTheDocument();
  });

  it('removes a product from the comparison', async () => {
    const user = userEvent.setup();
    seed(['iphone-15-pro', 'galaxy-s24-ultra']);
    renderWithProviders(<CompareProducts />);

    await user.click(
      screen.getByRole('button', { name: 'Remove Galaxy S24 Ultra from comparison' }),
    );

    expect(screen.getByText('Comparing 1 of 4 products')).toBeInTheDocument();
  });

  it('clears the whole comparison', async () => {
    const user = userEvent.setup();
    seed(['iphone-15-pro', 'galaxy-s24-ultra']);
    renderWithProviders(<CompareProducts />);

    await user.click(screen.getByRole('button', { name: 'Clear comparison' }));

    expect(screen.getByRole('heading', { name: 'Nothing to compare yet' })).toBeInTheDocument();
  });

  it('never shows more than the maximum number of products', () => {
    seed([
      'iphone-15-pro',
      'galaxy-s24-ultra',
      'pixel-8-pro',
      'galaxy-z-fold5',
      'macbook-air-m2',
    ]);
    renderWithProviders(<CompareProducts />);

    const columns = screen.getAllByRole('columnheader');
    // One spacer column for the row labels, then one per product.
    expect(columns.length - 1).toBeLessThanOrEqual(MAX_COMPARE);
  });
});
