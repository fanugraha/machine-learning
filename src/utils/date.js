// Format input tanggal lahir saat diketik: "14031994" → "14 / 03 / 1994".
export function maskDob(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join(' / ');
}

// "DD / MM / YYYY" → Date, atau null bila tidak valid / di masa depan.
export function parseDob(value, today = new Date()) {
  const m = value.match(/^(\d{2}) \/ (\d{2}) \/ (\d{4})$/);
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  const valid = date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d;
  if (!valid || date > today || y < 1900) return null;
  return date;
}

export function ageFrom(date, today = new Date()) {
  let age = today.getFullYear() - date.getFullYear();
  if (today < new Date(today.getFullYear(), date.getMonth(), date.getDate())) age--;
  return age;
}

const pad = (n) => String(n).padStart(2, '0');

// Date → "YYYY-MM-DD" (disimpan di Supabase).
export const toIsoDate = (date) => date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());

// "YYYY-MM-DD" → "DD / MM / YYYY" (ditampilkan di form).
export function isoToDob(iso) {
  const [y, m, d] = iso.split('-');
  return d + ' / ' + m + ' / ' + y;
}

// 125 → "2:05"
export function formatTimer(seconds) {
  return Math.floor(seconds / 60) + ':' + pad(seconds % 60);
}
