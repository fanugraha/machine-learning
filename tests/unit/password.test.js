import { describe, expect, it } from 'vitest';
import { isValidPassword, passwordRules } from '../../src/utils/password.js';

describe('passwordRules', () => {
  it('menandai panjang minimal 8 karakter', () => {
    expect(passwordRules('abc1').length).toBe(false);
    expect(passwordRules('abcdefg1').length).toBe(true);
  });

  it('mewajibkan huruf dan angka', () => {
    expect(passwordRules('abcdefgh').mix).toBe(false);
    expect(passwordRules('12345678').mix).toBe(false);
    expect(passwordRules('abcd1234').mix).toBe(true);
  });
});

describe('isValidPassword', () => {
  it('valid hanya jika semua aturan terpenuhi', () => {
    expect(isValidPassword('sehat2026')).toBe(true);
    expect(isValidPassword('sehat')).toBe(false);
  });
});
