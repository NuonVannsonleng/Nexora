import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MobileMenu } from '../../src/components/layout/MobileMenu';
import { BrandCard } from '../../src/components/brands/BrandCard';
import { getBrand } from '../../src/data/brands';
import { mobileNav } from '../../src/data/navigation';
import { renderWithProviders, screen, within } from './helpers';

describe('MobileMenu', () => {
  it('renders nothing while closed', () => {
    renderWithProviders(<MobileMenu open={false} onClose={() => {}} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders as a modal dialog with an accessible name', () => {
    renderWithProviders(<MobileMenu open onClose={() => {}} />);

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders every configured link', () => {
    renderWithProviders(<MobileMenu open onClose={() => {}} />);

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    for (const group of mobileNav) {
      for (const link of group.links) {
        expect(within(dialog).getByRole('link', { name: link.label })).toHaveAttribute(
          'href',
          link.to,
        );
      }
    }
  });

  it('closes on the close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<MobileMenu open onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /Close menu/ }));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<MobileMenu open onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when a link is followed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<MobileMenu open onClose={onClose} />);

    await user.click(screen.getByRole('link', { name: 'All products' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('moves focus into the drawer when it opens', () => {
    renderWithProviders(<MobileMenu open onClose={() => {}} />);

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('keeps Tab inside the drawer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu open onClose={() => {}} />);

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });
});

describe('BrandCard', () => {
  const apple = getBrand('apple')!;

  it('links to the brand page', () => {
    renderWithProviders(<BrandCard brand={apple} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/brand/apple');
  });

  it('shows the brand name, description and product count', () => {
    renderWithProviders(<BrandCard brand={apple} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText(apple.description)).toBeInTheDocument();
    expect(screen.getByText(/\d+ products?/)).toBeInTheDocument();
  });

  it('renders the official brand logo file', () => {
    const { container } = renderWithProviders(<BrandCard brand={apple} />);

    const logo = container.querySelector('img');
    expect(logo).toHaveAttribute('src', '/assets/brands/apple.svg');
  });

  it('constrains the logo on both axes so marks stay proportionate', () => {
    const { container } = renderWithProviders(<BrandCard brand={getBrand('bose')!} />);

    const logo = container.querySelector('img')!;
    // A very wide wordmark must be bounded by width, not stretched to the height.
    expect(logo.style.maxHeight).not.toBe('');
    expect(logo.style.maxWidth).not.toBe('');
    expect(logo).toHaveClass('object-contain');
  });
});
