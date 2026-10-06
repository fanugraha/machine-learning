import { NavLink, Link } from 'react-router';
import { ClipboardList, HeartPulse, History, LogOut, MoreVertical, UserCheck } from 'lucide-react';
import { Logo } from '../brand/Logo.jsx';
import { MenuButton } from '../ui/MenuButton.jsx';
import { PATHS } from '../../routes/paths.js';
import { cx } from '../../utils/cx.js';

const NAV = [
  { icon: HeartPulse, label: 'Beranda', to: PATHS.home },
  { icon: History, label: 'Catatan kesehatan', to: PATHS.notes },
  { icon: ClipboardList, label: 'Ringkasan dokter', to: PATHS.summaries },
  { icon: UserCheck, label: 'Profil kesehatan', to: PATHS.profile },
];

export function Avatar({ name, size = 'sm' }) {
  return (
    <span
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white',
        size === 'lg' ? 'h-12 w-12 text-lg' : size === 'md' ? 'h-10 w-10' : 'h-8 w-8 text-sm',
      )}
    >
      {(name || 'E').charAt(0).toUpperCase()}
    </span>
  );
}

// Kerangka aplikasi setelah onboarding: sidebar 240px (desktop) / top bar 56px (mobile).
// - `mobileBar`: pengganti top bar mobile (mis. <MobileBar> dengan tombol kembali).
// - `footer`: menempel di bawah layar pada mobile (kolom cerita, tombol aksi).
// - `mobileTone="muted"`: latar abu-abu di mobile (halaman detail berisi kartu).
export function AppShell({ title, name, onSignOut, hidden = false, mobileBar, footer, mobileTone, children }) {
  const signOut = [{ label: 'Keluar', icon: LogOut, onClick: onSignOut }];
  return (
    <div
      className={cx(
        'flex min-h-screen flex-col lg:h-screen lg:flex-row lg:bg-white',
        mobileTone === 'muted' ? 'bg-surface-secondary' : 'bg-white',
        hidden && 'invisible',
      )}
    >
      {title && <title>{`${title} · EDITH`}</title>}

      <aside className="hidden w-60 shrink-0 flex-col gap-5 border-r border-line-primary bg-surface-secondary px-4 py-5 lg:flex">
        <div className="px-1">
          <Logo size="header" />
        </div>
        <nav className="flex flex-col gap-0.5" aria-label="Menu utama">
          {NAV.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cx(
                  'flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm hover:no-underline',
                  isActive
                    ? 'bg-brand-50 font-semibold text-brand-700 hover:text-brand-700'
                    : 'font-medium text-ink-secondary hover:bg-white hover:text-ink-primary',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <MenuButton
            label="Profil"
            items={signOut}
            placement="top"
            className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-white"
          >
            <Avatar name={name} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{name || 'Akun saya'}</span>
              <span className="text-xs text-ink-tertiary">Pengaturan &amp; privasi</span>
            </span>
            <MoreVertical className="h-[18px] w-[18px] text-ink-tertiary" />
          </MenuButton>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
        {mobileBar || (
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-line-primary bg-white pl-5 pr-3 lg:hidden">
            <Logo size="header" />
            <div className="flex items-center">
              <Link
                to={PATHS.notes}
                aria-label="Catatan kesehatan"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary hover:no-underline"
              >
                <History className="h-5 w-5" />
              </Link>
              <MenuButton label="Profil" items={signOut} className="flex h-11 w-11 items-center justify-center">
                <Avatar name={name} />
              </MenuButton>
            </div>
          </header>
        )}
        <main className="flex flex-1 flex-col items-center px-5 lg:px-12">{children}</main>
        {footer && (
          <div className="sticky bottom-0 border-t border-line-primary bg-white px-4 pb-5 pt-3 lg:hidden">{footer}</div>
        )}
      </div>
    </div>
  );
}
