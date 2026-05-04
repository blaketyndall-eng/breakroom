alter table public.user_profiles
  add column if not exists clocked_out_at timestamptz;
