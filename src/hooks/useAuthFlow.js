import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { supabase } from '../lib/supabase.js';
import { nextPath } from '../lib/flow.js';
import { getMyProfile, resolveNextPath } from '../lib/profile-api.js';
import { PATHS } from '../routes/paths.js';

// Pastikan halaman ini memang langkah pengguna saat ini; kalau bukan, alihkan.
// Mengembalikan { user, profile } setelah dicek (null selama memeriksa).
export function useStepGuard(path) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [state, setState] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;
      let profile = null;
      if (user) {
        const result = await getMyProfile(user.id);
        if (result.error) console.error('Gagal memuat profil:', result.error);
        profile = result.data;
      }
      if (!active) return;

      const next = nextPath(user, profile);
      if (next !== path) return navigate(next, { replace: true });
      // Rapikan URL lama (mis. /dashboard.html → /dashboard) setelah Supabase memproses token di URL.
      if (pathname !== path) navigate(path, { replace: true });
      setState({ user, profile });
    })();
    return () => {
      active = false;
    };
  }, [navigate, path, pathname]);

  return state;
}

// Untuk halaman Masuk/Daftar: kalau sudah login, lanjutkan ke langkah berikutnya.
export function useRedirectIfSignedIn() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) navigate(await resolveNextPath(data.session.user), { replace: true });
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
