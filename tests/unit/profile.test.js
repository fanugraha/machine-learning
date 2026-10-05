import { describe, expect, it } from 'vitest';
import { validateProfile } from '../../src/pages/onboarding/profile.js';

const today = new Date(2026, 9, 5);
const valid = { nickname: 'Rina', dob: '14 / 03 / 1994', gender: 'female', height: '158', weight: '54,5' };

describe('validateProfile', () => {
  it('mengembalikan profil siap simpan untuk data valid', () => {
    const r = validateProfile(valid, today);
    expect(r.missing).toEqual([]);
    expect(r.underage).toBe(false);
    expect(r.profile).toEqual({
      nickname: 'Rina',
      birth_date: '1994-03-14',
      gender: 'female',
      height_cm: 158,
      weight_kg: 54.5,
    });
  });

  it('menandai field yang kosong / di luar batas', () => {
    const r = validateProfile({ nickname: ' ', dob: '31 / 02 / 2000', gender: '', height: '10', weight: '500' }, today);
    expect(r.profile).toBeNull();
    expect(Object.keys(r.invalid)).toEqual(['nickname', 'dob', 'gender', 'height', 'weight']);
  });

  it('mendeteksi usia di bawah 18 tahun', () => {
    expect(validateProfile({ ...valid, dob: '06 / 10 / 2008' }, today).underage).toBe(true);
    expect(validateProfile({ ...valid, dob: '05 / 10 / 2008' }, today).underage).toBe(false);
  });
});
