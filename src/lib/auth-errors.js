// Ubah pesan error Supabase menjadi kalimat yang ramah pengguna.
export function friendlyError(error) {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email atau password tidak cocok';
  if (msg.includes('email not confirmed')) return 'Email kamu belum diverifikasi. Cek kotak masuk, ya.';
  if (msg.includes('already registered')) return 'Email ini sudah terdaftar. Coba masuk, ya.';
  if (msg.includes('rate limit') || msg.includes('too many') || msg.includes('security purposes'))
    return 'Kebanyakan percobaan, nih. Coba lagi sebentar lagi, ya.';
  if (msg.includes('same password')) return 'Password baru nggak boleh sama dengan yang lama.';
  if (msg.includes('password') && msg.includes('characters')) return 'Password-nya terlalu pendek.';
  if (msg.includes('failed to fetch') || msg.includes('network'))
    return 'Nggak bisa terhubung ke server. Cek koneksi internetmu, ya.';
  return error?.message || 'Ada yang salah. Coba lagi, ya.';
}

export const isInvalidCredentials = (error) => /invalid login credentials/i.test(error?.message || '');
export const isEmailNotConfirmed = (error) => /email not confirmed/i.test(error?.message || '');
