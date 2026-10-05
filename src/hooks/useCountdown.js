import { useCallback, useEffect, useState } from 'react';

// Hitung mundur dalam detik.
// - initialEndsAt: timestamp (ms) akhir hitungan, mis. dipulihkan dari storage. 0 = tidak berjalan.
// - start(ms): mulai hitungan baru selama `ms` milidetik.
export function useCountdown(initialEndsAt = 0) {
  const [endsAt, setEndsAt] = useState(initialEndsAt);
  const [now, setNow] = useState(() => Date.now());
  const seconds = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const running = seconds > 0;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback((ms) => {
    const t = Date.now();
    setNow(t);
    setEndsAt(t + ms);
  }, []);

  return [seconds, start];
}
