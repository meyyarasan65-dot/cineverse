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
