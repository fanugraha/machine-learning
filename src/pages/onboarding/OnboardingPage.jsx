import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCheck } from 'lucide-react';
import { friendlyError } from '../../lib/auth-errors.js';
import { nextPath, STORAGE_KEYS } from '../../lib/flow.js';
import { updateMyProfile } from '../../lib/profile-api.js';
import { isoToDob } from '../../utils/date.js';
import { PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { StepLayout } from '../../components/layout/StepLayout.jsx';
import { EMPTY_PROFILE, validateProfile } from './profile.js';
import { ProfileStep } from './ProfileStep.jsx';
import { GoalsStep } from './GoalsStep.jsx';
import { UnderageWaitlist } from './UnderageWaitlist.jsx';

const AutosaveNote = () => (
  <span className="inline-flex items-center gap-1.5 pr-2 text-xs text-ink-tertiary lg:pr-0">
    <CheckCheck className="h-4 w-4" />
    Progresmu tersimpan otomatis
  </span>
);

const readDraft = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

// Nilai awal: profil yang sudah tersimpan di database, lalu ditimpa draft lokal bila ada.
function initialState(user, profile) {
  const meta = user.user_metadata || {};
  const firstName = (profile?.full_name || meta.full_name || meta.name || '').trim().split(/\s+/)[0];
  const profileDone = !!profile?.birth_date;
  const draft = readDraft(STORAGE_KEYS.onboardingDraft(user.id));

  let form = { ...EMPTY_PROFILE, nickname: firstName };
  if (profileDone) {
    form = {
      nickname: profile.nickname || '',
      dob: isoToDob(profile.birth_date),
      gender: profile.gender || '',
      height: String(profile.height_cm ?? ''),
      weight: String(profile.weight_kg ?? ''),
    };
  }
  if (draft?.profile) form = { ...form, ...draft.profile };

  return {
    firstName,
    form,
    goals: draft?.goals || profile?.goals || [],
    view: profileDone ? 'goals' : 'profile',
  };
}

function OnboardingFlow({ user, profile }) {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const draftKey = STORAGE_KEYS.onboardingDraft(user.id);
  const [initial] = useState(() => initialState(user, profile));

  const [view, setView] = useState(initial.view); // profile | goals | waitlist
  const [form, setForm] = useState(initial.form);
  const [goals, setGoals] = useState(initial.goals);
  const [invalid, setInvalid] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [goalsError, setGoalsError] = useState(null);

  // "Progresmu tersimpan otomatis": simpan draft di browser setiap ada perubahan.
  useEffect(() => {
    if (view === 'waitlist') return;
    localStorage.setItem(draftKey, JSON.stringify({ profile: form, goals }));
  }, [draftKey, form, goals, view]);

  const goTo = (next) => {
    setView(next);
    window.scrollTo(0, 0);
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    const result = validateProfile(form);
    setInvalid(result.invalid);
    if (result.missing.length) {
      return setMessage({ title: 'Masih ada yang kurang', description: `Lengkapi ${result.missing.join(', ')}, ya.` });
    }
    setMessage(null);
    setSaving(true);

    if (result.underage) {
      // Hapus semua data yang sempat diisi, lalu tawarkan daftar tunggu.
      localStorage.removeItem(draftKey);
      const { error } = await updateMyProfile(user.id, {
        nickname: null,
        birth_date: null,
        gender: null,
        height_cm: null,
        weight_kg: null,
        goals: [],
      });
      if (error) console.error('Gagal menghapus data profil:', error);
      setSaving(false);
      setForm(EMPTY_PROFILE);
      setGoals([]);
      return goTo('waitlist');
    }

    const { error } = await updateMyProfile(user.id, result.profile);
    setSaving(false);
    if (error) return setMessage({ title: friendlyError(error) });
    goTo('goals');
  };

  const toggleGoal = (goal) =>
    setGoals((current) => (current.includes(goal) ? current.filter((g) => g !== goal) : [...current, goal]));

  const finish = async () => {
    setGoalsError(null);
    setSaving(true);
    const { data, error } = await updateMyProfile(user.id, { goals, onboarded_at: new Date().toISOString() });
    if (error) {
      setSaving(false);
      return setGoalsError(friendlyError(error));
    }
    localStorage.removeItem(draftKey);
    navigate(nextPath(user, data), { replace: true });
  };

  return (
    <StepLayout title="Kenalan dulu" headerRight={view !== 'waitlist' && <AutosaveNote />}>
      {view === 'profile' && (
        <ProfileStep
          firstName={initial.firstName}
          form={form}
          onChange={setForm}
          invalid={invalid}
          message={message}
          saving={saving}
          onSubmit={submitProfile}
        />
      )}
      {view === 'goals' && (
        <GoalsStep
          selected={goals}
          onToggle={toggleGoal}
          onBack={() => goTo('profile')}
          onFinish={finish}
          saving={saving}
          error={goalsError}
        />
      )}
      {view === 'waitlist' && <UnderageWaitlist defaultEmail={user.email} onExit={signOut} />}
    </StepLayout>
  );
}

export default function OnboardingPage() {
  const session = useStepGuard(PATHS.onboarding);
  if (!session) return <StepLayout title="Kenalan dulu" hidden />;
  return <OnboardingFlow user={session.user} profile={session.profile} />;
}
