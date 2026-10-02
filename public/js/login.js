const form = document.getElementById('login-form');
const errorBox = document.getElementById('form-error');
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggle-password');
const googleBtn = document.getElementById('google-login');

toggleBtn.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  toggleBtn.textContent = show ? 'Sembunyi' : 'Lihat';
  toggleBtn.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { username, password } = Object.fromEntries(new FormData(form));

  if (!username.trim() || !password) {
    errorBox.textContent = 'Username dan password wajib diisi.';
    errorBox.classList.remove('hidden');
    return;
  }
  errorBox.classList.add('hidden');
  // TODO: hubungkan ke API autentikasi
  console.log({ username });
});

googleBtn.addEventListener('click', () => {
  // TODO: hubungkan ke Google OAuth
  console.log('login with google');
});
