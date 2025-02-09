-- Create a function to reset the kanban data
CREATE OR REPLACE FUNCTION reset_kanban_data()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete all existing data
    DELETE FROM boards;

    -- Re-run the migration that creates the German boards
    \i '20240327000002_create_german_boards.sql'
END;
$$;