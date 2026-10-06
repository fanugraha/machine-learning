import { cx } from '../../utils/cx.js';

const TONES = {
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  neutral: 'bg-surface-secondary text-ink-secondary',
};

// Label status kecil. tone: success | warning | neutral
export function Chip({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cx('inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium', TONES[tone], className)}
    >
      {children}
    </span>
  );
}

// Chip untuk memilih/menyaring.
export function FilterChip({ selected, className, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        'h-9 rounded-full border px-4 text-sm font-medium transition',
        selected
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : 'border-line-secondary bg-white text-ink-secondary hover:bg-surface-secondary',
        className,
      )}
      {...props}
    />
  );
}
