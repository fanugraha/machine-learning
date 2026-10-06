import { describe, expect, it } from 'vitest';
import { validateProfile } from '../../src/pages/onboarding/profile.js';

const today = new Date(2026, 9, 6);
const valid = { nickname: 'Rina', dob: '14 / 03 / 1994', gender: 'female' };

describe('validateProfile', () => {
  it('mengembalikan profil siap simpan untuk data valid', () => {
    const r = validateProfile(valid, today);
    expect(r.missing).toEqual([]);
    expect(r.underage).toBe(false);
    expect(r.profile).toEqual({ nickname: 'Rina', birth_date: '1994-03-14', gender: 'female' });
  });

  it('menandai field yang kosong / tidak valid', () => {
    const r = validateProfile({ nickname: ' ', dob: '31 / 02 / 2000', gender: '' }, today);
    expect(r.profile).toBeNull();
    expect(Object.keys(r.invalid)).toEqual(['nickname', 'dob', 'gender']);
  });

  it('mendeteksi usia di bawah 18 tahun', () => {
    expect(validateProfile({ ...valid, dob: '07 / 10 / 2008' }, today).underage).toBe(true);
    expect(validateProfile({ ...valid, dob: '06 / 10 / 2008' }, today).underage).toBe(false);
  });
});
