import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { getProduct } from '../../data/products';
import { productCountByCategory } from '../../lib/catalog';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Category explorer.
 *
 * Each tile borrows the photo of a representative product from that category, so
 * the artwork is always a real device rather than a generic icon.
 */
export function CategoryNavigation() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-haze"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <Container>
        <SectionHeading
          title={<span id="categories-heading">Browse by category</span>}
          description="Find the right device for the job."
        />

        <ScrollReveal>
          <ul className="rail m-0 list-none p-0 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {categories.map((category) => {
              const product = getProduct(category.representativeProduct);
              const count = productCountByCategory.get(category.id) ?? 0;

              return (
                <li key={category.id} className="flex">
                  <Link
                    to={`/category/${category.id}`}
                    className="group flex w-[150px] flex-1 flex-col items-center gap-3 rounded-md bg-white p-5 text-center transition-[box-shadow,transform] duration-base ease-premium hover:-translate-y-0.5 hover:shadow-card sm:w-auto"
                  >
                    {product && (
                      <img
                        src={`${product.image}-640.webp`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        width={120}
                        height={90}
                        className="h-[72px] w-auto object-contain transition-transform duration-slow ease-premium group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    )}
                    <span className="font-medium">{category.name}</span>
                    <span className="text-micro text-slate">
                      {count} {count === 1 ? 'product' : 'products'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </ScrollReveal>
      </Container>
    </section>
  );
}
