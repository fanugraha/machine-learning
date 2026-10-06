import { useState } from 'react';
import { CircleAlert, ClipboardList, HeartPulse, Phone, Send, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useRecords } from '../../lib/records.js';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { displayName } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
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

function StoryInput({ text, setText, selectedChip, setSelectedChip, placeholder, compact }) {
  const sendOff = !text.trim();

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (selectedChip) setSelectedChip(null);
  };

  return (
    <div
      className={cx(
        'rounded-xl border border-line-secondary bg-white transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15 shadow-sm',
        compact ? 'flex items-center gap-2 py-2 pl-4 pr-2' : 'flex flex-col gap-2 p-3 pl-4',
      )}
    >
      <textarea
        value={text}
        onChange={handleTextChange}
        rows={compact ? 1 : 2}
        placeholder={placeholder}
        aria-label="Ceritakan keluhanmu"
        className="min-h-10 w-full flex-1 resize-none bg-transparent text-[15px] leading-6 text-ink-primary placeholder-ink-tertiary/70 focus:outline-none"
      />
      {compact ? (
        <button
          type="button"
          disabled={sendOff}
          aria-label="Kirim"
          title={sendOff ? undefined : 'Segera hadir'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-line-primary text-ink-tertiary disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      ) : (
        <div className="flex items-center justify-between border-t border-line-primary/50 pt-2 lg:border-t-0 lg:pt-0">
          <span className="text-xs text-ink-tertiary hidden lg:inline">Bisa juga tanya soal obat atau hasil lab</span>
          <button
            type="button"
            disabled={sendOff}
            aria-label="Kirim"
            title={sendOff ? undefined : 'Segera hadir'}
            className={cx(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition disabled:cursor-not-allowed',
              sendOff ? 'bg-line-primary text-ink-tertiary' : 'bg-brand-600 text-white hover:bg-brand-700',
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function EmergencyBanner() {
  return (
    <div className="w-full">
      <div className="hidden lg:flex">
        <Banner type="error" icon={CircleAlert} className="w-full items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold">Nyeri dada, sesak napas, atau pingsan?</span>
            <span className="text-xs">Jangan tunggu, langsung telepon 119 atau ke IGD terdekat.</span>
          </div>
          <a
            href="tel:119"
            className="btn btn-destructive btn-sm ml-4 inline-flex shrink-0 items-center gap-1.5 no-underline"
          >
            <Phone className="h-4 w-4" />
            Telepon 119
          </a>
        </Banner>
      </div>
      <div className="lg:hidden mt-auto">
        <a
          href="tel:119"
          className="flex items-center gap-3 rounded-xl bg-red-50 p-3 text-red-700 no-underline hover:no-underline"
        >
          <Phone className="h-5 w-5 shrink-0 text-red-600" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-sm font-semibold">Darurat? Telepon 119</span>
            <span className="text-xs text-ink-primary font-normal">Nyeri dada, sesak napas, atau pingsan</span>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-red-600" />
        </a>
      </div>
    </div>
  );
}

function StepsEducation() {
  return (
    <div className="flex flex-col gap-3 border-t border-line-primary pt-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:pt-6">
      <div className="flex items-center gap-3 lg:items-start">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 lg:h-7 lg:w-7">
          1
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink-primary">Ceritain keluhanmu</span>
          <span className="text-xs text-ink-secondary">Nggak perlu istilah medis.</span>
        </div>
      </div>
      <div className="flex items-center gap-3 lg:items-start">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 lg:h-7 lg:w-7">
          2
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink-primary">Jawab beberapa pertanyaan</span>
          <span className="text-xs text-ink-secondary">Biasanya kurang dari 2 menit.</span>
        </div>
      </div>
      <div className="flex items-center gap-3 lg:items-start">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 lg:h-7 lg:w-7">
          3
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink-primary">Tahu harus gimana</span>
          <span className="text-xs text-ink-secondary">Rawat di rumah, ke dokter, atau ke IGD.</span>
        </div>
      </div>
    </div>
  );
}

// 06: Beranda v2 — sapaan + kolom cerita tunggal + check-in + darurat 119.
export default function HomePage() {
  const session = useStepGuard(PATHS.home);
  const signOut = useSignOut();
  const navigate = useNavigate();

  const nickname = displayName(session);

  const { notes: allNotes } = useRecords();
  const open = allNotes.find((n) => n.type === 'Cek gejala' && !n.done);

  const [text, setText] = useState('');
  const [selectedChip, setSelectedChip] = useState(null);
  const [checkinPicked, setCheckinPicked] = useState(null);

  const handlePickChip = (chip) => {
    if (selectedChip === chip.label) {
      setSelectedChip(null);
      setText('');
    } else {
      setSelectedChip(chip.label);
      setText(chip.text);
    }
  };

  const checkinTitle = open ? `${open.title}mu gimana hari ini?` : '';
  const lastUpdate = open
    ? open.last ||
      (open.timeline?.length > 0
        ? `${open.timeline[open.timeline.length - 1].title.replace(/^(Cek gejala|Check-in) ·\s*/, '').toLowerCase()} · ${open.timeline[open.timeline.length - 1].meta.split(',')[0]}`
        : open.span || '')
    : '';

  const returning = Boolean(open) || allNotes.length > 0;

  const greeting = returning
    ? `Hai lagi${nickname ? `, ${nickname}` : ''}`
    : `Hai${nickname ? ` ${nickname}` : ''}, ada keluhan apa hari ini?`;

  const subtitle = returning
    ? null
    : 'Ceritain aja pakai bahasamu sendiri. EDITH bantu cari tahu kamu perlu ke dokter atau cukup istirahat di rumah.';

  return (
    <AppShell
      title="Beranda"
      name={nickname}
      onSignOut={signOut}
      hidden={!session}
      footer={
        <StoryInput
          text={text}
          setText={setText}
          selectedChip={selectedChip}
          setSelectedChip={setSelectedChip}
          compact
          placeholder="Ceritain keluhanmu…"
        />
      }
    >
      <div className="flex w-full max-w-[680px] flex-1 animate-fade-up flex-col justify-center gap-6 py-6 lg:gap-7 lg:py-10">
        <div className="space-y-1.5 lg:text-center">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">{greeting}</h1>
          {subtitle && <p className="text-sm text-ink-secondary lg:text-base">{subtitle}</p>}
        </div>

        {/* Check-in Card untuk Pengguna Kembali (3b / 3d) */}
        {open && (
          <div className="flex gap-3 rounded-xl bg-brand-50 p-4 lg:p-5">
            <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#20AEB8] to-[#91C964] text-white lg:flex">
              <HeartPulse className="h-4 w-4" />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-ink-primary">{checkinTitle}</span>
                <span className="text-xs text-ink-secondary">
                  <span className="hidden lg:inline">Kabar terakhir darimu: </span>
                  <span className="lg:hidden">Kabar terakhir: </span>
                  {lastUpdate}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(CHECKIN_REPLIES).map((label) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={checkinPicked === label}
                    onClick={() => setCheckinPicked(label)}
                    className={cx(
                      'h-9 rounded-full border px-3.5 text-xs font-medium transition lg:text-sm',
                      checkinPicked === label
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-line-secondary bg-white text-ink-primary hover:bg-surface-secondary',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {checkinPicked && (
                <p className="text-xs font-medium text-ink-primary lg:text-sm">{CHECKIN_REPLIES[checkinPicked]}</p>
              )}
            </div>
          </div>
        )}

        {/* Doctor Summary Card (3b / 3d) */}
        {open && (
          <div
            onClick={() => navigate(PATHS.summaries)}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-line-primary p-3.5 transition hover:bg-surface-secondary lg:p-4"
          >
            <ClipboardList className="h-5 w-5 shrink-0 text-brand-600" />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink-primary">
                Mau periksa {open.title.toLowerCase()} ke dokter?
              </span>
              <span className="text-xs text-ink-secondary">EDITH sudah siapkan ringkasan keluhanmu.</span>
            </div>
            <Button
              variant="secondary"
              size="md"
              className="hidden lg:inline-flex"
              onClick={(e) => {
                e.stopPropagation();
                navigate(PATHS.summaries);
              }}
            >
              Lihat ringkasan
            </Button>
            <ChevronRight className="h-4 w-4 shrink-0 text-ink-tertiary lg:hidden" />
          </div>
        )}

        {/* Story Input Section (Desktop version) */}
        <div className="hidden flex-col gap-3 lg:flex">
          {returning && <h2 className="text-sm font-semibold text-ink-primary">Ada keluhan lain?</h2>}
          <StoryInput
            text={text}
            setText={setText}
            selectedChip={selectedChip}
            setSelectedChip={setSelectedChip}
            placeholder={returning ? 'Ceritain di sini…' : 'Contoh: dari kemarin demam dan kepala pusing'}
          />
        </div>

        {/* Chips Keluhan Umum */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-ink-tertiary lg:text-sm">
            {returning ? 'Ada keluhan lain?' : 'Atau pilih:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_COMPLAINTS.map((q) => (
              <FilterChip
                key={q.label}
                selected={selectedChip === q.label}
                onClick={() => handlePickChip(q)}
              >
                {q.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Steps Education (Hanya pengguna pertama kali) */}
        {!returning && <StepsEducation />}

        {/* Emergency 119 Banner */}
        <EmergencyBanner />
      </div>
    </AppShell>
  );
}
