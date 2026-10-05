# EDITH Web

Aplikasi web EDITH, asisten kesehatan pribadi: masuk, daftar, verifikasi email, persetujuan data, onboarding, dan dashboard. Dibangun dengan React 19, Vite, React Router, Tailwind CSS, dan Supabase Auth (email + password, Google).

## Menjalankan

Butuh Node.js 20.19 atau lebih baru.

```bash
npm install
cp .env.example .env   # isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
npm run dev            # http://127.0.0.1:5500
```

| Perintah          | Fungsi                               |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Dev server dengan hot reload         |
| `npm run build`   | Build production ke `dist/`          |
| `npm run preview` | Menyajikan hasil build secara lokal  |
| `npm run lint`    | ESLint (termasuk aturan React Hooks) |
| `npm run format`  | Merapikan kode dengan Prettier       |
| `npm test`        | Unit test (Vitest)                   |

## Struktur

```
├── index.html                  entry Vite (hanya <div id="root">)
├── public/                     file statis apa adanya (favicon)
├── src/
│   ├── main.jsx                titik masuk React
│   ├── App.jsx                 daftar route (React Router)
│   ├── routes/paths.js         konstanta URL + Redirect URL Supabase
│   ├── pages/                  satu folder per fitur
│   │   ├── auth/               LoginPage, RegisterPage, VerifyEmailPage, ForgotPasswordPage, ResetPasswordPage
│   │   ├── onboarding/         ConsentPage, OnboardingPage (+ ProfileStep, GoalsStep, UnderageWaitlist)
│   │   └── dashboard/
│   ├── components/
│   │   ├── ui/                 Button, Field, Banner, Checkbox, Stepper, … (komponen dasar)
│   │   ├── layout/             AuthSplitLayout (Masuk/Daftar), StepLayout (layar langkah)
│   │   └── brand/              Logo, Disclaimer, GoogleIcon
│   ├── hooks/                  useStepGuard, useSignOut, useCountdown, …
│   ├── lib/                    supabase client, akses database (profile-api), alur antar-langkah (flow), pesan error
│   ├── utils/                  fungsi murni tanpa React (password, tanggal)
│   └── styles/main.css         Tailwind + kelas komponen (btn, field, chip, banner, …)
├── supabase/migrations/        skema database (tabel + RLS)
├── tests/unit/                 Vitest
└── .github/workflows/ci.yml    lint, format, test, build di setiap push & PR
```

### Menambah halaman

1. Buat komponen di `src/pages/<fitur>/<Nama>Page.jsx` (export default).
2. Tambahkan path di `src/routes/paths.js` dan `<Route>` di `src/App.jsx`.
3. Kalau halaman hanya boleh dibuka di langkah tertentu, panggil `useStepGuard(PATHS.x)` dan perbarui `nextPath()` di `src/lib/flow.js`.

## Database (Supabase)

Skema ada di `supabase/migrations/`. Jalankan file SQL-nya di **Supabase Dashboard → SQL Editor** (sekali per project; aman dijalankan ulang).

| Tabel      | Isi                                                                                      | Akses pengguna (RLS)                               |
| ---------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `profiles` | nama, tanggal lahir, jenis kelamin, tinggi, berat, tujuan, status persetujuan/onboarding | baca & ubah baris sendiri (kolom tertentu saja)    |
| `consents` | catatan persetujuan S&K dan data kesehatan (jenis, versi kebijakan, waktu)               | baca & tambah milik sendiri; tidak bisa ubah/hapus |
| `waitlist` | email pendaftar di bawah 18 tahun                                                        | hanya tambah                                       |

- Baris `profiles` dibuat otomatis oleh trigger saat akun dibuat (`handle_new_user`).
- `profiles.health_consent_at` hanya diisi trigger dari tabel `consents`, tidak bisa diubah dari browser.
- Database menolak tanggal lahir di bawah 18 tahun.
- Akses database dari aplikasi dikumpulkan di `src/lib/profile-api.js`.

## Alur pengguna

Masuk/Daftar → Verifikasi email (khusus email + password) → Persetujuan data kesehatan → Profil dasar → Tujuan → Dashboard.

`nextPath()` di `src/lib/flow.js` menentukan langkah berikutnya dari baris `profiles` milik user (`health_consent_at`, `onboarded_at`). Login Google dan link verifikasi email kembali ke `/dashboard.html`, lalu diarahkan ke langkah yang belum selesai.

## Catatan penting

- **`/dashboard.html` dan `/reset-password.html` tetap dipakai sebagai Redirect URL Supabase** (lihat `AUTH_REDIRECTS` di `src/routes/paths.js`). Keduanya terdaftar di Supabase (Authentication → URL Configuration). Route-nya ada di `App.jsx`; jangan dihapus. Kalau URL atau port dev (`5500`) diubah, perbarui juga pengaturan di Supabase.
- **Hosting harus diatur sebagai SPA**: semua path diarahkan ke `index.html` (Netlify `_redirects`, Vercel `rewrites`, atau `try_files` di Nginx). Tanpa ini, membuka `/register` atau `/dashboard.html` langsung akan 404.
- **`.env` tidak di-commit.** Untuk CI, isi secret `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di GitHub. Hanya gunakan key anon/publishable, jangan pernah `service_role`.
