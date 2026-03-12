-- Messages: remove all RLS policies so the table is only accessible via service_role (server-side).
-- RLS remains enabled; anon and authenticated have no access.

DROP POLICY IF EXISTS "messages_public_insert_anon" ON "messages";
DROP POLICY IF EXISTS "messages_public_insert_authenticated" ON "messages";
DROP POLICY IF EXISTS "messages_admin_select" ON "messages";
DROP POLICY IF EXISTS "messages_admin_update" ON "messages";
DROP POLICY IF EXISTS "messages_admin_delete" ON "messages";
