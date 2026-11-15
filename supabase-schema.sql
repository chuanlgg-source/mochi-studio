-- ============================================================================
-- Mochi Studio (개인용 웹사이트) - Supabase Schema & Storage Setup
-- Supabase Dashboard > SQL Editor 에서 아래 SQL을 순서대로 실행하세요.
-- ============================================================================

-- 1. 게시판 테이블 (posts) 생성
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_email text not null,
  author_name text not null,
  author_avatar text default 'mochi',
  category text default '일상' check (category in ('일상', '작업노트', '사진첩')),
  title text not null,
  content text not null,
  image_url text,
  likes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Row Level Security (RLS) 활성화
alter table public.posts enable row level security;

-- 누구나 게시글 조회 가능
create policy "Anyone can view posts"
  on public.posts for select
  using (true);

-- 로그인한 사용자만 게시글 작성 가능
create policy "Authenticated users can create posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

-- 작성자 본인만 게시글 수정/삭제 가능
create policy "Users can update own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- 3. 이미지 저장용 Storage 버킷 (post-images) 생성
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Storage 정책: 누구나 이미지 조회 가능
create policy "Public Access to post-images"
  on storage.objects for select
  using (bucket_id = 'post-images');

-- Storage 정책: 로그인한 사용자만 이미지 업로드 가능
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images'
    and auth.role() = 'authenticated'
  );

-- Storage 정책: 본인이 업로드한 이미지만 삭제 가능
create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and auth.uid() = owner
  );
