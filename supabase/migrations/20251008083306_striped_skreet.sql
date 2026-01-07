ALTER POLICY "crud-authenticated-policy-insert" ON "users" TO authenticated WITH CHECK (false);--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-update" ON "users" TO authenticated USING (false) WITH CHECK (false);--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-delete" ON "users" TO authenticated USING (false);