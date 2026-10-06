import { describe, expect, it } from 'vitest';
import { cx } from '../../src/utils/cx.js';

describe('cx', () => {
  it('menggabungkan beberapa nama class dengan spasi', () => {
    expect(cx('btn', 'btn-primary', 'w-full')).toBe('btn btn-primary w-full');
  });

  it('mengabaikan nilai-nilai falsy (false, null, undefined, 0, string kosong, NaN)', () => {
    expect(cx('btn', false, null, undefined, 0, '', NaN, 'is-active')).toBe('btn is-active');
  });

  it('mengembalikan string kosong jika tidak ada argumen yang diberikan', () => {
    expect(cx()).toBe('');
  });

  it('mengembalikan string kosong jika semua argumen bernilai falsy', () => {
    expect(cx(false, null, undefined, '', 0)).toBe('');
  });

  it('menangani ekspresi kondisional', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cx('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')).toBe('btn btn-active');
  });

  it('menangani perilaku terhadap nilai truthy non-string seperti boolean true', () => {
    // filter(Boolean) meloloskan nilai true, sehingga bergabung menjadi string "true"
    expect(cx('btn', true)).toBe('btn true');
  });
});
