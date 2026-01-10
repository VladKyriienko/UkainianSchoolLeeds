CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "messages_public_insert_anon" ON "messages" AS PERMISSIVE FOR INSERT TO "anon" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "messages_public_insert_authenticated" ON "messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "messages_admin_select" ON "messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "messages_admin_update" ON "messages" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )) WITH CHECK (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "messages_admin_delete" ON "messages" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));