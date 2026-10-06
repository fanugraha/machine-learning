import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { CircleCheck, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { initialHashError } from '../../lib/initial-url.js';
import { isValidPassword } from '../../utils/password.js';
import { AUTH_REDIRECTS, PATHS } from '../../routes/paths.js';
import { FormScreen } from '../../components/layout/FormScreen.jsx';
import { StepLayout, StepCard, StatusHeader } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Checkbox } from '../../components/ui/Checkbox.jsx';
import { PasswordField } from '../../components/ui/Field.jsx';
import { PasswordRules } from '../../components/ui/PasswordRules.jsx';
import { IconCircle } from '../../components/ui/IconCircle.jsx';

const LINK_CHECK_MS = 2500;

// 1i: link reset kedaluwarsa / tidak valid.
function LinkExpired() {
  return (
    <StepLayout title="Link kedaluwarsa" logoLinksHome>
      <StepCard width="lg:w-[440px]" bodyClassName="items-center gap-6 px-5 pb-6 pt-14 text-center lg:p-10">
        <StatusHeader icon={<IconCircle icon={Clock} tone="warning" />} title="Yah, link-nya sudah kedaluwarsa">
          Link cuma aktif sebentar biar akunmu aman. Minta link baru, yuk.
        </StatusHeader>
        <Link to={PATHS.forgotPassword} className="btn btn-primary btn-lg mt-auto w-full lg:mt-0">
          Kirim link baru
        </Link>
      </StepCard>
    </StepLayout>
  );
}

// 1o: password berhasil diganti. Pengguna diminta masuk lagi dengan password baru.
function PasswordChanged() {
  return (
    <StepLayout title="Password diganti" header={false}>
      <StepCard
        fullScreen
        width="lg:w-[440px]"
        bodyClassName="gap-6 px-5 pb-6 pt-[72px] lg:p-10 lg:pb-0"
        footerClassName="lg:border-0 lg:pb-10 lg:pt-6"
        footer={
          <Link to={PATHS.login} className="btn btn-primary btn-lg w-full">
            Masuk
          </Link>
        }
      >
        <StatusHeader icon={<IconCircle icon={CircleCheck} tone="success" />} title="Password baru sudah aktif">
          Yuk, masuk lagi pakai password barumu.
        </StatusHeader>
      </StepCard>
    </StepLayout>
  );
}

export default function ResetPasswordPage() {
  const { pathname } = useLocation();
  // checking → form → done, atau expired. Error dari Supabase hanya relevan di URL tujuan link email.
  const [status, setStatus] = useState(
    initialHashError && pathname === AUTH_REDIRECTS.passwordReset ? 'expired' : 'checking',
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logoutAll, setLogoutAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (status !== 'checking') return;
    // Link di email membawa sesi "recovery"; Supabase memberi tahu lewat event ini.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setEmail(session?.user?.email || '');
        setStatus('form');
      }
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
        title: 'Password belum memenuhi syarat',
        description: 'Minimal 8 karakter, berisi huruf dan angka.',
      });
    }
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setLoading(false);
      return setMessage({ title: friendlyError(error) });
    }
    // Keluar dari sesi pemulihan. "global" juga mengeluarkan akun dari semua perangkat lain.
    await supabase.auth.signOut({ scope: logoutAll ? 'global' : 'local' });
    setStatus('done');
  };

  if (status === 'checking') {
    return (
      <StepLayout title="Password baru" logoLinksHome>
        <p className="px-5 pt-14 text-center text-sm text-ink-secondary lg:p-10">Memeriksa link...</p>
      </StepLayout>
    );
  }
  if (status === 'expired') return <LinkExpired />;
  if (status === 'done') return <PasswordChanged />;

  // 1n / 2l: bikin password baru.
  return (
    <FormScreen
      title="Password baru"
      heading="Bikin password baru"
      subtitle={email && `Untuk akun ${email}`}
      onSubmit={handleSubmit}
      action={
        <Button type="submit" className="w-full" loading={loading} loadingText="Menyimpan...">
          Simpan password
        </Button>
      }
    >
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
      <Checkbox className="items-center" checked={logoutAll} onChange={(e) => setLogoutAll(e.target.checked)}>
        <span className="text-xs leading-[18px] text-ink-secondary">Keluarkan akun dari semua perangkat lain</span>
      </Checkbox>
      {message && (
        <Banner type="error" title={message.title}>
          {message.description}
        </Banner>
      )}
    </FormScreen>
  );
}
