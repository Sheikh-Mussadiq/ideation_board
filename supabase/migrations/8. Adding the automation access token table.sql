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