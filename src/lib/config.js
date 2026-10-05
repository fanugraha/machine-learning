// Nilai diambil dari file .env (lihat .env.example).
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi. Salin .env.example menjadi .env.');
}
