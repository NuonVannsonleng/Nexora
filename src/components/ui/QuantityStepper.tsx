import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  /** Accessible name, e.g. "Quantity for iPhone 15 Pro". */
  label: string;
  max?: number;
}

/**
 * Minus / value / plus control for cart quantities.
 *
 * The live count is announced via `aria-live` so keyboard and screen-reader users
 * hear the new quantity after pressing a button. Minus at 1 removes the line,
 * which is why it is never disabled at the lower bound.
 */
export function QuantityStepper({ value, onChange, label, max = 10 }: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-pill border border-hairline"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label={value === 1 ? `Remove, ${label}` : `Decrease ${label}`}
        className="grid h-9 w-9 place-items-center rounded-l-pill text-slate transition-colors duration-fast hover:bg-haze hover:text-ink"
      >
        <Minus aria-hidden="true" className="h-3.5 w-3.5" />
      </button>

      <span aria-live="polite" className="tabular w-8 text-center text-small font-medium">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        className="grid h-9 w-9 place-items-center rounded-r-pill text-slate transition-colors duration-fast hover:bg-haze hover:text-ink disabled:opacity-40"
      >
        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
