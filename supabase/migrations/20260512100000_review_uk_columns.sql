-- Optional Ukrainian fields for parent reviews (mirrors `*_uk` pattern used elsewhere, e.g. teachers).
-- Rollback: ALTER TABLE "public"."review" DROP COLUMN IF EXISTS "perens_uk", DROP COLUMN IF EXISTS "content_uk";

ALTER TABLE "public"."review"
  ADD COLUMN IF NOT EXISTS "perens_uk" text,
  ADD COLUMN IF NOT EXISTS "content_uk" text;

COMMENT ON COLUMN "public"."review"."perens_uk" IS 'Parent attribution line in Ukrainian (optional).';
COMMENT ON COLUMN "public"."review"."content_uk" IS 'Review body in Ukrainian (optional).';
