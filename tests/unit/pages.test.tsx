import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { Home } from '../../src/pages/Home';
import { Products } from '../../src/pages/Products';
import { Cart } from '../../src/pages/Cart';
import { Compare } from '../../src/pages/Compare';
import { Deals } from '../../src/pages/Deals';
import { NewArrivalsPage } from '../../src/pages/NewArrivalsPage';
import { Stores } from '../../src/pages/Stores';
import { Support } from '../../src/pages/Support';
import { NotFound } from '../../src/pages/NotFound';
import { Brand } from '../../src/pages/Brand';
import { Category } from '../../src/pages/Category';
import { ProductDetailPage } from '../../src/pages/ProductDetailPage';
import { Footer } from '../../src/components/layout/Footer';
import { renderWithProviders, screen, within } from './helpers';

describe('Home', () => {
  it('renders the hero, every band and its brand showcases', () => {
    renderWithProviders(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/next era of technology/i);

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
      expect(screen.getByRole('heading', { name: heading }), heading).toBeInTheDocument();
    }

    expect(screen.getByRole('heading', { name: /The Apple lineup/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Galaxy, built to fold/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sony, for the people/ })).toBeInTheDocument();
  });

  it('features a real product in the hero, labelled with its brand', () => {
    renderWithProviders(<Home />);

    const hero = screen.getByRole('region', { name: /next era of technology/i });
    expect(within(hero).getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(within(hero).getByText('Apple')).toBeInTheDocument();
  });

  it('sets the document title', () => {
    renderWithProviders(<Home />);
    expect(document.title).toMatch(/NEXORA/);
  });

  it('loads a cross-brand comparison from the teaser', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    await user.click(screen.getByRole('button', { name: 'Compare these three' }));

    expect(JSON.parse(window.localStorage.getItem('nexora.compare') ?? '[]')).toEqual([
      'iphone-15-pro',
      'galaxy-s24-ultra',
      'pixel-8-pro',
    ]);
  });
});

