import { useState } from 'react';
import { User } from 'lucide-react';
import { joinWaitlist } from '../../lib/profile-api.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { StepCard, StatusHeader } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { IconCircle } from '../../components/ui/IconCircle.jsx';

// 1k / 2i: usia di bawah 18 tahun. Data profil sudah dihapus sebelum layar ini tampil.
export function UnderageWaitlist({ defaultEmail, onExit }) {
  const [email, setEmail] = useState(defaultEmail || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = email.trim();
    if (!address) return setMessage({ type: 'error', title: 'Email wajib diisi' });
    setSaving(true);
    const { error } = await joinWaitlist(address);
    setSaving(false);
    if (error) return setMessage({ type: 'error', title: friendlyError(error) });
    setMessage({
      type: 'success',
      title: 'Siap, nanti kami kabari!',
      description: `Kami akan kirim kabar ke ${address}.`,
    });
  };

  const done = message?.type === 'success';

  return (
    <StepCard
      as="form"
      onSubmit={handleSubmit}
      width="lg:w-[440px]"
      bodyClassName="items-center gap-6 px-5 pb-6 pt-14 text-center lg:p-10"
    >
      <StatusHeader icon={<IconCircle icon={User} tone="info" />} title="Sabar sebentar, ya!">
        EDITH baru bisa dipakai usia 18+. Tinggalin email, nanti kami kabari kalau sudah bisa, ya!
      </StatusHeader>
      <div className="flex w-full flex-col gap-3 text-left">
        <Field
          id="waitlist-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && (
          <Banner type={message.type} title={message.title}>
            {message.description}
          </Banner>
        )}
        <Button type="submit" className="w-full" disabled={done} loading={saving} loadingText="Menyimpan...">
          Kabari aku
        </Button>
        <Button variant="ghost" className="w-full" onClick={onExit}>
          Kembali ke halaman awal
        </Button>
      </div>
      <p className="text-xs text-ink-tertiary">Data yang sempat kamu isi sudah kami hapus.</p>
    </StepCard>
  );
}
