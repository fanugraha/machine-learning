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

// "5–7 Okt" → "5 Okt"; "28–30 Sep" → "28 Sep"; "2 Okt" → "2 Okt". Bulan diambil dari ujung rentang bila awalnya tanpa bulan.
export function spanStart(span = '') {
  const [from, to = ''] = span.split('–').map((s) => s.trim());
  if (/[A-Za-z]/.test(from)) return from;
  const month = to.match(/[A-Za-z]+/)?.[0];
  return month ? `${from} ${month}` : from;
}

export const spanEnd = (span = '') => span.split('–').pop().trim();

// Teks ringkas catatan untuk daftar dan Beranda. Bila catatan membawa teksnya sendiri, itu yang dipakai.
export const noteSince = (note) => note.since || `Mulai ${spanStart(note.span)}`;
export const noteLast = (note) => {
  if (note.last) return note.last;
  const meta = note.timeline?.at(-1)?.meta;
  return meta ? meta.split(',')[0] : 'Belum ada kabar';
};
export const noteDoneMeta = (note) => note.meta || `Sembuh ${spanEnd(note.span)}`;
export const noteQuestionMeta = (note) => note.meta || `Kamu tanya ${spanStart(note.span)}`;
