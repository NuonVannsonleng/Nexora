import type { CategoryId, Product } from './types';
import credits from '../../public/assets/products/credits.json';
import type { PhotoCredit } from './types';

/**
 * The catalogue.
 *
 * Product names, models, colourways, release years and headline specifications
 * describe real shipping hardware. Where Wikimedia Commons only had a photograph of
 * a particular generation, the entry names that generation rather than labelling the
 * photo as a newer model — so the name, the specs and the picture always agree.
 *
 * Prices, stock and review counts are DEMO VALUES. Nothing here is wired to a live
 * retail API; see PRICING_DISCLAIMER, which the UI shows wherever money appears.
 */

export const PRICING_DISCLAIMER =
  'Prices, availability and ratings shown in this store are sample data for demonstration only and are not live retail figures.';

export const PROMO_DISCLAIMER =
  'Sample promotion. Reference prices are illustrative and do not represent a real offer.';

const photoCredits = credits as Record<string, PhotoCredit>;

export const products: Product[] = [
  /* ---------------------------------------------------------------- Apple */
  {
    id: 'iphone-15-pro',
    brandId: 'apple',
    name: 'iPhone 15 Pro',
    model: 'A2848',
    category: 'phones',
    description:
      'Titanium design with the A17 Pro chip, a 48MP Main camera and a customisable Action button.',
    image: '/assets/products/iphone-15-pro',
    imageWidth: 1200,
    imageHeight: 900,
    price: 999,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 2417,
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    specifications: {
      display: '6.1-inch Super Retina XDR, 120Hz ProMotion',
      processor: 'Apple A17 Pro',
      storage: '128GB / 256GB / 512GB / 1TB',
      camera: '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      battery: 'Up to 23 hours video playback',
      connectivity: '5G, Wi-Fi 6E, USB-C (USB 3)',
      os: 'iOS',
      weight: '187 g',
    },
    badge: 'Popular',
    featured: true,
    inStock: true,
    releaseYear: 2023,
  },
  {
    id: 'macbook-air-m2',
    brandId: 'apple',
    name: 'MacBook Air',
    model: 'M2, 13-inch',
    category: 'laptops',
    description:
      'A strikingly thin fanless design with the M2 chip and up to 18 hours of battery life.',
    image: '/assets/products/macbook-air-m2',
    imageWidth: 1200,
    imageHeight: 1200,
    price: 1099,
    originalPrice: 1199,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 3180,
    colors: ['Midnight', 'Starlight', 'Space Gray', 'Silver'],
    specifications: {
      display: '13.6-inch Liquid Retina, 2560x1664',
      processor: 'Apple M2, 8-core CPU',
      memory: '8GB / 16GB / 24GB unified memory',
      storage: '256GB – 2TB SSD',
      battery: 'Up to 18 hours',
      connectivity: 'Wi-Fi 6, Thunderbolt / USB 4, MagSafe 3',
      os: 'macOS',
      weight: '1.24 kg',
    },
    badge: 'Sale',
    featured: true,
    inStock: true,
    releaseYear: 2022,
  },
  {
    id: 'macbook-pro-16',
    brandId: 'apple',
    name: 'MacBook Pro 16-inch',
    model: 'M1 Pro',
    category: 'laptops',
    description:
      'A Liquid Retina XDR display, extensive port selection and M1 Pro performance for heavy workloads.',
    image: '/assets/products/macbook-pro-16',
    imageWidth: 1200,
    imageHeight: 900,
    price: 2199,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 1465,
    colors: ['Space Gray', 'Silver'],
    specifications: {
      display: '16.2-inch Liquid Retina XDR, 120Hz ProMotion',
      processor: 'Apple M1 Pro, 10-core CPU',
      memory: '16GB / 32GB unified memory',
      storage: '512GB – 8TB SSD',
      battery: 'Up to 21 hours video playback',
      connectivity: 'Wi-Fi 6, 3x Thunderbolt 4, HDMI, SDXC, MagSafe 3',
      os: 'macOS',
      weight: '2.15 kg',
    },
    inStock: true,
    releaseYear: 2021,
  },
  {
    id: 'ipad-pro-11',
    brandId: 'apple',
    name: 'iPad Pro 11-inch',
    model: 'M5',
    category: 'tablets',
    description:
      'An Ultra Retina XDR display with M5 performance, Apple Pencil Pro and Magic Keyboard support.',
    image: '/assets/products/ipad-pro-11',
    imageWidth: 1200,
    imageHeight: 1680,
    price: 999,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 1902,
    colors: ['Space Black', 'Silver'],
    specifications: {
      display: '11-inch Ultra Retina XDR, 120Hz ProMotion',
      processor: 'Apple M5',
      storage: '256GB – 2TB',
      camera: '12MP Wide rear, 12MP Centre Stage front',
      battery: 'Up to 10 hours web browsing',
      connectivity: 'Wi-Fi, USB-C (Thunderbolt), optional 5G',
      os: 'iPadOS',
    },
    featured: true,
    inStock: true,
    releaseYear: 2025,
  },
  {
    id: 'apple-watch-s9',
    brandId: 'apple',
    name: 'Apple Watch Series 9',
    category: 'smartwatches',
    description:
      'The S9 chip brings a brighter display and the double tap gesture for one-handed control.',
    image: '/assets/products/apple-watch-s9',
    imageWidth: 1200,
    imageHeight: 900,
    price: 399,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 2064,
    colors: ['Midnight', 'Starlight', 'Silver', 'Pink', '(PRODUCT)RED'],
    specifications: {
      display: 'Always-On Retina LTPO OLED, up to 2000 nits',
      processor: 'Apple S9 SiP',
      storage: '64GB',
      battery: 'Up to 18 hours, 36 hours in Low Power Mode',
      connectivity: 'Wi-Fi, Bluetooth 5.3, optional cellular',
      os: 'watchOS',
    },
    badge: 'New',
    inStock: true,
    releaseYear: 2023,
  },
  {
    id: 'airpods-pro-2',
    brandId: 'apple',
    name: 'AirPods Pro',
    model: '2nd generation',
    category: 'headphones',
    description:
      'Active Noise Cancellation and Adaptive Transparency, driven by the H2 chip.',
    image: '/assets/products/airpods-pro-2',
    imageWidth: 1200,
    imageHeight: 900,
    price: 249,
    originalPrice: 279,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 5321,
    colors: ['White'],
    specifications: {
      processor: 'Apple H2',
      battery: 'Up to 6 hours listening, 30 hours with case',
      connectivity: 'Bluetooth 5.3',
      audio: 'Active Noise Cancellation, Adaptive Transparency, Personalised Spatial Audio',
      weight: '5.3 g per bud',
    },
    badge: 'Sale',
    inStock: true,
    releaseYear: 2022,
  },

  /* -------------------------------------------------------------- Samsung */
  {
    id: 'galaxy-s24-ultra',
    brandId: 'samsung',
    name: 'Galaxy S24 Ultra',
    model: 'SM-S928',
    category: 'phones',
    description:
      'A titanium frame, built-in S Pen and a 200MP main camera with a flat Gorilla Armor display.',
    image: '/assets/products/galaxy-s24-ultra',
    imageWidth: 1200,
    imageHeight: 2133,
    price: 1299,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 1873,
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow'],
    specifications: {
      display: '6.8-inch QHD+ Dynamic AMOLED 2X, 1–120Hz',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      memory: '12GB',
      storage: '256GB / 512GB / 1TB',
      camera: '200MP Wide, 12MP Ultra Wide, 50MP + 10MP Telephoto',
      battery: '5000 mAh',
      connectivity: '5G, Wi-Fi 7, USB-C',
      os: 'Android',
      weight: '232 g',
    },
    badge: 'Popular',
    featured: true,
    inStock: true,
    releaseYear: 2024,
  },
  {
    id: 'galaxy-z-fold5',
    brandId: 'samsung',
    name: 'Galaxy Z Fold5',
    model: 'SM-F946',
    category: 'phones',
    description:
      'A book-style foldable with a 7.6-inch main screen and a gapless Flex Hinge.',
    image: '/assets/products/galaxy-z-fold5',
    imageWidth: 1200,
    imageHeight: 674,
    price: 1799,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 742,
    colors: ['Icy Blue', 'Phantom Black', 'Cream'],
    specifications: {
      display: '7.6-inch main AMOLED 120Hz, 6.2-inch cover display',
      processor: 'Snapdragon 8 Gen 2 for Galaxy',
      memory: '12GB',
      storage: '256GB / 512GB / 1TB',
      camera: '50MP Wide, 12MP Ultra Wide, 10MP Telephoto',
      battery: '4400 mAh',
      connectivity: '5G, Wi-Fi 6E, USB-C',
      os: 'Android',
      weight: '253 g',
    },
    inStock: true,
    releaseYear: 2023,
  },
  {
    id: 'galaxy-tab-s9',
    brandId: 'samsung',
    name: 'Galaxy Tab S9',
    model: 'SM-X710',
    category: 'tablets',
    description:
      'A Dynamic AMOLED 2X tablet with an included S Pen and IP68 water resistance.',
    image: '/assets/products/galaxy-tab-s9',
    imageWidth: 1200,
    imageHeight: 931,
    price: 799,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 611,
    colors: ['Graphite', 'Beige'],
    specifications: {
      display: '11-inch Dynamic AMOLED 2X, 120Hz',
      processor: 'Snapdragon 8 Gen 2 for Galaxy',
      memory: '8GB / 12GB',
      storage: '128GB / 256GB, microSD expandable',
      battery: '8400 mAh',
      connectivity: 'Wi-Fi 6E, USB-C, optional 5G',
      os: 'Android',
      weight: '498 g',
    },
    inStock: true,
    releaseYear: 2023,
  },
  {
    id: 'galaxy-watch6',
    brandId: 'samsung',
    name: 'Galaxy Watch6',
    model: 'SM-R930',
    category: 'smartwatches',
    description:
      'A slimmer bezel and larger display with advanced sleep coaching and body composition tracking.',
    image: '/assets/products/galaxy-watch6',
    imageWidth: 1200,
    imageHeight: 1600,
    price: 299,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 934,
    colors: ['Graphite', 'Gold', 'Silver'],
    specifications: {
      display: '1.3-inch or 1.5-inch Super AMOLED, up to 2000 nits',
      processor: 'Exynos W930',
      memory: '2GB',
      storage: '16GB',
      battery: '300 mAh (40mm) / 425 mAh (44mm)',
      connectivity: 'Wi-Fi, Bluetooth 5.3, optional LTE',
      os: 'Wear OS',
    },
    inStock: true,
    releaseYear: 2023,
  },
  {
    id: 'galaxy-buds2-pro',
    brandId: 'samsung',
    name: 'Galaxy Buds2 Pro',
    model: 'SM-R510',
    category: 'headphones',
    description:
      '24-bit Hi-Fi audio with intelligent active noise cancelling in a smaller, lighter shell.',
    image: '/assets/products/galaxy-buds2-pro',
    imageWidth: 1200,
    imageHeight: 801,
    price: 229,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 1288,
    colors: ['Graphite', 'White', 'Bora Purple'],
    specifications: {
      battery: 'Up to 5 hours with ANC, 18 hours with case',
      connectivity: 'Bluetooth 5.3',
      audio: '24-bit Hi-Fi, intelligent ANC, 360 Audio',
      weight: '5.5 g per bud',
    },
    inStock: true,
    releaseYear: 2022,
  },

  /* ----------------------------------------------------------------- Sony */
  {
    id: 'sony-a7-iv',
    brandId: 'sony',
    name: 'Alpha 7 IV',
    model: 'ILCE-7M4',
    category: 'cameras',
    description:
      'A 33MP full-frame hybrid with 4K 60p recording and Real-time Eye AF for stills and video.',
    image: '/assets/products/sony-a7-iv',
    imageWidth: 1200,
    imageHeight: 904,
    price: 2498,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 706,
    colors: ['Black'],
    specifications: {
      processor: 'BIONZ XR',
      camera: '33MP full-frame Exmor R CMOS sensor',
      display: '3.0-inch vari-angle touchscreen, 3.68M-dot EVF',
      storage: 'Dual slots: CFexpress Type A / SD UHS-II',
      battery: 'NP-FZ100, approx. 580 shots',
      connectivity: 'Wi-Fi, Bluetooth, USB-C, HDMI',
      weight: '658 g with battery and card',
    },
    featured: true,
    inStock: true,
    releaseYear: 2021,
  },
  {
    id: 'sony-wh-ch510',
    brandId: 'sony',
    name: 'WH-CH510',
    category: 'headphones',
    description:
      'Lightweight on-ear wireless headphones with up to 35 hours of battery life.',
    image: '/assets/products/sony-wh-ch510',
    imageWidth: 1200,
    imageHeight: 898,
    price: 59,
    originalPrice: 79,
    currency: 'USD',
    rating: 4.4,
    reviewCount: 3410,
    colors: ['Black', 'White', 'Blue'],
    specifications: {
      battery: 'Up to 35 hours',
      connectivity: 'Bluetooth 5.0, USB-C charging',
      audio: '30mm drivers, 20Hz–20kHz',
      weight: '132 g',
    },
    badge: 'Sale',
    inStock: true,
    releaseYear: 2019,
  },
  {
    id: 'sony-bravia-w60',
    brandId: 'sony',
    name: 'BRAVIA W60',
    model: 'KDL-24W60',
    category: 'tvs',
    description:
      'A compact BRAVIA LED television suited to a desk, bedroom or second-room setup.',
    image: '/assets/products/sony-bravia-w60',
    imageWidth: 1200,
    imageHeight: 1600,
    price: 249,
    currency: 'USD',
    rating: 4.1,
    reviewCount: 187,
    colors: ['Black'],
    specifications: {
      display: '24-inch LED, 1366x768',
      connectivity: 'HDMI, USB, Wi-Fi',
      audio: 'Integrated stereo speakers',
    },
    inStock: false,
    releaseYear: 2014,
  },

  /* ------------------------------------------------------------ PlayStation */
  {
    id: 'playstation-5',
    brandId: 'playstation',
    name: 'PlayStation 5',
    model: 'CFI-1000A',
    category: 'gaming',
    description:
      'An ultra-high-speed SSD, ray tracing and the DualSense controller with haptic feedback.',
    image: '/assets/products/playstation-5',
    imageWidth: 1200,
    imageHeight: 1600,
    price: 499,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 8940,
    colors: ['White'],
    specifications: {
      processor: 'Custom 8-core AMD Zen 2, 3.5GHz',
      memory: '16GB GDDR6',
      storage: '825GB custom NVMe SSD',
      connectivity: 'Wi-Fi 6, Bluetooth 5.1, HDMI 2.1, Gigabit Ethernet',
      display: 'Up to 4K 120Hz, 8K output support',
      weight: '4.5 kg',
    },
    badge: 'Popular',
    featured: true,
    inStock: true,
    releaseYear: 2020,
  },

  /* ------------------------------------------------------------ Microsoft */
  {
    id: 'surface-laptop-studio',
    brandId: 'microsoft',
    name: 'Surface Laptop Studio',
    category: 'laptops',
    description:
      'A dynamic woven hinge pulls the display forward for drawing, watching or coding.',
    image: '/assets/products/surface-laptop-studio',
    imageWidth: 1200,
    imageHeight: 900,
    price: 1599,
    currency: 'USD',
    rating: 4.4,
    reviewCount: 512,
    colors: ['Platinum'],
    specifications: {
      display: '14.4-inch PixelSense Flow, 2400x1600, 120Hz',
      processor: 'Intel Core i5-11300H / i7-11370H',
      memory: '16GB / 32GB LPDDR4x',
      storage: '256GB – 2TB SSD',
      battery: 'Up to 19 hours',
      connectivity: 'Wi-Fi 6, 2x Thunderbolt 4, Surface Connect',
      os: 'Windows',
      weight: '1.74 kg',
    },
    inStock: true,
    releaseYear: 2021,
  },

  /* ----------------------------------------------------------------- Xbox */
  {
    id: 'xbox-series-x',
    brandId: 'xbox',
    name: 'Xbox Series X',
    category: 'gaming',
    description:
      '12 teraflops of processing power with Quick Resume and true 4K gaming.',
    image: '/assets/products/xbox-series-x',
    imageWidth: 1090,
    imageHeight: 1279,
    price: 499,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 6215,
    colors: ['Black'],
    specifications: {
      processor: 'Custom 8-core AMD Zen 2, 3.8GHz',
      memory: '16GB GDDR6',
      storage: '1TB custom NVMe SSD',
      connectivity: 'Wi-Fi 5, HDMI 2.1, Gigabit Ethernet',
      display: 'Up to 4K 120Hz, 8K output support',
      weight: '4.45 kg',
    },
    featured: true,
    inStock: true,
    releaseYear: 2020,
  },

  /* --------------------------------------------------------------- Google */
  {
    id: 'pixel-8-pro',
    brandId: 'google',
    name: 'Pixel 8 Pro',
    model: 'G1MNW',
    category: 'phones',
    description:
      'The Tensor G3 chip with a temperature sensor and a flat Super Actua display.',
    image: '/assets/products/pixel-8-pro',
    imageWidth: 1200,
    imageHeight: 798,
    price: 999,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 1204,
    colors: ['Obsidian', 'Porcelain', 'Bay'],
    specifications: {
      display: '6.7-inch Super Actua LTPO OLED, 1–120Hz',
      processor: 'Google Tensor G3',
      memory: '12GB',
      storage: '128GB / 256GB / 512GB / 1TB',
      camera: '50MP Wide, 48MP Ultra Wide, 48MP Telephoto',
      battery: '5050 mAh',
      connectivity: '5G, Wi-Fi 7, USB-C',
      os: 'Android',
      weight: '213 g',
    },
    badge: 'New',
    inStock: true,
    releaseYear: 2023,
  },
  {
    id: 'pixel-buds-pro',
    brandId: 'google',
    name: 'Pixel Buds Pro',
    category: 'headphones',
    description:
      'Active Noise Cancellation tuned by a custom 6-core audio chip, with Silent Seal.',
    image: '/assets/products/pixel-buds-pro',
    imageWidth: 1200,
    imageHeight: 1594,
    price: 199,
    currency: 'USD',
    rating: 4.4,
    reviewCount: 878,
    colors: ['Charcoal', 'Fog', 'Coral', 'Lemongrass'],
    specifications: {
      battery: 'Up to 7 hours with ANC, 20 hours with case',
      connectivity: 'Bluetooth 5.0, USB-C, wireless charging',
      audio: '11mm drivers, Active Noise Cancellation, Silent Seal',
      weight: '6.2 g per bud',
    },
    inStock: true,
    releaseYear: 2022,
  },
  {
    id: 'pixel-watch',
    brandId: 'google',
    name: 'Pixel Watch',
    category: 'smartwatches',
    description:
      'A domed recycled-steel case with Fitbit health tracking built into Wear OS.',
    image: '/assets/products/pixel-watch',
    imageWidth: 1200,
    imageHeight: 2133,
    price: 349,
    currency: 'USD',
    rating: 4.2,
    reviewCount: 640,
    colors: ['Matte Black', 'Polished Silver', 'Champagne Gold'],
    specifications: {
      display: '1.2-inch AMOLED, up to 1000 nits',
      processor: 'Exynos 9110 with Cortex M33 co-processor',
      memory: '2GB',
      storage: '32GB',
      battery: 'Up to 24 hours',
      connectivity: 'Wi-Fi, Bluetooth 5.0, optional LTE',
      os: 'Wear OS',
    },
    inStock: true,
    releaseYear: 2022,
  },

  /* ----------------------------------------------------------------- ASUS */
  {
    id: 'asus-rog-zephyrus-g14',
    brandId: 'asus',
    name: 'ROG Zephyrus G14',
    category: 'laptops',
    description:
      'A 14-inch gaming notebook built around a CNC-milled chassis and a high-refresh display.',
    image: '/assets/products/asus-rog-zephyrus-g14',
    imageWidth: 1200,
    imageHeight: 1019,
    price: 1599,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 1043,
    colors: ['Eclipse Gray', 'Platinum White'],
    specifications: {
      display: '14-inch ROG Nebula OLED, 120Hz',
      processor: 'AMD Ryzen 9',
      memory: '16GB / 32GB LPDDR5X',
      storage: '1TB PCIe SSD',
      connectivity: 'Wi-Fi 6E, USB4, HDMI 2.1',
      os: 'Windows',
      weight: '1.5 kg',
    },
    badge: 'New',
    inStock: true,
    releaseYear: 2024,
  },
  {
    id: 'asus-zenbook-duo',
    brandId: 'asus',
    name: 'Zenbook Duo',
    model: 'UX481FL',
    category: 'laptops',
    description:
      'A dual-screen notebook pairing the main display with a full-width ScreenPad Plus.',
    image: '/assets/products/asus-zenbook-duo',
    imageWidth: 1200,
    imageHeight: 1200,
    price: 1199,
    currency: 'USD',
    rating: 4.3,
    reviewCount: 288,
    colors: ['Celestial Blue'],
    specifications: {
      display: '14-inch FHD main display plus 12.6-inch ScreenPad Plus',
      processor: 'Intel Core i7-10510U',
      memory: '16GB',
      storage: '1TB PCIe SSD',
      connectivity: 'Wi-Fi 6, USB-C, USB-A, HDMI',
      os: 'Windows',
      weight: '1.5 kg',
    },
    inStock: true,
    releaseYear: 2019,
  },

  /* --------------------------------------------------------------- Lenovo */
  {
    id: 'thinkpad-x1-carbon',
    brandId: 'lenovo',
    name: 'ThinkPad X1 Carbon',
    model: 'Gen 7',
    category: 'laptops',
    description:
      'A carbon-fibre business ultrabook with the classic TrackPoint and a MIL-STD-tested chassis.',
    image: '/assets/products/thinkpad-x1-carbon',
    imageWidth: 1200,
    imageHeight: 800,
    price: 1449,
    originalPrice: 1649,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 1521,
    colors: ['Black'],
    specifications: {
      display: '14-inch FHD or 4K IPS',
      processor: 'Intel Core i5 / i7, 8th generation',
      memory: '8GB / 16GB LPDDR3',
      storage: '256GB – 2TB PCIe SSD',
      battery: 'Up to 18.5 hours',
      connectivity: 'Wi-Fi 5, 2x Thunderbolt 3, HDMI',
      os: 'Windows',
      weight: '1.09 kg',
    },
    badge: 'Sale',
    inStock: true,
    releaseYear: 2019,
  },
  {
    id: 'lenovo-legion-y520',
    brandId: 'lenovo',
    name: 'Legion Y520',
    category: 'laptops',
    description:
      'An entry gaming notebook with dual-channel cooling and a red-backlit keyboard.',
    image: '/assets/products/lenovo-legion-y520',
    imageWidth: 1200,
    imageHeight: 800,
    price: 899,
    currency: 'USD',
    rating: 4.1,
    reviewCount: 402,
    colors: ['Black'],
    specifications: {
      display: '15.6-inch FHD IPS',
      processor: 'Intel Core i5 / i7, 7th generation',
      memory: '8GB / 16GB DDR4',
      storage: 'HDD + SSD configurations',
      connectivity: 'Wi-Fi 5, USB-C, USB-A, HDMI',
      os: 'Windows',
      weight: '2.4 kg',
    },
    inStock: true,
    releaseYear: 2017,
  },

  /* ----------------------------------------------------------------- Dell */
  {
    id: 'dell-xps-13',
    brandId: 'dell',
    name: 'XPS 13',
    model: '9350',
    category: 'laptops',
    description:
      'The InfinityEdge display in a compact aluminium and carbon-fibre body.',
    image: '/assets/products/dell-xps-13',
    imageWidth: 1200,
    imageHeight: 1263,
    price: 999,
    currency: 'USD',
    rating: 4.4,
    reviewCount: 967,
    colors: ['Platinum Silver'],
    specifications: {
      display: '13.3-inch FHD or QHD+ InfinityEdge',
      processor: 'Intel Core i5 / i7, 6th generation',
      memory: '8GB / 16GB LPDDR3',
      storage: '256GB – 1TB PCIe SSD',
      connectivity: 'Wi-Fi 5, Thunderbolt 3, USB-A',
      os: 'Windows',
      weight: '1.2 kg',
    },
    inStock: true,
    releaseYear: 2015,
  },

  /* ------------------------------------------------------------------- HP */
  {
    id: 'hp-spectre-x360',
    brandId: 'hp',
    name: 'Spectre x360',
    model: '13t',
    category: 'laptops',
    description:
      'A convertible with a 360-degree hinge, gem-cut edges and pen support.',
    image: '/assets/products/hp-spectre-x360',
    imageWidth: 1200,
    imageHeight: 1761,
    price: 1149,
    currency: 'USD',
    rating: 4.3,
    reviewCount: 583,
    colors: ['Nightfall Black', 'Poseidon Blue'],
    specifications: {
      display: '13.3-inch FHD or 4K touch',
      processor: 'Intel Core i5 / i7',
      memory: '8GB / 16GB',
      storage: '256GB – 2TB PCIe SSD',
      connectivity: 'Wi-Fi 6, 2x Thunderbolt, USB-A',
      os: 'Windows',
      weight: '1.32 kg',
    },
    inStock: true,
    releaseYear: 2019,
  },

  /* ------------------------------------------------------------- Logitech */
  {
    id: 'logitech-mx-master',
    brandId: 'logitech',
    name: 'MX Master',
    category: 'accessories',
    description:
      'A sculpted productivity mouse with a thumbwheel and Easy-Switch across three devices.',
    image: '/assets/products/logitech-mx-master',
    imageWidth: 1200,
    imageHeight: 800,
    price: 79,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 4102,
    colors: ['Graphite', 'Meteorite'],
    specifications: {
      connectivity: 'Bluetooth Smart and Logitech Unifying receiver',
      battery: 'Rechargeable, up to 40 days per charge',
      weight: '141 g',
    },
    inStock: true,
    releaseYear: 2015,
  },

  /* ------------------------------------------------------------------ JBL */
  {
    id: 'jbl-flip-4',
    brandId: 'jbl',
    name: 'Flip 4',
    category: 'accessories',
    description:
      'A waterproof portable Bluetooth speaker with a 12-hour battery and JBL Connect+.',
    image: '/assets/products/jbl-flip-4',
    imageWidth: 1200,
    imageHeight: 900,
    price: 99,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 6720,
    colors: ['Black', 'Blue', 'Red', 'Teal'],
    specifications: {
      battery: 'Up to 12 hours',
      connectivity: 'Bluetooth 4.2, 3.5mm input',
      audio: 'Dual external passive radiators, IPX7 waterproof',
      weight: '515 g',
    },
    inStock: true,
    releaseYear: 2017,
  },

  /* ----------------------------------------------------------------- Bose */
  {
    id: 'bose-qc-ultra-earbuds',
    brandId: 'bose',
    name: 'QuietComfort Ultra Earbuds',
    category: 'headphones',
    description:
      'Bose Immersive Audio with CustomTune calibration and world-class noise cancellation.',
    image: '/assets/products/bose-qc-ultra-earbuds',
    imageWidth: 1200,
    imageHeight: 1600,
    price: 299,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 1130,
    colors: ['Black', 'White Smoke'],
    specifications: {
      battery: 'Up to 6 hours, 24 hours with case',
      connectivity: 'Bluetooth 5.3',
      audio: 'Bose Immersive Audio, CustomTune, ActiveSense',
    },
    badge: 'New',
    inStock: true,
    releaseYear: 2023,
  },
  {
    id: 'bose-qc35-ii',
    brandId: 'bose',
    name: 'QuietComfort 35 II',
    category: 'headphones',
    description:
      'Over-ear wireless headphones with three levels of noise cancellation and a 20-hour battery.',
    image: '/assets/products/bose-qc35-ii',
    imageWidth: 1200,
    imageHeight: 900,
    price: 199,
    originalPrice: 299,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 9840,
    colors: ['Black', 'Silver'],
    specifications: {
      battery: 'Up to 20 hours wireless',
      connectivity: 'Bluetooth, NFC pairing, 3.5mm cable',
      audio: 'Three levels of active noise cancellation',
      weight: '234 g',
    },
    badge: 'Sale',
    inStock: true,
    releaseYear: 2017,
  },

  /* ---------------------------------------------------------------- Canon */
  {
    id: 'canon-eos-r6-ii',
    brandId: 'canon',
    name: 'EOS R6 Mark II',
    category: 'cameras',
    description:
      'A 24.2MP full-frame sensor with up to 40 fps electronic shutter and 6K oversampled 4K.',
    image: '/assets/products/canon-eos-r6-ii',
    imageWidth: 1200,
    imageHeight: 749,
    price: 2499,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 418,
    colors: ['Black'],
    specifications: {
      processor: 'DIGIC X',
      camera: '24.2MP full-frame CMOS sensor',
      display: '3.0-inch vari-angle touchscreen, 3.69M-dot EVF',
      storage: 'Dual SD UHS-II slots',
      battery: 'LP-E6NH',
      connectivity: 'Wi-Fi, Bluetooth, USB-C, HDMI',
      weight: '670 g with battery and card',
    },
    featured: true,
    inStock: true,
    releaseYear: 2022,
  },

  /* ---------------------------------------------------------------- Nikon */
  {
    id: 'nikon-z6',
    brandId: 'nikon',
    name: 'Z 6',
    category: 'cameras',
    description:
      'A 24.5MP full-frame mirrorless body with in-body stabilisation and the wide Z mount.',
    image: '/assets/products/nikon-z6',
    imageWidth: 1200,
    imageHeight: 800,
    price: 1599,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 852,
    colors: ['Black'],
    specifications: {
      processor: 'EXPEED 6',
      camera: '24.5MP full-frame BSI CMOS sensor',
      display: '3.2-inch tilting touchscreen, 3.69M-dot EVF',
      storage: 'XQD / CFexpress Type B',
      battery: 'EN-EL15b, approx. 310 shots',
      connectivity: 'Wi-Fi, Bluetooth, USB-C, HDMI',
      weight: '675 g with battery and card',
    },
    inStock: true,
    releaseYear: 2018,
  },

  /* ------------------------------------------------------------- Nintendo */
  {
    id: 'nintendo-switch-oled',
    brandId: 'nintendo',
    name: 'Switch',
    model: 'OLED Model',
    category: 'gaming',
    description:
      'A 7-inch OLED screen, wide adjustable stand and 64GB of internal storage.',
    image: '/assets/products/nintendo-switch-oled',
    imageWidth: 1200,
    imageHeight: 901,
    price: 349,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 7430,
    colors: ['White', 'Neon Blue / Neon Red'],
    specifications: {
      display: '7-inch OLED multi-touch, 1280x720',
      processor: 'Custom NVIDIA Tegra',
      storage: '64GB, microSD expandable',
      battery: 'Approx. 4.5–9 hours',
      connectivity: 'Wi-Fi, Bluetooth, USB-C, dock with LAN port',
      weight: '420 g with Joy-Con',
    },
    badge: 'Popular',
    inStock: true,
    releaseYear: 2021,
  },
];

