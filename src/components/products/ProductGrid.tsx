import type { Product } from '../../data/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  /** Columns at the widest breakpoint. */
  columns?: 3 | 4;
  /** How many leading cards load eagerly (the first visible row). */
  priorityCount?: number;
  /** Shown in place of the grid when there is nothing to display. */
  emptyState?: React.ReactNode;
  /** Accessible name for the list, e.g. "Search results". */
  label?: string;
  /** Passed to each card; see ProductCard's headingLevel. */
  headingLevel?: 2 | 3;
  className?: string;
}

const columnClasses = {
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const;

/**
 * The catalogue grid. A real list so assistive tech announces how many products
 * are present, with each card as a list item.
 */
export function ProductGrid({
  products,
  columns = 3,
  priorityCount = 0,
  emptyState,
  label = 'Products',
  headingLevel = 3,
  className = '',
}: ProductGridProps) {
  if (products.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <ul
      aria-label={label}
      className={`grid list-none grid-cols-1 gap-5 p-0 sm:gap-6 ${columnClasses[columns]} ${className}`}
    >
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <div className="w-full">
            <ProductCard
              product={product}
              priority={index < priorityCount}
              headingLevel={headingLevel}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
