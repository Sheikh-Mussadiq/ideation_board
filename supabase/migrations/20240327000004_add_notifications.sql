-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_email ON notifications(user_email);

-- Create function to create notification for mentioned users
CREATE OR REPLACE FUNCTION create_mention_notifications()
RETURNS TRIGGER AS $$
DECLARE
    mentioned_user TEXT;
    mentions TEXT[];
BEGIN
    -- Extract mentions from comment text (usernames starting with @)
    SELECT ARRAY(
        SELECT regexp_matches(NEW.text, '@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', 'g')
    ) INTO mentions;

    -- Create notification for each mentioned user
    FOREACH mentioned_user IN ARRAY mentions
    LOOP
        INSERT INTO notifications (
            user_email,
            type,
            content,
            card_id,
            board_id
        )
        SELECT
            mentioned_user[1],
            'mention',
            format('%s mentioned you in a comment: %s', NEW.author, NEW.text),
            NEW.card_id,
            c.board_id
        FROM cards card
        JOIN columns c ON card.column_id = c.id
        WHERE card.id = NEW.card_id;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new comments
DROP TRIGGER IF EXISTS comment_mentions_trigger ON comments;
CREATE TRIGGER comment_mentions_trigger
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION create_mention_notifications();