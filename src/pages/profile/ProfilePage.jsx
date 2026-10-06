import { useState } from 'react';
import {
  HeartPulse,
  Info,
  MoreVertical,
  Pencil,
  Phone,
  Pill,
  Plus,
  Settings,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { addProfileItem, removeProfileItem, useRecords } from '../../lib/records.js';
import { demographics, displayName, GENDER_LABELS } from '../../lib/display.js';
import { ageFrom } from '../../utils/date.js';
import { Avatar, AppShell } from '../../components/layout/AppShell.jsx';
import { BarIconButton, MobileBar } from '../../components/layout/MobileBar.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { MenuButton } from '../../components/ui/MenuButton.jsx';
import { Overlay } from '../../components/ui/Overlay.jsx';
import { cx } from '../../utils/cx.js';

// Isi Profil kesehatan (F7). Kolom pertama tiap bagian jadi nama item, sisanya jadi keterangan.
const SECTIONS = [
  {
    key: 'allergy',
    title: 'Alergi',
    icon: TriangleAlert,
    empty: 'Belum ada',
    addTitle: 'Tambah alergi',
    note: 'EDITH pakai info ini biar nggak menyarankan hal yang bikin kamu alergi.',
    fields: [
      { name: 'name', label: 'Alergi terhadap', placeholder: 'Contoh: udang, debu, ibuprofen' },
      { name: 'detail', label: 'Reaksinya', placeholder: 'Contoh: gatal, sesak, bengkak', optional: true },
    ],
  },
  {
    key: 'meds',
    title: 'Obat rutin',
    icon: Pill,
    empty: 'Belum ada',
    addTitle: 'Tambah obat rutin',
    fields: [
      { name: 'name', label: 'Nama obat', placeholder: 'Contoh: amlodipine' },
      { name: 'purpose', label: 'Untuk apa', placeholder: 'Contoh: darah tinggi', optional: true },
      { name: 'dose', label: 'Cara minum dari dokter', placeholder: 'Contoh: 1x sehari, pagi', optional: true },
    ],
  },
  {
    key: 'history',
    title: 'Riwayat penyakit',
    icon: HeartPulse,
    empty: 'Belum ada',
    addTitle: 'Tambah riwayat penyakit',
    fields: [
      { name: 'name', label: 'Penyakit', placeholder: 'Contoh: maag, hipertensi' },
      { name: 'since', label: 'Sejak kapan', placeholder: 'Contoh: 2022', optional: true },
    ],
  },
  {
    key: 'blood',
    title: 'Golongan darah',
    icon: Info,
    empty: 'Belum ada. Isi kalau kamu tahu, ya.',
    addTitle: 'Tambah golongan darah',
    fields: [{ name: 'name', label: 'Golongan darah', placeholder: 'Contoh: O' }],
  },
  {
    key: 'contact',
    title: 'Kontak darurat',
    icon: Phone,
    empty: 'Belum ada. Orang yang bisa dihubungi saat darurat.',
    addTitle: 'Tambah kontak darurat',
    fields: [
      { name: 'name', label: 'Nama', placeholder: 'Contoh: Budi (suami)' },
      { name: 'phone', label: 'Nomor telepon', placeholder: 'Contoh: 0812…', optional: true },
    ],
  },
];

function AddSheet({ section, onClose }) {
  const [values, setValues] = useState({});
  const [first, ...rest] = section.fields;
  const name = (values[first.name] || '').trim();

  const save = (e) => {
    e.preventDefault();
    if (!name) return;
    const detail = rest.map((f) => (values[f.name] || '').trim()).filter(Boolean);
    addProfileItem(section.key, { name, meta: [...detail, 'kamu tambahkan sendiri'].join(' · ') });
    onClose();
  };

  return (
    <Overlay variant="drawer" label={section.addTitle} onClose={onClose}>
      <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-5 pb-1 pt-4 lg:border-b lg:border-line-primary lg:py-5 lg:pl-6 lg:pr-4">
          <h2 className="text-lg font-semibold">{section.addTitle}</h2>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-secondary lg:flex"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 lg:p-6">
          {section.fields.map((f, i) => (
            <Field
              key={f.name}
              id={`add-${f.name}`}
              label={
                f.optional ? (
                  <>
                    {f.label} <span className="font-normal text-ink-tertiary">(opsional)</span>
                  </>
                ) : (
                  f.label
                )
              }
              placeholder={f.placeholder}
              value={values[f.name] || ''}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              autoFocus={i === 0}
              autoComplete="off"
            />
          ))}
          {section.note && <p className="text-xs text-ink-tertiary">{section.note}</p>}
        </div>
        <div className="flex flex-col gap-2 px-5 pb-6 pt-1 lg:flex-row-reverse lg:justify-start lg:border-t lg:border-line-primary lg:px-6 lg:py-4">
          <Button type="submit" disabled={!name} className="lg:h-9 lg:px-3 lg:text-sm">
            Simpan
          </Button>
          <Button variant="ghost" onClick={onClose} className="lg:h-9 lg:px-3 lg:text-sm">
            Batal
          </Button>
        </div>
      </form>
    </Overlay>
  );
}

function SectionCard({ section, items, onAdd }) {
  const Icon = section.icon;
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-line-primary bg-white">
      <div className="flex items-center gap-2.5 py-2 pl-4 pr-1 lg:gap-3 lg:py-3.5 lg:pl-5 lg:pr-3">
        <span className="flex shrink-0 items-center justify-center text-brand-600 lg:h-8 lg:w-8 lg:rounded-lg lg:bg-brand-50">
          <Icon className="h-5 w-5 lg:h-[18px] lg:w-[18px]" />
        </span>
        <h2 className="flex-1 font-semibold">{section.title}</h2>
        <button
          type="button"
          aria-label={section.addTitle}
          onClick={onAdd}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary lg:h-8 lg:w-auto lg:gap-1 lg:px-2.5 lg:text-sm lg:font-semibold"
        >
          <Plus className="h-5 w-5 lg:h-4 lg:w-4" />
          <span className="hidden lg:inline">Tambah</span>
        </button>
      </div>
      {items.length === 0 && (
        <p className="px-4 pb-3.5 text-sm text-ink-tertiary lg:px-5 lg:pb-[18px]">{section.empty}</p>
      )}
      {items.map((it, i) => (
        <div
          key={it.name + i}
          className="flex items-center gap-2 border-t border-line-primary py-2.5 pl-4 pr-1 lg:py-3 lg:pl-5 lg:pr-3"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-sm font-medium">{it.name}</span>
            <span className="text-xs text-ink-tertiary">{it.meta}</span>
          </span>
          <MenuButton
            label="Lainnya"
            items={[{ label: 'Hapus', icon: Trash2, danger: true, onClick: () => removeProfileItem(section.key, i) }]}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-tertiary hover:bg-surface-secondary lg:h-7 lg:w-7"
          >
            <MoreVertical className="h-[18px] w-[18px]" />
          </MenuButton>
        </div>
      ))}
    </section>
  );
}

