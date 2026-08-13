-- IQ Project: Supabase schema
-- Run this entire file in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

-- A public profile tied one-to-one to Supabase Auth.
-- Never store a password or password hash in this table.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 100),
  country_code text not null default '+91' check (country_code ~ '^\+[1-9][0-9]{0,3}$'),
  mobile_number text not null check (mobile_number ~ '^[0-9]{6,15}$'),
  preferred_language text not null default 'en' check (preferred_language in ('en', 'ta', 'hi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_code, mobile_number)
);

create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Farm names are unique per user, ignoring capitalization.
create unique index if not exists farms_owner_name_unique
  on public.farms (owner_id, lower(trim(name)));
create index if not exists farms_owner_id_idx on public.farms(owner_id);

create table if not exists public.qmt_devices (
  id uuid primary key default gen_random_uuid(),
  qmt_id text not null check (char_length(trim(qmt_id)) between 1 and 64),
  name text check (name is null or char_length(trim(name)) <= 120),
  farm_id uuid not null references public.farms(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A physical QMT device can only be registered once.
create unique index if not exists qmt_devices_qmt_id_unique
  on public.qmt_devices (upper(trim(qmt_id)));
create index if not exists qmt_devices_farm_id_idx on public.qmt_devices(farm_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists farms_set_updated_at on public.farms;
create trigger farms_set_updated_at
before update on public.farms
for each row execute function public.set_updated_at();

drop trigger if exists qmt_devices_set_updated_at on public.qmt_devices;
create trigger qmt_devices_set_updated_at
before update on public.qmt_devices
for each row execute function public.set_updated_at();

-- Create the profile (and optional first farm) from sign-up metadata.
-- Pass full_name, country_code, mobile_number, preferred_language, and farm_name
-- in the options.data object supplied to supabase.auth.signUp().
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  first_farm_name text;
begin
  insert into public.profiles (
    id, full_name, country_code, mobile_number, preferred_language
  ) values (
    new.id,
    trim(coalesce(new.raw_user_meta_data ->> 'full_name', 'New User')),
    coalesce(nullif(new.raw_user_meta_data ->> 'country_code', ''), '+91'),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'mobile_number', ''),
      regexp_replace(coalesce(new.phone, ''), '[^0-9]', '', 'g')
    ),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_language', ''), 'en')
  );

  first_farm_name := trim(coalesce(new.raw_user_meta_data ->> 'farm_name', ''));
  if first_farm_name <> '' then
    insert into public.farms (owner_id, name) values (new.id, first_farm_name);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.qmt_devices enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Users can create own farms" on public.farms;
create policy "Users can create own farms"
on public.farms for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can read own farms" on public.farms;
create policy "Users can read own farms"
on public.farms for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "Users can update own farms" on public.farms;
create policy "Users can update own farms"
on public.farms for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Users can delete own farms" on public.farms;
create policy "Users can delete own farms"
on public.farms for delete to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "Users can create devices on own farms" on public.qmt_devices;
create policy "Users can create devices on own farms"
on public.qmt_devices for insert to authenticated
with check (exists (
  select 1 from public.farms
  where farms.id = qmt_devices.farm_id
    and farms.owner_id = (select auth.uid())
));

drop policy if exists "Users can read devices on own farms" on public.qmt_devices;
create policy "Users can read devices on own farms"
on public.qmt_devices for select to authenticated
using (exists (
  select 1 from public.farms
  where farms.id = qmt_devices.farm_id
    and farms.owner_id = (select auth.uid())
));

drop policy if exists "Users can update devices on own farms" on public.qmt_devices;
create policy "Users can update devices on own farms"
on public.qmt_devices for update to authenticated
using (exists (
  select 1 from public.farms
  where farms.id = qmt_devices.farm_id
    and farms.owner_id = (select auth.uid())
))
with check (exists (
  select 1 from public.farms
  where farms.id = qmt_devices.farm_id
    and farms.owner_id = (select auth.uid())
));

drop policy if exists "Users can delete devices on own farms" on public.qmt_devices;
create policy "Users can delete devices on own farms"
on public.qmt_devices for delete to authenticated
using (exists (
  select 1 from public.farms
  where farms.id = qmt_devices.farm_id
    and farms.owner_id = (select auth.uid())
));
