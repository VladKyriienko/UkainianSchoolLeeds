-- Create bucket for class cover photos (used by admin panel)
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'classes-photos') then
    insert into storage.buckets (id, name, public)
    values ('classes-photos', 'classes-photos', true);
  end if;

  -- Public read
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'classes_photos_public_select'
  ) then
    create policy "classes_photos_public_select"
      on storage.objects
      for select
      to public
      using (bucket_id = 'classes-photos');
  end if;

  -- Admin insert
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'classes_photos_admin_insert'
  ) then
    create policy "classes_photos_admin_insert"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'classes-photos'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;

  -- Admin update
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'classes_photos_admin_update'
  ) then
    create policy "classes_photos_admin_update"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'classes-photos'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      )
      with check (
        bucket_id = 'classes-photos'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;

  -- Admin delete
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'classes_photos_admin_delete'
  ) then
    create policy "classes_photos_admin_delete"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'classes-photos'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;
end $$;
