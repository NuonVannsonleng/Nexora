import { Link } from 'react-router-dom';
import type { Brand } from '../../data/types';
import { productCountByBrand } from '../../lib/catalog';
import { BrandLogo } from './BrandLogo';

interface BrandCardProps {
  brand: Brand;
}

/**
 * A brand tile in the explorer: the manufacturer's official logo, its name and a
 * short line about what the store carries from them.
 *
 * The logo sits on a white plate at a fixed height so marks of very different
 * proportions — Apple's glyph, HP's circle, the Microsoft and Canon wordmarks —
 * all line up on a shared baseline without any being stretched.
 */
export function BrandCard({ brand }: BrandCardProps) {
  const count = productCountByBrand.get(brand.id) ?? 0;

  return (
    <Link
      to={`/brand/${brand.id}`}
      className="group flex h-full w-[220px] flex-col gap-4 rounded-md border border-hairline bg-white p-5 transition-[border-color,box-shadow,transform] duration-base ease-premium hover:-translate-y-0.5 hover:border-slate/40 hover:shadow-card sm:w-auto"
    >
      <span className="grid h-14 place-items-center rounded-sm bg-white px-2">
        <BrandLogo brandId={brand.id} height={26} decorative />
      </span>

      <span className="flex flex-1 flex-col gap-1">
        <span className="font-semibold">{brand.name}</span>
        <span className="text-small leading-snug text-slate">{brand.description}</span>
      </span>

      <span className="text-micro text-slate">
        {count} {count === 1 ? 'product' : 'products'}
      </span>
    </Link>
  );
}
