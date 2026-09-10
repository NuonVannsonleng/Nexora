import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { usePageTitle } from '../hooks/usePageTitle';

/** Catch-all route. */
export function NotFound() {
  usePageTitle('Page not found — NEXORA');

  return (
    <Container className="py-24 text-center">
      <p className="text-micro font-semibold uppercase tracking-[0.14em] text-slate">
        404
      </p>
      <h1 className="mt-3">This page doesn&rsquo;t exist</h1>
      <p className="mx-auto mt-3 max-w-[48ch] text-slate">
        The link may be out of date. Try the store, or search for what you need.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/products">Browse the store</Button>
        <Button to="/" variant="outline">
          Back to home
        </Button>
      </div>
    </Container>
  );
}
