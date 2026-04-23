-- Schedule table (date + PDF file path)
create table if not exists public.schedule (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null default now(),
  file text not null,
  created_at timestamptz not null default now()
);

alter table public.schedule enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'schedule'
      and policyname = 'schedule_admin_select'
  ) then
    create policy "schedule_admin_select"
      on public.schedule
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'schedule'
      and policyname = 'schedule_admin_insert'
  ) then
    create policy "schedule_admin_insert"
      on public.schedule
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'schedule'
      and policyname = 'schedule_admin_update'
  ) then
    create policy "schedule_admin_update"
      on public.schedule
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      )
      with check (
        exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'schedule'
      and policyname = 'schedule_admin_delete'
  ) then
    create policy "schedule_admin_delete"
      on public.schedule
      for delete
      to authenticated
      using (
        exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;
end $$;

-- Bucket for schedule PDF files
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'schedule-files') then
    insert into storage.buckets (id, name, public)
    values ('schedule-files', 'schedule-files', true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'schedule_files_public_select'
  ) then
    create policy "schedule_files_public_select"
      on storage.objects
      for select
      to public
      using (bucket_id = 'schedule-files');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'schedule_files_admin_insert'
  ) then
    create policy "schedule_files_admin_insert"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'schedule-files'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'schedule_files_admin_update'
  ) then
    create policy "schedule_files_admin_update"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'schedule-files'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      )
      with check (
        bucket_id = 'schedule-files'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'schedule_files_admin_delete'
  ) then
    create policy "schedule_files_admin_delete"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'schedule-files'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;
end $$;
