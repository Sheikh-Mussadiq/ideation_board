alter policy "Enable read access for all users"
on "public"."users"
to authenticated
using (
  true
);

alter policy Allow users to select their own data
on "public"."users"
rename to "Enable read access for all users";


ALTER TABLE public.boards ADD COLUMN shared_users text[];

DROP POLICY IF EXISTS "Allow creator or team members to select board" ON public.boards;

CREATE POLICY "Allow creator or team members or shared users to select board" 
ON public.boards 
FOR SELECT 
TO authenticated 
USING (
    (auth.uid() = created_by) OR 
    (team_id IN (SELECT jsonb_array_elements_text((auth.jwt() -> 'teams'::text)))) OR 
    (auth.jwt() ->> 'userId') = ANY(shared_users)
);