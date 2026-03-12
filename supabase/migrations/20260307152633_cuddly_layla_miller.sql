CREATE TABLE IF NOT EXISTS "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_session_id" text NOT NULL,
	"stripe_payment_intent_id" text,
	"amount_cents" integer NOT NULL,
	"currency" text DEFAULT 'gbp' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"donor_email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "donations_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
ALTER TABLE "donations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY IF EXISTS "messages_public_insert_anon" ON "messages";--> statement-breakpoint
DROP POLICY IF EXISTS "messages_public_insert_authenticated" ON "messages";--> statement-breakpoint
DROP POLICY IF EXISTS "messages_admin_select" ON "messages";--> statement-breakpoint
DROP POLICY IF EXISTS "messages_admin_update" ON "messages";--> statement-breakpoint
DROP POLICY IF EXISTS "messages_admin_delete" ON "messages";--> statement-breakpoint
DROP POLICY IF EXISTS "donations_admin_select" ON "donations";--> statement-breakpoint
CREATE POLICY "donations_admin_select" ON "donations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));