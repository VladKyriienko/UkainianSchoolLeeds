-- Create avatars bucket for user profile pictures
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Create policy to allow authenticated users to upload their own avatars
create policy "Allow authenticated users to upload avatars" on storage.objects for insert
    to authenticated
    with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to update their own avatars  
create policy "Allow authenticated users to update avatars" on storage.objects for update
    to authenticated
    using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1])
    with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to delete their own avatars
create policy "Allow authenticated users to delete avatars" on storage.objects for delete
    to authenticated
    using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow everyone to view avatars (public read)
create policy "Allow public access to avatars" on storage.objects for select
    to public
    using (bucket_id = 'avatars');

