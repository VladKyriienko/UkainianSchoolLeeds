-- Trigram indexes for admin ILIKE search filters (%term% patterns).

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS review_perens_trgm_idx
  ON public.review USING gin (perens gin_trgm_ops);

CREATE INDEX IF NOT EXISTS review_perens_uk_trgm_idx
  ON public.review USING gin (perens_uk gin_trgm_ops);

CREATE INDEX IF NOT EXISTS documents_title_trgm_idx
  ON public.documents USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS documents_title_uk_trgm_idx
  ON public.documents USING gin (title_uk gin_trgm_ops);

CREATE INDEX IF NOT EXISTS teachers_name_trgm_idx
  ON public.teachers USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS teachers_email_trgm_idx
  ON public.teachers USING gin (email gin_trgm_ops);

CREATE INDEX IF NOT EXISTS news_title_trgm_idx
  ON public.news USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS news_title_uk_trgm_idx
  ON public.news USING gin (title_uk gin_trgm_ops);

CREATE INDEX IF NOT EXISTS classes_title_trgm_idx
  ON public.classes USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS classes_title_uk_trgm_idx
  ON public.classes USING gin (title_uk gin_trgm_ops);

CREATE INDEX IF NOT EXISTS roles_user_id_idx
  ON public.roles (user_id);
