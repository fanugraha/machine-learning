import { Link } from 'react-router';
import { Logo } from '../brand/Logo.jsx';
import { cx } from '../../utils/cx.js';
import { PATHS } from '../../routes/paths.js';

// Layout langkah (verifikasi, persetujuan, onboarding, lupa password):
// header tipis + kartu di tengah (desktop) / layar penuh dengan tombol menempel di bawah (mobile).
// `header={false}` untuk layar status tanpa header (mis. link reset terkirim).
export function StepLayout({ title, header = true, headerRight, logoLinksHome = false, hidden = false, children }) {
  const logo = <Logo size="header" />;
  return (
    <div className="min-h-screen bg-white lg:bg-surface-secondary">
      {title && <title>{`${title} · EDITH`}</title>}
      {header && (
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-line-primary bg-white pl-5 pr-3 lg:h-16 lg:px-8">
          {logoLinksHome ? (
            <Link to={PATHS.login} className="hover:no-underline">
              {logo}
            </Link>
          ) : (
            logo
          )}
          {headerRight}
        </header>
      )}
      <main
        className={cx(
          'lg:flex lg:items-center lg:justify-center lg:py-10',
          header ? 'lg:min-h-[calc(100vh-4rem)]' : 'lg:min-h-screen',
          hidden && 'invisible',
        )}
      >
        {children}
      </main>
    </div>
  );
}

// Kartu langkah. `width` berupa kelas Tailwind lengkap (mis. 'lg:w-[560px]').
// `footer` menempel di bawah layar pada mobile. `as="form"` untuk kartu berisi form.
// `fullScreen` bila StepLayout tanpa header (kartu setinggi layar di mobile).
export function StepCard({
  as: Tag = 'section',
  width,
  fullScreen = false,
  bodyClassName,
  footer,
  footerClassName,
  children,
  ...props
}) {
  return (
    <Tag
      className={cx(
        'flex flex-col bg-white lg:min-h-0 lg:rounded-xl lg:border lg:border-line-primary lg:shadow-sm',
        fullScreen ? 'min-h-screen' : 'min-h-[calc(100vh-3.5rem)]',
        width,
      )}
      noValidate={Tag === 'form' ? true : undefined}
      {...props}
    >
      <div className={cx('flex flex-1 animate-fade-up flex-col', bodyClassName)}>{children}</div>
      {footer && (
        <div
          className={cx(
            'sticky bottom-0 border-t border-line-primary bg-white px-5 pb-6 pt-3 lg:static lg:rounded-b-xl lg:px-10 lg:py-5',
            footerClassName,
          )}
        >
          {footer}
        </div>
      )}
    </Tag>
  );
}

// Isi kartu status yang terpusat: ikon, judul, deskripsi.
export function StatusHeader({ icon, title, children }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {icon}
      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm leading-5 text-ink-secondary">{children}</p>
      </div>
    </div>
  );
}
