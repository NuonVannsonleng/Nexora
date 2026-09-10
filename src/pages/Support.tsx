import { ServicesSection } from '../components/sections/ServicesSection';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Support and company information.
 *
 * The footer's Support and Company links point at anchors on this page, so every
 * footer link resolves somewhere real instead of a dead route. Each block states
 * plainly what this build does and does not do.
 */
const SECTIONS = [
  {
    id: 'contact',
    title: 'Contact us',
    body: 'A production deployment would route enquiries to a support desk here. This build has no backend, so the form and live-chat entry points are omitted rather than shown as non-functional controls.',
  },
  {
    id: 'shipping',
    title: 'Shipping',
    body: 'Sample delivery terms: free standard delivery on orders over $99, otherwise a flat $9. Orders are not fulfilled in this demonstration.',
  },
  {
    id: 'returns',
    title: 'Returns',
    body: 'Sample returns policy: unopened items may be returned within 14 days of delivery. No real returns process is connected.',
  },
  {
    id: 'warranty',
    title: 'Warranty',
    body: 'Products carry their manufacturer’s standard warranty. Warranty claims are handled by the manufacturer, not by NEXORA — check the manufacturer’s official site for the terms that apply to your device.',
  },
  {
    id: 'account',
    title: 'Your account',
    body: 'Account UI is present in the header for completeness. There is no authentication in this build: no account is created, and nothing is stored on a server. Your bag, wishlist and comparison live in this browser’s local storage only.',
  },
  {
    id: 'about',
    title: 'About NEXORA',
    body: 'NEXORA is a fictional multi-brand electronics retailer built as a front-end portfolio project. It demonstrates a premium storefront — catalogue, search, filtering, product pages, comparison, bag and wishlist — driven entirely by structured data.',
  },
  {
    id: 'careers',
    title: 'Careers',
    body: 'NEXORA is not a real company and is not hiring. This page exists so the footer’s navigation is complete.',
  },
  {
    id: 'privacy',
    title: 'Privacy',
    body: 'This site collects nothing. There is no analytics, no tracking and no server. The only data stored is your bag, wishlist, comparison and recent searches, held in your own browser’s local storage and removable by clearing site data.',
  },
  {
    id: 'terms',
    title: 'Terms',
    body: 'All product names, logos and brands are the property of their respective owners. NEXORA is not affiliated with, endorsed by or operated by any manufacturer shown. Product names and logos are used only to identify the products described.',
  },
];

export function Support() {
  usePageTitle('Support — NEXORA');

  return (
    <>
      <Container className="py-10 sm:py-14">
        <SectionHeading
          level={1}
          title="Help and support"
          description="What NEXORA covers, and what this demonstration build does not."
        />

        {/* Jump links, so the footer's deep links have somewhere to land. */}
        <nav aria-label="Support topics" className="mb-10">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex rounded-pill bg-haze px-4 py-2 text-small transition-colors duration-fast hover:bg-hairline/60"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex max-w-[70ch] flex-col gap-10">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2 id={`${section.id}-heading`} className="text-[1.25rem]">
                {section.title}
              </h2>
              <p className="mt-2 leading-relaxed text-slate">{section.body}</p>
            </section>
          ))}

          <div className="flex flex-wrap gap-3">
            <Button to="/stores" variant="outline">
              Find a store
            </Button>
            <Button to="/products">Browse products</Button>
          </div>
        </div>
      </Container>

      <ServicesSection />
    </>
  );
}
