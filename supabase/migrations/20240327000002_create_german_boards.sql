-- Delete existing data
DELETE FROM boards;

-- Create the four main boards
INSERT INTO boards (id, title) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Kampagnenplanung'),
  ('b1000000-0000-0000-0000-000000000002', 'Content Ideen'),
  ('b1000000-0000-0000-0000-000000000003', 'Geplante Kollaborationen'),
  ('b1000000-0000-0000-0000-000000000004', 'ToDo''s und Aufgaben');

-- Create columns for each board
INSERT INTO columns (board_id, title, position) VALUES
  -- Kampagnenplanung
  ('b1000000-0000-0000-0000-000000000001', 'Planung', 0),
  ('b1000000-0000-0000-0000-000000000001', 'In Bearbeitung', 1),
  ('b1000000-0000-0000-0000-000000000001', 'Review', 2),
  ('b1000000-0000-0000-0000-000000000001', 'Abgeschlossen', 3),

  -- Content Ideen
  ('b1000000-0000-0000-0000-000000000002', 'Neue Ideen', 0),
  ('b1000000-0000-0000-0000-000000000002', 'Zu Prüfen', 1),
  ('b1000000-0000-0000-0000-000000000002', 'Genehmigt', 2),
  ('b1000000-0000-0000-0000-000000000002', 'In Produktion', 3),

  -- Geplante Kollaborationen
  ('b1000000-0000-0000-0000-000000000003', 'Potenzielle Partner', 0),
  ('b1000000-0000-0000-0000-000000000003', 'In Verhandlung', 1),
  ('b1000000-0000-0000-0000-000000000003', 'Bestätigt', 2),
  ('b1000000-0000-0000-0000-000000000003', 'Abgeschlossen', 3),

  -- ToDo's und Aufgaben
  ('b1000000-0000-0000-0000-000000000004', 'Backlog', 0),
  ('b1000000-0000-0000-0000-000000000004', 'Diese Woche', 1),
  ('b1000000-0000-0000-0000-000000000004', 'In Arbeit', 2),
  ('b1000000-0000-0000-0000-000000000004', 'Erledigt', 3);

-- Get column IDs for reference
DO $$ 
DECLARE
  planning_col UUID;
  content_ideas_col UUID;
  collab_col UUID;
  todo_col UUID;
BEGIN
  -- Get column IDs
  SELECT id INTO planning_col FROM columns WHERE board_id = 'b1000000-0000-0000-0000-000000000001' AND position = 0 LIMIT 1;
  SELECT id INTO content_ideas_col FROM columns WHERE board_id = 'b1000000-0000-0000-0000-000000000002' AND position = 0 LIMIT 1;
  SELECT id INTO collab_col FROM columns WHERE board_id = 'b1000000-0000-0000-0000-000000000003' AND position = 0 LIMIT 1;
  SELECT id INTO todo_col FROM columns WHERE board_id = 'b1000000-0000-0000-0000-000000000004' AND position = 0 LIMIT 1;

  -- Insert cards for Kampagnenplanung
  INSERT INTO cards (column_id, title, description, priority, position) VALUES
    (planning_col, 'Q2 Social Media Kampagne', 'Entwicklung der Social Media Strategie für Q2', 'high', 0),
    (planning_col, 'Influencer Marketing Plan', 'Auswahl und Ansprache relevanter Influencer', 'medium', 1),
    (planning_col, 'Email Marketing Automation', 'Setup der automatisierten Email-Kampagnen', 'medium', 2);

  -- Insert cards for Content Ideen
  INSERT INTO cards (column_id, title, description, priority, position) VALUES
    (content_ideas_col, 'Behind the Scenes Video', 'Produktionsprozess dokumentieren', 'medium', 0),
    (content_ideas_col, 'Customer Success Stories', 'Interviews mit zufriedenen Kunden', 'high', 1),
    (content_ideas_col, 'Tutorial Serie', 'How-to Videos für Produktfeatures', 'medium', 2);

  -- Insert cards for Kollaborationen
  INSERT INTO cards (column_id, title, description, priority, position) VALUES
    (collab_col, 'Tech Conference Sponsoring', 'Mögliche Sponsoring-Partnerschaft', 'high', 0),
    (collab_col, 'Co-Marketing Campaign', 'Gemeinsame Marketingaktion mit Partner', 'medium', 1),
    (collab_col, 'Podcast Appearance', 'Gastauftritt in Industry Podcast', 'low', 2);

  -- Insert cards for ToDo's
  INSERT INTO cards (column_id, title, description, priority, position) VALUES
    (todo_col, 'Weekly Team Meeting', 'Agenda vorbereiten und Team briefen', 'high', 0),
    (todo_col, 'Content Calendar Update', 'Social Media Kalender aktualisieren', 'medium', 1),
    (todo_col, 'Analytics Report', 'Monatlicher Performance Bericht', 'medium', 2);

END $$;