import { getProduct } from '../../data/products';
import { brandName } from '../../data/brands';
import { formatPrice } from '../../lib/format';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { BrandLogo } from '../brands/BrandLogo';
import { ProductImage } from '../products/ProductImage';

/** The product carried in the hero. A real product, labelled with its real brand. */
const HERO_PRODUCT_ID = 'iphone-15-pro';

/**
 * Editorial hero.
 *
 * Copy is original to this store — no manufacturer campaign lines. The featured
 * product is named with its brand and official mark so the visitor knows exactly
 * what they are looking at.
 *
 * Entrance motion staggers headline, copy and CTAs via .hero-enter, and both the
 * text and the image collapse to a static state under prefers-reduced-motion.
 */
export function Hero() {
  const product = getProduct(HERO_PRODUCT_ID);

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-haze">
      <Container>
        <div className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-8 md:py-24">
          <div className="hero-enter flex flex-col items-start gap-6">
            <p className="text-micro font-semibold uppercase tracking-[0.14em] text-slate">
              Every major brand, one store
            </p>

            <h1 id="hero-heading" style={{ fontSize: 'var(--t-display)' }} className="max-w-[18ch]">
              The next era of technology.
            </h1>

            <p className="max-w-[46ch] text-[1.125rem] text-slate">
              Discover the devices, entertainment and tools designed for the way you live,
              work and create — from the brands that build them best.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button to="/new-arrivals" size="lg">
                Shop new arrivals
              </Button>
              <Button to="/products" variant="outline" size="lg">
                Explore brands
              </Button>
            </div>
          </div>

          {product && (
            <div className="hero-media relative">
              <div className="photo-plate relative mx-auto aspect-square w-full max-w-[520px] rounded-lg">
                <ProductImage
                  base={product.image}
                  alt={`${brandName(product.brandId)} ${product.name}`}
                  width={product.imageWidth}
                  height={product.imageHeight}
                  priority
                  sizes="(min-width: 768px) 520px, 90vw"
                />
              </div>

              {/* Product label: brand mark, real name, price and a route in. */}
              <div className="mx-auto mt-2 flex max-w-[520px] flex-wrap items-center justify-between gap-4 rounded-md bg-white/70 px-5 py-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <BrandLogo brandId={product.brandId} height={18} decorative />
                  <div>
                    <p className="text-micro uppercase tracking-[0.08em] text-slate">
                      {brandName(product.brandId)}
                    </p>
                    <p className="font-semibold">{product.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="tabular text-small text-slate">
                    From {formatPrice(product.price)}
                  </p>
                  <Button to={`/products/${product.id}`} size="sm">
                    View
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
