import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ProductDetail } from '../../src/components/products/ProductDetail';
import { CartDrawer } from '../../src/components/layout/CartDrawer';
import { getProduct } from '../../src/data/products';
import { renderWithProviders, screen, within } from './helpers';

const iphone = getProduct('iphone-15-pro')!;
const bravia = getProduct('sony-bravia-w60')!;

describe('ProductDetail', () => {
  it('renders the product name as the page heading', () => {
    renderWithProviders(<ProductDetail product={iphone} />);

    expect(screen.getByRole('heading', { level: 1, name: 'iPhone 15 Pro' })).toBeInTheDocument();
  });

  it('shows the real model designation and announcement year', () => {
    renderWithProviders(<ProductDetail product={iphone} />);

    expect(screen.getByText(/Model A2848/)).toBeInTheDocument();
    expect(screen.getByText(/Announced 2023/)).toBeInTheDocument();
  });

  it('shows the price, rating and availability', () => {
    renderWithProviders(<ProductDetail product={iphone} />);

    // Scoped to the main product region: the related-products grid below repeats
    // prices and stock labels for other products.
    const main = screen.getByRole('region', { name: 'iPhone 15 Pro' });
    expect(within(main).getByText('$999')).toBeInTheDocument();
    expect(within(main).getByText('4.8')).toBeInTheDocument();
    expect(within(main).getByText('In stock')).toBeInTheDocument();
  });

  it('renders every published specification and no others', () => {
    renderWithProviders(<ProductDetail product={iphone} />);

    expect(screen.getByRole('heading', { name: 'Specifications' })).toBeInTheDocument();
    expect(screen.getByText('Apple A17 Pro')).toBeInTheDocument();
    expect(screen.getByText('187 g')).toBeInTheDocument();
    // The iPhone entry publishes no memory figure, so no such row should exist.
    expect(screen.queryByText('Memory')).not.toBeInTheDocument();
  });

  it('offers the real colourways as radio options', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductDetail product={iphone} />);

    const natural = screen.getByRole('radio', { name: 'Natural Titanium' });
    expect(natural).toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'Blue Titanium' }));
    expect(screen.getByRole('radio', { name: 'Blue Titanium' })).toBeChecked();
  });

  it('has a working image gallery with switchable views', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductDetail product={iphone} />);

    const views = screen.getByRole('group', { name: 'Product views' });
    const buttons = within(views).getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');

    await user.click(buttons[1]);
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('adds the product to the bag', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ProductDetail product={iphone} />
        <CartDrawer />
      </>,
    );

    const main = screen.getByRole('region', { name: 'iPhone 15 Pro' });
    await user.click(within(main).getByRole('button', { name: 'Add to bag' }));

    const dialog = screen.getByRole('dialog', { name: /Shopping bag/ });
    expect(within(dialog).getByRole('link', { name: 'iPhone 15 Pro' })).toBeInTheDocument();
  });

  it('toggles wishlist and compare', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductDetail product={iphone} />);

    await user.click(screen.getByRole('button', { name: /Add Apple iPhone 15 Pro to wishlist/ }));
    expect(
      screen.getByRole('button', { name: /Remove Apple iPhone 15 Pro from wishlist/ }),
    ).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Add to compare' }));
    expect(screen.getByRole('button', { name: /In comparison/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('disables purchase for an out-of-stock product', () => {
    renderWithProviders(<ProductDetail product={bravia} />);

    expect(screen.getByRole('button', { name: 'Currently unavailable' })).toBeDisabled();
  });

  it('links to the brand and category pages via breadcrumbs', () => {
    renderWithProviders(<ProductDetail product={iphone} />);

    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(crumbs).getByRole('link', { name: 'Apple' })).toHaveAttribute(
      'href',
      '/brand/apple',
    );
    expect(within(crumbs).getByRole('link', { name: 'Phones' })).toHaveAttribute(
      'href',
      '/category/phones',
    );
  });

  it('discloses that pricing is demo data', () => {
    renderWithProviders(<ProductDetail product={iphone} />);

    expect(screen.getByText(/sample data for demonstration only/)).toBeInTheDocument();
  });

  it('credits the source of the product photograph', () => {
    renderWithProviders(<ProductDetail product={iphone} />);

    expect(screen.getByText(/via Wikimedia Commons/)).toBeInTheDocument();
  });

  it('shows the official brand logo', () => {
    const { container } = renderWithProviders(<ProductDetail product={iphone} />);

    expect(container.querySelector('img[src="/assets/brands/apple.svg"]')).not.toBeNull();
  });
});
