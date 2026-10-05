import { useState } from 'react';
import { Link } from 'react-router';
import { KeyRound, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { AUTH_REDIRECTS, PATHS, absoluteUrl } from '../../routes/paths.js';
import { StepLayout, StepCard, StatusHeader } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { IconCircle } from '../../components/ui/IconCircle.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = email.trim();
    if (!address) return setError('Email wajib diisi');

    setError(null);
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(address, {
      redirectTo: absoluteUrl(AUTH_REDIRECTS.passwordReset),
    });
    setLoading(false);
    if (resetError) return setError(friendlyError(resetError));

    // Pesan sama baik email terdaftar maupun tidak, agar akun tidak bisa ditebak.
    setSentTo(address);
  };

  const backLink = (variant) => (
    <Link to={PATHS.login} className={`btn btn-${variant} btn-lg w-full`}>
      Kembali ke halaman masuk
    </Link>
  );

  return (
    <StepLayout title="Lupa password" logoLinksHome>
      {sentTo ? (
        <StepCard width="lg:w-[440px]" bodyClassName="items-center gap-6 px-5 pb-6 pt-14 text-center lg:p-10">
          <StatusHeader icon={<IconCircle icon={Mail} />} title="Cek email kamu, ya">
            Kalau <strong className="font-semibold text-ink-primary">{sentTo}</strong> terdaftar, link buat bikin
            password baru sudah kami kirim.
          </StatusHeader>
          <p className="text-xs text-ink-tertiary">Link-nya berlaku 24 jam. Belum masuk? Coba cek folder Spam.</p>
          <div className="mt-auto w-full lg:mt-0">{backLink('secondary')}</div>
        </StepCard>
      ) : (
        <StepCard as="form" onSubmit={handleSubmit} width="lg:w-[440px]" bodyClassName="gap-6 px-5 pb-6 pt-14 lg:p-10">
          <StatusHeader icon={<IconCircle icon={KeyRound} />} title="Lupa password?">
            Tenang, masukkan emailmu dan kami kirim link buat bikin password baru.
          </StatusHeader>
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <Banner type="error" title={error} />}
          <div className="mt-auto flex flex-col gap-2 lg:mt-0">
            <Button type="submit" className="w-full" loading={loading} loadingText="Mengirim...">
              Kirim link reset
            </Button>
            {backLink('ghost')}
          </div>
        </StepCard>
      )}
    </StepLayout>
  );
}
