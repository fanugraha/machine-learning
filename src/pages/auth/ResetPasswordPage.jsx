import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { resolveNextPath } from '../../lib/profile-api.js';
import { initialHashError } from '../../lib/initial-url.js';
import { isValidPassword } from '../../utils/password.js';
import { AUTH_REDIRECTS, PATHS } from '../../routes/paths.js';
import { StepLayout, StepCard, StatusHeader } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { PasswordField } from '../../components/ui/Field.jsx';
import { PasswordRules } from '../../components/ui/PasswordRules.jsx';
import { IconCircle } from '../../components/ui/IconCircle.jsx';

const LINK_CHECK_MS = 2500;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // checking → form | expired. Error dari Supabase hanya relevan di URL tujuan link email.
  const [status, setStatus] = useState(
    initialHashError && pathname === AUTH_REDIRECTS.passwordReset ? 'expired' : 'checking',
  );
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (status !== 'checking') return;
    // Link di email membawa sesi "recovery"; Supabase memberi tahu lewat event ini.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setStatus('form');
    });
    // Tidak ada sesi setelah jeda singkat: anggap link tidak valid / kedaluwarsa.
    const timer = setTimeout(() => setStatus((s) => (s === 'checking' ? 'expired' : s)), LINK_CHECK_MS);
    return () => {
      data.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      return setMessage({
        type: 'error',
        title: 'Password belum memenuhi syarat',
        description: 'Minimal 8 karakter, berisi huruf dan angka.',
      });
    }
    setMessage(null);
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      setLoading(false);
      return setMessage({ type: 'error', title: friendlyError(error) });
    }
    setMessage({
      type: 'success',
      title: 'Password berhasil diubah',
      description: 'Sebentar, kami arahkan kamu ke EDITH...',
    });
    const next = await resolveNextPath(data.user);
    setTimeout(() => navigate(next, { replace: true }), 1500);
  };

  return (
    <StepLayout title="Password baru" logoLinksHome>
      {status === 'checking' && (
        <p className="px-5 pt-14 text-center text-sm text-ink-secondary lg:p-10">Memeriksa link...</p>
      )}

      {status === 'expired' && (
        <StepCard width="lg:w-[440px]" bodyClassName="items-center gap-6 px-5 pb-6 pt-14 text-center lg:p-10">
          <StatusHeader icon={<IconCircle icon={Clock} tone="warning" />} title="Yah, link-nya sudah kedaluwarsa">
            Link cuma aktif 24 jam biar akunmu aman. Minta link baru, yuk.
          </StatusHeader>
          <Link to={PATHS.forgotPassword} className="btn btn-primary btn-lg mt-auto w-full lg:mt-0">
            Kirim link baru
          </Link>
        </StepCard>
      )}

      {status === 'form' && (
        <StepCard as="form" onSubmit={handleSubmit} width="lg:w-[440px]" bodyClassName="gap-6 px-5 pb-6 pt-14 lg:p-10">
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-bold tracking-tight">Bikin password baru</h1>
            <p className="text-sm leading-5 text-ink-secondary">
              Pakai password yang belum pernah kamu pakai di EDITH, ya.
            </p>
          </div>
          <div>
            <PasswordField
              id="password"
              label="Password baru"
              autoComplete="new-password"
              placeholder="Buat password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordRules value={password} />
          </div>
          {message && (
            <Banner type={message.type} title={message.title}>
              {message.description}
            </Banner>
          )}
          <Button type="submit" className="mt-auto w-full lg:mt-0" loading={loading} loadingText="Menyimpan...">
            Simpan password
          </Button>
        </StepCard>
      )}
    </StepLayout>
  );
}
