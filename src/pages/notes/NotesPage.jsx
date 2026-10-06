import {
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Clock,
  HeartPulse,
  History,
  MessageCircleQuestion,
  TriangleAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { useRecords } from '../../lib/records.js';
import { displayName, noteDoneMeta, noteLast, noteQuestionMeta, noteSince } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { MobileBar } from '../../components/layout/MobileBar.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

const SoftIcon = ({ icon: Icon, className }) => (
  <span className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full lg:flex ${className}`}>
    <Icon className="h-5 w-5" />
  </span>
);

// Satu baris di daftar "Sudah sembuh" dan "Pertanyaanmu ke EDITH". Di mobile tanpa lingkaran ikon.
function NoteRow({ icon: Icon, tone, iconClass, title, meta, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 border-b border-line-primary py-3 text-left last:border-b-0 hover:bg-surface-secondary lg:gap-4 lg:px-5 lg:py-4"
    >
      <Icon className={`h-5 w-5 shrink-0 lg:hidden ${iconClass}`} />
      <SoftIcon icon={Icon} className={tone} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold lg:text-[15px]">{title}</span>
        <span className="text-xs text-ink-secondary lg:text-[13px]">{meta}</span>
      </span>
      <ChevronRight className="h-[18px] w-[18px] shrink-0 text-ink-tertiary" />
    </button>
  );
}

function Section({ title, hint, children }) {
  return (
    <section className="flex flex-col gap-2.5 lg:gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {hint && <p className="text-[13px] text-ink-tertiary">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

const ListBox = ({ children }) => (
  <div className="lg:overflow-hidden lg:rounded-xl lg:border lg:border-line-primary lg:bg-white">{children}</div>
);

// Keluhan yang masih dipantau: ringkasan saran dan kabar terakhir, plus aksi lanjutan.
function OngoingCard({ note, onOpen, onSummary }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-line-primary bg-white p-4 lg:gap-4 lg:px-6 lg:py-5">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Buka catatan ${note.title}`}
        className="flex flex-col items-start gap-0.5 text-left hover:underline lg:flex-row lg:items-baseline lg:justify-between lg:gap-4"
      >
        <span className="text-base font-semibold lg:text-lg">{note.title}</span>
        <span className="text-xs text-ink-tertiary lg:text-[13px]">{noteSince(note)}</span>
      </button>
      <div className="grid gap-3.5 lg:grid-cols-2 lg:gap-4">
        <div className="flex items-start gap-2.5">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <span className="flex flex-col gap-0.5">
            <span className="text-xs text-ink-tertiary">Saran EDITH</span>
            <span className="text-sm font-medium">{note.advice?.short || note.advice?.title}</span>
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-ink-secondary" />
          <span className="flex flex-col gap-0.5">
            <span className="text-xs text-ink-tertiary">Kabar terakhir darimu</span>
            <span className="text-sm font-medium">{noteLast(note)}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:border-t lg:border-line-primary lg:pt-4">
        <Button size="md" className="lg:h-9" disabled title="Segera hadir">
          Kasih kabar terbaru
        </Button>
        <Button variant="secondary" size="md" onClick={onSummary}>
          <ClipboardList className="h-[18px] w-[18px]" />
          Siapkan ke dokter
        </Button>
        <Button variant="ghost" size="md" className="hidden lg:inline-flex" onClick={onOpen}>
          Lihat detail
        </Button>
      </div>
    </div>
  );
}

// 12–13: daftar catatan kesehatan. Satu keluhan = satu catatan, dibagi tiga bagian.
export default function NotesPage() {
  const session = useStepGuard(PATHS.notes, { app: true });
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { notes } = useRecords();

  const complaints = notes.filter((n) => n.type === 'Cek gejala');
  const ongoing = complaints.filter((n) => !n.done);
  const recovered = complaints.filter((n) => n.done);
  const questions = notes.filter((n) => n.type === 'Tanya EDITH');
  const open = (n) => () => navigate(PATHS.note(n.id));

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
        <div className="flex w-full max-w-[880px] flex-col gap-6 py-4 lg:gap-8 lg:py-10">
          <div className="space-y-1">
            <h1 className="hidden text-2xl font-bold tracking-tight lg:block">Catatan kesehatan</h1>
            <p className="text-sm text-ink-secondary lg:text-base">Tercatat otomatis tiap kamu cerita ke EDITH.</p>
          </div>

          {ongoing.length > 0 && (
            <Section title="Masih dipantau">
              <div className="flex flex-col gap-3">
                {ongoing.map((n) => (
                  <OngoingCard key={n.id} note={n} onOpen={open(n)} onSummary={() => navigate(PATHS.summaries)} />
                ))}
              </div>
            </Section>
          )}

          {recovered.length > 0 && (
            <Section title="Sudah sembuh">
              <ListBox>
                {recovered.map((n) => (
                  <NoteRow
                    key={n.id}
                    icon={CircleCheck}
                    iconClass="text-green-600"
                    tone="bg-green-50 text-green-600"
                    title={n.title}
                    meta={noteDoneMeta(n)}
                    onOpen={open(n)}
                  />
                ))}
              </ListBox>
            </Section>
          )}

          {questions.length > 0 && (
            <Section title="Pertanyaanmu ke EDITH" hint="Jawabannya tersimpan, bisa kamu baca lagi.">
              <ListBox>
                {questions.map((n) => (
                  <NoteRow
                    key={n.id}
                    icon={MessageCircleQuestion}
                    iconClass="text-brand-600"
                    tone="bg-brand-50 text-brand-600"
                    title={n.title}
                    meta={noteQuestionMeta(n)}
                    onOpen={open(n)}
                  />
                ))}
              </ListBox>
            </Section>
          )}
        </div>
      )}
    </AppShell>
  );
}
