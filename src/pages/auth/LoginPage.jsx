import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Clock, KeyRound } from 'lucide-react';
import { supabase, setRememberMe } from '../../lib/supabase.js';
import { friendlyError, isEmailNotConfirmed, isInvalidCredentials } from '../../lib/auth-errors.js';
import { nextPath, STORAGE_KEYS } from '../../lib/flow.js';
import { formatTimer } from '../../utils/date.js';
import { PATHS } from '../../routes/paths.js';
import { useRedirectIfSignedIn } from '../../hooks/useAuthFlow.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { AuthSplitLayout, AuthHeading, AsideHero, OrDivider } from '../../components/layout/AuthSplitLayout.jsx';
import { LogoMark } from '../../components/brand/Logo.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Checkbox } from '../../components/ui/Checkbox.jsx';
import { Field, PasswordField } from '../../components/ui/Field.jsx';
import { GoogleAuthButton } from './GoogleAuthButton.jsx';

// Batas percobaan di sisi browser (tampilan saja; batas sebenarnya tetap dari Supabase).
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

const readAttempts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.loginAttempts)) || { count: 0, lockedUntil: 0 };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
};
const saveAttempts = (a) => localStorage.setItem(STORAGE_KEYS.loginAttempts, JSON.stringify(a));

const CHAT_SAMPLE = [
  { from: 'user', text: 'Dua minggu ini aku susah tidur, padahal badan capek.' },
  { from: 'edith', text: 'Duh, pasti nggak enak ya. Biasanya kamu tidur jam berapa? Masih ngopi sore-sore?' },
  { from: 'user', text: 'Jam 1-an. Kopi sore hampir tiap hari.' },
  { from: 'edith', text: 'Coba stop kopi setelah jam 2 siang seminggu ini, ya. Mau aku ingetin tiap malam?' },
];

function LoginAside() {
  return (
    <>
      <AsideHero title="Asisten kesehatan yang paham kamu.">
        Mau tanya soal tidur, makan, atau keluhan ringan? Cerita aja ke EDITH, kapan pun.
      </AsideHero>
      <div className="mt-10 w-full max-w-[500px] overflow-hidden rounded-xl border border-line-primary bg-white shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-line-primary px-4 py-3">
          <LogoMark className="h-7 w-7 rounded-full" iconClassName="h-4 w-4" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">EDITH</span>
            <span className="text-xs text-ink-tertiary">Contoh percakapan</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {CHAT_SAMPLE.map((m) => (
            <div key={m.text} className={'bubble ' + (m.from === 'user' ? 'bubble-user' : 'bubble-edith')}>
              {m.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  useRedirectIfSignedIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { title, description }
  const [fieldError, setFieldError] = useState(false);
  const [lockSeconds, startLock] = useCountdown(readAttempts().lockedUntil);
  const locked = lockSeconds > 0;

  const registerFailure = () => {
    const a = readAttempts();
    a.count += 1;
    if (a.count >= MAX_ATTEMPTS) {
      saveAttempts({ count: 0, lockedUntil: Date.now() + LOCK_MS });
      setMessage(null);
      setFieldError(false);
      startLock(LOCK_MS);
      return;
    }
    saveAttempts(a);
    setFieldError(true);
    setMessage({
      title: 'Email atau password tidak cocok',
      description: `Coba cek lagi, ya. Sisa ${MAX_ATTEMPTS - a.count} kali percobaan.`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setFieldError(false);
      setMessage({ title: 'Email dan password wajib diisi', description: 'Lengkapi dulu, ya.' });
      return;
    }

    setMessage(null);
    setFieldError(false);
    setLoading(true);
    setRememberMe(remember);

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      setLoading(false);
      if (isInvalidCredentials(error)) return registerFailure();
      if (isEmailNotConfirmed(error)) {
        sessionStorage.setItem(STORAGE_KEYS.pendingEmail, email.trim());
        return navigate(PATHS.verifyEmail);
      }
      setMessage({ title: friendlyError(error) });
      return;
    }

    saveAttempts({ count: 0, lockedUntil: 0 });
    navigate(nextPath(data.user), { replace: true });
  };

  return (
    <AuthSplitLayout aside={<LoginAside />}>
      <title>Masuk · EDITH</title>
      <AuthHeading title="Masuk ke EDITH" subtitle="Senang ketemu kamu lagi!" />

      {locked ? (
        <Banner type="warning" icon={Clock} title="Kebanyakan percobaan, nih" className="mt-5">
          Biar akunmu tetap aman, coba lagi dalam {formatTimer(lockSeconds)} atau reset password.
        </Banner>
      ) : (
        message && (
          <Banner type="error" title={message.title} className="mt-5">
            {message.description}
          </Banner>
        )
      )}

      <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalid={fieldError}
          disabled={locked}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Masukkan password kamu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          invalid={fieldError}
          disabled={locked}
        />

        {!locked && (
          <div className="flex items-center justify-between gap-2">
            <Checkbox className="items-center" checked={remember} onChange={(e) => setRemember(e.target.checked)}>
              <span className="whitespace-nowrap text-xs font-medium">
                <span className="lg:hidden">Ingat aku</span>
                <span className="hidden lg:inline">Ingat aku di perangkat ini</span>
              </span>
            </Checkbox>
            <Link to={PATHS.forgotPassword} className="whitespace-nowrap text-xs">
              Lupa password?
            </Link>
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading} disabled={locked}>
          Masuk
        </Button>
        {locked && (
          <Link to={PATHS.forgotPassword} className="btn btn-secondary btn-lg w-full">
            <KeyRound className="h-[18px] w-[18px]" />
            Reset password
          </Link>
        )}
      </form>

      {!locked && (
        <>
          <OrDivider />
          <GoogleAuthButton
            label="Masuk dengan Google"
            remember={remember}
            onError={(msg) => setMessage(msg && { title: msg })}
          />
          <p className="mt-4 text-center text-sm text-ink-secondary">
            Belum punya akun? <Link to={PATHS.register}>Daftar</Link>
          </p>
        </>
      )}
    </AuthSplitLayout>
  );
}
