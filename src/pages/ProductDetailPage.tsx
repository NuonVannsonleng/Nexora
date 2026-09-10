import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../data/products';
import { brandName } from '../data/brands';
import { ProductDetail } from '../components/products/ProductDetail';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';

/** Route wrapper for a single product; handles the unknown-id case. */
export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProduct(id) : undefined;

  usePageTitle(
    product ? `${brandName(product.brandId)} ${product.name} — NEXORA` : 'Product not found — NEXORA',
  );

  if (!product) {
    return (
      <Container className="py-24 text-center">
        <h1>We couldn&rsquo;t find that product</h1>
        <p className="mx-auto mt-3 max-w-[48ch] text-slate">
          The link may be out of date. Browse the full catalogue to find what you were
          looking for.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/products">All products</Button>
          <Link
            to="/"
            className="inline-flex items-center text-small text-accent hover:underline"
          >
            Back to home
          </Link>
        </div>
      </Container>
    );
  }

  // `key` remounts the detail view when navigating between products, so gallery
  // and colour selection reset instead of carrying over.
  return <ProductDetail key={product.id} product={product} />;
}
