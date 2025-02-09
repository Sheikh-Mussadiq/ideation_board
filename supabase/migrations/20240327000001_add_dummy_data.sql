-- Insert demo boards
INSERT INTO boards (id, title) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Marketing Campaign 2024'),
  ('b1000000-0000-0000-0000-000000000002', 'Product Launch Q2')
ON CONFLICT DO NOTHING;

-- Insert columns for Marketing Campaign board
INSERT INTO columns (id, board_id, title, position) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Planning', 0),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'In Progress', 1),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Review', 2),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'Done', 3)
ON CONFLICT DO NOTHING;

-- Insert columns for Product Launch board
INSERT INTO columns (id, board_id, title, position) VALUES
  ('c2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Backlog', 0),
  ('c2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Development', 1),
  ('c2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Testing', 2),
  ('c2000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Ready', 3)
ON CONFLICT DO NOTHING;

-- Insert cards for Marketing Campaign board
INSERT INTO cards (id, column_id, title, description, priority, due_date, assignee, position, archived) VALUES
  ('card001', 'c1000000-0000-0000-0000-000000000001', 'Social Media Strategy', 'Define target audience and content themes for Q2', 'high', '2024-04-15', 'Sarah', 0, false),
  ('card002', 'c1000000-0000-0000-0000-000000000001', 'Content Calendar', 'Create monthly content calendar for all platforms', 'medium', '2024-04-10', 'John', 1, false),
  ('card003', 'c1000000-0000-0000-0000-000000000002', 'Instagram Campaign', 'Design and schedule posts for new product line', 'high', '2024-04-20', 'Emma', 0, false),
  ('card004', 'c1000000-0000-0000-0000-000000000003', 'Email Newsletter', 'Draft monthly newsletter content', 'medium', '2024-04-05', 'Mike', 0, false)
ON CONFLICT DO NOTHING;

-- Insert cards for Product Launch board
INSERT INTO cards (id, column_id, title, description, priority, due_date, assignee, position, archived) VALUES
  ('card005', 'c2000000-0000-0000-0000-000000000001', 'Feature Specification', 'Document core features and requirements', 'high', '2024-04-01', 'David', 0, false),
  ('card006', 'c2000000-0000-0000-0000-000000000002', 'UI Implementation', 'Implement new user interface components', 'high', '2024-04-10', 'Lisa', 0, false),
  ('card007', 'c2000000-0000-0000-0000-000000000002', 'API Integration', 'Connect with third-party services', 'medium', '2024-04-15', 'Alex', 1, false),
  ('card008', 'c2000000-0000-0000-0000-000000000003', 'Performance Testing', 'Run load tests and optimize', 'medium', '2024-04-20', 'Tom', 0, false)
ON CONFLICT DO NOTHING;

-- Insert labels
INSERT INTO labels (card_id, name) VALUES
  ('card001', 'strategy'),
  ('card001', 'planning'),
  ('card002', 'content'),
  ('card003', 'social-media'),
  ('card003', 'design'),
  ('card004', 'content'),
  ('card004', 'email'),
  ('card005', 'documentation'),
  ('card006', 'frontend'),
  ('card007', 'backend'),
  ('card008', 'testing')
ON CONFLICT DO NOTHING;

-- Insert comments
INSERT INTO comments (card_id, text, author, created_at) VALUES
  ('card001', 'We should focus on Instagram and TikTok for Q2', 'Sarah', NOW() - INTERVAL '2 days'),
  ('card001', 'Agreed, our target audience is most active there', 'John', NOW() - INTERVAL '1 day'),
  ('card003', 'First batch of designs ready for review', 'Emma', NOW() - INTERVAL '12 hours'),
  ('card006', 'Using the new design system for consistency', 'Lisa', NOW() - INTERVAL '1 day'),
  ('card007', 'API documentation updated in Notion', 'Alex', NOW() - INTERVAL '3 hours')
ON CONFLICT DO NOTHING;

-- Insert attachments
INSERT INTO attachments (card_id, type, url, name, size) VALUES
  ('card001', 'file', 'https://example.com/files/strategy-doc.pdf', 'Q2 Strategy Document.pdf', 1024576),
  ('card003', 'file', 'https://example.com/files/campaign-assets.zip', 'Campaign Assets.zip', 5242880),
  ('card006', 'link', 'https://www.figma.com/file/design-system', 'Design System - Figma', NULL),
  ('card007', 'link', 'https://api-docs.example.com', 'API Documentation', NULL)
ON CONFLICT DO NOTHING;