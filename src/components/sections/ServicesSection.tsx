import {
  Headset,
  RefreshCw,
  Settings,
  Shield,
  Store,
  Recycle,
  Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { services } from '../../data/services';
import { Container } from '../ui/Container';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SectionHeading } from '../ui/SectionHeading';

const icons: Record<string, LucideIcon> = {
  truck: Truck,
  store: Store,
  headset: Headset,
  shield: Shield,
  refresh: RefreshCw,
  settings: Settings,
  recycle: Recycle,
};

/**
 * Store services.
 *
 * Every entry in this demo is UI only — nothing is fulfilled — so the section
 * states that once at the top rather than tagging each card.
 */
export function ServicesSection() {
  return (
    <section
      aria-labelledby="services-heading"
      className="bg-haze"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <Container>
        <SectionHeading
          title={<span id="services-heading">Shopping with NEXORA</span>}
          description="What a NEXORA order would include. These services are demonstration UI in this build — no order is fulfilled and no payment is taken."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = icons[service.icon] ?? Truck;
            return (
              <ScrollReveal key={service.id} as="li" delay={index * 60} className="flex">
                <article className="flex flex-1 flex-col gap-3 rounded-md bg-white p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-haze">
                    <Icon aria-hidden="true" className="h-5 w-5 text-ink" />
                  </span>
                  <h3 className="text-[1.0625rem] font-semibold">{service.title}</h3>
                  <p className="text-small leading-relaxed text-slate">
                    {service.description}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
