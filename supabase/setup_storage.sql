-- 1. Create the storage bucket 'reports' (if not exists)
insert into storage.buckets (id, name, public)
values ('reports', 'reports', true)
on conflict (id) do nothing;

-- 2. Drop existing restrictive policies if they exist
drop policy if exists "Authenticated Uploads" on storage.objects;
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "User Update Own Files" on storage.objects;
drop policy if exists "User Delete Own Files" on storage.objects;

-- 3. Policy: Allow Public Read Access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'reports' );

-- 4. Policy: Allow Public/Anonymous Uploads
-- Since we are using custom Auth (Prisma) and not Supabase Auth,
-- the client is technically "anonymous" to Supabase.
create policy "Allow Public Uploads"
on storage.objects for insert
to anon
with check ( bucket_id = 'reports' );

-- 5. Policy: Allow Public Updates (Optional, for completeness if needed)
create policy "Allow Public Updates"
on storage.objects for update
to anon
using ( bucket_id = 'reports' );
