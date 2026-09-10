import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine } from '../data/types';
import { getProduct } from '../data/products';

/** Most products the comparison view can hold at once. */
export const MAX_COMPARE = 4;

const KEYS = {
  cart: 'nexora.cart',
  wishlist: 'nexora.wishlist',
  compare: 'nexora.compare',
  searches: 'nexora.recentSearches',
} as const;

/**
 * Reads JSON from localStorage, falling back to `fallback` when storage is
 * unavailable (private browsing, disabled cookies, SSR) or holds malformed data.
 */
function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) === Array.isArray(fallback) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — the in-memory state stays correct for this session.
  }
}

interface StoreValue {
  /* bag */
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  /* wishlist */
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;

  /* compare */
  compare: string[];
  isComparing: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  /* recent searches */
  recentSearches: string[];
  rememberSearch: (term: string) => void;
  clearRecentSearches: () => void;

  /* bag drawer visibility, shared by the header and product pages */
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => readStored<CartLine[]>(KEYS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStored<string[]>(KEYS.wishlist, []));
  // Clamp on read as well as on toggle: a stored list from an older session (or a
  // hand-edited one) must not be able to push the comparison past its cap.
  const [compare, setCompare] = useState<string[]>(() =>
    readStored<string[]>(KEYS.compare, []).slice(0, MAX_COMPARE),
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    readStored<string[]>(KEYS.searches, []),
  );
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => writeStored(KEYS.cart, cart), [cart]);
  useEffect(() => writeStored(KEYS.wishlist, wishlist), [wishlist]);
  useEffect(() => writeStored(KEYS.compare, compare), [compare]);
  useEffect(() => writeStored(KEYS.searches, recentSearches), [recentSearches]);

  /* ------------------------------------------------------------------- bag */

  const addToCart = useCallback((productId: string, quantity = 1) => {
    if (!getProduct(productId) || quantity < 1) return;
    setCart((lines) => {
      const existing = lines.find((l) => l.productId === productId);
      if (existing) {
        return lines.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...lines, { productId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((lines) => lines.filter((l) => l.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    // Dropping to zero removes the line, matching the stepper's minus control.
    if (quantity < 1) {
      setCart((lines) => lines.filter((l) => l.productId !== productId));
      return;
    }
    setCart((lines) =>
      lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((sum, l) => sum + l.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, line) => {
        const product = getProduct(line.productId);
        return product ? sum + product.price * line.quantity : sum;
      }, 0),
    [cart],
  );

  /* -------------------------------------------------------------- wishlist */

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const toggleWishlist = useCallback((productId: string) => {
    if (!getProduct(productId)) return;
    setWishlist((ids) =>
      ids.includes(productId) ? ids.filter((i) => i !== productId) : [...ids, productId],
    );
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((ids) => ids.filter((i) => i !== productId));
  }, []);

  /* --------------------------------------------------------------- compare */

  const isComparing = useCallback((id: string) => compare.includes(id), [compare]);

  const toggleCompare = useCallback((productId: string) => {
    if (!getProduct(productId)) return;
    setCompare((ids) => {
      if (ids.includes(productId)) return ids.filter((i) => i !== productId);
      // At the cap, drop the oldest so the control never silently does nothing.
      const next = [...ids, productId];
      return next.length > MAX_COMPARE ? next.slice(next.length - MAX_COMPARE) : next;
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  /* -------------------------------------------------------- recent searches */

  const rememberSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 2) return;
    setRecentSearches((prev) =>
      [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6),
    );
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      compare,
      isComparing,
      toggleCompare,
      clearCompare,
      recentSearches,
      rememberSearch,
      clearRecentSearches,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
    }),
    [
      cart, cartCount, cartSubtotal, addToCart, removeFromCart, setQuantity, clearCart,
      wishlist, isWishlisted, toggleWishlist, removeFromWishlist,
      compare, isComparing, toggleCompare, clearCompare,
      recentSearches, rememberSearch, clearRecentSearches, cartOpen,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside a StoreProvider');
  return ctx;
}
