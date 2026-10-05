-- EDITH: tabel profil, persetujuan, dan daftar tunggu (menggantikan penyimpanan di user_metadata).
-- Jalankan sekali di Supabase Dashboard → SQL Editor. Aman dijalankan ulang.

-- ============================================================================
-- 1. profiles — satu baris per akun, dibuat otomatis saat user mendaftar.
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  nickname text check (char_length(nickname) <= 50),
  birth_date date check (birth_date >= date '1900-01-01'),
  gender text check (gender in ('female', 'male')),
  height_cm numeric(4, 1) check (height_cm between 50 and 250),
  weight_kg numeric(4, 1) check (weight_kg between 20 and 300),
  goals text[] not null default '{}',
  -- Diisi otomatis dari tabel consents (lihat trigger di bawah), tidak bisa diubah dari browser.
  health_consent_at timestamptz,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tolak tanggal lahir di bawah 18 tahun & perbarui updated_at.
create or replace function public.profiles_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.birth_date is not null and new.birth_date > current_date - interval '18 years' then
    raise exception 'EDITH hanya untuk usia 18 tahun ke atas' using errcode = 'check_violation';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_before_write on public.profiles;
create trigger profiles_before_write
  before insert or update on public.profiles
  for each row execute function public.profiles_before_write();

alter table public.profiles enable row level security;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
-- Hanya kolom ini yang boleh diubah pengguna (bukan health_consent_at / created_at).
grant update (nickname, birth_date, gender, height_cm, weight_kg, goals, onboarded_at)
  on public.profiles to authenticated;

drop policy if exists "profiles: baca milik sendiri" on public.profiles;
create policy "profiles: baca milik sendiri" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles: ubah milik sendiri" on public.profiles;
create policy "profiles: ubah milik sendiri" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ============================================================================
-- 2. consents — catatan persetujuan. Hanya bisa ditambah, tidak bisa diubah/dihapus.
-- ============================================================================
create table if not exists public.consents (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind in ('terms', 'health_data')),
  granted boolean not null default true,
  policy_version text not null,
  created_at timestamptz not null default now()
);

create index if not exists consents_user_kind_idx on public.consents (user_id, kind, created_at desc);

alter table public.consents enable row level security;

revoke all on public.consents from anon, authenticated;
grant select on public.consents to authenticated;
-- user_id & created_at selalu diisi server (default), jadi tidak bisa dipalsukan.
grant insert (kind, granted, policy_version) on public.consents to authenticated;

drop policy if exists "consents: baca milik sendiri" on public.consents;
create policy "consents: baca milik sendiri" on public.consents
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "consents: tambah milik sendiri" on public.consents;
create policy "consents: tambah milik sendiri" on public.consents
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- Salin status persetujuan data kesehatan terbaru ke profiles.health_consent_at.
create or replace function public.sync_health_consent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.kind = 'health_data' then
    insert into public.profiles (id, health_consent_at)
    values (new.user_id, case when new.granted then new.created_at end)
    on conflict (id) do update set health_consent_at = excluded.health_consent_at;
  end if;
  return new;
end;
$$;

drop trigger if exists consents_sync_health on public.consents;
create trigger consents_sync_health
  after insert on public.consents
  for each row execute function public.sync_health_consent();

-- ============================================================================
-- 3. waitlist — email pendaftar di bawah 18 tahun. Pengguna hanya bisa menambah.
-- ============================================================================
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  user_id uuid unique default auth.uid() references auth.users (id) on delete set null,
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

revoke all on public.waitlist from anon, authenticated;
grant insert (email) on public.waitlist to authenticated;

drop policy if exists "waitlist: tambah milik sendiri" on public.waitlist;
create policy "waitlist: tambah milik sendiri" on public.waitlist
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- ============================================================================
-- 4. Akun baru → buat baris profiles + catat persetujuan S&K dari form Daftar.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;

  -- Hanya pendaftaran lewat form Daftar (email + password) yang mengirim edith_tos_at.
  if new.raw_user_meta_data ? 'edith_tos_at' then
    insert into public.consents (user_id, kind, policy_version)
    values (new.id, 'terms', coalesce(new.raw_user_meta_data ->> 'edith_policy_version', 'unknown'));
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 5. Akun yang sudah ada sebelum migrasi ini: buat baris profiles kosong.
--    Mereka akan diminta persetujuan & onboarding ulang (data lama di user_metadata tidak disalin).
-- ============================================================================
insert into public.profiles (id, full_name)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name')
from auth.users u
on conflict (id) do nothing;