describe('Products page', () => {
  it('renders the catalogue with filters and a sort control', () => {
    renderWithProviders(<Products />, { route: '/products' });

    expect(screen.getByRole('heading', { level: 1, name: 'All products' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Product results' })).toBeInTheDocument();
    expect(screen.getByLabelText('Sort')).toBeInTheDocument();
  });

  it('seeds the text filter from the q query parameter', () => {
    renderWithProviders(<Products />, { route: '/products?q=galaxy' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/galaxy/i);
    const cards = screen.getByRole('list', { name: 'Product results' });
    expect(within(cards).getAllByText('Samsung').length).toBeGreaterThan(0);
  });

  it('narrows results when a brand is checked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Products />, { route: '/products' });

    const before = within(screen.getByRole('list', { name: 'Product results' }))
      .getAllByRole('listitem').length;

    await user.click(screen.getByRole('checkbox', { name: /^Apple/ }));

    const after = within(screen.getByRole('list', { name: 'Product results' }))
      .getAllByRole('listitem').length;
    expect(after).toBeLessThan(before);
  });

  it('shows an empty state and can reset from it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Products />, { route: '/products?q=zzzznothing' });

    expect(screen.getByRole('heading', { name: 'No products match' })).toBeInTheDocument();

    // The sidebar panel has its own reset control, so use the empty state's.
    await user.click(screen.getAllByRole('button', { name: 'Reset filters' }).at(-1)!);
    expect(screen.getByRole('list', { name: 'Product results' })).toBeInTheDocument();
  });

  it('opens the mobile filter drawer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Products />, { route: '/products' });

    await user.click(screen.getByRole('button', { name: /Filters/ }));
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
  });
});

describe('Routed pages', () => {
  it('renders a brand page scoped to that manufacturer', () => {
    renderWithProviders(
      <Routes>
        <Route path="/brand/:brand" element={<Brand />} />
      </Routes>,
      { route: '/brand/samsung' },
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Samsung at NEXORA');
    expect(screen.getByText(/not operated by or affiliated with Samsung/)).toBeInTheDocument();
  });

  it('reports an unknown brand', () => {
    renderWithProviders(
      <Routes>
        <Route path="/brand/:brand" element={<Brand />} />
      </Routes>,
      { route: '/brand/nope' },
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Brand not found' })).toBeInTheDocument();
  });

  it('renders a category page', () => {
    renderWithProviders(
      <Routes>
        <Route path="/category/:category" element={<Category />} />
      </Routes>,
      { route: '/category/cameras' },
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Cameras' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Cameras products' })).toBeInTheDocument();
  });

  it('reports an unknown category', () => {
    renderWithProviders(
      <Routes>
        <Route path="/category/:category" element={<Category />} />
      </Routes>,
      { route: '/category/nope' },
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Category not found' }),
    ).toBeInTheDocument();
  });

  it('renders a product page from the route parameter', () => {
    renderWithProviders(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>,
      { route: '/products/playstation-5' },
    );

    expect(screen.getByRole('heading', { level: 1, name: 'PlayStation 5' })).toBeInTheDocument();
  });

  it('reports an unknown product', () => {
    renderWithProviders(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>,
      { route: '/products/nope' },
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/couldn’t find/i);
  });

  it('renders the empty bag page', () => {
    renderWithProviders(<Cart />);

    expect(screen.getByRole('heading', { level: 1, name: 'Your bag is empty' })).toBeInTheDocument();
  });

  it('renders the bag with a summary once it has a line', () => {
    window.localStorage.setItem(
      'nexora.cart',
      JSON.stringify([{ productId: 'iphone-15-pro', quantity: 2 }]),
    );
    renderWithProviders(<Cart />);

    expect(screen.getByRole('heading', { level: 1, name: 'Shopping bag' })).toBeInTheDocument();
    const summary = screen.getByRole('complementary', { name: 'Order summary' });
    // 2 x $999, delivery free above the sample threshold.
    expect(within(summary).getByText('$1,998.00')).toBeInTheDocument();
    expect(within(summary).getByText('Free')).toBeInTheDocument();
    // Checkout is present but deliberately inert.
    expect(within(summary).getByRole('button', { name: /Checkout unavailable/ })).toBeDisabled();
  });

  it('charges sample delivery below the free threshold', () => {
    window.localStorage.setItem(
      'nexora.cart',
      JSON.stringify([{ productId: 'sony-wh-ch510', quantity: 1 }]),
    );
    renderWithProviders(<Cart />);

    const summary = screen.getByRole('complementary', { name: 'Order summary' });
    expect(within(summary).getByText('$9.00')).toBeInTheDocument();
    expect(screen.getByText(/more for free delivery/)).toBeInTheDocument();
  });

  it('renders the comparison page', () => {
    renderWithProviders(<Compare />);
    expect(screen.getByRole('heading', { level: 1, name: 'Compare products' })).toBeInTheDocument();
  });

  it('renders the offers page and labels the promotion as a sample', () => {
    renderWithProviders(<Deals />);

    expect(screen.getByRole('heading', { level: 1, name: 'Sample offers' })).toBeInTheDocument();
    expect(screen.getAllByText(/Sample promotion/).length).toBeGreaterThan(0);
  });

  it('renders the new arrivals page', () => {
    renderWithProviders(<NewArrivalsPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'New arrivals' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'New arrivals' })).toBeInTheDocument();
  });

  it('renders the store finder as a page with an h1 and filters it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Stores />);

    expect(screen.getByRole('heading', { level: 1, name: 'Find a store' })).toBeInTheDocument();
    expect(screen.getByText(/demonstration store/)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Search by city or region'), 'Tokyo');
    expect(screen.getByRole('heading', { name: 'NEXORA Ginza' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'NEXORA SoHo' })).not.toBeInTheDocument();
  });

  it('renders every support section the footer links to', () => {
    renderWithProviders(<Support />);

    expect(screen.getByRole('heading', { level: 1, name: 'Help and support' })).toBeInTheDocument();
    for (const id of ['contact', 'shipping', 'returns', 'warranty', 'privacy', 'terms']) {
      expect(document.getElementById(id), id).not.toBeNull();
    }
  });

  it('renders the 404 page', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/doesn’t exist/);
  });
});

describe('Footer', () => {
  it('carries the store identity and the required disclosures', () => {
    renderWithProviders(<Footer />);

    expect(screen.getAllByTitle('NEXORA').length).toBeGreaterThan(0);
    expect(screen.getByText(/not\s+affiliated with, endorsed by or operated by Apple/)).toBeInTheDocument();
    expect(screen.getByText(/sample data for demonstration only/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Wikimedia Commons' })).toBeInTheDocument();
  });

  it('renders all four navigation columns', () => {
    renderWithProviders(<Footer />);

    for (const group of ['Shop', 'Brands', 'Support', 'Company']) {
      expect(screen.getByRole('navigation', { name: group })).toBeInTheDocument();
    }
  });
});
