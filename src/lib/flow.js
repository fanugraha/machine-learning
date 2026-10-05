import { PATHS } from '../routes/paths.js';

// Urutan alur: Masuk/Daftar → (verifikasi email) → Persetujuan data → Onboarding → Dashboard.
// `profile` adalah baris public.profiles milik user (null bila belum ada / belum dimuat).
export function nextPath(user, profile) {
  if (!user) return PATHS.login;
  if (!profile?.health_consent_at) return PATHS.consent;
  if (!profile.onboarded_at) return PATHS.onboarding;
  return PATHS.dashboard;
}

// Kunci penyimpanan browser yang dipakai lintas halaman.
export const STORAGE_KEYS = {
  pendingEmail: 'edith.pendingEmail',
  verifySentAt: 'edith.verifySentAt',
  loginAttempts: 'edith.loginAttempts',
  onboardingDraft: (userId) => 'edith.onboarding.' + userId,
};
