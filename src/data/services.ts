/**
 * Store services.
 *
 * `status` distinguishes what this demo actually implements from what a real
 * deployment would need a backend for. The UI renders that distinction rather than
 * presenting every service as live.
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: 'truck' | 'store' | 'headset' | 'shield' | 'refresh' | 'settings' | 'recycle';
  /** 'demo' services are illustrative UI only; nothing is fulfilled. */
  status: 'demo';
}

export const services: Service[] = [
  {
    id: 'shipping',
    title: 'Free delivery',
    description: 'Complimentary standard delivery on every order over $99.',
    icon: 'truck',
    status: 'demo',
  },
  {
    id: 'pickup',
    title: 'Store pickup',
    description: 'Reserve online and collect from a NEXORA store, usually same day.',
    icon: 'store',
    status: 'demo',
  },
  {
    id: 'support',
    title: 'Technical support',
    description: 'Talk to a specialist about setup, transfers and troubleshooting.',
    icon: 'headset',
    status: 'demo',
  },
  {
    id: 'warranty',
    title: 'Warranty cover',
    description: 'Manufacturer warranty on all products, with optional extended cover.',
    icon: 'shield',
    status: 'demo',
  },
  {
    id: 'returns',
    title: 'Easy returns',
    description: 'Changed your mind? Return any unopened item within 14 days.',
    icon: 'refresh',
    status: 'demo',
  },
  {
    id: 'setup',
    title: 'Device setup',
    description: 'We will configure your new device and move your data across.',
    icon: 'settings',
    status: 'demo',
  },
  {
    id: 'tradein',
    title: 'Trade in',
    description: 'Estimate the value of your current device towards an upgrade.',
    icon: 'recycle',
    status: 'demo',
  },
];

/**
 * Sample store locations.
 *
 * These are illustrative addresses for a fictional retailer — NEXORA has no
 * physical stores. The locator filters this list by text; it never requests the
 * visitor's real location.
 */
export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  region: string;
  address: string;
  hours: string;
  phone: string;
}

export const storeLocations: StoreLocation[] = [
  {
    id: 'sf-union',
    name: 'NEXORA Union Square',
    city: 'San Francisco',
    region: 'California',
    address: '210 Post Street, San Francisco, CA 94108',
    hours: 'Mon–Sat 10:00–20:00, Sun 11:00–18:00',
    phone: '+1 415 000 0100',
  },
  {
    id: 'ny-soho',
    name: 'NEXORA SoHo',
    city: 'New York',
    region: 'New York',
    address: '480 Broadway, New York, NY 10013',
    hours: 'Mon–Sat 10:00–21:00, Sun 11:00–19:00',
    phone: '+1 212 000 0140',
  },
  {
    id: 'chi-mile',
    name: 'NEXORA Michigan Avenue',
    city: 'Chicago',
    region: 'Illinois',
    address: '640 N Michigan Ave, Chicago, IL 60611',
    hours: 'Mon–Sat 10:00–20:00, Sun 11:00–18:00',
    phone: '+1 312 000 0175',
  },
  {
    id: 'ldn-regent',
    name: 'NEXORA Regent Street',
    city: 'London',
    region: 'United Kingdom',
    address: '235 Regent Street, London W1B 2EL',
    hours: 'Mon–Sat 10:00–21:00, Sun 12:00–18:00',
    phone: '+44 20 0000 0190',
  },
  {
    id: 'ber-mitte',
    name: 'NEXORA Mitte',
    city: 'Berlin',
    region: 'Germany',
    address: 'Friedrichstraße 140, 10117 Berlin',
    hours: 'Mon–Sat 10:00–20:00, closed Sunday',
    phone: '+49 30 0000 0210',
  },
  {
    id: 'tok-ginza',
    name: 'NEXORA Ginza',
    city: 'Tokyo',
    region: 'Japan',
    address: '5-2-1 Ginza, Chuo City, Tokyo 104-0061',
    hours: 'Daily 10:00–21:00',
    phone: '+81 3 0000 0260',
  },
  {
    id: 'syd-george',
    name: 'NEXORA George Street',
    city: 'Sydney',
    region: 'Australia',
    address: '367 George Street, Sydney NSW 2000',
    hours: 'Mon–Sat 09:30–19:00, Sun 10:00–18:00',
    phone: '+61 2 0000 0300',
  },
  {
    id: 'tor-eaton',
    name: 'NEXORA Eaton Centre',
    city: 'Toronto',
    region: 'Canada',
    address: '220 Yonge Street, Toronto, ON M5B 2H1',
    hours: 'Mon–Sat 10:00–21:00, Sun 11:00–19:00',
    phone: '+1 416 000 0330',
  },
];

export const STORE_LOCATOR_DISCLAIMER =
  'NEXORA is a demonstration store. The locations listed below are sample data and are not real retail outlets.';