/* ------------------------------------------------------------------ lookups */

/**
 * Overwrite each product's declared image dimensions with the real dimensions of
 * the processed 1200px render, recorded by scripts/fetch-assets.mjs.
 *
 * The catalogue keeps the fields so the type stays self-describing, but this pass
 * is the source of truth — swapping a product photo can never leave a stale
 * width/height behind to cause layout shift.
 */
for (const product of products) {
  const credit = photoCredits[product.id];
  if (credit?.width && credit?.height) {
    product.imageWidth = credit.width;
    product.imageHeight = credit.height;
  }
}

const productIndex = new Map(products.map((p) => [p.id, p]));

export const getProduct = (id: string): Product | undefined => productIndex.get(id);

export const getProductsByBrand = (brandId: string): Product[] =>
  products.filter((p) => p.brandId === brandId);

export const getProductsByCategory = (category: CategoryId): Product[] =>
  products.filter((p) => p.category === category);

export const featuredProducts = products.filter((p) => p.featured);

/** Sample promotion: the products carrying a demo reference price. */
export const dealProducts = products.filter((p) => p.originalPrice !== undefined);

/** Newest catalogue additions, by real announcement year. */
export const newArrivals = [...products]
  .sort((a, b) => b.releaseYear - a.releaseYear)
  .slice(0, 8);

/**
 * "Popular picks" — ordered by the demo review count. Deliberately not called
 * "best sellers": this store has no real sales data to support that claim.
 */
export const popularPicks = [...products]
  .sort((a, b) => b.reviewCount - a.reviewCount)
  .slice(0, 8);

/** Percentage saved against the demo reference price, rounded. */
export const discountPercent = (p: Product): number | undefined =>
  p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : undefined;

export const priceRange = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};

/** Commons attribution for a product photo, if one was recorded. */
export const getPhotoCredit = (productId: string): PhotoCredit | undefined =>
  photoCredits[productId];

export const allPhotoCredits = photoCredits;
