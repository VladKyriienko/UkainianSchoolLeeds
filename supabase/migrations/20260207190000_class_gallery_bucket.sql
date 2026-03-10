-- Create bucket for class gallery photos (used by admin panel)
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'class-gallery') then
    insert into storage.buckets (id, name, public)
    values ('class-gallery', 'class-gallery', true);
  end if;

  -- Public read
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'class_gallery_public_select'
  ) then
    create policy "class_gallery_public_select"
      on storage.objects
      for select
      to public
      using (bucket_id = 'class-gallery');
  end if;

  -- Admin insert
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'class_gallery_admin_insert'
  ) then
    create policy "class_gallery_admin_insert"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'class-gallery'
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
      and policyname = 'class_gallery_admin_update'
  ) then
    create policy "class_gallery_admin_update"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'class-gallery'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      )
      with check (
        bucket_id = 'class-gallery'
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
      and policyname = 'class_gallery_admin_delete'
  ) then
    create policy "class_gallery_admin_delete"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'class-gallery'
        and exists (
          select 1
          from public.roles
          where roles.user_id = auth.uid()
            and roles.role = 'admin'
        )
      );
  end if;
end $$;
