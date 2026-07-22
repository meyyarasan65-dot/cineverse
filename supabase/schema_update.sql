-- Run this file to add the new Social Features to your existing database.
-- It only contains the new tables to avoid the "relation already exists" error.

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
