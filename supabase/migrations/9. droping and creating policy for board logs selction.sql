-- Drop the existing policy
DROP POLICY IF EXISTS "Board logs select only for board creator" ON board_logs;

-- Create a new policy allowing only authenticated users to see board logs
CREATE POLICY "Board logs select only for authenticated users"
  ON board_logs
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
  );
