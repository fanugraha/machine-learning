(async () => {
  const { data } = await window.supabaseClient.auth.getSession();

  // Belum login: kembali ke halaman login.
  if (!data.session) return window.location.replace('index.html');

  const user = data.session.user;
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || user.email;

  document.getElementById('user-name').textContent = name;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('greeting-name').textContent = name.split(' ')[0];

  if (meta.avatar_url) {
    const img = document.getElementById('avatar');
    img.src = meta.avatar_url;
    img.classList.remove('hidden');
  }
})();

document.getElementById('logout').addEventListener('click', async () => {
  await window.supabaseClient.auth.signOut();
  window.location.replace('index.html');
});
