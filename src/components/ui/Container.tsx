import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

interface OwnProps {
  children: ReactNode;
  /** Renders as a different element so sections keep their semantics. */
  as?: ElementType;
  className?: string;
  /** Narrower measure for reading-width content such as support copy. */
  width?: 'default' | 'narrow';
}

/**
 * Anything else — `aria-labelledby`, `id`, `role` — is forwarded to the rendered
 * element. Without this, a `<Container as="section" aria-labelledby="…">` would
 * silently drop the attribute and leave the landmark with no accessible name.
 */
type ContainerProps = OwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof OwnProps | 'style'>;

/**
 * The single source of horizontal rhythm. Every section's content sits inside one
 * of these, so the site keeps one max-width and one responsive gutter throughout
 * and product grids never stretch to the full viewport.
 */
export function Container({
  children,
  as: Tag = 'div',
  className = '',
  width = 'default',
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${className}`}
      style={{
        maxWidth: width === 'narrow' ? '760px' : 'var(--container-max)',
        paddingInline: 'var(--container-pad)',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
