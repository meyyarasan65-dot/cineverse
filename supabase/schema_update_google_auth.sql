-- ========================================================
-- Schema Update: Google Auth & Social Login Support
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- Update handle_new_user trigger function to safely handle OAuth sign-ins
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  user_avatar text;
begin
  -- 1. Extract avatar if provided by Google or other OAuth providers
  user_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  );

  -- 2. Try to get username from metadata, or derive from full_name, name, or email
  base_username := coalesce(
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- 3. Clean and sanitize username (lowercase, alphanumeric and underscores only)
  base_username := regexp_replace(lower(trim(base_username)), '[^a-z0-9_]', '', 'g');
  if base_username = '' or base_username is null then
    base_username := 'cinephile';
  end if;

  -- Trim to max 20 characters
  base_username := substr(base_username, 1, 20);

  -- 4. Check for uniqueness; if username already taken, append part of user UUID
  final_username := base_username;
  if exists (select 1 from public.users where username = final_username and id != new.id) then
    final_username := substr(base_username, 1, 15) || '_' || substr(new.id::text, 1, 4);
  end if;

  -- 5. Insert or update the public.users record
  insert into public.users (id, username, email, avatar_url)
  values (
    new.id,
    final_username,
    new.email,
    user_avatar
  )
  on conflict (id) do update set
    avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url),
    email = excluded.email;

  return new;
exception
  when others then
    -- Fail-safe so auth user creation is never aborted if an edge case occurs
    return new;
end;
$$ language plpgsql security definer;

-- Re-create the trigger to make sure it's active
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
