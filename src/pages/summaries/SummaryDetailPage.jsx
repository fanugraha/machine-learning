import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Copy, Eye, EyeOff, Pencil, Send } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { useRecords } from '../../lib/records.js';
import { demographics, displayName, levelTone } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { MobileBar } from '../../components/layout/MobileBar.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Chip } from '../../components/ui/Chip.jsx';
import { Toast } from '../../components/ui/Toast.jsx';
import { cx } from '../../utils/cx.js';

const FOOTNOTE = 'Dibuat oleh EDITH dari cerita pengguna. Bukan diagnosis.';

function SectionRow({ section, text, hidden, editing, onEdit, onToggleHide, onSave, onCancel }) {
  const [draft, setDraft] = useState(text);
  const small =
    'inline-flex h-8 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary disabled:cursor-not-allowed disabled:opacity-40 lg:px-2.5';

  return (
    <div className="flex flex-col gap-2 border-b border-line-primary py-3.5 pl-4 pr-2 lg:px-6 lg:py-[18px]">
      <div className="flex items-center gap-1 lg:gap-3">
        <span className="flex flex-1 flex-col lg:flex-row lg:flex-wrap lg:items-baseline lg:gap-2">
          <span className="text-sm font-medium">{section.title}</span>
          <span className="text-xs text-ink-tertiary">{section.source}</span>
        </span>
        {!editing && (
          <span className="flex gap-1">
            <button type="button" className={small} onClick={onEdit} disabled={hidden} aria-label="Ubah">
              <Pencil className="h-4 w-4" />
              <span className="hidden lg:inline">Ubah</span>
            </button>
            <button
              type="button"
              className={small}
              onClick={onToggleHide}
              aria-label={hidden ? 'Tampilkan' : 'Sembunyikan'}
            >
              {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span className="hidden lg:inline">{hidden ? 'Tampilkan' : 'Sembunyikan'}</span>
            </button>
          </span>
        )}
      </div>
      {hidden && (
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-tertiary">
          <EyeOff className="h-3.5 w-3.5" />
          Tidak ikut dibagikan
        </span>
      )}
      {!hidden && !editing && <p className="whitespace-pre-line pr-3 text-sm lg:pr-0">{text}</p>}
      {editing && (
        <div className="flex flex-col gap-2 pr-2 lg:pr-0">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-lg border border-brand-500 px-3 py-2.5 text-sm leading-5 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={onCancel}>
              Batal
            </Button>
            <Button size="md" onClick={() => onSave(draft)}>
              Simpan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 15: pratinjau ringkasan untuk dokter. Tiap bagian bisa diubah dan disembunyikan sebelum dibagikan.
export default function SummaryDetailPage() {
  const { id } = useParams();
  const session = useStepGuard(PATHS.summaries, { app: true });
  const signOut = useSignOut();
  const navigate = useNavigate();
  const summary = useRecords().summaries.find((s) => s.id === id);

  const [texts, setTexts] = useState({});
  const [hidden, setHidden] = useState({});
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2200);
  };

  const name = session?.profile?.full_name || displayName(session);
  const sections = summary?.sections ?? [];
  const textOf = (s) => texts[s.key] ?? s.text;
  const shown = sections.filter((s) => !hidden[s.key]);

  const asText = () =>
    [
      [name, demographics(session?.profile)].filter(Boolean).join(' · '),
      ...shown.map((s) => `${s.title}:\n${textOf(s)}`),
      FOOTNOTE,
    ].join('\n\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText());
      flash('Ringkasan disalin');
    } catch {
      flash('Gagal menyalin. Coba lagi, ya.');
    }
  };

  // Menu bagikan bawaan HP; di perangkat tanpa itu, jatuh ke salin teks.
  const share = async () => {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: 'Ringkasan untuk dokter', text: asText() });
    } catch (e) {
      if (e.name !== 'AbortError') flash('Gagal membagikan. Coba lagi, ya.');
    }
  };

  return (
    <AppShell
      title="Ringkasan untuk dokter"
      name={displayName(session)}
      onSignOut={signOut}
      hidden={!session}
      mobileTone="muted"
      mobileBar={<MobileBar title="Ringkasan untuk dokter" backTo={PATHS.summaries} />}
      footer={
        summary && (
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={copy}>
              <Copy className="h-[18px] w-[18px]" />
              Salin
            </Button>
            <Button className="flex-1" onClick={share}>
              <Send className="h-[18px] w-[18px]" />
              Bagikan
            </Button>
          </div>
        )
      }
    >
      {!summary ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-ink-secondary">Ringkasan ini nggak ditemukan.</p>
          <Button variant="secondary" onClick={() => navigate(PATHS.summaries)}>
            Ke ringkasan dokter
          </Button>
        </div>
      ) : (
        <div className="flex w-full max-w-[760px] flex-col gap-3 py-4 lg:gap-6 lg:py-8">
          <Link to={PATHS.summaries} className="hidden items-center gap-1.5 self-start text-sm lg:inline-flex">
            <ArrowLeft className="h-4 w-4" />
            Ringkasan dokter
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2 px-1 lg:px-0">
              <h1 className="hidden text-2xl font-bold tracking-tight lg:block">Ringkasan untuk dokter</h1>
              <div className="flex flex-wrap items-center gap-1.5 lg:gap-2">
                <span className="text-sm font-medium lg:font-normal lg:text-ink-secondary">{summary.title}</span>
                <Chip tone={levelTone(summary.level)}>{summary.level}</Chip>
                <span className="hidden text-xs text-ink-tertiary lg:inline">· {summary.updated}</span>
              </div>
            </div>
            <div className="hidden shrink-0 gap-2 lg:flex">
              <Button variant="secondary" size="md" onClick={share}>
                <Send className="h-[18px] w-[18px]" />
                Bagikan
              </Button>
              <Button size="md" onClick={copy}>
                <Copy className="h-[18px] w-[18px]" />
                Salin teks
              </Button>
            </div>
          </div>

          <article className="overflow-hidden rounded-xl border border-line-primary bg-white">
            <header className="flex items-center justify-between gap-3 border-b border-line-primary bg-surface-secondary px-4 py-3.5 lg:px-6 lg:py-5">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold">{name}</span>
                <span className="text-xs text-ink-secondary">{demographics(session?.profile)}</span>
              </div>
              <span className="text-xs text-ink-tertiary">
                {shown.length} dari {sections.length} bagian dibagikan
              </span>
            </header>
            {sections.map((s) => (
              <SectionRow
                key={s.key}
                section={s}
                text={textOf(s)}
                hidden={!!hidden[s.key]}
                editing={editing === s.key}
                onEdit={() => setEditing(s.key)}
                onToggleHide={() => setHidden((h) => ({ ...h, [s.key]: !h[s.key] }))}
                onSave={(value) => {
                  setTexts((t) => ({ ...t, [s.key]: value }));
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            ))}
            <p className={cx('px-4 py-3 text-xs text-ink-tertiary lg:px-6 lg:py-3.5')}>{FOOTNOTE}</p>
          </article>
        </div>
      )}
      {toast && <Toast>{toast}</Toast>}
    </AppShell>
  );
}
