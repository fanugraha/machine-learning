import {
  CheckCircle2,
  ChevronRight,
  Clock,
  HeartPulse,
  History,
  MessageCircleQuestion,
  TriangleAlert,
  ClipboardList,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { useRecords } from '../../lib/records.js';
import { displayName } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { MobileBar } from '../../components/layout/MobileBar.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Button } from '../../components/ui/Button.jsx';

function getSince(note) {
  if (note.since) return note.since;
  if (!note.span) return '';
  const start = note.span.split('–')[0].trim();
  const hasMonth = note.span.includes('Okt') || note.span.includes('Sep');
  return `Mulai ${start}${hasMonth && !start.match(/[a-zA-Z]/) ? ' Okt' : ''}`;
}

function getLastUpdate(note) {
  if (note.last) return note.last;
  const lastTl = note.timeline?.[note.timeline.length - 1];
  if (!lastTl) return 'Belum ada kabar';
  const titlePart = lastTl.title.replace(/^(Cek gejala|Check-in) ·\s*/, '');
  const datePart = lastTl.meta.split(',')[0];
  return `${titlePart} · ${datePart}`;
}

function getDoneMeta(note) {
  if (note.meta) return note.meta;
  const end = note.span?.split('–').pop()?.trim() || note.span;
  const adviceText = note.advice?.title ? note.advice.title.toLowerCase() : 'cukup dirawat di rumah';
  return `Sembuh ${end} · ${adviceText}`;
}

function getQuestionMeta(note) {
  if (note.meta) return note.meta;
  return `Kamu tanya ${note.span}`;
}

// 12–13: daftar catatan kesehatan. Tiga bagian: Masih dipantau, Sudah sembuh, Pertanyaanmu ke EDITH.
export default function NotesPage() {
  const session = useStepGuard(PATHS.notes, { app: true });
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { notes } = useRecords();

  const ongoing = notes.filter((n) => n.type === 'Cek gejala' && !n.done);
  const done = notes.filter((n) => n.type === 'Cek gejala' && n.done);
  const questions = notes.filter((n) => n.type === 'Tanya EDITH');

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
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Catatan kesehatan</h1>
            <p className="text-sm text-ink-secondary">Tercatat otomatis tiap kamu cerita ke EDITH.</p>
          </div>

          {/* 1. Masih dipantau */}
          {ongoing.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-ink-primary">Masih dipantau</h2>
              <div className="flex flex-col gap-3 lg:gap-4">
                {ongoing.map((n) => (
                  <div
                    key={n.id}
                    className="flex flex-col gap-3.5 rounded-xl border border-line-primary bg-white p-4 lg:gap-4 lg:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
                      <span className="text-base font-semibold text-ink-primary lg:text-lg">{n.title}</span>
                      <span className="text-xs text-ink-tertiary">{getSince(n)}</span>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                      <div className="flex items-start gap-2.5">
                        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <div className="flex flex-col text-xs lg:text-sm">
                          <span className="text-ink-tertiary">Saran EDITH</span>
                          <span className="font-semibold text-ink-primary">
                            {n.advice?.short || n.advice?.title || n.advice?.text}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-ink-tertiary" />
                        <div className="flex flex-col text-xs lg:text-sm">
                          <span className="text-ink-tertiary">Kabar terakhir darimu</span>
                          <span className="font-semibold text-ink-primary">{getLastUpdate(n)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t border-line-primary lg:flex-row lg:items-center lg:gap-2 lg:pt-4">
                      <Button disabled title="Segera hadir" className="w-full lg:w-auto">
                        Kasih kabar terbaru
                      </Button>
                      <Button variant="secondary" disabled title="Segera hadir" className="w-full lg:w-auto">
                        <ClipboardList className="h-[18px] w-[18px]" />
                        Siapkan ke dokter
                      </Button>
                      <Button
                        variant="ghost"
                        className="hidden lg:inline-flex"
                        onClick={() => navigate(PATHS.note(n.id))}
                      >
                        Lihat detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. Sudah sembuh */}
          {done.length > 0 && (
            <section className="flex flex-col gap-2 lg:gap-3">
              <h2 className="text-sm font-semibold text-ink-primary">Sudah sembuh</h2>
              <div className="overflow-hidden bg-white rounded-xl border border-line-primary">
                {done.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => navigate(PATHS.note(n.id))}
                    className="flex w-full items-center gap-3 border-b border-line-primary px-4 py-3 text-left last:border-b-0 hover:bg-surface-secondary lg:gap-4 lg:px-5 lg:py-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-sm font-semibold text-ink-primary">{n.title}</span>
                      <span className="text-xs text-ink-secondary">{getDoneMeta(n)}</span>
                    </span>
                    <ChevronRight className="h-[18px] w-[18px]" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* 3. Pertanyaanmu ke EDITH */}
          {questions.length > 0 && (
            <section className="flex flex-col gap-2 lg:gap-3">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-sm font-semibold text-ink-primary">Pertanyaanmu ke EDITH</h2>
                <span className="text-xs text-ink-tertiary">Jawabannya tersimpan, bisa kamu baca lagi.</span>
              </div>
              <div className="overflow-hidden bg-white rounded-xl border border-line-primary">
                {questions.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => navigate(PATHS.note(n.id))}
                    className="flex w-full items-center gap-3 border-b border-line-primary px-4 py-3 text-left last:border-b-0 hover:bg-surface-secondary lg:gap-4 lg:px-5 lg:py-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <MessageCircleQuestion className="h-5 w-5" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-sm font-semibold text-ink-primary">{n.title}</span>
                      <span className="text-xs text-ink-secondary">{getQuestionMeta(n)}</span>
                    </span>
                    <ChevronRight className="h-[18px] w-[18px]" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </AppShell>
  );
}
