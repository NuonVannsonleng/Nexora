import { Link } from 'react-router-dom';
import { footerGroups, socialLinks, STORE_NAME, STORE_TAGLINE } from '../../data/footer';
import { PRICING_DISCLAIMER } from '../../data/products';
import { Container } from '../ui/Container';
import { StoreLogo } from '../ui/StoreLogo';

/** Inline social glyphs — generic platform marks, not brand product logos. */
function SocialIcon({ platform }: { platform: string }) {
  const common = { viewBox: '0 0 24 24', 'aria-hidden': true, className: 'h-4 w-4' } as const;
  if (platform === 'x') {
    return (
      <svg {...common} fill="currentColor">
        <path d="M18.9 2H22l-7.3 8.3L22.8 22h-6.2l-4.9-6.4L6 22H2.9l7.6-8.7L1.6 2h6.3l4.6 6L18.9 2Zm-1.1 18h1.7L6.3 3.8H4.5L17.8 20Z" />
      </svg>
    );
  }
  if (platform === 'instagram') {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.8" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="currentColor">
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2L10 15.2Z" />
    </svg>
  );
}

/**
 * Site footer: shop / brands / support / company columns, then the store's own
 * identity, the demo-data disclosure and photo attribution.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-hairline bg-haze">
      <Container className="py-14">
        {/* One column below 360px: two columns of link lists leave the uppercase
            headings too little room and push the page wider than the viewport. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 min-[360px]:grid-cols-2 sm:grid-cols-4">
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="mb-3 break-words text-micro font-semibold uppercase tracking-[0.08em] text-slate">
                {group.title}
              </h2>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.to}-${link.label}`}>
                    <Link
                      to={link.to}
                      className="text-small text-ink transition-colors duration-fast hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="my-10 border-0 border-t border-hairline" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Link to="/" aria-label={`${STORE_NAME} home`} className="text-ink">
              <StoreLogo height={20} />
            </Link>
            <p className="text-small text-slate">{STORE_TAGLINE}</p>
          </div>

          <ul className="m-0 flex list-none items-center gap-2 p-0">
            {socialLinks.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-hairline text-slate transition-colors duration-fast hover:border-ink hover:text-ink"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclosures. This is a portfolio build, so say so plainly rather than
            implying a live retailer. */}
        <div className="mt-10 flex flex-col gap-2 text-micro leading-relaxed text-slate">
          <p>
            {STORE_NAME} is an independent multi-brand demonstration store and is not
            affiliated with, endorsed by or operated by Apple, Samsung, Sony, Google,
            Microsoft or any other manufacturer shown. All product names, logos and brands
            are the property of their respective owners and are used here to identify the
            products offered.
          </p>
          <p>{PRICING_DISCLAIMER}</p>
          <p>
            Product photography sourced from{' '}
            <a
              href="https://commons.wikimedia.org"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2 hover:text-ink"
            >
              Wikimedia Commons
            </a>{' '}
            under its contributors&rsquo; respective free licences.
          </p>
          <p className="mt-2">
            &copy; {year} {STORE_NAME}. A portfolio project.
          </p>
        </div>
      </Container>
    </footer>
  );
}
