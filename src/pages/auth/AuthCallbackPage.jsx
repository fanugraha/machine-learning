import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase.js';
import { isOtpExpired } from '../../lib/initial-url.js';
import { isNewlyLinkedGoogle, STORAGE_KEYS } from '../../lib/flow.js';
import { resolveNextPath } from '../../lib/profile-api.js';
import { PATHS } from '../../routes/paths.js';

// Tujuan redirect Supabase setelah login Google dan link verifikasi email (/dashboard.html).
// Supabase memproses token di URL saat aplikasi dimuat; halaman ini lalu mengarahkan
// ke layar yang tepat.
export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOtpExpired) return navigate(PATHS.verifyEmail + '?expired=1', { replace: true });

    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (!user) return navigate(PATHS.login, { replace: true });

      const noticeKey = STORAGE_KEYS.linkedNoticeShown(user.id);
      if (isNewlyLinkedGoogle(user) && !localStorage.getItem(noticeKey)) {
        return navigate(PATHS.accountLinked, { replace: true });
      }
      navigate(await resolveNextPath(user), { replace: true });
    });
  }, [navigate]);

  return null;
}
