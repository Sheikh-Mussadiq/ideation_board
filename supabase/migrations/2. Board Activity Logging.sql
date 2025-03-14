-- 1. Create the logs table
CREATE TABLE board_logs (
  id BIGSERIAL PRIMARY KEY,
  board_id UUID REFERENCES boards(id),
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