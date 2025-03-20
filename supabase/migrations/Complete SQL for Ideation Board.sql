-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id text NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    
);

-- Create columns table
CREATE TABLE IF NOT EXISTS columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    account_id text NOT NULL,
    title TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMPTZ,
    assignee JSONB DEFAULT '[]',
    account_id text NOT NULL,
    labels jsonb NULL ,
    checklist jsonb NULL DEFAULT '[]'::jsonb,
    attachments jsonb NULL DEFAULT '[]'::jsonb,
    position INTEGER NOT NULL,
    completed boolean NULL DEFAULT false,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    user_id text NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);



-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_columns_board_id ON columns(board_id);
CREATE INDEX IF NOT EXISTS idx_cards_column_id ON cards(column_id);
CREATE INDEX IF NOT EXISTS idx_comments_card_id ON comments(card_id);


-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_boards_updated_at ON boards;
CREATE TRIGGER update_boards_updated_at
    BEFORE UPDATE ON boards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_columns_updated_at ON columns;
CREATE TRIGGER update_columns_updated_at
    BEFORE UPDATE ON columns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- -- Insert initial demo data
-- INSERT INTO boards (title) VALUES ('My First Board')
-- ON CONFLICT DO NOTHING;

-- Get the board ID and insert default columns
-- DO $$ 
-- DECLARE
--     board_id UUID;
-- BEGIN
--     SELECT id INTO board_id FROM boards LIMIT 1;

--     -- Insert default columns if they don't exist
--     INSERT INTO columns (board_id, title, position)
--     SELECT board_id, col.title, col.position
--     FROM (
--         VALUES
--             ('To Do', 0),
--             ('In Progress', 1),
--             ('Done', 2)
--     ) AS col(title, position)
--     WHERE NOT EXISTS (
--         SELECT 1 FROM columns WHERE board_id = board_id
--     );
-- END $$;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

ALTER TABLE boards ADD COLUMN created_by UUID REFERENCES auth.users(id);
ALTER TABLE boards ADD COLUMN team_id TEXT;
ALTER TABLE public.boards ADD COLUMN shared_users text[];

CREATE POLICY "Allow any authenticated user to create a board"
ON boards
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow only creator to update their board"
ON boards
FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Allow only creator to delete their board"
ON boards
FOR DELETE
USING (auth.uid() = created_by);

CREATE POLICY "Allow creator or team members or shared users to select board" 
ON boards
FOR SELECT
USING (
  (auth.uid() = created_by) OR 
    (team_id IN (SELECT jsonb_array_elements_text((auth.jwt() -> 'teams'::text)))) OR 
    (auth.jwt() ->> 'userId') = ANY(shared_users)
);

CREATE POLICY "Allow only creator to assign team to board"
ON boards
FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (team_id IS NOT NULL);

-- Policies for Columns Table
CREATE POLICY "Allow any authenticated user to create a column"
ON columns
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow any authenticated user to update a column"
ON columns
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow any authenticated user to delete a column"
ON columns
FOR DELETE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow any authenticated user to select a column"
ON columns
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Policies for Cards Table
CREATE POLICY "Allow any authenticated user to view cards"
ON cards
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow any authenticated user to create a card"
ON cards
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow any authenticated user to update a card"
ON cards
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow any authenticated user to delete a card"
ON cards
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- policy for all users can commment
CREATE POLICY "Allow any authenticated user to select comments" 
ON public.comments 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow any authenticated user to insert comments" 
ON public.comments 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow any authenticated user to update comments" 
ON public.comments 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow any authenticated user to delete comments" 
ON public.comments 
FOR DELETE 
TO authenticated 
USING (true);

-- 1. Create the logs table
CREATE TABLE board_logs (
  id BIGSERIAL PRIMARY KEY,
  board_id UUID,
  event_type TEXT,        -- 'INSERT', 'UPDATE', 'DELETE'
  message TEXT,           -- Log message (e.g., "Alice created column 'To Do'")
  created_at TIMESTAMPTZ DEFAULT NOW(),
  triggered_by TEXT       -- User id or similar, captured from JWT claims
);

-- Enable Row Level Security on board_logs
ALTER TABLE board_logs ENABLE ROW LEVEL SECURITY;

-- Only allow the board creator to SELECT logs.
CREATE POLICY "Board logs select only for board creator"
  ON board_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_logs.board_id
        AND boards.created_by = auth.uid()
    )
  );

