/** Header, mobile-drawer and footer link structures. */

export interface NavLink {
  label: string;
  to: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** Primary desktop navigation. */
export const primaryNav: NavLink[] = [
  { label: 'Store', to: '/products' },
  { label: 'Laptops', to: '/category/laptops' },
  { label: 'Phones', to: '/category/phones' },
  { label: 'Tablets', to: '/category/tablets' },
  { label: 'Watch', to: '/category/smartwatches' },
  { label: 'Audio', to: '/category/headphones' },
  { label: 'Gaming', to: '/category/gaming' },
  { label: 'Accessories', to: '/category/accessories' },
];

/** Sections of the mobile drawer. */
export const mobileNav: NavGroup[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/products' },
      { label: 'New arrivals', to: '/new-arrivals' },
      { label: 'Deals', to: '/deals' },
      { label: 'Compare products', to: '/compare' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'Phones', to: '/category/phones' },
      { label: 'Laptops', to: '/category/laptops' },
      { label: 'Tablets', to: '/category/tablets' },
      { label: 'Smartwatches', to: '/category/smartwatches' },
      { label: 'Headphones', to: '/category/headphones' },
      { label: 'Cameras', to: '/category/cameras' },
      { label: 'Gaming', to: '/category/gaming' },
      { label: 'TVs', to: '/category/tvs' },
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
      { label: 'Lenovo', to: '/brand/lenovo' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help centre', to: '/support' },
      { label: 'Find a store', to: '/stores' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Shopping bag', to: '/cart' },
    ],
  },
];
