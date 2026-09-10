import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: ReactNode;
  /** Supporting line under the title. */
  description?: ReactNode;
  /** Optional "see all" affordance on the trailing edge. */
  action?: { label: string; to: string };
  /** Heading level, so each page keeps a correct outline. */
  level?: 1 | 2 | 3;
  align?: 'start' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Section title block. Every band on the site uses this so heading size, spacing
 * and the "see all" link stay identical throughout.
 */
export function SectionHeading({
  title,
  description,
  action,
  level = 2,
  align = 'start',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const Tag = (['h1', 'h2', 'h3'] as const)[level - 1];
  const centred = align === 'center';

  return (
    <div
      className={`mb-8 flex flex-col gap-3 sm:mb-10 ${
        centred ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'
      } ${className}`}
    >
      <div className={`flex flex-col gap-2 ${centred ? 'items-center' : ''}`}>
        <Tag className={tone === 'dark' ? 'text-white' : 'text-ink'}>{title}</Tag>
        {description && (
          <p
            className={`max-w-[60ch] text-body ${
              tone === 'dark' ? 'text-white/70' : 'text-slate'
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          to={action.to}
          className={`group inline-flex shrink-0 items-center gap-1.5 text-small font-medium ${
            tone === 'dark' ? 'text-white' : 'text-accent'
          }`}
        >
          {action.label}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-fast ease-premium group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
