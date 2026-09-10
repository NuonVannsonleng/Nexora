/**
 * The design tokens themselves live in src/styles/variables.css; this file maps
 * them onto named Tailwind utilities.
 *
 * They are registered here rather than used as arbitrary values because Tailwind
 * v3 does not support the bare `text-[--token]` shorthand — that syntax compiles
 * to nothing at all, silently dropping the style. Named utilities (`text-small`,
 * `rounded-md`, `duration-fast`) keep the token as the single source of truth and
 * fail loudly if the name is wrong.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--c-ink)',           // primary text — near-black, softer than pure black
        slate: 'var(--c-slate)',       // secondary text
        haze: 'var(--c-haze)',         // section background
        hairline: 'var(--c-hairline)', // borders
        accent: {
          DEFAULT: 'var(--c-accent)',
          hover: 'var(--c-accent-hover)',
          press: 'var(--c-accent-press)',
        },
        deal: 'var(--c-deal)',       // savings / price-drop text
        instock: 'var(--c-instock)',
      },
      fontSize: {
        display: 'var(--t-display)',
        h1: 'var(--t-h1)',
        h2: 'var(--t-h2)',
        h3: 'var(--t-h3)',
        body: 'var(--t-body)',
        small: 'var(--t-small)',
        micro: 'var(--t-micro)',
      },
      fontFamily: {
        sans: [
          '"Inter var"', 'Inter',
          // SF on Apple platforms, Segoe on Windows, Roboto on Android.
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
      },
      boxShadow: {
        card: 'var(--sh-card)',
        'card-hover': 'var(--sh-card-hover)',
        drawer: 'var(--sh-drawer)',
      },
      transitionDuration: {
        fast: 'var(--d-fast)',
        base: 'var(--d-base)',
        slow: 'var(--d-slow)',
      },
      transitionTimingFunction: {
        // Apple-ish ease: slow out, quick settle.
        premium: 'var(--e-premium)',
      },
      spacing: {
        gutter: 'var(--container-pad)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
    },
  },
  plugins: [],
};
