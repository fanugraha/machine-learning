import { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ClipboardList,
  MessageSquare,
  MoreVertical,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { deleteNote, useRecords } from '../../lib/records.js';
import { displayName, levelTone } from '../../lib/display.js';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { MobileBar } from '../../components/layout/MobileBar.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Chip } from '../../components/ui/Chip.jsx';
import { MenuButton } from '../../components/ui/MenuButton.jsx';
import { Overlay } from '../../components/ui/Overlay.jsx';
import { cx } from '../../utils/cx.js';

const Card = ({ title, className, children }) => (
  <section className={cx('flex flex-col gap-4 rounded-xl border border-line-primary bg-white p-4 lg:p-6', className)}>
    <h2 className="font-semibold">{title}</h2>
    {children}
  </section>
);

function Timeline({ steps }) {
  return (
    <ol>
      {steps.map((s, i) => (
        <li key={s.title + i} className="flex gap-3">
          <span className="flex flex-col items-center">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
            {i < steps.length - 1 && <span className="my-1 w-px flex-1 bg-line-primary" />}
          </span>
          <span className="flex flex-col gap-0.5 pb-3 lg:pb-4">
            <span className="text-sm font-medium">{s.title}</span>
            <span className="text-xs text-ink-tertiary">{s.meta}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function ChatToggle({ chat }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="overflow-hidden rounded-xl border border-line-primary bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-secondary lg:px-6 lg:py-4"
      >
        <MessageSquare className="h-5 w-5 text-ink-tertiary" />
        <span className="flex-1 text-sm font-semibold lg:text-base">
          {open ? 'Sembunyikan percakapan' : `Lihat percakapan (${chat.length} pesan)`}
        </span>
        <ChevronDown className={cx('h-5 w-5 text-ink-tertiary transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="flex flex-col gap-2 border-t border-line-primary p-3 lg:px-6 lg:pb-6 lg:pt-4">
          {chat.map((m, i) => (
            <div key={i} className={cx('bubble', m.from === 'user' ? 'bubble-user' : 'bubble-edith')}>
              {m.text}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function DeleteDialog({ title, onCancel, onConfirm }) {
  return (
    <Overlay variant="confirm" label="Hapus catatan" onClose={onCancel}>
      <div className="flex flex-col gap-5 px-5 pb-6 pt-4 lg:p-6">
        <span className="hidden h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 lg:flex">
          <Trash2 className="h-6 w-6" />
        </span>
        <div className="space-y-1">
          <h2 className="text-base font-semibold lg:text-lg">Hapus catatan ini?</h2>
          <p className="text-sm text-ink-secondary">
            EDITH nggak akan ingat lagi keluhan &ldquo;{title}&rdquo;, termasuk percakapannya.
          </p>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row-reverse lg:gap-2">
          <Button className="bg-red-600 text-white hover:bg-red-700 lg:h-9 lg:px-3 lg:text-sm" onClick={onConfirm}>
            Hapus catatan
          </Button>
          <Button variant="ghost" className="lg:h-9 lg:px-3 lg:text-sm" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </div>
    </Overlay>
  );
}

// 13: detail catatan. Inti (saran, ringkasan, perkembangan) tampil dulu; percakapan disembunyikan.
export default function NoteDetailPage() {
  const { id } = useParams();
  const session = useStepGuard(PATHS.notes, { app: true });
  const signOut = useSignOut();
  const navigate = useNavigate();
  const note = useRecords().notes.find((n) => n.id === id);
  const [confirming, setConfirming] = useState(false);

  const menu = [{ label: 'Hapus catatan', icon: Trash2, danger: true, onClick: () => setConfirming(true) }];
  const toSummary = () => navigate(PATHS.summaries);

  const remove = () => {
    deleteNote(id);
    navigate(PATHS.notes, { replace: true });
  };

  return (
    <AppShell
      title={note?.title || 'Catatan'}
      name={displayName(session)}
      onSignOut={signOut}
      hidden={!session}
      mobileTone="muted"
      mobileBar={
        <MobileBar backTo={PATHS.notes}>
          {note && (
            <MenuButton
              label="Lainnya"
              items={menu}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary"
            >
              <MoreVertical className="h-5 w-5" />
            </MenuButton>
          )}
        </MobileBar>
      }
      footer={
        note && (
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={toSummary}>
              Ke dokter
            </Button>
            <Button className="flex-1" disabled title="Segera hadir">
              Kasih kabar terbaru
            </Button>
          </div>
        )
      }
    >
      {!note ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-ink-secondary">Catatan ini nggak ditemukan.</p>
          <Button variant="secondary" onClick={() => navigate(PATHS.notes)}>
            Ke catatan kesehatan
          </Button>
        </div>
      ) : (
        <div className="flex w-full max-w-[1040px] flex-col gap-3 py-5 lg:gap-6 lg:py-8">
          <Link to={PATHS.notes} className="hidden items-center gap-1.5 self-start text-sm lg:inline-flex">
            <ArrowLeft className="h-4 w-4" />
            Catatan kesehatan
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2 px-1 lg:px-0">
              <h1 className="text-xl font-bold tracking-tight lg:text-2xl">{note.title}</h1>
              <div className="flex flex-wrap items-center gap-1.5 lg:gap-2">
                {note.done ? <Chip tone="success">Sudah sembuh</Chip> : note.level && <Chip tone={levelTone(note.level)}>{note.level}</Chip>}
                <span className="text-xs text-ink-tertiary">
                  <span className="hidden lg:inline">{note.type} · </span>
                  {note.span}
                  <span className="hidden lg:inline"> 2026</span>
                </span>
              </div>
            </div>
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <MenuButton
                label="Lainnya"
                items={menu}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-secondary"
              >
                <MoreVertical className="h-5 w-5" />
              </MenuButton>
              <Button variant="secondary" size="md" onClick={toSummary}>
                <ClipboardList className="h-[18px] w-[18px]" />
                Siapkan ke dokter
              </Button>
              <Button size="md" disabled title="Segera hadir">
                Kasih kabar terbaru
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-x-6 lg:gap-y-4">
            {note.advice && (
              <Card title="Saran EDITH" className="lg:col-start-1 lg:row-start-1">
                <Banner type={note.done ? 'success' : levelTone(note.level)} title={note.advice.title}>
                  {note.advice.text}
                </Banner>
                {note.redFlags.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium">Segera ke dokter kalau:</h3>
                    {note.redFlags.map((r) => (
                      <p key={r} className="flex items-start gap-2 text-sm text-ink-secondary">
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        {r}
                      </p>
                    ))}
                  </div>
                )}
                <p className="hidden border-t border-line-primary pt-4 text-xs text-ink-tertiary lg:block">
                  EDITH nggak bisa memastikan penyebabnya. Kalau ragu, periksa ke dokter, ya.
                </p>
              </Card>
            )}
            <Card title="Ringkasan keluhan" className="lg:col-start-1 lg:row-start-2">
              <dl className="flex flex-col gap-3 lg:grid lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-x-4">
                {note.facts.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5 lg:contents">
                    <dt className="text-xs text-ink-tertiary lg:text-sm">{k}</dt>
                    <dd className="text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
            <Card title="Perkembangan" className="lg:col-start-2 lg:row-span-3 lg:row-start-1">
              <Timeline steps={note.timeline} />
            </Card>
            {note.chat.length > 0 && (
              <div className="lg:col-start-1 lg:row-start-3">
                <ChatToggle chat={note.chat} />
              </div>
            )}
          </div>
        </div>
      )}
      {confirming && <DeleteDialog title={note?.title} onCancel={() => setConfirming(false)} onConfirm={remove} />}
    </AppShell>
  );
}
