import { parseDob, ageFrom, toIsoDate } from '../../utils/date.js';

const MIN_AGE = 18;

// Profil dasar (PRD v2.0, onboarding 1 layar): nama panggilan, tanggal lahir, jenis kelamin.
export const EMPTY_PROFILE = { nickname: '', dob: '', gender: '' };

// Validasi form Profil dasar.
// Hasil: { invalid: {field: true}, missing: [label], profile (siap disimpan) | null, underage }
export function validateProfile(form, today = new Date()) {
  const dob = parseDob(form.dob, today);

  const checks = [
    ['nickname', !!form.nickname.trim(), 'nama panggilan'],
    ['dob', !!dob, 'tanggal lahir yang valid'],
    ['gender', !!form.gender, 'jenis kelamin'],
  ];
  const failed = checks.filter(([, ok]) => !ok);
  const invalid = Object.fromEntries(failed.map(([key]) => [key, true]));
  const missing = failed.map(([, , label]) => label);

  if (failed.length) return { invalid, missing, profile: null, underage: false };
  return {
    invalid,
    missing,
    underage: ageFrom(dob, today) < MIN_AGE,
    profile: { nickname: form.nickname.trim(), birth_date: toIsoDate(dob), gender: form.gender },
  };
}