const Fact = ({ label, children }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-ink-tertiary">{label}</span>
    <span className="font-semibold">{children}</span>
  </div>
);

// 14: Profil kesehatan — yang EDITH ingat tentang pengguna.
export default function ProfilePage() {
  const session = useStepGuard(PATHS.profile, { app: true });
  const signOut = useSignOut();
  const { profileItems } = useRecords();
  const [adding, setAdding] = useState(null);

  const name = displayName(session);
  const profile = session?.profile;
  const filled = SECTIONS.filter((s) => profileItems[s.key].length > 0).length;
  const filledLabel = `${filled} dari ${SECTIONS.length} sudah diisi`;

  return (
    <AppShell
      title="Profil kesehatan"
      name={name}
      onSignOut={signOut}
      hidden={!session}
      mobileTone="muted"
      mobileBar={
        <MobileBar title="Profil kesehatan" backTo={PATHS.home}>
          <BarIconButton icon={Settings} label="Pengaturan & privasi" disabled title="Segera hadir" />
        </MobileBar>
      }
    >
      <div className="flex w-full max-w-[880px] flex-col gap-3 py-4 lg:gap-6 lg:py-10">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-1 px-1 lg:px-0">
            <h1 className="hidden text-2xl font-bold tracking-tight lg:block">Profil kesehatan</h1>
            <p className="text-sm text-ink-secondary lg:text-base">
              Yang EDITH ingat tentang kamu. Bisa kamu ubah atau hapus kapan aja.
            </p>
          </div>
          <span className="hidden shrink-0 text-xs text-ink-tertiary lg:block">{filledLabel}</span>
        </div>

        <section className="flex flex-col gap-3 rounded-xl border border-line-primary bg-white p-4 lg:flex-row lg:items-center lg:gap-4 lg:px-6 lg:py-5">
          <div className="flex items-center gap-3 lg:contents">
            <span className="lg:hidden">
              <Avatar name={name} size="md" />
            </span>
            <span className="hidden lg:block">
              <Avatar name={name} size="lg" />
            </span>
            <span className="flex flex-1 flex-col lg:hidden">
              <span className="font-semibold">{name}</span>
              <span className="text-xs text-ink-tertiary">{demographics(profile)}</span>
            </span>
          </div>
          <div className="hidden flex-1 grid-cols-3 gap-4 lg:grid">
            <Fact label="Nama panggilan">{name}</Fact>
            <Fact label="Usia">{profile?.birth_date ? `${ageFrom(new Date(profile.birth_date))} tahun` : '-'}</Fact>
            <Fact label="Jenis kelamin">{GENDER_LABELS[profile?.gender] || '-'}</Fact>
          </div>
          <Button variant="secondary" size="md" disabled title="Segera hadir" className="hidden lg:inline-flex">
            <Pencil className="h-[18px] w-[18px]" />
            Ubah
          </Button>
          <span className="text-xs text-ink-tertiary lg:hidden">{filledLabel}</span>
        </section>

        <div className={cx('flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4')}>
          {SECTIONS.map((s) => (
            <SectionCard key={s.key} section={s} items={profileItems[s.key]} onAdd={() => setAdding(s)} />
          ))}
        </div>
      </div>
      {adding && <AddSheet section={adding} onClose={() => setAdding(null)} />}
    </AppShell>
  );
}
