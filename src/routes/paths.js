export const PATHS = {
  login: '/',
  register: '/register',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  consent: '/consent',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
};

// Alamat tujuan yang dikirim ke Supabase. Harus sama persis dengan Redirect URLs di
// Supabase (Authentication → URL Configuration), jadi tetap memakai URL lama ber-.html.
// App.jsx memetakan URL ini ke halaman yang benar.
export const AUTH_REDIRECTS = {
  afterSignIn: '/dashboard.html',
  passwordReset: '/reset-password.html',
};

export const absoluteUrl = (path) => new URL(path, window.location.origin).href;
