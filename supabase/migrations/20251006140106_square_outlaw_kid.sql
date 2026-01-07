CREATE TYPE "public"."postSignupCompletionEnum" AS ENUM('profile_completion', 'terms_acceptance', 'custom');--> statement-breakpoint
CREATE TABLE "user_completion_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"completion_type" "postSignupCompletionEnum" NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_completion_status" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_completion_status" ADD CONSTRAINT "user_completion_status_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "select_own_completion_status" ON "user_completion_status" AS PERMISSIVE FOR SELECT TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "insert_own_completion_status" ON "user_completion_status" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "crud-anon-policy-select" ON "user_completion_status" AS PERMISSIVE FOR SELECT TO "anon" USING (false);--> statement-breakpoint
CREATE POLICY "crud-anon-policy-insert" ON "user_completion_status" AS PERMISSIVE FOR INSERT TO "anon" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anon-policy-update" ON "user_completion_status" AS PERMISSIVE FOR UPDATE TO "anon" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anon-policy-delete" ON "user_completion_status" AS PERMISSIVE FOR DELETE TO "anon" USING (false);