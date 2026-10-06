import { useState } from 'react';
import { ChevronRight, ClipboardList, HeartPulse, MessageCircleQuestion, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useRecords } from '../../lib/records.js';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { displayName, levelTone } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { Chip } from '../../components/ui/Chip.jsx';
import { cx } from '../../utils/cx.js';

// Tiga pintasan beranda (PRD v2.0). Fiturnya menyusul di Fase 2–3, jadi belum bisa diklik.
const SHORTCUTS = [
  {
    icon: HeartPulse,
    title: 'Cek gejala',
    short: 'Cek gejala',
    text: 'Jawab beberapa pertanyaan, tahu perlu ke dokter atau nggak.',
    mobileText: 'Tahu perlu ke dokter atau nggak.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Tanya EDITH',
    short: 'Tanya EDITH',
    text: 'Soal obat, makanan, atau hasil lab.',
    mobileText: 'Soal obat, makanan, atau hasil lab.',
  },
  {
    icon: ClipboardList,
    title: 'Siapkan ke dokter',
    short: 'Ke dokter',
    to: `${PATHS.summaries}?buat=1`,
    text: 'Ringkasan keluhan buat ditunjukkan ke dokter.',
    mobileText: 'Ringkasan keluhan buat dokter.',
  },
];

const IconBox = ({ icon: Icon }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
    <Icon className="h-5 w-5" />
  </span>
);

// Kolom cerita. Pengiriman keluhan belum tersedia (Fase 2), jadi tombol kirim tetap nonaktif.
function StoryInput({ placeholder, compact }) {
  const [text, setText] = useState('');
  const send = (
    <button
      type="button"
      disabled
      aria-label="Kirim"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-line-primary text-ink-tertiary disabled:cursor-not-allowed"
    >
      <Send className="h-5 w-5" />
    </button>
  );
  const field = (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows={compact ? 1 : 2}
      placeholder={placeholder}
      aria-label="Ceritakan keluhanmu"
      className="min-h-10 w-full flex-1 resize-none bg-transparent text-[15px] leading-6 text-ink-primary placeholder-ink-tertiary/70 focus:outline-none"
    />
  );
  return (
    <div
      className={cx(
        'rounded-xl border border-line-secondary bg-white transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15',
        compact ? 'flex items-center gap-2 py-2 pl-4 pr-2' : 'flex flex-col gap-2 p-3 pl-4 shadow-sm',
      )}
    >
      {field}
      {compact ? send : <div className="flex justify-end">{send}</div>}
    </div>
  );
}

