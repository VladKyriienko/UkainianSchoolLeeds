-- Change start_time and end_time columns from timestamp to time in events table

-- Drop existing columns (they were timestamp with time zone)
ALTER TABLE public.events DROP COLUMN IF EXISTS start_time;
ALTER TABLE public.events DROP COLUMN IF EXISTS end_time;

-- Add new columns with time type
ALTER TABLE public.events ADD COLUMN start_time time;
ALTER TABLE public.events ADD COLUMN end_time time;
