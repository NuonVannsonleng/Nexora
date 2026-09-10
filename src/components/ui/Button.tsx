import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'buy';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap ' +
  'transition-[background-color,color,border-color,opacity] duration-fast ease-premium ' +
  'disabled:opacity-40 disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  // Solid near-black: the default forward action.
  primary: 'bg-ink text-white hover:bg-black active:bg-black/90',
  // Light fill for a second action beside a primary one.
  secondary: 'bg-haze text-ink hover:bg-hairline/60 active:bg-hairline',
  outline: 'border border-hairline text-ink hover:border-ink active:bg-haze',
  // Text-only: tertiary actions and links inside cards.
  ghost: 'text-accent hover:underline underline-offset-4',
  // Reserved for the purchase action so it reads differently from navigation.
  buy: 'bg-accent text-white hover:bg-accent-hover active:bg-accent-press',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'text-[0.8125rem] px-4 h-8',
  md: 'text-[0.9375rem] px-5 h-11',
  lg: 'text-[1.0625rem] px-7 h-[52px]',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretches to the container width — used in drawers and mobile layouts. */
  block?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined };
// Navigating variants still accept an onClick so a caller can, say, close a drawer
// on the way out.
type LinkProps = CommonProps & { to: string; href?: undefined; onClick?: MouseEventHandler<HTMLAnchorElement> };
type AnchorProps = CommonProps & { href: string; to?: undefined; onClick?: MouseEventHandler<HTMLAnchorElement> };

const classesFor = ({ variant = 'primary', size = 'md', block, className = '' }: CommonProps) =>
  [base, variants[variant], sizes[size], 'rounded-pill', block ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ');

/**
 * One button surface for the whole store, rendered as a <button>, a router
 * <Link> or an <a> depending on which of `to` / `href` is supplied — so a
 * navigating control is still a real link for keyboard and middle-click.
 */
export function Button(props: ButtonProps | LinkProps | AnchorProps) {
  const { variant, size, block, className, children } = props;
  const classes = classesFor({ variant, size, block, className, children });

  if ('to' in props && props.to !== undefined) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href !== undefined) {
    return (
      <a
        href={props.href}
        className={classes}
        onClick={props.onClick}
        target="_blank"
        rel="noreferrer noopener"
      >
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, block: _b, className: _c, children: _ch, ...rest } =
    props as ButtonProps;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
