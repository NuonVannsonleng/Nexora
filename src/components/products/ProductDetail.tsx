import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, MapPin, Star, Truck } from 'lucide-react';
import type { Product } from '../../data/types';
import { brandName, getBrand } from '../../data/brands';
import { categoryName } from '../../data/categories';
import {
  discountPercent,
  getPhotoCredit,
  getProductsByCategory,
  PRICING_DISCLAIMER,
} from '../../data/products';
import { formatPrice, formatReviewCount } from '../../lib/format';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../brands/BrandLogo';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductGallery } from './ProductGallery';
import { ProductGrid } from './ProductGrid';

interface ProductDetailProps {
  product: Product;
}

/**
 * Product page.
 *
 * Everything shown here comes from the same catalogue record that drives the
 * product card, so the two can never disagree. Specifications list only what the
 * manufacturer publishes; the demo nature of price, stock and delivery is stated
 * on the page rather than implied.
 */
export function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart, openCart, isWishlisted, toggleWishlist, isComparing, toggleCompare } =
    useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? '');
  const [fulfilment, setFulfilment] = useState<'delivery' | 'pickup'>('delivery');

  const brand = getBrand(product.brandId);
  const label = `${brandName(product.brandId)} ${product.name}`;
  const discount = discountPercent(product);
  const saved = isWishlisted(product.id);
  const comparing = isComparing(product.id);
  const credit = getPhotoCredit(product.id);

  const specEntries = Object.entries(product.specifications).filter(([, v]) => Boolean(v)) as [
    string,
    string,
  ][];

  const specLabels: Record<string, string> = {
    display: 'Display',
    processor: 'Processor',
    memory: 'Memory',
    storage: 'Storage',
    camera: 'Camera',
    battery: 'Battery',
    connectivity: 'Connectivity',
    os: 'Operating system',
    weight: 'Weight',
    audio: 'Audio',
  };

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Container as="div" className="pb-6 pt-5">
        <nav aria-label="Breadcrumb">
          <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-small text-slate">
            <li>
              <Link to="/products" className="hover:text-ink">
                Store
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`/category/${product.category}`} className="hover:text-ink">
                {categoryName(product.category)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`/brand/${product.brandId}`} className="hover:text-ink">
                {brandName(product.brandId)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>
      </Container>

      <Container as="section" aria-labelledby="product-heading" className="pb-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery product={product} productLabel={label} />

          <div className="flex flex-col gap-6">
            {/* Brand: the manufacturer's official mark plus a route to their page. */}
            <div className="flex items-center gap-3">
              <span className="grid h-9 place-items-center rounded-sm bg-haze px-3">
                <BrandLogo brandId={product.brandId} height={18} decorative />
              </span>
              <Link
                to={`/brand/${product.brandId}`}
                className="text-small font-medium text-slate hover:text-ink"
              >
                {brandName(product.brandId)}
              </Link>
              {product.badge && (
                <Badge tone={product.badge === 'Sale' ? 'sale' : 'new'}>{product.badge}</Badge>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h1 id="product-heading">{product.name}</h1>
              {product.model && (
                <p className="text-small text-slate">
                  Model {product.model} · Announced {product.releaseYear}
                </p>
              )}
            </div>

            <p className="max-w-[54ch] text-[1.0625rem] text-slate">{product.description}</p>

            <div className="flex items-center gap-2 text-small">
              <span className="flex items-center gap-1">
                <Star aria-hidden="true" className="h-4 w-4 fill-ink text-ink" />
                <span className="tabular font-medium">{product.rating.toFixed(1)}</span>
              </span>
              <span className="text-slate">
                ({formatReviewCount(product.reviewCount)} reviews)
              </span>
              <span aria-hidden="true" className="text-hairline">
                |
              </span>
              {product.inStock ? (
                <span className="font-medium text-instock">In stock</span>
              ) : (
                <span className="text-slate">Currently unavailable</span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <p className="tabular text-[1.75rem] font-semibold">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <>
                  <span className="tabular text-slate line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-small font-medium text-deal">
                    Save {formatPrice(product.originalPrice - product.price)}
                    {discount ? ` (${discount}%)` : ''}
                  </span>
                </>
              )}
            </div>

            {/* Colour picker. These are the manufacturer's real colourway names. */}
            {product.colors.length > 1 && (
              <fieldset className="border-0 p-0">
                <legend className="mb-2 text-small font-medium">
                  Finish:{' '}
                  <span className="font-normal text-slate">{selectedColor}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <label
                      key={color}
                      className={`cursor-pointer rounded-pill border px-4 py-2 text-small transition-colors duration-fast has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                        selectedColor === color
                          ? 'border-ink bg-ink text-white'
                          : 'border-hairline hover:border-slate'
                      }`}
                    >
                      <input
                        type="radio"
                        name="product-color"
                        value={color}
                        checked={selectedColor === color}
                        onChange={() => setSelectedColor(color)}
                        className="sr-only"
                      />
                      {color}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Fulfilment choice — demo UI, labelled as such below. */}
            <fieldset className="border-0 p-0">
              <legend className="mb-2 text-small font-medium">How to get it</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    { id: 'delivery', icon: Truck, title: 'Free delivery', detail: 'Arrives in 2–4 business days' },
                    { id: 'pickup', icon: MapPin, title: 'Store pickup', detail: 'Check availability near you' },
                  ] as const
                ).map((option) => {
                  const Icon = option.icon;
                  const active = fulfilment === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer gap-3 rounded-md border p-4 transition-colors duration-fast has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                        active ? 'border-ink' : 'border-hairline hover:border-slate'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfilment"
                        checked={active}
                        onChange={() => setFulfilment(option.id)}
                        className="sr-only"
                      />
                      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
                      <span>
                        <span className="block text-small font-medium">{option.title}</span>
                        <span className="block text-micro text-slate">{option.detail}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="buy"
                  size="lg"
                  disabled={!product.inStock}
                  onClick={() => {
                    addToCart(product.id);
                    openCart();
                  }}
                  className="flex-1"
                >
                  {product.inStock ? 'Add to bag' : 'Currently unavailable'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => toggleWishlist(product.id)}
                  aria-pressed={saved}
                  aria-label={saved ? `Remove ${label} from wishlist` : `Add ${label} to wishlist`}
                >
                  <Heart
                    aria-hidden="true"
                    className={`h-[18px] w-[18px] ${saved ? 'fill-deal text-deal' : ''}`}
                  />
                  <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => toggleCompare(product.id)}
                  aria-pressed={comparing}
                  className="flex-1"
                >
                  {comparing ? (
                    <>
                      <Check aria-hidden="true" className="h-4 w-4" /> In comparison
                    </>
                  ) : (
                    'Add to compare'
                  )}
                </Button>
                <Button to="/compare" variant="ghost">
                  View comparison
                </Button>
              </div>
            </div>

            <p className="text-micro leading-relaxed text-slate">{PRICING_DISCLAIMER}</p>
          </div>
        </div>
      </Container>

      {/* ---- Specifications ---------------------------------------------- */}
      <section
        aria-labelledby="specs-heading"
        className="bg-haze"
        style={{ paddingBlock: 'var(--section-y)' }}
      >
        <Container>
          <SectionHeading
            title={<span id="specs-heading">Specifications</span>}
            description={`Published specifications for the ${label}. Fields the manufacturer does not publish are omitted rather than estimated.`}
          />

          <dl className="grid grid-cols-1 gap-0 overflow-hidden rounded-md bg-white sm:grid-cols-2">
            {specEntries.map(([key, value], index) => (
              <div
                key={key}
                className={`flex flex-col gap-1 border-hairline p-5 sm:p-6 ${
                  index < specEntries.length - 1 ? 'border-b' : ''
                } ${index % 2 === 0 ? 'sm:border-r' : ''}`}
              >
                <dt className="text-micro font-semibold uppercase tracking-[0.08em] text-slate">
                  {specLabels[key] ?? key}
                </dt>
                <dd className="m-0 text-body leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>

          <dl className="mt-4 grid grid-cols-1 gap-4 rounded-md bg-white p-5 min-[400px]:grid-cols-2 sm:grid-cols-4 sm:p-6">
            <div>
              <dt className="text-micro uppercase tracking-[0.08em] text-slate">Brand</dt>
              <dd className="m-0 mt-1 font-medium">{brand?.name}</dd>
            </div>
            <div>
              <dt className="text-micro uppercase tracking-[0.08em] text-slate">Category</dt>
              <dd className="m-0 mt-1 font-medium">{categoryName(product.category)}</dd>
            </div>
            <div>
              <dt className="text-micro uppercase tracking-[0.08em] text-slate">Announced</dt>
              <dd className="tabular m-0 mt-1 font-medium">{product.releaseYear}</dd>
            </div>
            <div>
              <dt className="text-micro uppercase tracking-[0.08em] text-slate">Finishes</dt>
              <dd className="m-0 mt-1 font-medium">{product.colors.length}</dd>
            </div>
          </dl>

          {credit && (
            <p className="mt-4 text-micro text-slate">
              Photograph:{' '}
              <a
                href={credit.descriptionUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2 hover:text-ink"
              >
                {credit.file.replace(/^File:/, '')}
              </a>{' '}
              by {credit.author} · {credit.license} via Wikimedia Commons.
            </p>
          )}
        </Container>
      </section>

      {/* ---- Related products -------------------------------------------- */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" style={{ paddingBlock: 'var(--section-y)' }}>
          <Container>
            <SectionHeading
              title={<span id="related-heading">More in {categoryName(product.category)}</span>}
              action={{ label: 'See category', to: `/category/${product.category}` }}
            />
            <ProductGrid
              products={related}
              columns={4}
              label={`More ${categoryName(product.category)}`}
            />
          </Container>
        </section>
      )}
    </>
  );
}
