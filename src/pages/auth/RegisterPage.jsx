import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Lock, Trash2, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { STORAGE_KEYS } from '../../lib/flow.js';
import { POLICY_VERSION, resolveNextPath } from '../../lib/profile-api.js';
import { isValidPassword } from '../../utils/password.js';
import { AUTH_REDIRECTS, PATHS, absoluteUrl } from '../../routes/paths.js';
import { useRedirectIfSignedIn } from '../../hooks/useAuthFlow.js';
import { AuthSplitLayout, AuthHeading, AsideHero, OrDivider } from '../../components/layout/AuthSplitLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Checkbox } from '../../components/ui/Checkbox.jsx';
import { Field, PasswordField } from '../../components/ui/Field.jsx';
import { PasswordRules } from '../../components/ui/PasswordRules.jsx';
import { GoogleAuthButton } from './GoogleAuthButton.jsx';

const BENEFITS = [
  { icon: Lock, title: 'Datamu aman', text: 'Selalu dienkripsi dan nggak pernah kami jual.' },
  { icon: UserCheck, title: 'Saran yang pas buat kamu', text: 'Disesuaikan dengan usia dan kondisimu.' },
  { icon: Trash2, title: 'Kamu yang pegang kendali', text: 'Ubah atau hapus datamu kapan aja dari profil.' },
];

function RegisterAside() {
  return (
    <>
      <AsideHero title="Siap dalam 2 menit aja.">Cukup isi 3 data dasar. Sisanya bisa nyusul sambil ngobrol.</AsideHero>
      <ul className="mt-10 max-w-[500px] space-y-5">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold">{title}</span>
              <span className="text-sm text-ink-secondary">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function RegisterPage() {
  useRedirectIfSignedIn();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [tos, setTos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = form.fullName.trim();
    const email = form.email.trim();

    if (!fullName || !email || !form.password) {
      return setMessage({ title: 'Semua kolom wajib diisi', description: 'Lengkapi nama, email, dan password, ya.' });
    }
    if (!isValidPassword(form.password)) {
      return setMessage({
        title: 'Password belum memenuhi syarat',
        description: 'Minimal 8 karakter, berisi huruf dan angka.',
      });
    }

    setMessage(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        // Dibaca trigger database untuk membuat profil & mencatat persetujuan S&K.
        data: { full_name: fullName, edith_tos_at: new Date().toISOString(), edith_policy_version: POLICY_VERSION },
        emailRedirectTo: absoluteUrl(AUTH_REDIRECTS.afterSignIn),
      },
    });
    setLoading(false);

    if (error) return setMessage({ title: friendlyError(error) });

    // Supabase mengembalikan user tanpa identitas bila email sudah terdaftar.
    if (data.user?.identities?.length === 0) {
      return setMessage({ title: 'Email ini sudah terdaftar', description: 'Coba masuk pakai email ini, ya.' });
    }

    // Verifikasi email dimatikan di Supabase: langsung lanjut.
    if (data.session) return navigate(await resolveNextPath(data.session.user), { replace: true });

    sessionStorage.setItem(STORAGE_KEYS.pendingEmail, email);
    sessionStorage.removeItem(STORAGE_KEYS.verifySentAt);
    navigate(PATHS.verifyEmail);
  };

  return (
    <AuthSplitLayout aside={<RegisterAside />}>
      <title>Daftar · EDITH</title>
      <AuthHeading title="Buat akun EDITH" subtitle="Asisten kesehatan pribadi yang siap nemenin kamu, kapan aja." />

      {message && (
        <Banner type="error" title={message.title} className="mt-5">
          {message.description}
        </Banner>
      )}

      <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
        <Field
          id="full_name"
          label="Nama lengkap"
          autoComplete="name"
          placeholder="Nama lengkap kamu"
          value={form.fullName}
          onChange={update('fullName')}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={update('email')}
        />
        <div>
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="Buat password"
            value={form.password}
            onChange={update('password')}
          />
          <PasswordRules value={form.password} />
        </div>
        <Checkbox checked={tos} onChange={(e) => setTos(e.target.checked)}>
          <span className="text-xs leading-[18px] text-ink-secondary">
            Aku setuju dengan <a href="#">Syarat &amp; Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> EDITH.
          </span>
        </Checkbox>
        <Button type="submit" className="w-full" disabled={!tos} loading={loading} loadingText="Membuat akun...">
          Buat akun
        </Button>
      </form>

      <OrDivider />
      <GoogleAuthButton label="Daftar dengan Google" onError={(msg) => setMessage(msg && { title: msg })} />
      <p className="mt-4 text-center text-sm text-ink-secondary">
        Sudah punya akun? <Link to={PATHS.login}>Masuk</Link>
      </p>
    </AuthSplitLayout>
  );
}
