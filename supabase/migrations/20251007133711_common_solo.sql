CREATE TYPE "public"."sexEnum" AS ENUM('male', 'female', 'intersex', 'prefer_not_to_respond');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sex" "sexEnum";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birthdate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "marketing_consent" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_completion_status" DROP COLUMN "completion_type";--> statement-breakpoint
ALTER TABLE "user_completion_status" DROP COLUMN "metadata";--> statement-breakpoint
DROP POLICY "select_own_completion_status" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP POLICY "crud-anon-policy-select" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP POLICY "crud-anon-policy-insert" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP POLICY "crud-anon-policy-update" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP POLICY "crud-anon-policy-delete" ON "user_completion_status" CASCADE;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "user_completion_status" AS PERMISSIVE FOR SELECT TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "user_completion_status" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "user_completion_status" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "user_completion_status" AS PERMISSIVE FOR DELETE TO "authenticated" USING (false);--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-insert" ON "users" TO authenticated WITH CHECK (id = auth.uid());--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-update" ON "users" TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-delete" ON "users" TO authenticated USING (id = auth.uid());--> statement-breakpoint
DROP TYPE "public"."postSignupCompletionEnum";