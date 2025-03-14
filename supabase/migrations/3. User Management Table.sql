CREATE TABLE public.users (
    id uuid NOT NULL PRIMARY KEY,
    email text NOT NULL,
    user_id text NOT NULL,
    account_id text NOT NULL,
    account_name text NOT NULL,
    user_name text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    role text NOT NULL,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE
) WITH (OIDS=FALSE);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own data" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (id = (select auth.uid()));

CREATE POLICY "Allow users to insert their own data" 
ON public.users 
FOR INSERT 
TO authenticated 
WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Allow users to update their own data" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (id = (select auth.uid())) 
WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Allow users to delete their own data" 
ON public.users 
FOR DELETE 
TO authenticated 
USING (id = (select auth.uid()));