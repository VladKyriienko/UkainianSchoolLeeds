DROP POLICY "insert_own_completion_status" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP POLICY "crud-authenticated-policy-select" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP POLICY "crud-authenticated-policy-insert" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP POLICY "crud-authenticated-policy-update" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP POLICY "crud-authenticated-policy-delete" ON "user_completion_status" CASCADE;--> statement-breakpoint
DROP TABLE "user_completion_status" CASCADE;