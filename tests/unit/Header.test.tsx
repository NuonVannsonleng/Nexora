import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Header } from '../../src/components/layout/Header';
import { primaryNav } from '../../src/data/navigation';
import { renderWithProviders, screen, within } from './helpers';

describe('Header', () => {
  it('renders the store’s own logo linking home', () => {
    renderWithProviders(<Header />);

    const home = screen.getByRole('link', { name: /NEXORA home/ });
    expect(home).toHaveAttribute('href', '/');
    // The store identity is NEXORA's own mark, not a manufacturer's.
    expect(within(home).getByTitle('NEXORA')).toBeInTheDocument();
  });

  it('renders every primary navigation link', () => {
    renderWithProviders(<Header />);

    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const item of primaryNav) {
      expect(within(nav).getByRole('link', { name: item.label })).toHaveAttribute('href', item.to);
    }
  });

  it('exposes the bag and wishlist counts in their accessible names', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('button', { name: /Shopping bag, 0 items/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Wishlist, 0 items/ })).toBeInTheDocument();
  });

  it('opens the search dialog and focuses the field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    await user.click(screen.getByRole('button', { name: 'Search the store' }));

    const dialog = screen.getByRole('dialog', { name: 'Search' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Search the store' })).toHaveFocus();
  });

  it('closes the search dialog on Escape', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    await user.click(screen.getByRole('button', { name: 'Search the store' }));
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument();
  });

  it('opens the mobile menu with all its sections', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    for (const heading of ['Shop', 'Categories', 'Brands', 'Support']) {
      expect(within(dialog).getByRole('heading', { name: heading })).toBeInTheDocument();
    }
  });

  it('locks page scroll while a drawer is open and releases it after', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(document.body.dataset.scrollLocked).toBe('true');

    await user.click(screen.getByRole('button', { name: /Close menu/ }));
    expect(document.body.dataset.scrollLocked).toBeUndefined();
  });
});
