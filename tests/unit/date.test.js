import { describe, expect, it } from 'vitest';
import { ageFrom, formatTimer, isoToDob, maskDob, parseDob, toIsoDate } from '../../src/utils/date.js';

const today = new Date(2026, 9, 5); // 5 Okt 2026

describe('maskDob', () => {
  it('menyisipkan pemisah saat mengetik', () => {
    expect(maskDob('14')).toBe('14');
    expect(maskDob('1403')).toBe('14 / 03');
    expect(maskDob('14031994')).toBe('14 / 03 / 1994');
  });

  it('membuang karakter non-angka dan membatasi 8 digit', () => {
    expect(maskDob('14/03/1994999')).toBe('14 / 03 / 1994');
  });
});

describe('parseDob', () => {
  it('mengembalikan Date untuk tanggal valid', () => {
    expect(toIsoDate(parseDob('14 / 03 / 1994', today))).toBe('1994-03-14');
  });

  it('menolak tanggal yang tidak ada, format salah, atau di masa depan', () => {
    expect(parseDob('31 / 02 / 2000', today)).toBeNull();
    expect(parseDob('14031994', today)).toBeNull();
    expect(parseDob('01 / 01 / 2030', today)).toBeNull();
  });
});

describe('ageFrom', () => {
  it('menghitung usia, memperhitungkan ulang tahun yang belum lewat', () => {
    expect(ageFrom(new Date(2008, 9, 5), today)).toBe(18);
    expect(ageFrom(new Date(2008, 9, 6), today)).toBe(17);
  });
});

describe('isoToDob & formatTimer', () => {
  it('mengubah format tampilan', () => {
    expect(isoToDob('1994-03-14')).toBe('14 / 03 / 1994');
    expect(formatTimer(125)).toBe('2:05');
    expect(formatTimer(42)).toBe('0:42');
  });
});
