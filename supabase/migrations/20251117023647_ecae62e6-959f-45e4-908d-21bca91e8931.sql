-- Fix game_rooms table security issues

-- Step 1: Make host_user_id NOT NULL (after we ensure auth is implemented)
-- We'll do this in a separate migration after auth is set up

-- Step 2: Drop insecure RLS policies
DROP POLICY IF EXISTS "Anyone can view game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Anyone can create game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Anyone can update game rooms" ON public.game_rooms;

-- Step 3: Create secure RLS policies that require authentication

-- Allow users to view only their own game rooms
CREATE POLICY "Users can view their own game rooms"
ON public.game_rooms
FOR SELECT
TO authenticated
USING (auth.uid() = host_user_id);

-- Allow authenticated users to create game rooms (host_user_id will be set to auth.uid())
CREATE POLICY "Authenticated users can create game rooms"
ON public.game_rooms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = host_user_id);

-- Allow users to update only their own game rooms
CREATE POLICY "Users can update their own game rooms"
ON public.game_rooms
FOR UPDATE
TO authenticated
USING (auth.uid() = host_user_id);

-- Add missing DELETE policy to enable cleanup functionality
CREATE POLICY "Users can delete their own game rooms"
ON public.game_rooms
FOR DELETE
TO authenticated
USING (auth.uid() = host_user_id);