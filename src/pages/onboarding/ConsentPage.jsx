import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, LogOut, Sparkles, Trash2, TriangleAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { nextPath } from '../../lib/flow.js';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { StepLayout, StepCard } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Checkbox } from '../../components/ui/Checkbox.jsx';
import { DeclineConsentDialog } from './DeclineConsentDialog.jsx';

const POINTS = [
  { icon: Sparkles, text: 'Cuma dipakai biar sarannya pas buat kamu' },
  { icon: Lock, text: 'Dienkripsi dan nggak pernah dijual' },
  { icon: Trash2, text: 'Bisa kamu hapus kapan aja' },
];

export default function ConsentPage() {
  const user = useStepGuard(PATHS.consent);
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [declining, setDeclining] = useState(false);

  const agree = async () => {
    setError(null);
    setSaving(true);
    const { data, error: saveError } = await supabase.auth.updateUser({
      data: { edith_consent_at: new Date().toISOString() },
    });
    if (saveError) {
      setSaving(false);
      return setError(friendlyError(saveError));
    }
    navigate(nextPath(data.user), { replace: true });
  };

  return (
    <StepLayout
      title="Persetujuan data"
      hidden={!user}
      headerRight={
        <Button variant="ghost" size="md" onClick={signOut}>
          <LogOut className="hidden h-[18px] w-[18px] lg:block" />
          Keluar
        </Button>
      }
    >
      <StepCard
        width="lg:w-[600px]"
        bodyClassName="gap-5 px-5 py-6 lg:gap-6 lg:p-10"
        footerClassName="flex flex-col gap-2 lg:flex-row-reverse lg:justify-start"
        footer={
          <>
            <Button
              className="w-full lg:w-auto"
              disabled={!agreed}
              loading={saving}
              loadingText="Menyimpan..."
              onClick={agree}
            >
              Setuju, lanjut
            </Button>
            <Button variant="ghost" className="w-full lg:w-auto" onClick={() => setDeclining(true)}>
              Nggak setuju
            </Button>
          </>
        }
      >
        <h1 className="text-xl font-bold tracking-tight">Boleh EDITH pakai data kesehatanmu?</h1>
        <ul className="space-y-4 text-sm">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-brand-600" />
              {text}
            </li>
          ))}
        </ul>
        <Banner type="warning" icon={TriangleAlert} role="note" title="EDITH bukan pengganti dokter">
          Kalau darurat, langsung hubungi 119, ya.
        </Banner>
        <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} inputClassName="!h-5 !w-5">
          <span className="text-sm">
            Aku setuju data kesehatanku diproses sesuai <a href="#">Kebijakan Privasi</a>.
          </span>
        </Checkbox>
        {error && <Banner type="error" title={error} />}
      </StepCard>

      {declining && <DeclineConsentDialog onReview={() => setDeclining(false)} onLater={signOut} />}
    </StepLayout>
  );
}
