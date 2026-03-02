-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage on cron schema to postgres
GRANT USAGE ON SCHEMA cron TO postgres;

-- Create a simple function that keeps the database active
CREATE OR REPLACE FUNCTION public.keep_db_active()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple query to keep connection active
  -- This just touches the database and returns
  PERFORM 1;
  
  -- Optional: Log the activity (you can remove this if you don't need logs)
  RAISE LOG 'Database keep-alive executed at %', NOW();
END;
$$;

-- Schedule the function to run every 3 days at 3:00 AM UTC
-- Cron format: minute hour day month weekday
SELECT cron.schedule(
  'keep-database-active',           -- job name
  '0 3 */3 * *',                    -- every 3 days at 3:00 AM UTC
  $$SELECT public.keep_db_active();$$
);

-- To verify the scheduled job was created, you can run:
-- SELECT * FROM cron.job;
