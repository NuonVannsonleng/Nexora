import { useMemo, useState } from 'react';
import { Clock, MapPin, Phone, Search } from 'lucide-react';
import { storeLocations, STORE_LOCATOR_DISCLAIMER } from '../../data/services';
import { normalize } from '../../lib/format';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

interface StoreSectionProps {
  /** The homepage band trims the list; the stores page shows everything. */
  limit?: number;
  /**
   * Heading depth. The homepage renders this as one band among many (h2); the
   * dedicated stores page renders it as the page heading (h1).
   */
  headingLevel?: 1 | 2;
}

/**
 * Store finder.
 *
 * Filters the sample location list by city, region or address text. It never asks
 * for or infers the visitor's real position — there is no geolocation call here,
 * because there is no real store network to match them against.
 */
export function StoreSection({ limit, headingLevel = 2 }: StoreSectionProps) {
  const [query, setQuery] = useState('');
  const StoreHeading = headingLevel === 1 ? 'h2' : 'h3';

  const matches = useMemo(() => {
    const q = normalize(query);
    const filtered = q
      ? storeLocations.filter((store) =>
          normalize(`${store.name} ${store.city} ${store.region} ${store.address}`).includes(q),
        )
      : storeLocations;
    return limit ? filtered.slice(0, limit) : filtered;
  }, [query, limit]);

  return (
    <section aria-labelledby="stores-heading" style={{ paddingBlock: 'var(--section-y)' }}>
      <Container>
        <SectionHeading
          level={headingLevel}
          title={<span id="stores-heading">Find a store</span>}
          description={STORE_LOCATOR_DISCLAIMER}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-5">
            <div>
              <label htmlFor="store-search" className="mb-2 block text-small font-medium">
                Search by city or region
              </label>
              <div className="flex min-w-0 items-center gap-3 rounded-md border border-hairline px-4 focus-within:border-ink">
                <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-slate" />
                <input
                  id="store-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="London, Tokyo, California…"
                  className="h-12 min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate"
                />
              </div>
            </div>

            <p aria-live="polite" className="text-small text-slate">
              {matches.length} {matches.length === 1 ? 'store' : 'stores'}
              {query.trim() ? ` matching “${query.trim()}”` : ''}
            </p>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {matches.map((store) => (
                <li
                  key={store.id}
                  className="rounded-md border border-hairline p-5 transition-colors duration-fast hover:border-slate/40"
                >
                  <StoreHeading className="text-[1.0625rem] font-semibold">
                    {store.name}
                  </StoreHeading>
                  <dl className="mt-2 flex flex-col gap-1.5 text-small text-slate">
                    <div className="flex items-start gap-2">
                      <dt className="sr-only">Address</dt>
                      <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                      <dd className="m-0">{store.address}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="sr-only">Opening hours</dt>
                      <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                      <dd className="m-0">{store.hours}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="sr-only">Telephone</dt>
                      <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                      <dd className="m-0">{store.phone}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            {matches.length === 0 && (
              <p className="rounded-md bg-haze px-5 py-8 text-center text-small text-slate">
                No sample stores match that search.
              </p>
            )}
          </div>

          {/* Decorative map-style panel. Explicitly not a real map — labelling it
              as one would imply store data this build does not have. */}
          <div
            aria-hidden="true"
            className="relative min-h-[320px] min-w-0 overflow-hidden rounded-lg bg-haze"
          >
            <svg
              viewBox="0 0 400 320"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0H0v40" fill="none" stroke="var(--c-hairline)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="320" fill="url(#grid)" />
              {/* Suggested arterial roads. */}
              <path d="M0 210 C90 190 150 240 400 190" fill="none" stroke="var(--c-hairline)" strokeWidth="6" />
              <path d="M120 0 C140 120 100 220 160 320" fill="none" stroke="var(--c-hairline)" strokeWidth="6" />
              <rect x="196" y="120" width="8" height="8" rx="4" fill="var(--c-ink)" />
              <circle cx="200" cy="124" r="26" fill="none" stroke="var(--c-ink)" strokeOpacity="0.25" strokeWidth="2" />
            </svg>
            <p className="absolute bottom-4 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-pill bg-white/90 px-4 py-1.5 text-center text-micro text-slate">
              Illustrative map — sample locations only
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
