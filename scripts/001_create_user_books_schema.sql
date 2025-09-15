-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create user_books table (replacing the old books table)
create table if not exists public.user_books (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text not null,
  year integer not null default extract(year from now()),
  genre text not null,
  pages integer not null default 0,
  rating integer not null default 0 check (rating >= 0 and rating <= 5),
  status text not null default 'unread' check (status in ('unread', 'reading', 'completed')),
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on user_books
alter table public.user_books enable row level security;

-- Create policies for user_books
create policy "user_books_select_own"
  on public.user_books for select
  using (auth.uid() = user_id);

create policy "user_books_insert_own"
  on public.user_books for insert
  with check (auth.uid() = user_id);

create policy "user_books_update_own"
  on public.user_books for update
  using (auth.uid() = user_id);

create policy "user_books_delete_own"
  on public.user_books for delete
  using (auth.uid() = user_id);

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger for new user registration
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

create trigger update_user_books_updated_at
  before update on public.user_books
  for each row
  execute function public.update_updated_at_column();
