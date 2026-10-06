import { describe, expect, it } from 'vitest';
import { isNewlyLinkedGoogle, nextPath } from '../../src/lib/flow.js';

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

  it('semua langkah selesai → beranda', () => {
    expect(nextPath(user, { health_consent_at: '2026-10-05', onboarded_at: '2026-10-05' })).toBe('/home');
  });
});

describe('isNewlyLinkedGoogle', () => {
  const now = new Date('2026-10-06T10:00:00Z').getTime();
  const identity = (provider, createdAt) => ({ provider, created_at: createdAt });

  it('benar bila Google baru saja ditambahkan ke akun email lama', () => {
    const u = {
      identities: [identity('email', '2026-09-01T00:00:00Z'), identity('google', '2026-10-06T09:58:00Z')],
    };
    expect(isNewlyLinkedGoogle(u, now)).toBe(true);
  });

  it('salah untuk akun yang daftar langsung dengan Google', () => {
    expect(isNewlyLinkedGoogle({ identities: [identity('google', '2026-10-06T09:58:00Z')] }, now)).toBe(false);
  });

  it('salah bila penggabungan sudah lama terjadi', () => {
    const u = {
      identities: [identity('email', '2026-09-01T00:00:00Z'), identity('google', '2026-10-01T00:00:00Z')],
    };
    expect(isNewlyLinkedGoogle(u, now)).toBe(false);
  });
});
