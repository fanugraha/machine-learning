// Data contoh untuk pratinjau desain. Hanya dipakai saat dev dengan ?demo di URL (lihat records.js).
// Nama dan isinya fiktif.

const redFlags = [
  'Demam lebih dari 3 hari atau di atas 39°C',
  'Muncul sesak napas, ruam, atau leher kaku',
  'Muntah terus dan susah minum',
];

export const SAMPLE_NOTES = [
  {
    id: 'n1',
    month: 'Oktober 2026',
    title: 'Demam dan pusing',
    type: 'Cek gejala',
    span: '5–6 Okt',
    level: 'Rawat mandiri',
    done: true,
    advice: {
      title: 'Rawat mandiri dulu',
      text: 'Demam baru 2 hari, suhu 38°C, dan nggak ada tanda bahaya. Banyak minum, istirahat, dan pantau suhu.',
    },
    redFlags,
    facts: [
      ['Keluhan utama', 'Demam dan pusing'],
      ['Sejak', '4 Okt (2 hari saat dicek)'],
      ['Tingkat keparahan', 'Sedang, masih bisa beraktivitas'],
      ['Gejala lain', 'Badan pegal, nafsu makan turun'],
      ['Kondisi khusus', 'Tidak ada'],
    ],
    timeline: [
      { title: 'Cek gejala · Rawat mandiri', meta: '5 Okt, 20.14' },
      { title: 'Check-in · Masih sama', meta: '6 Okt, 08.02' },
      { title: 'Check-in · Sudah membaik', meta: '7 Okt, 08.10 · ditandai Selesai' },
    ],
    chat: [
      { from: 'user', text: 'Dari kemarin demam sama pusing.' },
      { from: 'edith', text: 'Semoga cepat baikan. Demamnya sudah berapa hari, dan berapa suhunya?' },
      { from: 'user', text: 'Baru 2 hari, sekitar 38°C.' },
      { from: 'edith', text: 'Ada sesak napas, ruam, atau muntah terus?' },
    ],
  },
  {
    id: 'n2',
    month: 'Oktober 2026',
    title: 'Nyeri ulu hati',
    type: 'Cek gejala',
    span: '1–3 Okt',
    extra: 'naik dari Rawat mandiri',
    level: 'Temui dokter',
    done: false,
    advice: { title: 'Sebaiknya temui dokter', text: 'Nyeri ulu hati belum membaik setelah 3 hari rawat mandiri.' },
    redFlags: ['Muntah darah atau BAB hitam', 'Nyeri dada menjalar ke lengan atau rahang', 'Sulit menelan'],
    facts: [
      ['Keluhan utama', 'Nyeri ulu hati'],
      ['Sejak', '1 Okt'],
      ['Gejala lain', 'Mual dan kembung'],
    ],
    timeline: [
      { title: 'Cek gejala · Rawat mandiri', meta: '1 Okt, 21.30' },
      { title: 'Check-in · Masih sama', meta: '3 Okt, 08.00 · naik ke Temui dokter' },
    ],
    chat: [],
  },
  {
    id: 'n3',
    month: 'Oktober 2026',
    title: 'Obat maag yang aman diminum',
    type: 'Tanya EDITH',
    span: '2 Okt',
    level: null,
    done: false,
    advice: null,
    redFlags: [],
    facts: [['Pertanyaan', 'Obat maag yang aman diminum']],
    timeline: [{ title: 'Tanya EDITH', meta: '2 Okt, 19.05' }],
    chat: [],
  },
  {
    id: 'n4',
    month: 'September 2026',
    title: 'Hasil cek kolesterol',
    type: 'Tanya EDITH',
    span: '18 Sep',
    level: null,
    done: false,
    advice: null,
    redFlags: [],
    facts: [['Pertanyaan', 'Arti hasil cek kolesterol']],
    timeline: [{ title: 'Tanya EDITH', meta: '18 Sep, 10.12' }],
    chat: [],
  },
  {
    id: 'n5',
    month: 'September 2026',
    title: 'Batuk dan pilek',
    type: 'Cek gejala',
    span: '9–14 Sep',
    level: 'Rawat mandiri',
    done: true,
    advice: { title: 'Rawat mandiri dulu', text: 'Batuk pilek ringan tanpa demam tinggi.' },
    redFlags,
    facts: [
      ['Keluhan utama', 'Batuk dan pilek'],
      ['Sejak', '8 Sep'],
    ],
    timeline: [{ title: 'Cek gejala · Rawat mandiri', meta: '9 Sep, 07.45' }],
    chat: [],
  },
];

export const SAMPLE_SUMMARIES = [
  {
    id: 's1',
    noteId: 'n2',
    title: 'Nyeri ulu hati',
    level: 'Temui dokter',
    updated: 'Diperbarui 7 Okt',
    sections: [
      {
        key: 'main',
        title: 'Keluhan utama',
        source: 'dari cek gejala 1 Okt',
        text: 'Nyeri ulu hati sejak 1 Okt (6 hari). Terasa perih, makin parah setelah makan pedas dan malam hari. Tingkat keparahan sedang, masih bisa beraktivitas.',
      },
      {
        key: 'other',
        title: 'Gejala lain',
        source: 'dari cek gejala',
        text: 'Mual dan kembung. Tidak ada muntah darah atau BAB hitam.',
      },
      {
        key: 'prog',
        title: 'Perkembangan',
        source: 'dari check-in',
        text: '1 Okt: disarankan rawat mandiri.\n3 Okt: belum membaik, disarankan temui dokter dalam 1–3 hari.',
      },
      {
        key: 'meds',
        title: 'Obat yang sedang diminum',
        source: 'dari Profil kesehatan & percakapan',
        text: 'Omeprazole (untuk maag)\nAntasida sirup, sejak 2 Okt',
      },
      { key: 'allergy', title: 'Alergi', source: 'dari Profil kesehatan', text: 'Amoxicillin (ruam)' },
      {
        key: 'history',
        title: 'Riwayat penyakit',
        source: 'dari Profil kesehatan',
        text: 'Maag (gastritis) sejak 2022',
      },
      {
        key: 'ask',
        title: 'Pertanyaan untuk dokter',
        source: 'saran EDITH, bisa kamu ubah',
        text: '1. Perlu endoskopi atau cek lain?\n2. Boleh lanjut minum omeprazole?\n3. Makanan apa yang sebaiknya dihindari?',
      },
    ],
  },
  {
    id: 's2',
    noteId: 'n5',
    title: 'Batuk dan pilek',
    level: 'Rawat mandiri',
    updated: 'Dibuat 12 Sep',
    sections: [
      {
        key: 'main',
        title: 'Keluhan utama',
        source: 'dari cek gejala 9 Sep',
        text: 'Batuk dan pilek sejak 8 Sep, tanpa demam tinggi.',
      },
      { key: 'allergy', title: 'Alergi', source: 'dari Profil kesehatan', text: 'Amoxicillin (ruam)' },
      {
        key: 'ask',
        title: 'Pertanyaan untuk dokter',
        source: 'saran EDITH, bisa kamu ubah',
        text: '1. Perlu obat batuk?',
      },
    ],
  },
];

export const SAMPLE_PROFILE_ITEMS = {
  allergy: [{ name: 'Amoxicillin', meta: 'Ruam · dari percakapan 2 Okt' }],
  meds: [{ name: 'Omeprazole', meta: 'Untuk maag · dari percakapan 2 Okt' }],
  history: [{ name: 'Maag (gastritis)', meta: 'Sejak 2022 · kamu tambahkan sendiri' }],
  blood: [],
  contact: [],
};
