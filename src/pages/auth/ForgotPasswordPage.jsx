import { useState } from 'react';
import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { formatTimer } from '../../utils/date.js';
import { AUTH_REDIRECTS, PATHS, absoluteUrl } from '../../routes/paths.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { FormScreen } from '../../components/layout/FormScreen.jsx';
import { StepLayout, StepCard, StatusHeader } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { IconCircle } from '../../components/ui/IconCircle.jsx';

const COOLDOWN_MS = 60 * 1000; // jeda sebelum boleh kirim ulang
const SPAM_HINT = 'Link-nya berlaku 1 jam. Belum masuk? Coba cek folder Spam.';

const sendResetLink = (email) =>
  supabase.auth.resetPasswordForEmail(email, { redirectTo: absoluteUrl(AUTH_REDIRECTS.passwordReset) });

// 1m / 2k: link reset terkirim + kirim ulang dengan jeda.
// Pesan sama baik email terdaftar maupun tidak, agar akun tidak bisa ditebak.
function LinkSent({ email }) {
  const [cooldown, startCooldown] = useCountdown(() => Date.now() + COOLDOWN_MS);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  const resend = async () => {
    setMessage(null);
    setSending(true);
    const { error } = await sendResetLink(email);
    setSending(false);
    if (error) return setMessage({ type: 'error', title: friendlyError(error) });
    startCooldown(COOLDOWN_MS);
    setMessage({
      type: 'success',
      title: 'Link baru sudah dikirim',
      description: 'Cek kotak masuk atau folder Spam, ya.',
    });
  };

  return (
    <StepLayout title="Link sudah dikirim" header={false}>
      <StepCard
        fullScreen
        width="lg:w-[440px]"
        bodyClassName="gap-6 px-5 pb-6 pt-[72px] lg:px-10 lg:pb-0 lg:pt-10"
        footerClassName="flex flex-col gap-2 lg:border-0 lg:pb-10 lg:pt-6"
        footer={
          <>
            <Button
              variant="secondary"
              className="w-full"
              disabled={cooldown > 0}
              loading={sending}
              loadingText="Mengirim..."
              onClick={resend}
            >
              {cooldown > 0 ? `Kirim ulang link (${formatTimer(cooldown)})` : 'Kirim ulang link'}
            </Button>
            <Link to={PATHS.login} className="btn btn-ghost btn-lg w-full">
              Kembali ke halaman masuk
            </Link>
            <p className="hidden pt-4 text-center text-xs text-ink-tertiary lg:block">{SPAM_HINT}</p>
          </>
        }
      >
        <StatusHeader icon={<IconCircle icon={Mail} />} title="Link sudah dikirim">
          Cek email <strong className="font-semibold text-ink-primary">{email}</strong>, lalu klik link-nya buat bikin
          password baru.
        </StatusHeader>
        <p className="text-center text-xs text-ink-tertiary lg:hidden">{SPAM_HINT}</p>
        {message && (
          <Banner type={message.type} title={message.title}>
            {message.description}
          </Banner>
        )}
      </StepCard>
    </StepLayout>
  );
}

// 1l / 2j: minta link reset.
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
    const { error: resetError } = await sendResetLink(address);
    setLoading(false);
    if (resetError) return setError(friendlyError(resetError));
    setSentTo(address);
  };

  if (sentTo) return <LinkSent email={sentTo} />;

  return (
    <FormScreen
      title="Lupa password"
      backTo={PATHS.login}
      heading="Lupa password?"
      subtitle="Tenang, masukkan email kamu. Kami kirim link buat bikin password baru."
      onSubmit={handleSubmit}
      action={
        <Button type="submit" className="w-full" loading={loading} loadingText="Mengirim...">
          Kirim link
        </Button>
      }
    >
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
    </FormScreen>
  );
}
