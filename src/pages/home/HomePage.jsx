import { useState } from 'react';
import { ChevronRight, CircleAlert, ClipboardList, HeartPulse, Phone, Send } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useRecords } from '../../lib/records.js';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { displayName, noteLast } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FilterChip } from '../../components/ui/Chip.jsx';
import { cx } from '../../utils/cx.js';

const QUICK_COMPLAINTS = [
  { label: 'Demam', text: 'Aku lagi demam' },
  { label: 'Sakit kepala', text: 'Kepalaku sakit' },
  { label: 'Batuk & pilek', text: 'Aku batuk dan pilek' },
  { label: 'Sakit perut', text: 'Perutku sakit' },
  { label: 'Gatal atau ruam', text: 'Kulitku gatal dan ada ruam' },
];

const CHECKIN_REPLIES = {
  'Sudah membaik': 'Syukurlah! Aku tandai catatan ini sudah sembuh, ya.',
  'Masih sama': 'Oke, aku catat. Kalau sampai besok belum membaik, sebaiknya ke dokter.',
  'Makin parah': 'Waduh. Yuk ceritain lebih lanjut, aku bantu cek lagi sekarang.',
};

const STEPS = [
  { title: 'Ceritain keluhanmu', text: 'Nggak perlu istilah medis.', mobile: 'Ceritain keluhanmu' },
  { title: 'Jawab beberapa pertanyaan', text: 'Biasanya kurang dari 2 menit.', mobile: 'Jawab beberapa pertanyaan' },
  {
    title: 'Tahu harus gimana',
    text: 'Rawat di rumah, ke dokter, atau ke IGD.',
    mobile: 'Tahu harus gimana: rawat di rumah, ke dokter, atau ke IGD',
  },
];

// Kolom cerita. Pengiriman keluhan belum tersedia (Fase 2), jadi tombol kirim tetap nonaktif.
// `compact` = satu baris (footer mobile); selain itu kotak besar dengan petunjuk di kiri bawah.
function StoryInput({ value, onChange, placeholder, compact }) {
  const send = (
    <button
      type="button"
      disabled
      aria-label="Kirim"
      title="Segera hadir"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-line-primary text-ink-tertiary disabled:cursor-not-allowed"
    >
      <Send className="h-5 w-5" />
    </button>
  );
  return (
    <div
      className={cx(
        'rounded-xl border border-line-secondary bg-white shadow-sm transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15',
        compact ? 'flex items-center gap-2 py-2 pl-4 pr-2' : 'flex flex-col gap-2 p-3 pl-4',
      )}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={compact ? 1 : 3}
        placeholder={placeholder}
        aria-label="Ceritakan keluhanmu"
        className="min-h-10 w-full flex-1 resize-none bg-transparent text-[15px] leading-6 text-ink-primary placeholder-ink-tertiary/70 focus:outline-none"
      />
      {compact ? (
        send
      ) : (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-ink-tertiary">Bisa juga tanya soal obat atau hasil lab</span>
          {send}
        </div>
      )}
    </div>
  );
}

// Chip keluhan umum: memilih satu mengisi kolom cerita.
function ComplaintChips({ selected, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_COMPLAINTS.map((q) => (
        <FilterChip key={q.label} selected={selected === q.label} onClick={() => onPick(q)}>
          {q.label}
        </FilterChip>
      ))}
    </div>
  );
}

// Kartu check-in untuk pengguna kembali (3b/3d). Balasan hanya tampil di layar; belum menyimpan apa pun.
const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);

function CheckinCard({ note }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="flex gap-3 rounded-xl bg-brand-50 p-4 lg:px-5">
      <span className="logo-mark hidden h-8 w-8 rounded-full lg:flex">
        <HeartPulse className="h-4 w-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold">{note.title}mu gimana hari ini?</span>
          <span className="text-xs text-ink-secondary">
            Kabar terakhir<span className="hidden lg:inline"> darimu</span>: {lowerFirst(noteLast(note))}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(CHECKIN_REPLIES).map((label) => (
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
        {picked && <p className="text-sm">{CHECKIN_REPLIES[picked]}</p>}
      </div>
    </div>
  );
}

// Pintasan ke ringkasan dokter (3b/3d). Teks desktop dan mobile berbeda.
function SummaryCard({ note, onOpen }) {
  const topic = note.title.toLowerCase();
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line-primary p-3.5 lg:px-4 lg:py-3.5">
      <ClipboardList className="h-5 w-5 shrink-0 text-brand-600" />
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="text-sm font-semibold">
          <span className="lg:hidden">Mau ke dokter?</span>
          <span className="hidden lg:inline">Mau periksa {topic} ke dokter?</span>
        </span>
        <span className="text-xs text-ink-secondary">
          <span className="lg:hidden">Ringkasan {topic} sudah siap.</span>
          <span className="hidden lg:inline">EDITH sudah siapkan ringkasan keluhanmu.</span>
        </span>
      </button>
      <Button variant="secondary" size="md" className="hidden lg:inline-flex" onClick={onOpen}>
        Lihat ringkasan
      </Button>
      <ChevronRight className="h-[18px] w-[18px] shrink-0 text-ink-tertiary lg:hidden" />
    </div>
  );
}

