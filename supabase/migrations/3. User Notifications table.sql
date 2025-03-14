create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  content text not null,
  type text not null,
  board_id uuid references boards(id) on delete cascade,
  card_id uuid references cards(id) on delete cascade,
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