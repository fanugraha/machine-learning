import { useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx.js';

// Tombol yang membuka menu kecil. items: [{ label, icon, onClick, danger }].
// placement: top (terbuka ke atas, rata kiri) | bottom (ke bawah, rata kanan).
export function MenuButton({ label, items, placement = 'bottom', className, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={className}
      >
        {children}
      </button>
      {open && (
        <div
          role="menu"
          className={cx(
            'absolute z-30 w-48 rounded-lg border border-line-primary bg-white p-1 shadow-md',
            placement === 'top' ? 'bottom-full left-0 mb-2' : 'right-0 top-full mt-1',
          )}
        >
          {items.map(({ label: text, icon: Icon, onClick, danger }) => (
            <button
              key={text}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onClick();
              }}
              className={cx(
                'flex h-10 w-full items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-surface-secondary',
                danger ? 'text-red-600' : 'text-ink-secondary hover:text-ink-primary',
              )}
            >
              {Icon && <Icon className="h-[18px] w-[18px]" />}
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
