import { ClipboardList, LogOut, MessageCircle, Stethoscope } from 'lucide-react';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { StepLayout } from '../../components/layout/StepLayout.jsx';
import { Disclaimer } from '../../components/brand/Disclaimer.jsx';
import { Button } from '../../components/ui/Button.jsx';

// Tiga pintasan beranda (PRD v2.0). Fiturnya menyusul di Fase 2–3.
const SHORTCUTS = [
  {
    icon: Stethoscope,
    title: 'Cek gejala',
    text: 'Jawab beberapa pertanyaan, EDITH bantu tentukan: rawat sendiri, ke dokter, atau ke IGD.',
  },
  { icon: MessageCircle, title: 'Tanya EDITH', text: 'Tanya soal obat umum, makanan, atau hasil lab.' },
  { icon: ClipboardList, title: 'Siapkan ke dokter', text: 'Rangkum keluhanmu jadi catatan singkat untuk dokter.' },
];

// 06: Beranda — sapaan + tiga pintasan. Tidak ada dashboard di MVP.
export default function HomePage() {
  const session = useStepGuard(PATHS.home);
  const signOut = useSignOut();

  const meta = session?.user.user_metadata || {};
  const nickname = session?.profile?.nickname || (meta.full_name || meta.name || '').split(' ')[0];

  return (
    <StepLayout
      title="Beranda"
      hidden={!session}
      headerRight={
        <Button variant="ghost" size="md" onClick={signOut}>
          <LogOut className="hidden h-[18px] w-[18px] lg:block" />
          Keluar
        </Button>
      }
    >
      <section className="flex w-full max-w-3xl animate-fade-up flex-col gap-6 px-5 py-8 lg:px-0">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">{nickname ? `Hai ${nickname}!` : 'Hai!'}</h1>
          <p className="text-sm text-ink-secondary">Lagi ngerasa gimana hari ini? Pilih yang kamu butuhkan.</p>
        </div>
        <ul className="grid gap-3 lg:grid-cols-3 lg:gap-4">
          {SHORTCUTS.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <button
                type="button"
                disabled
                className="flex h-full w-full flex-col gap-3 rounded-xl border border-line-primary bg-white p-5 text-left disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium text-ink-tertiary">
                    Segera hadir
                  </span>
                </span>
                <span className="font-semibold">{title}</span>
                <span className="text-sm text-ink-secondary">{text}</span>
              </button>
            </li>
          ))}
        </ul>
        <Disclaimer />
      </section>
    </StepLayout>
  );
}
