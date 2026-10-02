// Helper UI yang dipakai semua halaman auth.
window.ui = {
  show(el, type, message) {
    el.textContent = message;
    el.className =
      'rounded-lg px-3 py-2 text-sm ' +
      (type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700');
  },

  hide(el) {
    el.className = 'hidden';
    el.textContent = '';
  },

  setLoading(btn, loading, loadingText) {
    if (loading) {
      btn.dataset.label = btn.textContent;
      btn.textContent = loadingText || 'Memproses...';
    } else if (btn.dataset.label) {
      btn.textContent = btn.dataset.label;
    }
    btn.disabled = loading;
    btn.classList.toggle('opacity-60', loading);
    btn.classList.toggle('cursor-not-allowed', loading);
  },

  friendlyError(error) {
    const msg = (error && error.message ? error.message : '').toLowerCase();
    if (msg.includes('invalid login credentials')) return 'Email atau password salah.';
    if (msg.includes('email not confirmed')) return 'Email belum diverifikasi. Cek kotak masuk Anda.';
    if (msg.includes('already registered')) return 'Email sudah terdaftar. Silakan login.';
    if (msg.includes('rate limit') || msg.includes('too many'))
      return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.';
    if (msg.includes('same password')) return 'Password baru tidak boleh sama dengan yang lama.';
    if (msg.includes('password') && msg.includes('characters')) return 'Password terlalu pendek.';
    if (msg.includes('failed to fetch') || msg.includes('network'))
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    return (error && error.message) || 'Terjadi kesalahan. Silakan coba lagi.';
  },

  redirectUrl(page) {
    return new URL(page, window.location.href).href;
  },
};

// Tombol "Lihat/Sembunyi" password: <button data-toggle-password="id-input">
document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
  const input = document.getElementById(btn.dataset.togglePassword);
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Sembunyi' : 'Lihat';
    btn.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
  });
});
