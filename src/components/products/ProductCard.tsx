import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import type { Product } from '../../data/types';
import { brandName } from '../../data/brands';
import { discountPercent } from '../../data/products';
import { formatPrice, formatReviewCount } from '../../lib/format';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../brands/BrandLogo';
import { Badge, toneForBadge } from '../ui/Badge';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  /** The first row of the first grid should not lazy-load. */
  priority?: boolean;
  /**
   * Depth of the card's title in the page outline. Grids that sit under a
   * section heading (h2) leave this at 3; a grid placed directly under the page
   * h1 passes 2, so the outline never skips a level.
   */
  headingLevel?: 2 | 3;
}

/**
 * A product tile: image, brand mark, name, price, then actions.
 *
 * The whole card is one link to the product page; the wishlist toggle and the
 * "Add to bag" button sit above it as real buttons rather than nested links, so
 * there is no interactive element inside an interactive element.
 */
export function ProductCard({ product, priority = false, headingLevel = 3 }: ProductCardProps) {
  const { isWishlisted, toggleWishlist, addToCart, openCart } = useStore();
  const saved = isWishlisted(product.id);
  const discount = discountPercent(product);
  const brand = brandName(product.brandId);
  const fullName = `${brand} ${product.name}`;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-hairline bg-white transition-shadow duration-base ease-premium hover:shadow-card-hover">
      <div className="product-frame">
        <ProductImage
          base={product.image}
          alt={`${fullName}${product.model ? ` (${product.model})` : ''}`}
          width={product.imageWidth}
          height={product.imageHeight}
          priority={priority}
        />

        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge tone={toneForBadge(product.badge)}>
              {product.badge === 'Sale' && discount ? `Save ${discount}%` : product.badge}
            </Badge>
          </div>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${fullName} from wishlist` : `Add ${fullName} to wishlist`}
          // z-10 keeps this above the card-wide link overlay below.
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-slate backdrop-blur transition-[color,background-color,transform] duration-fast ease-premium hover:scale-105 hover:text-ink"
        >
          <Heart
            aria-hidden="true"
            className={`h-[18px] w-[18px] transition-colors duration-fast ${
              saved ? 'fill-deal text-deal' : ''
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          {/* The official manufacturer mark, decorative here — the brand name
              follows it in text for screen readers. */}
          <BrandLogo brandId={product.brandId} height={14} decorative />
          <span className="text-micro font-medium uppercase tracking-[0.08em] text-slate">
            {brand}
          </span>
        </div>

        <Heading className="text-[1.0625rem] font-semibold leading-snug">
          <Link
            to={`/products/${product.id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
            {product.model && (
              <span className="ml-1.5 font-normal text-slate">{product.model}</span>
            )}
          </Link>
        </Heading>

        <p className="line-clamp-2 text-small text-slate">{product.description}</p>

        <div className="mt-auto flex flex-col gap-3 pt-1">
          <div className="flex items-center gap-2 text-small text-slate">
            <Star aria-hidden="true" className="h-3.5 w-3.5 fill-ink text-ink" />
            <span className="tabular font-medium text-ink">{product.rating.toFixed(1)}</span>
            <span>({formatReviewCount(product.reviewCount)})</span>
            <span aria-hidden="true">·</span>
            {product.inStock ? (
              <span className="text-instock">In stock</span>
            ) : (
              <span>Out of stock</span>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="tabular text-[1.125rem] font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="tabular text-small text-slate line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-small font-medium text-deal">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Raised above the card-wide link so it stays clickable. */}
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => {
              addToCart(product.id);
              openCart();
            }}
            className="relative z-10 h-10 rounded-pill bg-ink text-[0.9375rem] font-medium text-white transition-[background-color,opacity] duration-fast hover:bg-black disabled:opacity-40 sm:opacity-0 sm:transition-opacity sm:duration-base sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          >
            {product.inStock ? 'Add to bag' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
}
