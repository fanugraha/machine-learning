import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { supabase } from '../lib/supabase.js';
import { nextPath } from '../lib/flow.js';
import { PATHS } from '../routes/paths.js';

// Pastikan halaman ini memang langkah pengguna saat ini; kalau bukan, alihkan.
// Mengembalikan user setelah dicek (null selama memeriksa).
export function useStepGuard(path) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const current = data.session?.user ?? null;
      const next = nextPath(current);
      if (next !== path) return navigate(next, { replace: true });
      // Rapikan URL lama (mis. /dashboard.html → /dashboard) setelah Supabase memproses token di URL.
      if (pathname !== path) navigate(path, { replace: true });
      setUser(current);
    });
    return () => {
      active = false;
    };
  }, [navigate, path, pathname]);

  return user;
}

// Untuk halaman Masuk/Daftar: kalau sudah login, lanjutkan ke langkah berikutnya.
export function useRedirectIfSignedIn() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(nextPath(data.session.user), { replace: true });
    });
  }, [navigate]);
}

export function useSignOut() {
  const navigate = useNavigate();
  return async () => {
    await supabase.auth.signOut();
    navigate(PATHS.login, { replace: true });
  };
}
