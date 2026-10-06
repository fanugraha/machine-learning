import { describe, expect, it } from 'vitest';
import { noteDoneMeta, noteLast, noteQuestionMeta, noteSince, spanEnd, spanStart } from '../../src/lib/display.js';

describe('spanStart / spanEnd', () => {
  it('mengambil bulan dari ujung rentang bila awalnya tanpa bulan', () => {
    expect(spanStart('5–7 Okt')).toBe('5 Okt');
    expect(spanStart('28–30 Sep')).toBe('28 Sep');
  });

  it('mempertahankan bulan awal pada rentang lintas bulan', () => {
    expect(spanStart('28 Sep–2 Okt')).toBe('28 Sep');
    expect(spanEnd('28 Sep–2 Okt')).toBe('2 Okt');
  });

  it('menangani satu tanggal dan nilai kosong', () => {
    expect(spanStart('2 Okt')).toBe('2 Okt');
    expect(spanEnd('2 Okt')).toBe('2 Okt');
    expect(spanStart()).toBe('');
  });
});

describe('teks ringkas catatan', () => {
  it('memakai teks bawaan catatan bila ada', () => {
    expect(noteSince({ since: 'Mulai 1 Okt', span: '1–3 Okt' })).toBe('Mulai 1 Okt');
    expect(noteLast({ last: 'Belum membaik · 3 Okt' })).toBe('Belum membaik · 3 Okt');
    expect(noteDoneMeta({ meta: 'Sembuh 7 Okt · cukup dirawat di rumah' })).toBe(
      'Sembuh 7 Okt · cukup dirawat di rumah',
    );
    expect(noteQuestionMeta({ meta: 'Kamu tanya 2 Okt' })).toBe('Kamu tanya 2 Okt');
  });

  it('menurunkannya dari span dan timeline bila tidak ada', () => {
    expect(noteSince({ span: '28–30 Sep' })).toBe('Mulai 28 Sep');
    expect(noteLast({ timeline: [{ meta: '3 Okt, 08.00 · naik' }] })).toBe('3 Okt');
    expect(noteLast({ timeline: [] })).toBe('Belum ada kabar');
    expect(noteDoneMeta({ span: '9–14 Sep' })).toBe('Sembuh 14 Sep');
    expect(noteQuestionMeta({ span: '18 Sep' })).toBe('Kamu tanya 18 Sep');
  });
});