-- Prevent any UPDATE, DELETE, or INSERT directly into logs.
CREATE POLICY "Deny modification of board logs - Update"
  ON board_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "Deny modification of board logs - Delete"
  ON board_logs
  FOR DELETE
  USING (false);

CREATE POLICY "Deny insert of board logs"
  ON board_logs
  FOR INSERT
  WITH CHECK (false);

-- 2. Trigger Functions for Logging

-- 2a. Logging for the boards table
CREATE OR REPLACE FUNCTION log_board_changes() RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_userid TEXT;
BEGIN
  -- Get the username and user ID from the auth.users table
  SELECT raw_user_meta_data->>'username', id  INTO v_username, v_userid 
  FROM auth.users 
  WHERE id = auth.uid();

  IF TG_OP = 'INSERT' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (NEW.id, 'INSERT', v_username || ' created board', v_userid);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (NEW.id, 'UPDATE', v_username || ' updated board', v_userid);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (OLD.id, 'DELETE', v_username || ' deleted board', v_userid);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2b. Logging for the columns table
CREATE OR REPLACE FUNCTION log_column_changes() RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_userid TEXT;
BEGIN
  -- Get the username and user ID from the auth.users table
  SELECT raw_user_meta_data->>'username', id INTO v_username, v_userid 
  FROM auth.users 
  WHERE id = auth.uid();

  IF TG_OP = 'INSERT' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (NEW.board_id, 'INSERT', v_username || ' created column "' || NEW.title || '"', v_userid);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (NEW.board_id, 'UPDATE', v_username || ' updated column "' || NEW.title || '"', v_userid);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (OLD.board_id, 'DELETE', v_username || ' deleted column "' || OLD.title || '"', v_userid);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2c. Logging for the cards table.
CREATE EXTENSION IF NOT EXISTS hstore;

CREATE OR REPLACE FUNCTION log_card_changes() RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_userid TEXT;
  v_board_id UUID;
  v_column_title TEXT;
  changed_fields TEXT;
  diff hstore;
BEGIN
  -- Get the username and user ID from the auth.users table.
  SELECT raw_user_meta_data->>'username', id INTO v_username, v_userid 
    FROM auth.users 
   WHERE id = auth.uid();
  
  -- Get board id and column title from the columns table.
  IF TG_OP = 'DELETE' THEN
    SELECT board_id, title INTO v_board_id, v_column_title FROM columns WHERE id = OLD.column_id;
  ELSE
    SELECT board_id, title INTO v_board_id, v_column_title FROM columns WHERE id = NEW.column_id;
  END IF;
  
  IF TG_OP = 'INSERT' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (v_board_id, 'INSERT', 
              v_username || ' created card "' || NEW.title || '" in column "' || v_column_title || '"', 
              v_userid);
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Calculate the difference between the new and old record values.
    diff := hstore(NEW) - hstore(OLD);
    
    -- Extract the changed field names into a comma-separated list.
    changed_fields := array_to_string(akeys(diff), ', ');
    
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (v_board_id, 'UPDATE', 
              v_username || ' updated card "' || NEW.title || '". Changed fields: ' || changed_fields, 
              v_userid);
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (v_board_id, 'DELETE', 
              v_username || ' deleted card "' || OLD.title || '"', 
              v_userid);
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2d. Logging for the comments table.
CREATE OR REPLACE FUNCTION log_comment_changes() RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_userid TEXT;
  v_board_id UUID;
  v_card_title TEXT;
BEGIN
  -- Get the username and user ID from the auth.users table
  SELECT raw_user_meta_data->>'username', id  INTO v_username, v_userid 
  FROM auth.users 
  WHERE id = auth.uid();

  IF TG_OP = 'DELETE' THEN
    SELECT title INTO v_card_title FROM cards WHERE id = OLD.card_id;
    SELECT c.board_id INTO v_board_id
      FROM columns c
      JOIN cards ca ON ca.column_id = c.id
      WHERE ca.id = OLD.card_id;
  ELSE
    SELECT title INTO v_card_title FROM cards WHERE id = NEW.card_id;
    SELECT c.board_id INTO v_board_id
      FROM columns c
      JOIN cards ca ON ca.column_id = c.id
      WHERE ca.id = NEW.card_id;
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (v_board_id, 'INSERT', v_username || ' added comment to card "' || v_card_title || '"', v_userid);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (v_board_id, 'UPDATE', v_username || ' updated comment on card "' || v_card_title || '"', v_userid);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO board_logs(board_id, event_type, message, triggered_by)
      VALUES (v_board_id, 'DELETE', v_username || ' deleted comment from card "' || v_card_title || '"', v_userid);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Triggers to call the above functions

