import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../../src/components/products/ProductCard';
import { getProduct } from '../../src/data/products';
import { renderWithProviders, screen } from './helpers';

const iphone = getProduct('iphone-15-pro')!;
const bravia = getProduct('sony-bravia-w60')!; // the catalogue's out-of-stock item

describe('ProductCard', () => {
  it('shows the real product name, model and brand', () => {
    renderWithProviders(<ProductCard product={iphone} />);

    expect(screen.getByRole('heading', { name: /iPhone 15 Pro/ })).toBeInTheDocument();
    expect(screen.getByText('A2848')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('links to the product detail page', () => {
    renderWithProviders(<ProductCard product={iphone} />);

    expect(screen.getByRole('link', { name: /iPhone 15 Pro/ })).toHaveAttribute(
      'href',
      '/products/iphone-15-pro',
    );
  });

  it('renders the product photo with descriptive alt text and both dimensions', () => {
    renderWithProviders(<ProductCard product={iphone} />);

    const img = screen.getByAltText(/Apple iPhone 15 Pro/);
    expect(img).toHaveAttribute('width', String(iphone.imageWidth));
    expect(img).toHaveAttribute('height', String(iphone.imageHeight));
  });

  it('lazy-loads by default and eager-loads when prioritised', () => {
    const { unmount } = renderWithProviders(<ProductCard product={iphone} />);
    expect(screen.getByAltText(/iPhone 15 Pro/)).toHaveAttribute('loading', 'lazy');
    unmount();

    renderWithProviders(<ProductCard product={iphone} priority />);
    expect(screen.getByAltText(/iPhone 15 Pro/)).toHaveAttribute('loading', 'eager');
  });

  it('shows the price and, on a discounted product, the saving', () => {
    const air = getProduct('macbook-air-m2')!;
    renderWithProviders(<ProductCard product={air} />);

    expect(screen.getByText('$1,099')).toBeInTheDocument();
    expect(screen.getByText('$1,199')).toBeInTheDocument();
    expect(screen.getByText(/Save \$100/)).toBeInTheDocument();
  });

  it('toggles the wishlist and reflects it in aria-pressed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={iphone} />);

    const save = screen.getByRole('button', { name: /Add Apple iPhone 15 Pro to wishlist/ });
    expect(save).toHaveAttribute('aria-pressed', 'false');

    await user.click(save);

    const saved = screen.getByRole('button', { name: /Remove Apple iPhone 15 Pro from wishlist/ });
    expect(saved).toHaveAttribute('aria-pressed', 'true');
  });

  it('disables the bag button for an out-of-stock product', () => {
    renderWithProviders(<ProductCard product={bravia} />);

    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('renders the official brand logo as a decorative image', () => {
    const { container } = renderWithProviders(<ProductCard product={iphone} />);

    const logo = container.querySelector('img[src="/assets/brands/apple.svg"]');
    expect(logo).not.toBeNull();
    // Decorative: the brand name sits beside it in text.
    expect(logo).toHaveAttribute('alt', '');
  });
});
