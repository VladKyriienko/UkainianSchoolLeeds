CREATE TABLE "teacher_class" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "teacher_id" uuid NOT NULL,
  "class_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "teacher_class" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "teacher_class"
  ADD CONSTRAINT "teacher_class_teacher_id_users_id_fk"
  FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id")
  ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "teacher_class"
  ADD CONSTRAINT "teacher_class_class_id_classes_id_fk"
  FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id")
  ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE POLICY "teacher_class_admin_select"
ON "teacher_class"
AS PERMISSIVE
FOR SELECT
TO "authenticated"
USING (
  exists (
    select 1
    from roles
    where roles.user_id = auth.uid()
      and roles.role = 'admin'
  )
);
--> statement-breakpoint
CREATE POLICY "teacher_class_teacher_select"
ON "teacher_class"
AS PERMISSIVE
FOR SELECT
TO "authenticated"
USING ("teacher_id" = auth.uid());
--> statement-breakpoint
CREATE POLICY "teacher_class_admin_insert"
ON "teacher_class"
AS PERMISSIVE
FOR INSERT
TO "authenticated"
WITH CHECK (
  exists (
    select 1
    from roles
    where roles.user_id = auth.uid()
      and roles.role = 'admin'
  )
);
--> statement-breakpoint
CREATE POLICY "teacher_class_admin_update"
ON "teacher_class"
AS PERMISSIVE
FOR UPDATE
TO "authenticated"
USING (
  exists (
    select 1
    from roles
    where roles.user_id = auth.uid()
      and roles.role = 'admin'
  )
)
WITH CHECK (
  exists (
    select 1
    from roles
    where roles.user_id = auth.uid()
      and roles.role = 'admin'
  )
);
--> statement-breakpoint
CREATE POLICY "teacher_class_admin_delete"
ON "teacher_class"
AS PERMISSIVE
FOR DELETE
TO "authenticated"
USING (
  exists (
    select 1
    from roles
    where roles.user_id = auth.uid()
      and roles.role = 'admin'
  )
);
