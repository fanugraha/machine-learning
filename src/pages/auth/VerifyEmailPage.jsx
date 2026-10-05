import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { Clock, LogOut, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { STORAGE_KEYS } from '../../lib/flow.js';
import { formatTimer } from '../../utils/date.js';
import { AUTH_REDIRECTS, PATHS, absoluteUrl } from '../../routes/paths.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useSignOut } from '../../hooks/useAuthFlow.js';
import { StepLayout, StepCard, StatusHeader } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { IconCircle } from '../../components/ui/IconCircle.jsx';

const COOLDOWN_MS = 60 * 1000; // jeda sebelum boleh kirim ulang

const resendSignupLink = (email) =>
  supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: absoluteUrl(AUTH_REDIRECTS.afterSignIn) },
  });

const SPAM_HINT = 'Link-nya berlaku 24 jam. Belum masuk? Coba cek folder Spam.';

// 1c: "Cek email kamu" + kirim ulang dengan jeda.
function CheckInbox({ email }) {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [initialEndsAt] = useState(() => {
    let sentAt = Number(sessionStorage.getItem(STORAGE_KEYS.verifySentAt));
    if (!sentAt) {
      sentAt = Date.now();
      sessionStorage.setItem(STORAGE_KEYS.verifySentAt, String(sentAt));
    }
    return sentAt + COOLDOWN_MS;
  });
  const [cooldown, startCooldown] = useCountdown(initialEndsAt);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null); // { type, title, description }

  const clearPending = () => {
    sessionStorage.removeItem(STORAGE_KEYS.pendingEmail);
    sessionStorage.removeItem(STORAGE_KEYS.verifySentAt);
  };

  const resend = async () => {
    setMessage(null);
    setSending(true);
    const { error } = await resendSignupLink(email);
    setSending(false);
    if (error) return setMessage({ type: 'error', title: friendlyError(error) });
    sessionStorage.setItem(STORAGE_KEYS.verifySentAt, String(Date.now()));
    startCooldown(COOLDOWN_MS);
    setMessage({
      type: 'success',
      title: 'Link baru sudah dikirim',
      description: 'Cek kotak masuk atau folder Spam, ya.',
    });
  };

  return (
    <StepLayout
      title="Verifikasi email"
      headerRight={
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            clearPending();
            signOut();
          }}
        >
          <LogOut className="hidden h-[18px] w-[18px] lg:block" />
          Keluar
        </Button>
      }
    >
      <StepCard
        width="lg:w-[480px]"
        bodyClassName="gap-6 px-5 pb-6 pt-16 lg:px-10 lg:pb-0 lg:pt-10"
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
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                clearPending();
                navigate(PATHS.register);
              }}
            >
              Ganti email
            </Button>
            <p className="hidden pt-4 text-center text-xs text-ink-tertiary lg:block">{SPAM_HINT}</p>
          </>
        }
      >
        <StatusHeader icon={<IconCircle icon={Mail} />} title="Cek email kamu, ya">
          Kami sudah kirim link verifikasi ke <strong className="font-semibold text-ink-primary">{email}</strong>. Klik
          link-nya buat aktifin akunmu.
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

// 1i: link verifikasi kedaluwarsa.
function LinkExpired({ knownEmail }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = knownEmail || email.trim();
    if (!address) return setError('Email wajib diisi');
    setError(null);
    setSending(true);
    const { error: resendError } = await resendSignupLink(address);
    setSending(false);
    if (resendError) return setError(friendlyError(resendError));
    // Kembali ke layar "Cek email kamu" dengan jeda kirim ulang baru.
    sessionStorage.setItem(STORAGE_KEYS.pendingEmail, address);
    sessionStorage.setItem(STORAGE_KEYS.verifySentAt, String(Date.now()));
    navigate(PATHS.verifyEmail, { replace: true });
  };

  return (
    <StepLayout title="Verifikasi email">
      <StepCard
        as="form"
        onSubmit={handleSubmit}
        width="lg:w-[440px]"
        bodyClassName="items-center gap-6 px-5 pb-6 pt-16 text-center lg:p-10"
      >
        <StatusHeader icon={<IconCircle icon={Clock} tone="warning" />} title="Yah, link-nya sudah kedaluwarsa">
          {knownEmail
            ? `Link cuma aktif 24 jam biar akunmu aman. Tenang, kami kirim yang baru ke ${knownEmail}.`
            : 'Link cuma aktif 24 jam biar akunmu aman. Masukkan emailmu, nanti kami kirim yang baru.'}
        </StatusHeader>
        {!knownEmail && (
          <Field
            id="expired-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            className="w-full text-left"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        {error && <Banner type="error" title={error} className="w-full text-left" />}
        <Button type="submit" className="mt-auto w-full lg:mt-0" loading={sending} loadingText="Mengirim...">
          Kirim link baru
        </Button>
      </StepCard>
    </StepLayout>
  );
}

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const email = sessionStorage.getItem(STORAGE_KEYS.pendingEmail);

  if (params.has('expired')) return <LinkExpired knownEmail={email} />;
  if (!email) return <Navigate to={PATHS.login} replace />;
  return <CheckInbox email={email} />;
}
