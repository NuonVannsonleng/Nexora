import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { Home } from './pages/Home';

/**
 * Routes beyond the homepage are code-split, so the first load ships the hero and
 * homepage bands rather than the whole catalogue UI.
 */
const Products = lazy(() => import('./pages/Products').then((m) => ({ default: m.Products })));
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })),
);
const Brand = lazy(() => import('./pages/Brand').then((m) => ({ default: m.Brand })));
const Category = lazy(() => import('./pages/Category').then((m) => ({ default: m.Category })));
const Compare = lazy(() => import('./pages/Compare').then((m) => ({ default: m.Compare })));
const Cart = lazy(() => import('./pages/Cart').then((m) => ({ default: m.Cart })));
const Wishlist = lazy(() => import('./pages/Wishlist').then((m) => ({ default: m.Wishlist })));
const Deals = lazy(() => import('./pages/Deals').then((m) => ({ default: m.Deals })));
const NewArrivalsPage = lazy(() =>
  import('./pages/NewArrivalsPage').then((m) => ({ default: m.NewArrivalsPage })),
);
const Stores = lazy(() => import('./pages/Stores').then((m) => ({ default: m.Stores })));
const Support = lazy(() => import('./pages/Support').then((m) => ({ default: m.Support })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

/**
 * Scrolls to the top on navigation, but honours an in-page anchor so the footer's
 * deep links into /support land on the right section.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    // Route components are code-split, so the anchor target usually does not
    // exist yet on the first pass. Retry across a few frames before giving up
    // and falling back to the top of the page.
    let frame = 0;
    let raf = 0;
    const seek = () => {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
      if (frame++ < 30) raf = requestAnimationFrame(seek);
      else window.scrollTo({ top: 0, left: 0 });
    };
    raf = requestAnimationFrame(seek);

    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}

/** Placeholder shown while a route chunk loads. Sized to limit layout shift. */
function RouteFallback() {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[60vh] place-items-center">
      <span className="text-small text-slate">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ScrollManager />

      {/* Lets keyboard users jump the nav straight to the page content. */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main" className="flex min-h-[50vh] flex-col">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/brand/:brand" element={<Brand />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/support" element={<Support />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Mounted once at the root so the bag can be opened from anywhere. */}
      <CartDrawer />
    </StoreProvider>
  );
}
