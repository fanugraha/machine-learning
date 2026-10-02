const form = document.getElementById('login-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { email, password } = Object.fromEntries(new FormData(form));
  // TODO: hubungkan ke API autentikasi
  console.log({ email, password });
});
