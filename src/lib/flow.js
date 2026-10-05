import { PATHS } from '../routes/paths.js';

// Urutan alur: Masuk/Daftar → (verifikasi email) → Persetujuan data → Onboarding → Dashboard.
// Progres disimpan di user_metadata Supabase agar ikut ke perangkat lain.
export function nextPath(user) {
  if (!user) return PATHS.login;
  const meta = user.user_metadata || {};
  if (!meta.edith_consent_at) return PATHS.consent;
  if (!meta.edith_onboarded_at) return PATHS.onboarding;
  return PATHS.dashboard;
}

// Kunci penyimpanan browser yang dipakai lintas halaman.
export const STORAGE_KEYS = {
  pendingEmail: 'edith.pendingEmail',
  verifySentAt: 'edith.verifySentAt',
  loginAttempts: 'edith.loginAttempts',
  onboardingDraft: (userId) => 'edith.onboarding.' + userId,
};
