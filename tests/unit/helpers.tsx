import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';
import { StoreProvider } from '../../src/context/StoreContext';

interface WrapperOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial history entry, for components that read route params. */
  route?: string;
}

/**
 * Renders a component inside the providers it needs in the real app: a router and
 * the cart/wishlist/compare store. Tests exercise components as they actually
 * ship rather than through hand-built mocks.
 */
export function renderWithProviders(ui: ReactElement, { route = '/', ...options }: WrapperOptions = {}) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <StoreProvider>{children}</StoreProvider>
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
