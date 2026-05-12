-- Table: public.review — parent reviews (attribution `perens`, body `content`, moment `data`).
-- RLS: anon + authenticated SELECT; INSERT/UPDATE/DELETE only for users with role `admin`.

CREATE TABLE "public"."review" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "perens" text NOT NULL,
  "content" text NOT NULL,
  "data" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "public"."review" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "review_public_select" ON "public"."review" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);

CREATE POLICY "review_admin_insert" ON "public"."review" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "public"."roles"
    WHERE "roles"."user_id" = auth.uid()
      AND "roles"."role" = 'admin'
  )
);

CREATE POLICY "review_admin_update" ON "public"."review" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
  EXISTS (
    SELECT 1
    FROM "public"."roles"
    WHERE "roles"."user_id" = auth.uid()
      AND "roles"."role" = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "public"."roles"
    WHERE "roles"."user_id" = auth.uid()
      AND "roles"."role" = 'admin'
  )
);

CREATE POLICY "review_admin_delete" ON "public"."review" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  EXISTS (
    SELECT 1
    FROM "public"."roles"
    WHERE "roles"."user_id" = auth.uid()
      AND "roles"."role" = 'admin'
  )
);
