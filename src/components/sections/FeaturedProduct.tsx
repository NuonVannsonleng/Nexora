import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { brandName } from '../../data/brands';
import { featuredProducts } from '../../data/products';
import { formatPrice } from '../../lib/format';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../brands/BrandLogo';
import { ProductImage } from '../products/ProductImage';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Editorial spotlight on three featured products.
 *
 * The first gets a wide two-column treatment; the other two sit beside it. Each
 * carries its manufacturer's official mark, real name, colourways and the three
 * actions from the product page: view, buy and compare.
 */
export function FeaturedProduct() {
  const { addToCart, openCart, toggleCompare, isComparing } = useStore();
  const [lead, ...rest] = featuredProducts.slice(0, 3);
  if (!lead) return null;

  return (
    <section aria-labelledby="featured-heading" style={{ paddingBlock: 'var(--section-y)' }}>
      <Container>
        <SectionHeading
          title={<span id="featured-heading">In the spotlight</span>}
          description="Three products worth a closer look."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ---- Lead feature ------------------------------------------- */}
          <ScrollReveal className="flex">
            <article className="flex flex-1 flex-col gap-6 rounded-lg bg-haze p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <BrandLogo brandId={lead.brandId} height={20} decorative />
                <span className="text-micro font-medium uppercase tracking-[0.1em] text-slate">
                  {brandName(lead.brandId)}
                </span>
              </div>

              <div className="photo-plate mx-auto h-[320px] w-full max-w-[420px] rounded-lg">
                <ProductImage
                  base={lead.image}
                  alt={`${brandName(lead.brandId)} ${lead.name}`}
                  width={lead.imageWidth}
                  height={lead.imageHeight}
                  sizes="(min-width: 1024px) 420px, 80vw"
                />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-[1.75rem]">
                  <Link to={`/products/${lead.id}`} className="hover:text-accent">
                    {lead.name}
                  </Link>
                </h3>
                <p className="max-w-[52ch] text-slate">{lead.description}</p>

                <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-small text-slate">
                  {lead.colors.slice(0, 4).map((color) => (
                    <li key={color} className="flex items-center gap-1.5">
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                      {color}
                    </li>
                  ))}
                </ul>

                <p className="tabular mt-2 text-[1.25rem] font-semibold">
                  {formatPrice(lead.price)}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-3">
                <Button to={`/products/${lead.id}`}>View product</Button>
                <Button
                  variant="buy"
                  onClick={() => {
                    addToCart(lead.id);
                    openCart();
                  }}
                >
                  Buy now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleCompare(lead.id)}
                  aria-pressed={isComparing(lead.id)}
                >
                  {isComparing(lead.id) ? 'In comparison' : 'Compare'}
                </Button>
              </div>
            </article>
          </ScrollReveal>

          {/* ---- Two supporting features -------------------------------- */}
          <div className="grid gap-6">
            {rest.map((product, index) => (
              <ScrollReveal key={product.id} delay={120 * (index + 1)} className="flex">
                <article className="flex flex-1 flex-col gap-5 rounded-lg border border-hairline p-6 sm:flex-row sm:items-center sm:gap-6">
                  <div className="photo-plate h-[180px] w-full shrink-0 sm:w-[42%]">
                    <ProductImage
                      base={product.image}
                      alt={`${brandName(product.brandId)} ${product.name}`}
                      width={product.imageWidth}
                      height={product.imageHeight}
                      sizes="(min-width: 640px) 240px, 80vw"
                    />
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <BrandLogo brandId={product.brandId} height={14} decorative />
                      <span className="text-micro uppercase tracking-[0.08em] text-slate">
                        {brandName(product.brandId)}
                      </span>
                    </div>

                    <h3 className="text-[1.1875rem]">
                      <Link to={`/products/${product.id}`} className="hover:text-accent">
                        {product.name}
                      </Link>
                    </h3>

                    <p className="line-clamp-2 text-small text-slate">
                      {product.description}
                    </p>

                    <p className="tabular font-semibold">{formatPrice(product.price)}</p>

                    <div className="mt-1 flex flex-wrap gap-2">
                      <Button to={`/products/${product.id}`} size="sm" variant="secondary">
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCompare(product.id)}
                        aria-pressed={isComparing(product.id)}
                      >
                        {isComparing(product.id) ? 'In comparison' : 'Compare'}
                      </Button>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
