import { useEffect } from 'react';
import { cx } from '../../utils/cx.js';

const PANEL = {
  modal: 'lg:w-[520px] lg:rounded-xl',
  confirm: 'lg:w-[440px] lg:rounded-xl',
  drawer: 'lg:h-full lg:max-h-none lg:w-[420px] lg:rounded-none',
};

// Lapisan di atas halaman. Mobile: bottom sheet. Desktop: modal tengah, atau panel kanan (drawer).
// Isi panel diatur pemanggil. Esc dan klik di luar panel menutup.
export function Overlay({ variant = 'modal', label, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={cx(
        'fixed inset-0 z-50 flex items-end justify-center bg-slate-900/55',
        variant === 'drawer' ? 'lg:items-stretch lg:justify-end' : 'lg:items-center',
      )}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role={variant === 'confirm' ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-label={label}
        className={cx(
          'flex max-h-[90vh] w-full animate-sheet-up flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl lg:animate-none',
          PANEL[variant],
        )}
      >
        <span className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line-primary lg:hidden" />
        {children}
      </div>
    </div>
  );
}
