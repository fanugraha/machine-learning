import { useState } from 'react';
import { ChevronRight, HeartPulse, History, MessageCircleQuestion } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { useRecords } from '../../lib/records.js';
import { displayName, levelTone } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { MobileBar } from '../../components/layout/MobileBar.jsx';
import { Chip, FilterChip } from '../../components/ui/Chip.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Button } from '../../components/ui/Button.jsx';

const FILTERS = ['Semua', 'Cek gejala', 'Tanya EDITH'];

// Chip status catatan: tingkat saran + "Selesai".
function NoteChips({ note, className }) {
  if (!note.level && !note.done) return null;
  return (
    <span className={className}>
      {note.level && <Chip tone={levelTone(note.level)}>{note.level}</Chip>}
      {note.done && <Chip>Selesai</Chip>}
    </span>
  );
}

function NoteRow({ note, onOpen }) {
  const Icon = note.type === 'Cek gejala' ? HeartPulse : MessageCircleQuestion;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 border-b border-line-primary py-3 text-left last:border-b-0 hover:bg-surface-secondary lg:gap-4 lg:px-5 lg:py-4"
    >
      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 lg:flex">
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 lg:gap-0.5">
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold">{note.title}</span>
          <span className="text-xs text-ink-tertiary">
            {note.type} · {note.span}
            {note.extra && ` · ${note.extra}`}
          </span>
        </span>
        <NoteChips note={note} className="flex gap-1.5 lg:hidden" />
      </span>
      <NoteChips note={note} className="hidden items-center gap-1.5 lg:flex" />
      <ChevronRight className="h-[18px] w-[18px] shrink-0 text-ink-tertiary" />
    </button>
  );
}

// 12–13: daftar catatan kesehatan. Satu keluhan = satu catatan.
export default function NotesPage() {
  const session = useStepGuard(PATHS.notes, { app: true });
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { notes } = useRecords();
  const [filter, setFilter] = useState('Semua');

  const shown = filter === 'Semua' ? notes : notes.filter((n) => n.type === filter);
  const months = [...new Set(shown.map((n) => n.month))];

  return (
    <AppShell
      title="Catatan kesehatan"
      name={displayName(session)}
      onSignOut={signOut}
      hidden={!session}
      mobileBar={<MobileBar title="Catatan kesehatan" backTo={PATHS.home} />}
    >
      {notes.length === 0 ? (
        <EmptyState
          icon={History}
          title="Belum ada catatan"
          action={
            <Button disabled title="Segera hadir">
              <HeartPulse className="h-[18px] w-[18px]" />
              Cek gejala
            </Button>
          }
        >
          Ceritain keluhanmu ke EDITH, nanti tercatat di sini.
        </EmptyState>
      ) : (
        <div className="flex w-full max-w-[880px] flex-col gap-5 py-4 lg:gap-6 lg:py-10">
          <div className="hidden space-y-1 lg:block">
            <h1 className="text-2xl font-bold tracking-tight">Catatan kesehatan</h1>
            <p className="text-ink-secondary">Semua keluhan yang pernah kamu ceritain ke EDITH, beserta hasilnya.</p>
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <FilterChip key={f} selected={filter === f} onClick={() => setFilter(f)}>
                {f}
              </FilterChip>
            ))}
          </div>
          {months.map((month) => (
            <section key={month} className="flex flex-col gap-1 lg:gap-2">
              <h2 className="text-xs font-medium text-ink-tertiary">{month}</h2>
              <div className="overflow-hidden lg:rounded-xl lg:border lg:border-line-primary">
                {shown
                  .filter((n) => n.month === month)
                  .map((n) => (
                    <NoteRow key={n.id} note={n} onOpen={() => navigate(PATHS.note(n.id))} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
}
