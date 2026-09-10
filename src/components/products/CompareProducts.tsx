import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { brandName } from '../../data/brands';
import { getProduct } from '../../data/products';
import type { Specifications } from '../../data/types';
import { formatPrice } from '../../lib/format';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../brands/BrandLogo';
import { Button } from '../ui/Button';

/**
 * Comparison rows, in a fixed order so every column lines up even when the
 * products come from different categories and brands.
 */
const ROWS: { key: keyof Specifications; label: string }[] = [
  { key: 'display', label: 'Display' },
  { key: 'processor', label: 'Processor' },
  { key: 'memory', label: 'Memory' },
  { key: 'storage', label: 'Storage' },
  { key: 'camera', label: 'Camera' },
  { key: 'audio', label: 'Audio' },
  { key: 'battery', label: 'Battery' },
  { key: 'connectivity', label: 'Connectivity' },
  { key: 'os', label: 'Operating system' },
  { key: 'weight', label: 'Weight' },
];

/**
 * Side-by-side comparison of 2–4 products.
 *
 * One table on every viewport, wrapped in its own horizontal scroller so it can
 * be read on a phone without the page itself scrolling sideways. A dash marks a
 * specification a product does not publish — rather than inventing a value.
 */
export function CompareProducts() {
  const { compare, toggleCompare, clearCompare, addToCart, openCart } = useStore();

  const items = compare
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-haze px-6 py-16 text-center">
        <h2 className="text-[1.25rem]">Nothing to compare yet</h2>
        <p className="mx-auto mt-2 max-w-[46ch] text-small text-slate">
          Add two or more products from any product page or card to line up their
          specifications side by side.
        </p>
        <div className="mt-6">
          <Button to="/products">Browse products</Button>
        </div>
      </div>
    );
  }

  // Hide rows where not one of the selected products publishes a value.
  const visibleRows = ROWS.filter((row) => items.some((p) => p.specifications[row.key]));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-small text-slate" aria-live="polite">
          Comparing {items.length} of 4 products
        </p>
        <Button variant="ghost" size="sm" onClick={clearCompare}>
          Clear comparison
        </Button>
      </div>

      {items.length === 1 && (
        <p className="rounded-md bg-haze px-5 py-4 text-small text-slate">
          Add at least one more product to see a side-by-side comparison.
        </p>
      )}

      {/* The scroller, not the page, takes the horizontal overflow. */}
      <div className="-mx-gutter overflow-x-auto px-gutter sm:mx-0 sm:px-0">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <caption className="sr-only">
            Specification comparison for {items.map((p) => p.name).join(', ')}
          </caption>

          <thead>
            <tr>
              <th scope="col" className="w-[132px] p-0 sm:w-[180px]">
                <span className="sr-only">Specification</span>
              </th>
              {items.map((product) => (
                <th
                  key={product.id}
                  scope="col"
                  className="border-b border-hairline p-3 align-bottom sm:p-4"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <BrandLogo brandId={product.brandId} height={14} decorative />
                      <button
                        type="button"
                        onClick={() => toggleCompare(product.id)}
                        aria-label={`Remove ${product.name} from comparison`}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-ink"
                      >
                        <X aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <img
                      src={`${product.image}-640.webp`}
                      alt={`${brandName(product.brandId)} ${product.name}`}
                      loading="lazy"
                      decoding="async"
                      className="h-[88px] w-full object-contain"
                    />

                    <span className="block text-micro font-normal uppercase tracking-[0.08em] text-slate">
                      {brandName(product.brandId)}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="text-small font-semibold leading-snug hover:text-accent"
                    >
                      {product.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="odd:bg-haze/60">
              <th scope="row" className="p-3 align-top text-small font-medium sm:p-4">
                Price
              </th>
              {items.map((product) => (
                <td key={product.id} className="tabular p-3 align-top text-small font-semibold sm:p-4">
                  {formatPrice(product.price)}
                </td>
              ))}
            </tr>

            <tr className="even:bg-haze/60">
              <th scope="row" className="p-3 align-top text-small font-medium sm:p-4">
                Rating
              </th>
              {items.map((product) => (
                <td key={product.id} className="tabular p-3 align-top text-small sm:p-4">
                  {product.rating.toFixed(1)} / 5
                </td>
              ))}
            </tr>

            {visibleRows.map((row, index) => (
              <tr key={row.key} className={index % 2 === 0 ? 'bg-haze/60' : undefined}>
                <th scope="row" className="p-3 align-top text-small font-medium sm:p-4">
                  {row.label}
                </th>
                {items.map((product) => (
                  <td key={product.id} className="p-3 align-top text-small leading-relaxed sm:p-4">
                    {product.specifications[row.key] ?? (
                      <span className="text-slate" aria-label="Not published">
                        —
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            <tr>
              <th scope="row" className="p-3 sm:p-4">
                <span className="sr-only">Actions</span>
              </th>
              {items.map((product) => (
                <td key={product.id} className="p-3 align-top sm:p-4">
                  <Button
                    size="sm"
                    variant="buy"
                    block
                    disabled={!product.inStock}
                    onClick={() => {
                      addToCart(product.id);
                      openCart();
                    }}
                  >
                    {product.inStock ? 'Add to bag' : 'Unavailable'}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
