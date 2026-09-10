import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { mobileNav } from '../../data/navigation';
import { Modal } from '../ui/Modal';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The navigation drawer below 1024px.
 *
 * Modal supplies the whole dialog contract — Escape, scrim click, focus trap,
 * focus restore and scroll lock — so this component only lays out the sections.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <Modal open={open} onClose={onClose} title="Menu" placement="right">
      <nav aria-label="Store sections" className="flex flex-col gap-8 px-5 py-6 sm:px-6">
        {mobileNav.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 text-micro font-semibold uppercase tracking-[0.08em] text-slate">
              {group.title}
            </h3>
            <ul className="m-0 list-none p-0">
              {group.links.map((link) => (
                <li key={link.to} className="border-b border-hairline/60 last:border-0">
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="flex items-center justify-between gap-3 py-3 text-[1.0625rem] transition-colors duration-fast hover:text-accent"
                  >
                    {link.label}
                    <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </Modal>
  );
}
