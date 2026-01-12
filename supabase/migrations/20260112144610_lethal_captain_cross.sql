CREATE TYPE "public"."teacherCategoryEnum" AS ENUM('HEADTEACHER', 'TEACHER', 'STAF');--> statement-breakpoint
CREATE TYPE "public"."typeDocumentEnum" AS ENUM('COOKIES_POLICY', 'PRIVACY_POLICY', 'DOCUMEND');--> statement-breakpoint
CREATE TABLE "class_photo_galery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"photo" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_photo_galery" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" "typeDocumentEnum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"location" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"photo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "news" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"photo" text,
	"phone" text,
	"email" text,
	"description" text,
	"category" "teacherCategoryEnum" DEFAULT 'TEACHER' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "teachers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "class_photo_galery" ADD CONSTRAINT "class_photo_galery_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "class_photo_galery_public_select" ON "class_photo_galery" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "class_photo_galery_admin_insert" ON "class_photo_galery" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "class_photo_galery_admin_update" ON "class_photo_galery" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
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
CREATE POLICY "class_photo_galery_admin_delete" ON "class_photo_galery" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "classes_public_select" ON "classes" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "classes_admin_insert" ON "classes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "classes_admin_update" ON "classes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
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
CREATE POLICY "classes_admin_delete" ON "classes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "documents_public_select" ON "documents" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "documents_admin_insert" ON "documents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "documents_admin_update" ON "documents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
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
CREATE POLICY "documents_admin_delete" ON "documents" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "events_public_select" ON "events" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "events_admin_insert" ON "events" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "events_admin_update" ON "events" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
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
CREATE POLICY "events_admin_delete" ON "events" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "news_public_select" ON "news" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "news_admin_insert" ON "news" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "news_admin_update" ON "news" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
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
CREATE POLICY "news_admin_delete" ON "news" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "teachers_public_select" ON "teachers" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "teachers_admin_insert" ON "teachers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));--> statement-breakpoint
CREATE POLICY "teachers_admin_update" ON "teachers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
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
CREATE POLICY "teachers_admin_delete" ON "teachers" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    ));