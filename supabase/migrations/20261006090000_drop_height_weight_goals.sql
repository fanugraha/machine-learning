-- PRD v2.0: onboarding jadi 1 layar. Tinggi, berat badan, dan tujuan kesehatan tidak lagi
-- dikumpulkan (minimisasi data UU PDP). Hak akses per kolom ikut terhapus bersama kolomnya.
-- Jalankan di Supabase Dashboard → SQL Editor setelah 20261005120000_onboarding_tables.sql.
-- PERHATIAN: data di ketiga kolom ini akan terhapus permanen.

alter table public.profiles
  drop column if exists height_cm,
  drop column if exists weight_kg,
  drop column if exists goals;
