import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

// Top bar mobile untuk halaman dalam: tombol kembali + judul, aksi opsional di kanan.
export function MobileBar({ title, backTo, children }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-1 border-b border-line-primary bg-white px-2 lg:hidden">
      <div className="flex min-w-0 items-center gap-1">
        <Link
          to={backTo}
          aria-label="Kembali"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary hover:no-underline"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        {title && <span className="truncate text-[15px] font-semibold">{title}</span>}
      </div>
      {children}
    </header>
  );
}

// Tombol ikon 44px di MobileBar.
export function BarIconButton({ icon: Icon, label, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-secondary disabled:cursor-not-allowed"
      {...props}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
