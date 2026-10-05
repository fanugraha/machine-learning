import { useState } from 'react';
import { supabase, setRememberMe } from '../../lib/supabase.js';
import { friendlyError } from '../../lib/auth-errors.js';
import { AUTH_REDIRECTS, absoluteUrl } from '../../routes/paths.js';
import { Button } from '../../components/ui/Button.jsx';
import { GoogleIcon } from '../../components/brand/GoogleIcon.jsx';

// Masuk/Daftar dengan Google. Setelah login Google mengembalikan ke dashboard.html,
// yang lalu mengarahkan ke langkah yang belum selesai.
export function GoogleAuthButton({ label, remember = true, onError }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    onError(null);
    setRememberMe(remember);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: absoluteUrl(AUTH_REDIRECTS.afterSignIn) },
    });
    if (error) {
      onError(friendlyError(error));
      setBusy(false);
    }
  };

  return (
    <Button variant="secondary" className="w-full" disabled={busy} onClick={handleClick}>
      <GoogleIcon />
      {label}
    </Button>
  );
}