-- For boards
CREATE TRIGGER trg_log_boards
  AFTER INSERT OR UPDATE OR DELETE ON boards
  FOR EACH ROW EXECUTE FUNCTION log_board_changes();

-- For columns
CREATE TRIGGER trg_log_columns
  AFTER INSERT OR UPDATE OR DELETE ON columns
  FOR EACH ROW EXECUTE FUNCTION log_column_changes();

-- For cards
CREATE TRIGGER trg_log_cards
  AFTER INSERT OR UPDATE OR DELETE ON cards
  FOR EACH ROW EXECUTE FUNCTION log_card_changes();

-- For comments
CREATE TRIGGER trg_log_comments
  AFTER INSERT OR UPDATE OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION log_comment_changes();

-- 4. Create a function to clean up logs when a board is deleted
  CREATE OR REPLACE FUNCTION public.cleanup_board_logs()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.board_logs WHERE board_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_board_delete
AFTER DELETE ON public.boards
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_board_logs();

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

CREATE policy "Enable read access for all users"
on "public"."users"
FOR select
to authenticated
using (
  true
);

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


create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  content text not null,
  type text not null,
  board_id uuid ,
  card_id uuid ,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table notifications enable row level security;

-- Create policy for users to read their own notifications
CREATE POLICY "Allow users to select their notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (((auth.jwt() ->> 'userId'::text) = user_id));

-- Create policy for inserting notifications
create POLICY "Enable insert for authenticated users only"
ON public.notifications
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for users to update their own notifications
CREATE POLICY "Allow users to update their notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (((auth.jwt() ->> 'userId'::text) = user_id));



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


-- Step 1: Create helper function to delete storage objects
CREATE OR REPLACE FUNCTION delete_storage_object(bucket_name TEXT, path TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM storage.objects
    WHERE bucket_id = bucket_name AND name = path;
EXCEPTION WHEN others THEN
    -- Optional error handling
    RAISE WARNING 'Error deleting object: %', SQLERRM;
END;
$$;

-- Step 2: Create trigger function to process attachments
CREATE OR REPLACE FUNCTION delete_card_attachments()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    attachment JSONB;
BEGIN
    IF OLD.attachments IS NOT NULL THEN
        FOR attachment IN SELECT * FROM jsonb_array_elements(OLD.attachments)
        LOOP
            IF (attachment->>'type') = 'file' AND (attachment->>'storagePath') IS NOT NULL THEN
                PERFORM delete_storage_object('ideation_media', attachment->>'storagePath');
            END IF;
        END LOOP;
    END IF;
    RETURN OLD;
END;
$$;

-- Step 3: Create the trigger
CREATE TRIGGER delete_card_attachments_trigger
BEFORE DELETE ON cards
FOR EACH ROW
EXECUTE FUNCTION delete_card_attachments();

REVOKE EXECUTE ON FUNCTION delete_storage_object FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION delete_card_attachments FROM PUBLIC;

GRANT EXECUTE ON FUNCTION delete_storage_object TO service_role;
GRANT EXECUTE ON FUNCTION delete_card_attachments TO service_role;

-- Create a policy to allow DELETE access for service_role on the ideation_media bucket
CREATE POLICY "Allow service_role to delete objects"
ON storage.objects
FOR DELETE
TO service_role
USING (
    bucket_id = 'ideation_media'
);


-- Run this migration to enable realtime on all tables automatically, if errors, enable realtime manually on all tables except users
ALTER PUBLICATION supabase_realtime ADD TABLE boards;
ALTER PUBLICATION supabase_realtime ADD TABLE cards;
ALTER PUBLICATION supabase_realtime ADD TABLE columns;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE board_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;



CREATE TABLE IF NOT EXISTS automation_access_tokens (
  account_id text PRIMARY KEY,
  token text NOT NULL,
  created_at timestamp WITH time zone DEFAULT NOW() NOT NULL,
  updated_at timestamp WITH time zone DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_automation_access_tokens_updated_at BEFORE
UPDATE
  ON automation_access_tokens FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE automation_access_tokens ENABLE ROW LEVEL SECURITY;

-- Drop the existing policy
DROP POLICY IF EXISTS "Board logs select only for board creator" ON board_logs;

-- Create a new policy allowing only authenticated users to see board logs
CREATE POLICY "Board logs select only for authenticated users"
  ON board_logs
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
  );
