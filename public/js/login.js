const form = document.getElementById('login-form');
const errorBox = document.getElementById('form-error');
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggle-password');
const googleBtn = document.getElementById('google-login');

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}

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
    showError('Username dan password wajib diisi.');
    return;
  }
  errorBox.classList.add('hidden');
  // TODO: login username/password (Supabase Auth memakai email + password)
});

googleBtn.addEventListener('click', async () => {
  errorBox.classList.add('hidden');
  googleBtn.disabled = true;

  const { error } = await window.supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: new URL('dashboard.html', window.location.href).href },
  });

  if (error) {
    showError(error.message);
    googleBtn.disabled = false;
  }
});

// Kalau sudah login, langsung ke dashboard.
window.supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session) window.location.replace('dashboard.html');
});
