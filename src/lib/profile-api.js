import { supabase } from './supabase.js';
import { nextPath } from './flow.js';

// Versi Syarat & Ketentuan / Kebijakan Privasi yang disetujui pengguna. Naikkan saat dokumennya berubah.
export const POLICY_VERSION = '2026-10';

const PROFILE_COLUMNS =
  'full_name, nickname, birth_date, gender, height_cm, weight_kg, goals, health_consent_at, onboarded_at';

// Profil milik user yang sedang login (tabel public.profiles). { data, error }
export const getMyProfile = (userId) =>
  supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', userId).maybeSingle();

// Ubah sebagian kolom profil, kembalikan baris terbaru. { data, error }
export const updateMyProfile = (userId, fields) =>
  supabase.from('profiles').update(fields).eq('id', userId).select(PROFILE_COLUMNS).single();

// Catat persetujuan pemrosesan data kesehatan. Waktu & user diisi oleh database.
export const recordHealthConsent = () =>
  supabase.from('consents').insert({ kind: 'health_data', policy_version: POLICY_VERSION });

// Daftar tunggu untuk usia < 18 tahun. Mendaftar ulang dianggap berhasil.
export async function joinWaitlist(email) {
  const { error } = await supabase.from('waitlist').insert({ email });
  if (error && error.code !== '23505') return { error };
  return { error: null };
}

// Langkah berikutnya untuk user ini (butuh data profil dari database).
export async function resolveNextPath(user) {
  if (!user) return nextPath(null, null);
  const { data, error } = await getMyProfile(user.id);
  if (error) console.error('Gagal memuat profil:', error);
  return nextPath(user, data);
}
