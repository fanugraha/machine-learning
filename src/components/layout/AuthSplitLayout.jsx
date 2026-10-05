import { Logo } from '../brand/Logo.jsx';
import { Disclaimer } from '../brand/Disclaimer.jsx';

// Layout Masuk & Daftar: panel kiri berisi `aside` (desktop saja), form di kanan.
// Di mobile panel kiri disembunyikan; disclaimer pindah ke bawah layar.
export function AuthSplitLayout({ aside, children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-[47%] max-w-[680px] shrink-0 flex-col border-r border-line-primary bg-surface-secondary px-16 py-12 lg:flex">
        <Logo size="lg" />
        {aside}
        <Disclaimer className="mt-auto pt-10" />
      </aside>

      <main className="flex min-h-screen flex-1 flex-col px-5 py-6 lg:items-center lg:justify-center lg:px-10">
        <Logo className="lg:hidden" />
        <div className="mx-auto mt-8 w-full max-w-[400px] animate-fade-up lg:mt-0">{children}</div>
        <Disclaimer className="mx-auto mt-auto w-full max-w-[400px] pt-6 lg:hidden" />
      </main>
    </div>
  );
}

// Judul + subjudul di atas form.
export function AuthHeading({ title, subtitle }) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-ink-secondary">{subtitle}</p>
    </div>
  );
}

// Teks besar di panel kiri.
export function AsideHero({ title, children }) {
  return (
    <div className="mt-16 max-w-[500px] space-y-3">
      <h2 className="text-4xl font-bold leading-tight tracking-tight">{title}</h2>
      <p className="text-base leading-6 text-ink-secondary">{children}</p>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="my-4 flex items-center gap-3 text-xs text-ink-tertiary">
      <span className="h-px flex-1 bg-line-primary" />
      atau
      <span className="h-px flex-1 bg-line-primary" />
    </div>
  );
}
