import { ageFrom } from '../utils/date.js';

// Nama panggilan: dari profil, atau nama depan akun Google.
export function displayName(session) {
  const meta = session?.user.user_metadata || {};
  return session?.profile?.nickname || (meta.full_name || meta.name || '').split(' ')[0];
}

export const GENDER_LABELS = { female: 'Perempuan', male: 'Laki-laki' };

// "Perempuan · 32 tahun" (bagian yang belum diketahui dilewati).
export function demographics(profile) {
  const age = profile?.birth_date ? ageFrom(new Date(profile.birth_date)) : null;
  return [GENDER_LABELS[profile?.gender], age != null && `${age} tahun`].filter(Boolean).join(' · ');
}

// Warna chip untuk tingkat saran hasil Cek gejala.
export const levelTone = (level) => (level === 'Rawat mandiri' ? 'success' : 'warning');
