import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { STORAGE_KEYS } from '../../lib/flow.js';
import { resolveNextPath } from '../../lib/profile-api.js';
import { PATHS } from '../../routes/paths.js';
import { StepLayout, StepCard, StatusHeader } from '../../components/layout/StepLayout.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { IconCircle } from '../../components/ui/IconCircle.jsx';

// 1p / 2m: email sudah terdaftar lalu masuk dengan Google — akun digabung otomatis.
export default function AccountLinkedPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(undefined); // undefined = memuat, null = belum login
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const current = data.session?.user ?? null;
      if (current) localStorage.setItem(STORAGE_KEYS.linkedNoticeShown(current.id), '1'); // tampil sekali saja
      setUser(current);
    });
  }, []);

  if (user === null) return <Navigate to={PATHS.login} replace />;

  const proceed = async () => {
    setBusy(true);
    navigate(await resolveNextPath(user), { replace: true });
  };

  return (
    <StepLayout title="Akun tersambung" header={false} hidden={!user}>
      <StepCard
        fullScreen
        width="lg:w-[440px]"
        bodyClassName="gap-6 px-5 pb-6 pt-[72px] lg:p-10 lg:pb-0"
        footerClassName="lg:border-0 lg:pb-10 lg:pt-6"
        footer={
          <Button className="w-full" loading={busy} onClick={proceed}>
            Lanjut
          </Button>
        }
      >
        <StatusHeader icon={<IconCircle icon={UserCheck} />} title="Akunmu sudah tersambung ke Google">
          <strong className="font-semibold text-ink-primary">{user?.email}</strong> sudah terdaftar, jadi kami
          gabungkan. Mulai sekarang kamu bisa masuk pakai Google atau password.
        </StatusHeader>
      </StepCard>
    </StepLayout>
  );
}
