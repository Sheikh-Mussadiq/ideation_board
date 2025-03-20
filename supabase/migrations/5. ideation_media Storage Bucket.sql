-- Create the storage bucket
insert into storage.buckets (id, name, public) 
values ('ideation_media', 'ideation_media', false);

-- Policy to allow authenticated users to upload files (INSERT)
create policy "Allow authenticated users to upload files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'ideation_media');

-- Policy to allow authenticated users to read files (SELECT)
create policy "Allow authenticated users to read files"
on storage.objects
for select
to authenticated
using (bucket_id = 'ideation_media');

-- Policy to allow authenticated users to update files (UPDATE)
create policy "Allow authenticated users to update files"
on storage.objects
for update
to authenticated
using (bucket_id = 'ideation_media');

-- Policy to allow authenticated users to delete files (DELETE)
create policy "Allow authenticated users to delete files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'ideation_media');