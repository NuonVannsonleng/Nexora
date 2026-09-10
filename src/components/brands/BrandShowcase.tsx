import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getBrand } from '../../data/brands';
import { getProductsByBrand } from '../../data/products';
import { formatPrice } from '../../lib/format';
import { BrandLogo } from './BrandLogo';
import { ProductImage } from '../products/ProductImage';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';

interface BrandShowcaseProps {
  brandId: string;
  /** Original editorial line for this brand's band — never vendor campaign copy. */
  headline: string;
  blurb: string;
}

/**
 * A dedicated band for one manufacturer: their official logo, an original
 * editorial line and up to four of their real products.
 *
 * The band takes the brand's own light or dark treatment from brand data, which is
 * what gives Sony an editorial dark panel while Apple and Samsung stay light — but
 * only one brand ever appears per band, so nothing here reads as an official
 * combined brand page.
 */
export function BrandShowcase({ brandId, headline, blurb }: BrandShowcaseProps) {
  const brand = getBrand(brandId);
  const items = getProductsByBrand(brandId).slice(0, 4);
  if (!brand || items.length === 0) return null;

  const dark = brand.theme === 'dark';
  const headingId = `showcase-${brand.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className={dark ? 'bg-ink text-white' : 'bg-white text-ink'}
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <Container>
        <div className="flex flex-col gap-8">
          <ScrollReveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4">
              {/* On the dark treatment the mark sits on a white plate so it stays
                  legible without being recoloured. */}
              <span
                className={`inline-grid h-12 w-fit place-items-center rounded-sm px-4 ${
                  dark ? 'bg-white' : 'bg-haze'
                }`}
              >
                <BrandLogo brandId={brand.id} height={24} />
              </span>

              <h2 id={headingId} className={dark ? 'text-white' : undefined}>
                {headline}
              </h2>
              <p className={`max-w-[56ch] ${dark ? 'text-white/70' : 'text-slate'}`}>{blurb}</p>
            </div>

            <Link
              to={`/brand/${brand.id}`}
              className={`group inline-flex shrink-0 items-center gap-1.5 text-small font-medium ${
                dark ? 'text-white' : 'text-accent'
              }`}
            >
              All {brand.name} products
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-fast ease-premium group-hover:translate-x-0.5"
              />
            </Link>
          </ScrollReveal>

          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4 lg:gap-5">
            {items.map((product, index) => (
              <ScrollReveal key={product.id} as="li" delay={index * 80} className="flex">
                <Link
                  to={`/products/${product.id}`}
                  className={`group flex flex-1 flex-col gap-3 rounded-md p-4 transition-[background-color,transform] duration-base ease-premium hover:-translate-y-0.5 sm:p-5 ${
                    dark ? 'bg-white/[0.06] hover:bg-white/[0.1]' : 'bg-haze hover:bg-hairline/40'
                  }`}
                >
                  <span className="photo-plate h-[150px] w-full">
                    <ProductImage
                      base={product.image}
                      alt={`${brand.name} ${product.name}`}
                      width={product.imageWidth}
                      height={product.imageHeight}
                      sizes="(min-width: 1024px) 240px, 45vw"
                      className="transition-transform duration-slow ease-premium group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </span>

                  <span className="mt-auto flex flex-col gap-1">
                    <span className="font-medium leading-snug">{product.name}</span>
                    {product.model && (
                      <span className={`text-micro ${dark ? 'text-white/55' : 'text-slate'}`}>
                        {product.model}
                      </span>
                    )}
                    <span className="tabular text-small">{formatPrice(product.price)}</span>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </ul>

          {items.length >= 4 && (
            <div className="flex justify-center">
              <Button
                to={`/brand/${brand.id}`}
                variant={dark ? 'secondary' : 'outline'}
                size="sm"
              >
                Explore {brand.name}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
