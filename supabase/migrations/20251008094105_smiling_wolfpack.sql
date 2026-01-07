insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Allow authenticated users to delete avatars"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow authenticated users to update avatars"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
with check (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow authenticated users to upload avatars"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow public access to avatars"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));




