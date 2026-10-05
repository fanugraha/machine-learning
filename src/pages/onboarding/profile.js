import { parseDob, ageFrom, toIsoDate } from '../../utils/date.js';

const MIN_AGE = 18;

export const GOALS = [
  'Turunkan berat badan',
  'Naikkan berat badan',
  'Pola makan sehat',
  'Lebih aktif bergerak',
  'Tidur lebih baik',
  'Kelola stres',
  'Kesehatan jantung',
  'Pantau gula darah',
  'Berhenti merokok',
  'Kesehatan reproduksi',
];

export const EMPTY_PROFILE = { nickname: '', dob: '', gender: '', height: '', weight: '' };

const toNumber = (value) => Number(String(value).replace(',', '.'));

// Validasi form Profil dasar.
// Hasil: { invalid: {field: true}, missing: [label], profile (siap disimpan) | null, underage }
export function validateProfile(form, today = new Date()) {
  const dob = parseDob(form.dob, today);
  const height = toNumber(form.height);
  const weight = toNumber(form.weight);

  const checks = [
    ['nickname', !!form.nickname.trim(), 'nama panggilan'],
    ['dob', !!dob, 'tanggal lahir yang valid'],
    ['gender', !!form.gender, 'jenis kelamin'],
    ['height', height >= 50 && height <= 250, 'tinggi badan (50–250 cm)'],
    ['weight', weight >= 20 && weight <= 300, 'berat badan (20–300 kg)'],
  ];
  const failed = checks.filter(([, ok]) => !ok);
  const invalid = Object.fromEntries(failed.map(([key]) => [key, true]));
  const missing = failed.map(([, , label]) => label);

  if (failed.length) return { invalid, missing, profile: null, underage: false };
  return {
    invalid,
    missing,
    underage: ageFrom(dob, today) < MIN_AGE,
    profile: {
      nickname: form.nickname.trim(),
      dob: toIsoDate(dob),
      gender: form.gender,
      height_cm: height,
      weight_kg: weight,
    },
  };
}
