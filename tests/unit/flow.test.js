import { describe, expect, it } from 'vitest';
import { nextPath } from '../../src/lib/flow.js';

const user = { id: 'u1' };

describe('nextPath', () => {
  it('belum login → halaman masuk', () => {
    expect(nextPath(null, null)).toBe('/');
  });

  it('belum setuju data kesehatan → persetujuan (juga bila profil belum ada)', () => {
    expect(nextPath(user, null)).toBe('/consent');
    expect(nextPath(user, { health_consent_at: null, onboarded_at: null })).toBe('/consent');
  });

  it('sudah setuju tapi belum onboarding → onboarding', () => {
    expect(nextPath(user, { health_consent_at: '2026-10-05', onboarded_at: null })).toBe('/onboarding');
  });

  it('semua langkah selesai → dashboard', () => {
    expect(nextPath(user, { health_consent_at: '2026-10-05', onboarded_at: '2026-10-05' })).toBe('/dashboard');
  });
});
