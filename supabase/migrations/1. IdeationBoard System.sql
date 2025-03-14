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

CREATE POLICY "Allow creator or team members to select board"
ON boards
FOR SELECT
USING (
  auth.uid() = created_by OR
  boards.team_id IN (SELECT jsonb_array_elements_text(auth.jwt() -> 'teams'))
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