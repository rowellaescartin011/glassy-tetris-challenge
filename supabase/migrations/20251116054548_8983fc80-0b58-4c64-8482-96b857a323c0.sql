-- Create game rooms table
CREATE TABLE public.game_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  host_user_id UUID,
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for game rooms
CREATE POLICY "Anyone can view game rooms"
ON public.game_rooms
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create game rooms"
ON public.game_rooms
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update game rooms"
ON public.game_rooms
FOR UPDATE
USING (true);

-- Enable realtime for game rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;