// Kartu check-in untuk pengguna kembali (F9). Tampil bila `checkin` diberikan.
function CheckinCard({ checkin }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="flex gap-3 rounded-xl bg-brand-50 px-4 py-4 lg:px-5">
      <span className="logo-mark hidden h-8 w-8 lg:flex">
        <HeartPulse className="h-4 w-4" />
      </span>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold">{checkin.question}</span>
          <span className="text-xs text-ink-secondary">{checkin.meta}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {checkin.options.map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={picked === label}
              onClick={() => setPicked(label)}
              className={cx(
                'h-9 rounded-full border px-4 text-sm font-medium transition',
                picked === label
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-line-secondary bg-white text-ink-primary hover:bg-surface-secondary',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Daftar catatan kesehatan terakhir untuk pengguna kembali. Tampil bila `notes` tidak kosong.
function RecentNotes({ notes, limit }) {
  const navigate = useNavigate();
  return (
    <section aria-labelledby="recent-notes" className="flex flex-col">
      <div className="flex items-center justify-between pb-1">
        <h2 id="recent-notes" className="text-sm font-medium">
          Catatan kesehatan{limit ? '' : ' terakhir'}
        </h2>
        <Link to={PATHS.notes} className="text-xs">
          Lihat semua
        </Link>
      </div>
      <ul>
        {notes.slice(0, limit).map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => navigate(PATHS.note(n.id))}
              className="flex w-full items-center gap-3 border-b border-line-primary py-3 text-left"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium">{n.title}</span>
                <span className="text-xs text-ink-tertiary">
                  {n.type} · {n.span}
                </span>
              </span>
              {n.level && <Chip tone={levelTone(n.level)}>{n.level}</Chip>}
              <ChevronRight className="hidden h-[18px] w-[18px] text-ink-tertiary lg:block" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// 06: Beranda — sapaan + kolom cerita + tiga pintasan. Bukan dashboard (PRD v2.0).
export default function HomePage() {
  const session = useStepGuard(PATHS.home);
  const signOut = useSignOut();

  const nickname = displayName(session);

  // Selama belum ada catatan, tampil versi "pertama kali".
  const { notes: allNotes } = useRecords();
  const navigate = useNavigate();
  const notes = allNotes.slice(0, 3);
  const open = allNotes.find((n) => n.type === 'Cek gejala' && !n.done);
  const checkin = open && {
    question: `Kamu cerita soal ${open.title.toLowerCase()}. Sekarang gimana?`,
    meta: `Hasil terakhir: ${open.level.toLowerCase()} · ${open.span}`,
    options: ['Sudah membaik', 'Masih sama', 'Makin parah'],
  };
  const returning = Boolean(checkin) || notes.length > 0;

  const greeting = returning
    ? `Hai lagi${nickname ? `, ${nickname}` : ''}`
    : `Hai${nickname ? ` ${nickname}` : ''}, gimana kabarmu?`;
  const subtitle = returning
    ? 'Ada yang mau diceritain hari ini?'
    : 'Ceritain keluhanmu, EDITH bantu cari tahu harus gimana.';

  return (
    <AppShell
      title="Beranda"
      name={nickname}
      onSignOut={signOut}
      hidden={!session}
      footer={<StoryInput compact placeholder="Ceritain keluhanmu…" />}
    >
      <div className="flex w-full max-w-[720px] flex-1 animate-fade-up flex-col justify-center gap-6 py-7 lg:gap-8 lg:py-10">
        <div className="space-y-1.5 lg:text-center">
          <h1 className="text-2xl font-bold tracking-tight lg:text-[28px] lg:leading-9">{greeting}</h1>
          <p className="text-sm text-ink-secondary lg:text-base">{subtitle}</p>
        </div>

        {checkin && <CheckinCard checkin={checkin} />}

        <div className="hidden lg:block">
          <StoryInput
            placeholder={returning ? 'Ceritain keluhanmu di sini…' : 'Contoh: dari kemarin demam dan pusing'}
          />
        </div>

        {/* Desktop: pertama kali = kartu tinggi, kembali = kartu ringkas. Mobile: pertama kali = baris, kembali = tiga kolom. */}
        <ul className={cx('grid gap-3', returning ? 'grid-cols-3 gap-2 lg:gap-4' : 'lg:grid-cols-3 lg:gap-4')}>
          {SHORTCUTS.map(({ icon, title, short, text, mobileText, to }) => (
            <li key={title}>
              <button
                type="button"
                disabled={!to}
                onClick={to ? () => navigate(to) : undefined}
                title={to ? undefined : 'Segera hadir'}
                className={cx(
                  'flex h-full w-full rounded-xl border border-line-primary bg-white text-left disabled:cursor-not-allowed',
                  returning
                    ? 'flex-col items-center gap-2 px-1 py-3.5 text-center lg:flex-row lg:gap-3 lg:px-4 lg:text-left'
                    : 'items-center gap-3 p-4 lg:flex-col lg:items-start lg:gap-3 lg:p-5',
                )}
              >
                <IconBox icon={icon} />
                <span className="flex flex-1 flex-col gap-0.5 lg:gap-1">
                  <span className={cx('font-semibold', returning ? 'text-xs lg:text-[15px]' : 'text-[15px]')}>
                    <span className={returning ? 'lg:hidden' : 'hidden'}>{short}</span>
                    <span className={returning ? 'hidden lg:inline' : ''}>{title}</span>
                  </span>
                  {!returning && (
                    <>
                      <span className="text-xs text-ink-secondary lg:hidden">{mobileText}</span>
                      <span className="hidden text-xs text-ink-secondary lg:block">{text}</span>
                    </>
                  )}
                </span>
                {!returning && <ChevronRight className="h-5 w-5 text-ink-tertiary lg:hidden" />}
              </button>
            </li>
          ))}
        </ul>

        {notes.length > 0 && (
          <>
            <div className="hidden lg:block">
              <RecentNotes notes={notes} />
            </div>
            <div className="lg:hidden">
              <RecentNotes notes={notes} limit={2} />
            </div>
          </>
        )}

        <p className="mt-auto text-center text-xs text-ink-tertiary">
          EDITH bukan pengganti dokter. Darurat? Hubungi 119.
        </p>
      </div>
    </AppShell>
  );
}
