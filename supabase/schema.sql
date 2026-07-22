-- Run this script in the Supabase SQL Editor to set up the database schema

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Users Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  username text unique not null,
  email text not null,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Users
alter table public.users enable row level security;
create policy "Public profiles are viewable by everyone." on public.users for select using (true);
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.users for update using (auth.uid() = id);

-- Trigger to create a user profile automatically when they sign up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, email)
  values (new.id, new.raw_user_meta_data->>'username', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Watchlist Table
create table public.watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  movie_id integer not null, -- TMDB ID
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, movie_id)
);

-- RLS for Watchlist
alter table public.watchlist enable row level security;
create policy "Users can view their own watchlist." on public.watchlist for select using (auth.uid() = user_id);
create policy "Users can insert into their own watchlist." on public.watchlist for insert with check (auth.uid() = user_id);
create policy "Users can delete from their own watchlist." on public.watchlist for delete using (auth.uid() = user_id);


-- 3. Favorites Table
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  movie_id integer not null, -- TMDB ID
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, movie_id)
);

-- RLS for Favorites
alter table public.favorites enable row level security;
create policy "Users can view their own favorites." on public.favorites for select using (auth.uid() = user_id);
create policy "Users can insert into their own favorites." on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete from their own favorites." on public.favorites for delete using (auth.uid() = user_id);


-- 4. Reviews Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  movie_id integer not null, -- TMDB ID
  rating numeric(2,1) check (rating >= 0.5 and rating <= 5.0) not null,
  text text,
  contains_spoilers boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Reviews
alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone." on public.reviews for select using (true);
create policy "Users can insert their own reviews." on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can update their own reviews." on public.reviews for update using (auth.uid() = user_id);
create policy "Users can delete their own reviews." on public.reviews for delete using (auth.uid() = user_id);

-- 5. Recently Watched Table
create table public.recently_watched (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  movie_id integer not null, -- TMDB ID
  watched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, movie_id)
);

-- RLS for Recently Watched
alter table public.recently_watched enable row level security;
create policy "Recently watched is viewable by everyone." on public.recently_watched for select using (true);
create policy "Users can insert their own recently watched." on public.recently_watched for insert with check (auth.uid() = user_id);
create policy "Users can delete their own recently watched." on public.recently_watched for delete using (auth.uid() = user_id);

-- 6. Follows Table
create table public.follows (
  follower_id uuid references public.users(id) on delete cascade not null,
  following_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

-- RLS for Follows
alter table public.follows enable row level security;
create policy "Follows are viewable by everyone." on public.follows for select using (true);
create policy "Users can follow others." on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow others." on public.follows for delete using (auth.uid() = follower_id);

-- 7. Notifications Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null, -- The user receiving the notification
  actor_id uuid references public.users(id) on delete cascade, -- The user who triggered it
  type text not null, -- 'follow'
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Notifications
alter table public.notifications enable row level security;
create policy "Users can view their own notifications." on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications." on public.notifications for update using (auth.uid() = user_id);
create policy "System can insert notifications." on public.notifications for insert with check (true);

-- Trigger to create notification on new follow
create or replace function public.handle_new_follow()
returns trigger as $$
begin
  insert into public.notifications (user_id, actor_id, type)
  values (new.following_id, new.follower_id, 'follow');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_new_follow
  after insert on public.follows
  for each row execute procedure public.handle_new_follow();
