begin;

alter table public.items
  add column if not exists completed_from_status text null,
  add column if not exists completed_from_is_today boolean null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'items_completed_from_status_check'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
      add constraint items_completed_from_status_check
      check (
        completed_from_status is null
        or completed_from_status in ('未着手', '途中', '保留')
      );
  end if;
end $$;

commit;
