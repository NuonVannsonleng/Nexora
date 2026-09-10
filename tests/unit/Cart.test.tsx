import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { CartDrawer } from '../../src/components/layout/CartDrawer';
import { Header } from '../../src/components/layout/Header';
import { ProductCard } from '../../src/components/products/ProductCard';
import { getProduct } from '../../src/data/products';
import { renderWithProviders, screen, within } from './helpers';

const iphone = getProduct('iphone-15-pro')!; // $999
const airpods = getProduct('airpods-pro-2')!; // $249

/** The bag drawer plus two cards, so add/remove flows can be driven end to end. */
function Harness() {
  return (
    <>
      <Header />
      <ProductCard product={iphone} />
      <ProductCard product={airpods} />
      <CartDrawer />
    </>
  );
}

describe('Shopping bag', () => {
  it('starts empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getByRole('button', { name: /Shopping bag/ }));
    expect(screen.getByText('Your bag is empty')).toBeInTheDocument();
  });

  it('adds a product and shows it with the right line total', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getAllByRole('button', { name: 'Add to bag' })[0]);

    const dialog = screen.getByRole('dialog', { name: /Shopping bag/ });
    expect(within(dialog).getByRole('link', { name: 'iPhone 15 Pro' })).toBeInTheDocument();
    expect(within(dialog).getByText('$999')).toBeInTheDocument();
  });

  it('increments quantity and updates the subtotal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getAllByRole('button', { name: 'Add to bag' })[0]);
    const dialog = screen.getByRole('dialog', { name: /Shopping bag/ });

    await user.click(within(dialog).getByRole('button', { name: /Increase Quantity for iPhone 15 Pro/ }));

    const group = within(dialog).getByRole('group', { name: 'Quantity for iPhone 15 Pro' });
    expect(within(group).getByText('2')).toBeInTheDocument();
    // 2 x $999
    expect(within(dialog).getByText('$1,998.00')).toBeInTheDocument();
  });

  it('sums two different products into the subtotal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    const addButtons = screen.getAllByRole('button', { name: 'Add to bag' });
    await user.click(addButtons[0]);
    await user.click(addButtons[1]);

    const dialog = screen.getByRole('dialog', { name: /Shopping bag/ });
    // $999 + $249
    expect(within(dialog).getByText('$1,248.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shopping bag, 2 items/ })).toBeInTheDocument();
  });

  it('removes a line via the remove button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getAllByRole('button', { name: 'Add to bag' })[0]);
    const dialog = screen.getByRole('dialog', { name: /Shopping bag/ });

    await user.click(
      within(dialog).getByRole('button', { name: 'Remove iPhone 15 Pro from bag' }),
    );

    expect(screen.getByText('Your bag is empty')).toBeInTheDocument();
  });

  it('removes the line when quantity is decremented below one', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getAllByRole('button', { name: 'Add to bag' })[0]);
    const dialog = screen.getByRole('dialog', { name: /Shopping bag/ });

    await user.click(
      within(dialog).getByRole('button', { name: /Remove, Quantity for iPhone 15 Pro/ }),
    );

    expect(screen.getByText('Your bag is empty')).toBeInTheDocument();
  });

  it('offers a checkout call to action but processes no payment', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getAllByRole('button', { name: 'Add to bag' })[0]);
    const dialog = screen.getByRole('dialog', { name: /Shopping bag/ });

    // The CTA is a link to the bag page — there is no payment step anywhere.
    expect(within(dialog).getByRole('link', { name: 'Check out' })).toHaveAttribute('href', '/cart');
    expect(within(dialog).queryByText(/card number/i)).not.toBeInTheDocument();
  });

  it('persists the bag to localStorage', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.click(screen.getAllByRole('button', { name: 'Add to bag' })[0]);

    const stored = JSON.parse(window.localStorage.getItem('nexora.cart') ?? '[]');
    expect(stored).toEqual([{ productId: 'iphone-15-pro', quantity: 1 }]);
  });
});
