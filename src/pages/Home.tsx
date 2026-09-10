import { BrandShowcase } from '../components/brands/BrandShowcase';
import { BrandNavigation } from '../components/sections/BrandNavigation';
import { CategoryNavigation } from '../components/sections/CategoryNavigation';
import { DealsSection } from '../components/sections/DealsSection';
import { FeaturedProduct } from '../components/sections/FeaturedProduct';
import { Hero } from '../components/sections/Hero';
import { NewArrivals } from '../components/sections/NewArrivals';
import { PopularPicks } from '../components/sections/PopularPicks';
import { ServicesSection } from '../components/sections/ServicesSection';
import { StoreSection } from '../components/sections/StoreSection';
import { CompareTeaser } from '../components/sections/CompareTeaser';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Homepage.
 *
 * Section order follows the storefront narrative: hook, then browse routes
 * (brand and category), then merchandising, then the individual brand bands, and
 * finally the reassurance sections — services, stores, footer.
 *
 * Every band's copy is original to this store; the brand showcases carry each
 * manufacturer's own logo and real products but never their campaign lines.
 */
export function Home() {
  usePageTitle('NEXORA — Premium technology from every major brand');

  return (
    <>
      <Hero />
      <BrandNavigation />
      <FeaturedProduct />
      <CategoryNavigation />
      <NewArrivals />
      <PopularPicks />
      <DealsSection limit={4} />

      <BrandShowcase
        brandId="apple"
        headline="The Apple lineup, in one place."
        blurb="iPhone, Mac, iPad and Apple Watch — the devices that work together, ready to ship from NEXORA."
      />
      <BrandShowcase
        brandId="samsung"
        headline="Galaxy, built to fold and flow."
        blurb="From the S24 Ultra's 200MP camera to the Z Fold5's book-style hinge, Samsung keeps pushing what a phone can be."
      />
      <BrandShowcase
        brandId="sony"
        headline="Sony, for the people who make things."
        blurb="Full-frame Alpha cameras, PlayStation-grade entertainment and audio engineered to disappear."
      />

      <CompareTeaser />
      <ServicesSection />
      <StoreSection limit={4} />
    </>
  );
}
