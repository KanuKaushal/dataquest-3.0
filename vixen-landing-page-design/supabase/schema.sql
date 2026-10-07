-- ============================================================
-- ServiceSync Database Schema for Supabase
-- Run this in the Supabase Dashboard: SQL Editor -> New Query -> Run
-- ============================================================

-- 1. Create custom enum for roles if not exists
do $$ begin
  create type user_role as enum ('user', 'technician');
exception
  when duplicate_object then null;
end $$;

-- 2. Create Public Profiles Table
-- Holds basic profile details for both users and technicians
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  first_name text,
  last_name text,
  avatar_url text,
  role user_role not null default 'user',
  company text, -- Populated for users / site managers
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Create Technician Profiles Table
-- Holds field specialization, department, skills, and work status
create table if not exists public.technician_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  department text not null,
  skills text[] not null default '{}',
  experience_years integer not null default 0,
  location text,
  dob date,
  availability text default 'available' check (availability in ('available', 'on_a_job', 'off_duty')),
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.technician_profiles enable row level security;

-- 5. Set up RLS Policies
create policy "Allow authenticated users to read all profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Allow authenticated users to read technician profiles"
  on public.technician_profiles for select
  to authenticated
  using (true);

create policy "Technicians can update their own technician profile"
  on public.technician_profiles for update
  to authenticated
  using (auth.uid() = id);

-- 6. Trigger Function: Automatically insert profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_role user_role := coalesce((new.raw_user_meta_data->>'role')::user_role, 'user'::user_role);
  raw_name text := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User');
  raw_first text := coalesce(new.raw_user_meta_data->>'first_name', split_part(raw_name, ' ', 1));
  raw_last text := coalesce(new.raw_user_meta_data->>'last_name', split_part(raw_name, ' ', 2));
begin
  -- Insert into public.profiles
  insert into public.profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    avatar_url,
    role,
    company
  )
  values (
    new.id,
    new.email,
    raw_name,
    raw_first,
    raw_last,
    new.raw_user_meta_data->>'avatar_url',
    raw_role,
    new.raw_user_meta_data->>'company'
  );

  -- If technician, insert stub in technician_profiles if department is passed
  if raw_role = 'technician' and new.raw_user_meta_data->>'department' is not null then
    insert into public.technician_profiles (
      id,
      department,
      skills,
      experience_years,
      location,
      dob
    ) values (
      new.id,
      new.raw_user_meta_data->>'department',
      coalesce(array(select json_array_elements_text(new.raw_user_meta_data->'skills')), '{}'),
      coalesce((new.raw_user_meta_data->>'experience')::integer, 0),
      new.raw_user_meta_data->>'location',
      (new.raw_user_meta_data->>'dob')::date
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
