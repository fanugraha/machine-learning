const form = document.getElementById('register-form');
const message = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { full_name, email, password, confirm } = Object.fromEntries(new FormData(form));

  if (!full_name.trim() || !email.trim() || !password) {
    ui.show(message, 'error', 'Semua kolom wajib diisi.');
    return;
  }
  if (password.length < 8) {
    ui.show(message, 'error', 'Password minimal 8 karakter.');
    return;
  }
  if (password !== confirm) {
    ui.show(message, 'error', 'Konfirmasi password tidak sama.');
    return;
  }

  ui.hide(message);
  ui.setLoading(submitBtn, true, 'Mendaftarkan...');

  const { data, error } = await window.supabaseClient.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { full_name: full_name.trim() },
      emailRedirectTo: ui.redirectUrl('dashboard.html'),
    },
  });

  if (error) {
    ui.show(message, 'error', ui.friendlyError(error));
    ui.setLoading(submitBtn, false);
    return;
  }

  // Supabase mengembalikan user tanpa identitas bila email sudah terdaftar.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    ui.show(message, 'error', 'Email sudah terdaftar. Silakan login.');
    ui.setLoading(submitBtn, false);
    return;
  }

  // Verifikasi email dimatikan: langsung login.
  if (data.session) {
    window.location.replace('dashboard.html');
    return;
  }

  form.reset();
  ui.show(
    message,
    'success',
    'Pendaftaran berhasil. Kami mengirim email verifikasi, buka email tersebut lalu klik tautannya untuk mengaktifkan akun.'
  );
  ui.setLoading(submitBtn, false);
});
