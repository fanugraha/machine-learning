import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { cx } from '../../utils/cx.js';

// Layar form polos (Lupa password, Bikin password baru):
// - desktop: satu kolom 400px di tengah, tombol "Kembali" di atas judul, tombol aksi di bawah form
// - mobile: header berisi tombol kembali, tombol aksi menempel di bawah layar
export function FormScreen({ title, backTo, heading, subtitle, action, onSubmit, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {title && <title>{`${title} · EDITH`}</title>}
      {backTo && (
        <header className="flex h-14 shrink-0 items-center border-b border-line-primary px-2 lg:hidden">
          <Link to={backTo} className="btn btn-ghost btn-md w-11 !px-0" aria-label="Kembali">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </header>
      )}
      <form
        noValidate
        onSubmit={onSubmit}
        className="flex flex-1 flex-col lg:items-center lg:justify-center lg:px-10 lg:py-10"
      >
        <div
          className={cx(
            'flex w-full flex-1 animate-fade-up flex-col gap-6 px-5 lg:max-w-[400px] lg:flex-none lg:px-0',
            backTo ? 'pt-6' : 'pt-12 lg:pt-0',
          )}
        >
          {backTo && (
            <Link to={backTo} className="btn btn-ghost btn-md hidden self-start !pl-0 lg:inline-flex">
              <ArrowLeft className="h-[18px] w-[18px]" />
              Kembali
            </Link>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
            {subtitle && <p className="text-sm text-ink-secondary">{subtitle}</p>}
          </div>
          {children}
          <div className="sticky bottom-0 -mx-5 mt-auto border-t border-line-primary bg-white px-5 pb-6 pt-3 lg:static lg:mx-0 lg:mt-0 lg:border-0 lg:p-0">
            {action}
          </div>
        </div>
      </form>
    </div>
  );
}
