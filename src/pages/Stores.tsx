import { StoreSection } from '../components/sections/StoreSection';
import { usePageTitle } from '../hooks/usePageTitle';

/** Store finder page — the same locator the homepage shows, unrestricted. */
export function Stores() {
  usePageTitle('Find a store — NEXORA');
  return <StoreSection headingLevel={1} />;
}
