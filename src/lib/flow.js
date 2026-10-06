import { PATHS } from '../routes/paths.js';

// Urutan alur (PRD v2.0): Masuk/Daftar → (verifikasi email) → Persetujuan data → Profil dasar → Beranda.
// `profile` adalah baris public.profiles milik user (null bila belum ada / belum dimuat).
export function nextPath(user, profile) {
  if (!user) return PATHS.login;
  if (!profile?.health_consent_at) return PATHS.consent;
  if (!profile.onboarded_at) return PATHS.onboarding;
  return PATHS.home;
}

// Kunci penyimpanan browser yang dipakai lintas halaman.
export const STORAGE_KEYS = {
  pendingEmail: 'edith.pendingEmail',
  verifySentAt: 'edith.verifySentAt',
  loginAttempts: 'edith.loginAttempts',
  onboardingDraft: (userId) => 'edith.onboarding.' + userId,
  linkedNoticeShown: (userId) => 'edith.linkedNotice.' + userId,
};

// Email yang sudah terdaftar lalu masuk dengan Google: Supabase menggabungkan akun otomatis
// (identitas Google ditambahkan ke user lama). Benar bila penggabungan baru saja terjadi.
export function isNewlyLinkedGoogle(user, now = Date.now()) {
  const identities = user?.identities || [];
  const google = identities.find((i) => i.provider === 'google');
  const others = identities.filter((i) => i.provider !== 'google');
  if (!google || !others.length) return false;
  const linkedAt = new Date(google.created_at).getTime();
  const firstAt = Math.min(...others.map((i) => new Date(i.created_at).getTime()));
  return linkedAt - firstAt > 60 * 1000 && now - linkedAt < 10 * 60 * 1000;
}
