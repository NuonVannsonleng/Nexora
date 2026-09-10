import { Link } from 'react-router-dom';
import { Lock, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getProduct, PRICING_DISCLAIMER } from '../data/products';
import { brandName } from '../data/brands';
import { formatPrice, formatTotal } from '../lib/format';
import { BrandLogo } from '../components/brands/BrandLogo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { SectionHeading } from '../components/ui/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';

/** Sample delivery thresholds used by the order summary. */
const FREE_DELIVERY_OVER = 99;
const DELIVERY_FEE = 9;
const TAX_RATE = 0.08;

/**
 * Full-page bag and order summary.
 *
 * The arithmetic is real, over the catalogue's demo prices. Checkout deliberately
 * stops here: there is no payment step, and the page says so where the visitor
 * would expect one.
 */
export function Cart() {
  const { cart, cartCount, cartSubtotal, setQuantity, removeFromCart, clearCart } = useStore();
  usePageTitle('Shopping bag — NEXORA');

  const lines = cart
    .map((line) => ({ line, product: getProduct(line.productId) }))
    .filter((e): e is { line: typeof e.line; product: NonNullable<typeof e.product> } =>
      Boolean(e.product),
    );

  const delivery = cartSubtotal >= FREE_DELIVERY_OVER || cartSubtotal === 0 ? 0 : DELIVERY_FEE;
  const tax = cartSubtotal * TAX_RATE;
  const total = cartSubtotal + delivery + tax;

  if (lines.length === 0) {
    return (
      <Container className="py-20 sm:py-28">
        <div className="mx-auto flex max-w-[420px] flex-col items-center gap-5 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-haze">
            <ShoppingBag aria-hidden="true" className="h-7 w-7 text-slate" />
          </span>
          <h1>Your bag is empty</h1>
          <p className="text-slate">
            Once you add something, it will appear here with a full order summary.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/products">Shop all products</Button>
            <Button to="/deals" variant="outline">
              See offers
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        level={1}
        title="Shopping bag"
        description={`${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your bag.`}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
        {/* ---- Line items ------------------------------------------------ */}
        <div className="flex flex-col gap-4">
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {lines.map(({ line, product }) => (
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
                  <Link
                    to={`/products/${product.id}`}
                    className="font-semibold hover:text-accent"
                  >
                    {product.name}
                  </Link>
                  <p className="tabular text-small text-slate">
                    {formatPrice(product.price)} each
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
                  <QuantityStepper
                    value={line.quantity}
                    onChange={(next) => setQuantity(product.id, next)}
                    label={`Quantity for ${product.name}`}
                  />
                  <div className="flex items-center gap-3">
                    <p className="tabular font-semibold">
                      {formatPrice(product.price * line.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`Remove ${product.name} from bag`}
                      className="grid h-9 w-9 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-deal"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button to="/products" variant="ghost" size="sm">
              Continue shopping
            </Button>
            <Button variant="outline" size="sm" onClick={clearCart}>
              Empty bag
            </Button>
          </div>
        </div>

        {/* ---- Order summary --------------------------------------------- */}
        <aside aria-labelledby="summary-heading" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="flex flex-col gap-4 rounded-lg bg-haze p-6">
            <h2 id="summary-heading" className="text-[1.125rem]">
              Order summary
            </h2>

            <dl className="m-0 flex flex-col gap-2.5 text-small">
              <div className="flex justify-between gap-4">
                <dt className="text-slate">Subtotal</dt>
                <dd className="tabular m-0 font-medium">{formatTotal(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate">Delivery</dt>
                <dd className="tabular m-0 font-medium">
                  {delivery === 0 ? 'Free' : formatTotal(delivery)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate">Estimated tax</dt>
                <dd className="tabular m-0 font-medium">{formatTotal(tax)}</dd>
              </div>

              <hr className="my-1 border-0 border-t border-hairline" />

              <div className="flex justify-between gap-4 text-[1.0625rem]">
                <dt className="font-semibold">Estimated total</dt>
                <dd className="tabular m-0 font-semibold">{formatTotal(total)}</dd>
              </div>
            </dl>

            {delivery > 0 && (
              <p className="text-micro text-slate">
                Add {formatTotal(FREE_DELIVERY_OVER - cartSubtotal)} more for free delivery.
              </p>
            )}

            {/* Checkout is intentionally inert — no payment is collected. */}
            <Button variant="buy" block disabled>
              <Lock aria-hidden="true" className="h-4 w-4" />
              Checkout unavailable
            </Button>

            <p className="text-micro leading-relaxed text-slate">
              This is a demonstration store. Checkout is disabled — no payment method is
              collected and no order is placed. The architecture is ready for a payment
              provider to be connected.
            </p>

            <p className="text-micro leading-relaxed text-slate">{PRICING_DISCLAIMER}</p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
