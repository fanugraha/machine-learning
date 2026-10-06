import { useState } from 'react';
import { ChevronRight, ClipboardList, Plus, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { useRecords } from '../../lib/records.js';
import { displayName, levelTone } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { MobileBar } from '../../components/layout/MobileBar.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Chip } from '../../components/ui/Chip.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Overlay } from '../../components/ui/Overlay.jsx';
import { cx } from '../../utils/cx.js';

const NEW_COMPLAINT = 'new';

// 16c / 16e: pilih keluhan yang mau dibuatkan ringkasan.
function PickDialog({ notes, summaries, onClose }) {
  const navigate = useNavigate();
  const [picked, setPicked] = useState(notes[0]?.id ?? NEW_COMPLAINT);
  const existing = summaries.find((s) => s.noteId === picked);
  // Pembuatan ringkasan baru (dan cek gejala singkat) menyusul di Fase 2–3.
  const canContinue = Boolean(existing);

  const options = [
    ...notes.map((n) => ({ id: n.id, title: n.title, meta: `${n.type}${n.level ? ` · ${n.level}` : ''} · ${n.span}` })),
    { id: NEW_COMPLAINT, title: 'Keluhan baru', meta: 'Cek gejala singkat dulu, lalu dibuatkan ringkasan', soon: true },
  ];

  return (
    <Overlay label="Pilih keluhan" onClose={onClose}>
      <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4 lg:py-5 lg:pl-6 lg:pr-4">
        <h2 className="text-lg font-semibold">Ringkasan untuk keluhan yang mana?</h2>
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-secondary lg:flex"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto px-5 pb-5 lg:px-6 lg:pb-6">
        {options.map((o) => (
          <label
            key={o.id}
            className={cx(
              'flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3',
              picked === o.id ? 'border-brand-500 bg-brand-50' : 'border-line-secondary bg-white',
            )}
          >
            <input
              type="radio"
              name="pick"
              checked={picked === o.id}
              onChange={() => setPicked(o.id)}
              className="h-4 w-4 accent-brand-600"
            />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-medium">{o.title}</span>
              <span className="text-xs text-ink-tertiary">{o.meta}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="flex flex-col gap-2 px-5 pb-6 lg:flex-row-reverse lg:justify-start lg:border-t lg:border-line-primary lg:px-6 lg:py-4">
        <Button
          disabled={!canContinue}
          className="lg:h-9 lg:px-3 lg:text-sm"
          onClick={() => navigate(PATHS.summary(existing.id))}
          title={canContinue ? undefined : 'Segera hadir'}
        >
          {picked === NEW_COMPLAINT ? 'Mulai cek gejala' : 'Buat ringkasan'}
        </Button>
        <Button variant="ghost" className="hidden lg:inline-flex lg:h-9 lg:px-3 lg:text-sm" onClick={onClose}>
          Batal
        </Button>
      </div>
    </Overlay>
  );
}

// 16: daftar ringkasan dokter.
export default function SummariesPage() {
  const session = useStepGuard(PATHS.summaries, { app: true });
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { notes, summaries } = useRecords();

  const picking = params.has('buat');
  const setPicking = (open) => setParams(open ? { buat: '1' } : {}, { replace: true });
  const createButton = (
    <Button size="md" onClick={() => setPicking(true)}>
      <Plus className="h-[18px] w-[18px]" />
      Buat ringkasan
    </Button>
  );

  return (
    <AppShell
      title="Ringkasan dokter"
      name={displayName(session)}
      onSignOut={signOut}
      hidden={!session}
      mobileBar={<MobileBar title="Ringkasan dokter" backTo={PATHS.home} />}
    >
      {summaries.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Belum ada ringkasan" action={createButton}>
          Rangkuman keluhan yang siap kamu tunjukkan ke dokter akan muncul di sini.
        </EmptyState>
      ) : (
        <div className="flex w-full max-w-[880px] flex-col gap-4 py-4 lg:gap-6 lg:py-10">
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="hidden text-2xl font-bold tracking-tight lg:block">Ringkasan dokter</h1>
              <p className="text-sm text-ink-secondary lg:text-base">
                Rangkuman keluhan yang siap kamu tunjukkan ke dokter.
              </p>
            </div>
            {createButton}
          </div>
          <div className="overflow-hidden lg:rounded-xl lg:border lg:border-line-primary">
            {summaries.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate(PATHS.summary(m.id))}
                className="flex w-full items-center gap-3 border-b border-line-primary py-3 text-left last:border-b-0 hover:bg-surface-secondary lg:gap-4 lg:px-5 lg:py-4"
              >
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 lg:flex">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-semibold">{m.title}</span>
                  <span className="text-xs text-ink-tertiary">
                    {m.updated} · {m.sections.length} bagian
                  </span>
                </span>
                <Chip tone={levelTone(m.level)}>{m.level}</Chip>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-ink-tertiary" />
              </button>
            ))}
          </div>
        </div>
      )}
      {picking && <PickDialog notes={notes} summaries={summaries} onClose={() => setPicking(false)} />}
    </AppShell>
  );
}
