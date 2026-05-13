-- StudyFlow Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- SUBJECTS
-- ============================================
create table public.subjects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  color text not null default '#6366f1',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subjects enable row level security;

create policy "Users can view own subjects" on public.subjects
  for select using (auth.uid() = user_id);

create policy "Users can create own subjects" on public.subjects
  for insert with check (auth.uid() = user_id);

create policy "Users can update own subjects" on public.subjects
  for update using (auth.uid() = user_id);

create policy "Users can delete own subjects" on public.subjects
  for delete using (auth.uid() = user_id);

-- ============================================
-- TASKS
-- ============================================
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text,
  due_date date not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;

create policy "Users can view own tasks" on public.tasks
  for select using (auth.uid() = user_id);

create policy "Users can create own tasks" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update own tasks" on public.tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete own tasks" on public.tasks
  for delete using (auth.uid() = user_id);

-- ============================================
-- NOTES
-- ============================================
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notes enable row level security;

create policy "Users can view own notes" on public.notes
  for select using (auth.uid() = user_id);

create policy "Users can create own notes" on public.notes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own notes" on public.notes
  for update using (auth.uid() = user_id);

create policy "Users can delete own notes" on public.notes
  for delete using (auth.uid() = user_id);

-- ============================================
-- STUDY PLANS
-- ============================================
create table public.study_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  exam_date date not null,
  is_public boolean default false not null,
  share_slug text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.study_plans enable row level security;

create policy "Users can view own study plans" on public.study_plans
  for select using (auth.uid() = user_id);

create policy "Anyone can view public study plans" on public.study_plans
  for select using (is_public = true);

create policy "Users can create own study plans" on public.study_plans
  for insert with check (auth.uid() = user_id);

create policy "Users can update own study plans" on public.study_plans
  for update using (auth.uid() = user_id);

create policy "Users can delete own study plans" on public.study_plans
  for delete using (auth.uid() = user_id);

-- ============================================
-- STUDY PLAN ITEMS
-- ============================================
create table public.study_plan_items (
  id uuid default uuid_generate_v4() primary key,
  plan_id uuid references public.study_plans(id) on delete cascade not null,
  topic text not null,
  scheduled_date date not null,
  is_completed boolean default false not null
);

alter table public.study_plan_items enable row level security;

create policy "Users can view own plan items" on public.study_plan_items
  for select using (
    exists (
      select 1 from public.study_plans
      where study_plans.id = study_plan_items.plan_id
      and study_plans.user_id = auth.uid()
    )
  );

create policy "Anyone can view public plan items" on public.study_plan_items
  for select using (
    exists (
      select 1 from public.study_plans
      where study_plans.id = study_plan_items.plan_id
      and study_plans.is_public = true
    )
  );

create policy "Users can create own plan items" on public.study_plan_items
  for insert with check (
    exists (
      select 1 from public.study_plans
      where study_plans.id = study_plan_items.plan_id
      and study_plans.user_id = auth.uid()
    )
  );

create policy "Users can update own plan items" on public.study_plan_items
  for update using (
    exists (
      select 1 from public.study_plans
      where study_plans.id = study_plan_items.plan_id
      and study_plans.user_id = auth.uid()
    )
  );

create policy "Users can delete own plan items" on public.study_plan_items
  for delete using (
    exists (
      select 1 from public.study_plans
      where study_plans.id = study_plan_items.plan_id
      and study_plans.user_id = auth.uid()
    )
  );

-- ============================================
-- INDEXES
-- ============================================
create index idx_subjects_user_id on public.subjects(user_id);
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_tasks_due_date on public.tasks(due_date);
create index idx_tasks_status on public.tasks(status);
create index idx_notes_user_id on public.notes(user_id);
create index idx_notes_subject_id on public.notes(subject_id);
create index idx_study_plans_user_id on public.study_plans(user_id);
create index idx_study_plans_share_slug on public.study_plans(share_slug);
create index idx_study_plan_items_plan_id on public.study_plan_items(plan_id);
