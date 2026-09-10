import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { primaryNav } from '../../data/navigation';
import { STORE_NAME } from '../../data/footer';
import { useStore } from '../../context/StoreContext';
import { Container } from '../ui/Container';
import { StoreLogo } from '../ui/StoreLogo';
import { Modal } from '../ui/Modal';
import { ProductSearch } from '../products/ProductSearch';
import { MobileMenu } from './MobileMenu';

/** Small count bubble on the bag and wishlist buttons. */
function CountBubble({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      aria-hidden="true"
      className="tabular absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold leading-none text-white"
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

/**
 * Global header.
 *
 * Carries NEXORA's own store identity — the manufacturers' logos appear only in
 * brand sections and on product cards, so the marketplace never reads as any one
 * vendor's official store.
 *
 * Above 1024px the category links sit inline; below that they move into the
 * mobile drawer and the header keeps only the utility actions.
 */
export function Header() {
  const location = useLocation();
  const { cartCount, wishlist, openCart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Navigating away should never leave an overlay open behind the new page.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <header
        className="sticky top-0 border-b border-hairline/70 bg-white/80 backdrop-blur-xl backdrop-saturate-150"
        style={{ zIndex: 'var(--z-header)' }}
      >
        <Container>
          <nav
            aria-label="Main"
            className="flex items-center gap-1"
            style={{ minHeight: 'var(--header-h)' }}
          >
            <Link
              to="/"
              aria-label={`${STORE_NAME} home`}
              className="mr-2 flex min-w-0 items-center py-2 text-ink sm:mr-3 lg:mr-6"
            >
              <StoreLogo height={20} />
            </Link>

            <ul className="m-0 hidden flex-1 list-none items-center gap-0.5 p-0 lg:flex">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `inline-flex items-center rounded-sm px-2.5 py-1.5 text-small transition-colors duration-fast hover:text-ink ${
                        isActive ? 'text-ink' : 'text-slate'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="ml-auto flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search the store"
                className="grid h-9 w-9 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-ink sm:h-10 sm:w-10"
              >
                <Search aria-hidden="true" className="h-[18px] w-[18px]" />
              </button>

              <Link
                to="/wishlist"
                aria-label={`Wishlist, ${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'}`}
                className="relative grid h-9 w-9 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-ink sm:h-10 sm:w-10"
              >
                <Heart aria-hidden="true" className="h-[18px] w-[18px]" />
                <CountBubble count={wishlist.length} />
              </Link>

              <Link
                to="/support#account"
                aria-label="Account"
                className="hidden h-9 w-9 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-ink sm:grid sm:h-10 sm:w-10"
              >
                <User aria-hidden="true" className="h-[18px] w-[18px]" />
              </Link>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                className="relative grid h-9 w-9 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-ink sm:h-10 sm:w-10"
              >
                <ShoppingBag aria-hidden="true" className="h-[18px] w-[18px]" />
                <CountBubble count={cartCount} />
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="grid h-9 w-9 place-items-center rounded-full text-slate transition-colors duration-fast hover:bg-haze hover:text-ink sm:h-10 sm:w-10 lg:hidden"
              >
                <Menu aria-hidden="true" className="h-[18px] w-[18px]" />
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Search opens as a sheet from the top, mirroring the Apple Store pattern. */}
      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search"
        placement="top"
        className="max-h-[85vh]"
      >
        <Container className="py-5">
          <ProductSearch autoFocus onDone={() => setSearchOpen(false)} />
        </Container>
      </Modal>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
