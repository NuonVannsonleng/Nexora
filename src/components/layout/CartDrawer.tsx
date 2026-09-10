import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getProduct, PRICING_DISCLAIMER } from '../../data/products';
import { brandName } from '../../data/brands';
import { formatPrice, formatTotal } from '../../lib/format';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { QuantityStepper } from '../ui/QuantityStepper';

/**
 * The shopping bag, shown as a right-hand drawer.
 *
 * Demo only: quantities and totals are real arithmetic over the demo prices, but
 * checkout goes to a summary page and no payment is ever processed.
 */
export function CartDrawer() {
  const { cart, cartOpen, closeCart, cartCount, cartSubtotal, removeFromCart, setQuantity } =
    useStore();

  // Lines whose product resolves — guards against a stale id in localStorage.
  const lines = cart
    .map((line) => ({ line, product: getProduct(line.productId) }))
    .filter((entry): entry is { line: typeof entry.line; product: NonNullable<typeof entry.product> } =>
      Boolean(entry.product),
    );

  return (
    <Modal
      open={cartOpen}
      onClose={closeCart}
      title={`Shopping bag${cartCount > 0 ? ` (${cartCount})` : ''}`}
      placement="right"
      footer={
        lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-small text-slate">Subtotal</span>
              <span className="tabular text-[1.125rem] font-semibold">
                {formatTotal(cartSubtotal)}
              </span>
            </div>
            <p className="text-micro text-slate">
              Taxes and delivery are calculated at checkout.
            </p>
            <Button to="/cart" variant="buy" block onClick={closeCart}>
              Check out
            </Button>
            <Button variant="ghost" size="sm" onClick={closeCart}>
              Continue shopping
            </Button>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-haze">
            <ShoppingBag aria-hidden="true" className="h-6 w-6 text-slate" />
          </span>
          <div>
            <p className="font-semibold">Your bag is empty</p>
            <p className="mt-1 text-small text-slate">
              Browse the store and add something you like.
            </p>
          </div>
          <Button to="/products" variant="outline" size="sm" onClick={closeCart}>
            Shop all products
          </Button>
        </div>
      ) : (
        <>
          <ul className="m-0 list-none p-0">
            {lines.map(({ line, product }) => (
              <li
                key={product.id}
                className="flex gap-4 border-b border-hairline/60 px-5 py-4 last:border-0 sm:px-6"
              >
                <Link
                  to={`/products/${product.id}`}
                  onClick={closeCart}
                  className="grid h-20 w-20 shrink-0 place-items-center rounded-sm bg-haze"
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
                  <p className="text-micro uppercase tracking-[0.08em] text-slate">
                    {brandName(product.brandId)}
                  </p>
                  <Link
                    to={`/products/${product.id}`}
                    onClick={closeCart}
                    className="truncate font-medium hover:text-accent"
                  >
                    {product.name}
                  </Link>
                  <p className="tabular text-small text-slate">
                    {formatPrice(product.price)} each
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(next) => setQuantity(product.id, next)}
                      label={`Quantity for ${product.name}`}
                    />
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

                <p className="tabular shrink-0 font-semibold">
                  {formatPrice(product.price * line.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <p className="px-5 pb-6 pt-4 text-micro text-slate sm:px-6">
            {PRICING_DISCLAIMER}
          </p>
        </>
      )}
    </Modal>
  );
}
