import type { NavGroup } from './navigation';

export const STORE_NAME = 'NEXORA';
export const STORE_TAGLINE = 'Premium technology, every major brand.';

export const footerGroups: NavGroup[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Phones', to: '/category/phones' },
      { label: 'Laptops', to: '/category/laptops' },
      { label: 'Tablets', to: '/category/tablets' },
      { label: 'Audio', to: '/category/headphones' },
      { label: 'Gaming', to: '/category/gaming' },
      { label: 'Accessories', to: '/category/accessories' },
    ],
  },
  {
    title: 'Brands',
    links: [
      { label: 'Apple', to: '/brand/apple' },
      { label: 'Samsung', to: '/brand/samsung' },
      { label: 'Sony', to: '/brand/sony' },
      { label: 'Google', to: '/brand/google' },
      { label: 'Microsoft', to: '/brand/microsoft' },
      { label: 'ASUS', to: '/brand/asus' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact us', to: '/support#contact' },
      { label: 'Shipping', to: '/support#shipping' },
      { label: 'Returns', to: '/support#returns' },
      { label: 'Warranty', to: '/support#warranty' },
      { label: 'Help centre', to: '/support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/support#about' },
      { label: 'Careers', to: '/support#careers' },
      { label: 'Privacy', to: '/support#privacy' },
      { label: 'Terms', to: '/support#terms' },
      { label: 'Find a store', to: '/stores' },
    ],
  },
];

/**
 * Social destinations. These point at each platform's home page rather than
 * inventing account handles for a store that does not exist.
 */
export const socialLinks = [
  { label: 'NEXORA on X', platform: 'x', href: 'https://x.com' },
  { label: 'NEXORA on Instagram', platform: 'instagram', href: 'https://instagram.com' },
  { label: 'NEXORA on YouTube', platform: 'youtube', href: 'https://youtube.com' },
];