// Info darurat: banner dengan tombol di desktop, kartu satu ketukan di mobile.
function EmergencyNotice() {
  return (
    <>
      <div className="banner banner-error hidden items-center lg:flex" role="note">
        <CircleAlert className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          <div className="banner-title">Nyeri dada, sesak napas, atau pingsan?</div>
          <div>Jangan tunggu, langsung telepon 119 atau ke IGD terdekat.</div>
        </div>
        <a href="tel:119" className="btn btn-destructive btn-md shrink-0 hover:no-underline">
          <Phone className="h-4 w-4" />
          Telepon 119
        </a>
      </div>
      <a
        href="tel:119"
        className="mt-auto flex items-center gap-3 rounded-lg bg-red-50 px-3.5 py-3 text-red-700 hover:text-red-700 hover:no-underline lg:hidden"
      >
        <Phone className="h-5 w-5 shrink-0" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-semibold">Darurat? Telepon 119</span>
          <span className="text-xs font-normal text-ink-primary">Nyeri dada, sesak napas, atau pingsan</span>
        </span>
        <ChevronRight className="h-[18px] w-[18px] shrink-0" />
      </a>
    </>
  );
}

// 06: Beranda — satu pintu masuk: kolom cerita. Bukan dashboard (PRD v2.0).
export default function HomePage() {
  const session = useStepGuard(PATHS.home);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const nickname = displayName(session);

  const { notes } = useRecords();
  const open = notes.find((n) => n.type === 'Cek gejala' && !n.done);
  const returning = notes.length > 0;

  const [text, setText] = useState('');
  const [chip, setChip] = useState(null);
  const pickChip = (q) => {
    setChip(q.label);
    setText(q.text);
  };
  const type = (value) => {
    setText(value);
    setChip(null);
  };

  const greeting = returning
    ? `Hai lagi${nickname ? `, ${nickname}` : ''}`
    : `Hai${nickname ? ` ${nickname}` : ''}, ada keluhan apa hari ini?`;

  return (
    <AppShell
      title="Beranda"
      name={nickname}
      onSignOut={signOut}
      hidden={!session}
      footer={<StoryInput compact value={text} onChange={type} placeholder="Ceritain keluhanmu…" />}
    >
      <div className="flex w-full max-w-[680px] flex-1 flex-col gap-6 py-6 lg:py-8">
        <div className="flex flex-1 animate-fade-up flex-col justify-center gap-6 lg:gap-7">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight lg:text-[28px] lg:leading-9">{greeting}</h1>
            {!returning && (
              <p className="text-sm text-ink-secondary lg:text-base">
                Ceritain aja pakai bahasamu sendiri. EDITH bantu cari tahu kamu perlu ke dokter atau cukup istirahat di
                rumah.
              </p>
            )}
          </div>

          {open && <CheckinCard note={open} />}
          {open && <SummaryCard note={open} onOpen={() => navigate(PATHS.summaries)} />}

          <div className="flex flex-col gap-3">
            {returning && <h2 className="text-sm font-semibold">Ada keluhan lain?</h2>}
            <div className="hidden lg:block">
              <StoryInput
                value={text}
                onChange={type}
                placeholder={returning ? 'Ceritain di sini…' : 'Contoh: dari kemarin demam dan kepala pusing'}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!returning && (
                <span className="w-full text-sm font-medium text-ink-primary lg:w-auto lg:text-xs lg:font-normal lg:text-ink-tertiary">
                  <span className="lg:hidden">Mulai dari keluhan yang umum:</span>
                  <span className="hidden lg:inline">Atau pilih:</span>
                </span>
              )}
              <ComplaintChips selected={chip} onPick={pickChip} />
            </div>
          </div>

          {!returning && (
            <ol className="flex flex-col gap-3 border-t border-line-primary pt-5 lg:grid lg:grid-cols-3 lg:gap-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex items-center gap-3 lg:items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 lg:h-7 lg:w-7 lg:text-[13px]">
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="hidden text-sm font-semibold lg:block">{s.title}</span>
                    <span className="hidden text-xs text-ink-secondary lg:block">{s.text}</span>
                    <span className="text-sm lg:hidden">{s.mobile}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <EmergencyNotice />
      </div>
    </AppShell>
  );
}
