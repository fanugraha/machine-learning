import { cx } from '../../utils/cx.js';

function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={cx('animate-spin', className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-90" />
    </svg>
  );
}

// variant: primary | secondary | ghost — size: lg | md
export function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  loadingText = 'Memproses...',
  disabled,
  className,
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cx('btn', `btn-${variant}`, `btn-${size}`, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
