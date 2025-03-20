-- Run this migration to enable realtime on all tables automatically, if errors, enable realtime manually on all tables except users

ALTER PUBLICATION supabase_realtime ADD TABLE boards;
ALTER PUBLICATION supabase_realtime ADD TABLE cards;
ALTER PUBLICATION supabase_realtime ADD TABLE columns;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE board_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;