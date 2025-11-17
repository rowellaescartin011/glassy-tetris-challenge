-- Fix nullable host_user_id which conflicts with RLS policies
-- First, ensure no NULL values exist (table is empty, so this is safe)
-- Then make the column NOT NULL to prevent data integrity issues

ALTER TABLE public.game_rooms 
ALTER COLUMN host_user_id SET NOT NULL;

-- Add a check to ensure host_user_id is always set on insert
-- This provides an extra layer of protection
ALTER TABLE public.game_rooms 
ADD CONSTRAINT game_rooms_host_user_id_required 
CHECK (host_user_id IS NOT NULL);