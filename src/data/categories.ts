import type { Category, CategoryId } from './types';

/**
 * Shopping categories. Every entry has at least one product in the catalogue, so
 * no category page can render empty. `representativeProduct` supplies the tile
 * image, which keeps category art in step with real product photography.
 */
export const categories: Category[] = [
  {
    id: 'phones',
    name: 'Phones',
    description: 'Flagship handsets and foldables from Apple, Samsung and Google.',
    representativeProduct: 'iphone-15-pro',
  },
  {
    id: 'laptops',
    name: 'Laptops',
    description: 'Ultraportables, creator machines and gaming notebooks.',
    representativeProduct: 'macbook-air-m2',
  },
  {
    id: 'tablets',
    name: 'Tablets',
    description: 'Pro tablets with pen and keyboard support.',
    representativeProduct: 'ipad-pro-11',
  },
  {
    id: 'smartwatches',
    name: 'Smartwatches',
    description: 'Health tracking and notifications on your wrist.',
    representativeProduct: 'apple-watch-s9',
  },
  {
    id: 'headphones',
    name: 'Headphones',
    description: 'Noise cancelling over-ear and in-ear audio.',
    representativeProduct: 'airpods-pro-2',
  },
  {
    id: 'cameras',
    name: 'Cameras',
    description: 'Full-frame mirrorless bodies for stills and video.',
    representativeProduct: 'canon-eos-r6-ii',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Current-generation consoles and handhelds.',
    representativeProduct: 'playstation-5',
  },
  {
    id: 'tvs',
    name: 'TVs',
    description: 'Televisions and displays for every room.',
    representativeProduct: 'sony-bravia-w60',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Mice, keyboards and portable speakers.',
    representativeProduct: 'logitech-mx-master',
  },
];

const categoryIndex = new Map(categories.map((c) => [c.id, c]));

export const getCategory = (id: string): Category | undefined =>
  categoryIndex.get(id as CategoryId);

export const categoryName = (id: string): string => categoryIndex.get(id as CategoryId)?.name ?? id;
