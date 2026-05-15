begin;

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  status text not null,
  priority text not null,
  next_action text not null,
  due_date date null,
  url text null,
  memo text null,
  total_amount numeric null,
  current_amount numeric null,
  amount_unit text null,
  person_name text null,
  contact_method text null,
  is_today boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint items_category_check check (
    category in ('読書', '動画', '勉強', '人間関係', '買い物', 'その他')
  ),
  constraint items_status_check check (
    status in ('未着手', '途中', '保留', '完了', 'やめた')
  ),
  constraint items_priority_check check (
    priority in ('高', '中', '低')
  ),
  constraint items_amount_non_negative_check check (
    (total_amount is null or total_amount >= 0)
    and (current_amount is null or current_amount >= 0)
  ),
  constraint items_current_lte_total_check check (
    total_amount is null
    or current_amount is null
    or current_amount <= total_amount
  ),
  constraint items_title_not_blank_check check (char_length(btrim(title)) > 0),
  constraint items_next_action_not_blank_check check (
    char_length(btrim(next_action)) > 0
  )
);

create index if not exists items_user_id_created_at_idx
  on public.items (user_id, created_at desc);

create index if not exists items_user_id_status_idx
  on public.items (user_id, status);

create index if not exists items_user_id_due_date_idx
  on public.items (user_id, due_date);

create index if not exists items_user_id_is_today_idx
  on public.items (user_id, is_today);

alter table public.items enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.items to authenticated;
revoke all on table public.items from anon;

drop policy if exists "items_select_own" on public.items;
create policy "items_select_own"
on public.items
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "items_insert_own" on public.items;
create policy "items_insert_own"
on public.items
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "items_update_own" on public.items;
create policy "items_update_own"
on public.items
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "items_delete_own" on public.items;
create policy "items_delete_own"
on public.items
for delete
to authenticated
using ((select auth.uid()) = user_id);

commit;
