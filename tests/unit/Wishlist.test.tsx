import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Wishlist } from '../../src/pages/Wishlist';
import { CartDrawer } from '../../src/components/layout/CartDrawer';
import { ProductCard } from '../../src/components/products/ProductCard';
import { getProduct } from '../../src/data/products';
import { renderWithProviders, screen, within } from './helpers';

const iphone = getProduct('iphone-15-pro')!;

/** A card to save from, plus the wishlist page and bag drawer to check results. */
function Harness() {
  return (
    <>
      <ProductCard product={iphone} />
      <Wishlist />
      <CartDrawer />
    </>
  );
}

describe('Wishlist', () => {
  it('shows an empty state before anything is saved', () => {
    renderWithProviders(<Wishlist />);

    expect(screen.getByRole('heading', { name: 'Your wishlist is empty' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse products' })).toHaveAttribute(
      'href',
      '/products',
    );
  });

  it('lists a product once it is saved', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getByRole('button', { name: /Add Apple iPhone 15 Pro to wishlist/ }));

    expect(screen.getByRole('heading', { name: 'Wishlist' })).toBeInTheDocument();
    expect(screen.getByText(/1 saved product/)).toBeInTheDocument();
  });

  it('removes a saved product', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getByRole('button', { name: /Add Apple iPhone 15 Pro to wishlist/ }));
    await user.click(
      screen.getByRole('button', { name: 'Remove iPhone 15 Pro from wishlist' }),
    );

    expect(screen.getByRole('heading', { name: 'Your wishlist is empty' })).toBeInTheDocument();
  });

  it('moves a product to the bag and clears it from the list', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getByRole('button', { name: /Add Apple iPhone 15 Pro to wishlist/ }));
    await user.click(screen.getByRole('button', { name: 'Move to bag' }));

    const dialog = screen.getByRole('dialog', { name: /Shopping bag/ });
    expect(within(dialog).getByRole('link', { name: 'iPhone 15 Pro' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your wishlist is empty' })).toBeInTheDocument();
  });

  it('persists to localStorage', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getByRole('button', { name: /Add Apple iPhone 15 Pro to wishlist/ }));

    expect(JSON.parse(window.localStorage.getItem('nexora.wishlist') ?? '[]')).toEqual([
      'iphone-15-pro',
    ]);
  });

  it('restores a saved list from localStorage on mount', () => {
    window.localStorage.setItem('nexora.wishlist', JSON.stringify(['airpods-pro-2']));

    renderWithProviders(<Wishlist />);

    expect(screen.getByRole('link', { name: 'AirPods Pro' })).toBeInTheDocument();
  });

  it('ignores an unknown product id left in storage', () => {
    window.localStorage.setItem('nexora.wishlist', JSON.stringify(['no-such-product']));

    renderWithProviders(<Wishlist />);

    // A stale id must not crash the page or render a blank row.
    expect(screen.getByRole('heading', { name: 'Your wishlist is empty' })).toBeInTheDocument();
  });
});
