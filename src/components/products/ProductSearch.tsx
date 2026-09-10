import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, Tag, X } from 'lucide-react';
import { buildSuggestions } from '../../lib/catalog';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../brands/BrandLogo';
import { getProduct } from '../../data/products';

interface ProductSearchProps {
  /** Called after a suggestion is chosen or a search is submitted. */
  onDone?: () => void;
  /** Take focus on mount — used when the search overlay opens. */
  autoFocus?: boolean;
}

/**
 * Search field with live suggestions across products, brands and categories.
 *
 * Implements the combobox keyboard contract: ArrowUp/ArrowDown move the active
 * option, Enter opens it (or runs a full search when nothing is highlighted) and
 * Escape clears. `aria-activedescendant` keeps the highlighted option announced
 * without moving DOM focus out of the input.
 */
export function ProductSearch({ onDone, autoFocus = false }: ProductSearchProps) {
  const navigate = useNavigate();
  const { recentSearches, rememberSearch, clearRecentSearches } = useStore();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const suggestions = useMemo(() => buildSuggestions(query), [query]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // A changed query invalidates the previous highlight.
  useEffect(() => setActiveIndex(-1), [query]);

  const runSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    rememberSearch(trimmed);
    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
    onDone?.();
  };

  const openSuggestion = (index: number) => {
    const suggestion = suggestions[index];
    if (!suggestion) return;
    rememberSearch(query);
    navigate(suggestion.to);
    onDone?.();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0) openSuggestion(activeIndex);
      else runSearch(query);
    } else if (event.key === 'Escape' && query) {
      // Clear the field first; a second Escape closes the overlay via Modal.
      event.stopPropagation();
      setQuery('');
    }
  };

  const expanded = suggestions.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-w-0 items-center gap-3 rounded-md bg-haze px-4">
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-slate" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search products, brands and categories"
          aria-label="Search the store"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
          className="h-14 min-w-0 flex-1 bg-transparent text-[1.0625rem] outline-none placeholder:text-slate"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate hover:bg-white hover:text-ink"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions. Always rendered so the listbox referenced by aria-controls
          exists, but empty until there is something to show.

          A listbox may only contain options, so the options are plain elements
          rather than <li><button> — wrapping them in list markup would break the
          listbox/option relationship. Keyboard operation runs through the input via
          aria-activedescendant, which is the combobox pattern, so the options
          deliberately are not tab stops. */}
      <div id={listId} role="listbox" aria-label="Search suggestions">
        {suggestions.map((suggestion, index) => {
          const product = suggestion.kind === 'product' ? getProduct(suggestion.id) : undefined;
          return (
            <div
              key={`${suggestion.kind}-${suggestion.id}`}
              id={`${listId}-opt-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => openSuggestion(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors duration-fast ${
                index === activeIndex ? 'bg-haze' : 'hover:bg-haze'
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-haze">
                {product ? (
                  <img
                    src={`${product.image}-640.webp`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-contain p-1"
                  />
                ) : suggestion.kind === 'brand' ? (
                  <BrandLogo brandId={suggestion.id} height={14} decorative />
                ) : (
                  <Tag aria-hidden="true" className="h-4 w-4 text-slate" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body">{suggestion.label}</span>
                <span className="block text-micro text-slate">{suggestion.detail}</span>
              </span>
            </div>
          );
        })}
      </div>

      {query.trim().length > 0 && suggestions.length === 0 && (
        <p className="px-3 py-6 text-center text-small text-slate">
          No matches for &ldquo;{query.trim()}&rdquo;. Try a brand or product name.
        </p>
      )}

      {query.trim().length === 0 && recentSearches.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-micro font-semibold uppercase tracking-[0.08em] text-slate">
              Recent searches
            </h3>
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-micro text-accent hover:underline"
            >
              Clear
            </button>
          </div>
          <ul className="m-0 list-none p-0">
            {recentSearches.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  onClick={() => runSearch(term)}
                  className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors duration-fast hover:bg-haze"
                >
                  <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-slate" />
                  <span className="truncate text-body">{term}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
