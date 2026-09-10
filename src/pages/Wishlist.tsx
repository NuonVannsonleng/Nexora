import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getProduct } from '../data/products';
import { brandName } from '../data/brands';
import { formatPrice } from '../lib/format';
import { BrandLogo } from '../components/brands/BrandLogo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Saved products.
 *
 * The list persists in localStorage, so it survives a reload and a return visit
 * on the same browser.
 */
export function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart, openCart } = useStore();
  usePageTitle('Wishlist — NEXORA');

  const items = wishlist
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) {
    return (
      <Container className="py-20 sm:py-28">
        <div className="mx-auto flex max-w-[420px] flex-col items-center gap-5 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-haze">
            <Heart aria-hidden="true" className="h-7 w-7 text-slate" />
          </span>
          <h1>Your wishlist is empty</h1>
          <p className="text-slate">
            Tap the heart on any product to save it here for later. Your list stays on this
            device.
          </p>
          <Button to="/products">Browse products</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        level={1}
        title="Wishlist"
        description={`${items.length} saved ${items.length === 1 ? 'product' : 'products'}. Saved on this device.`}
      />

      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {items.map((product) => (
          <li
            key={product.id}
            className="flex flex-col gap-4 rounded-md border border-hairline p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5"
          >
            <Link
              to={`/products/${product.id}`}
              className="grid h-28 w-full shrink-0 place-items-center rounded-sm bg-haze sm:h-24 sm:w-24"
            >
              <img
                src={`${product.image}-640.webp`}
                alt={`${brandName(product.brandId)} ${product.name}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain p-2"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <BrandLogo brandId={product.brandId} height={12} decorative />
                <span className="text-micro uppercase tracking-[0.08em] text-slate">
                  {brandName(product.brandId)}
                </span>
              </div>
              <Link to={`/products/${product.id}`} className="font-semibold hover:text-accent">
                {product.name}
              </Link>
              <p className="line-clamp-1 text-small text-slate">{product.description}</p>
              <p className="tabular font-semibold">{formatPrice(product.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={!product.inStock}
                onClick={() => {
                  addToCart(product.id);
                  // Moving to the bag clears it from the saved list.
                  removeFromWishlist(product.id);
                  openCart();
                }}
              >
                {product.inStock ? 'Move to bag' : 'Unavailable'}
              </Button>
              <Button to={`/products/${product.id}`} size="sm" variant="outline">
                View
              </Button>
              <button
                type="button"
                onClick={() => removeFromWishlist(product.id)}
                aria-label={`Remove ${product.name} from wishlist`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-deal"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
