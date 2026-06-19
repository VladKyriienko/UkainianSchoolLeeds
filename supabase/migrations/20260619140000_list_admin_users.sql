-- Paginated admin user listing (service_role only).
-- Replaces loading all auth users via auth.admin.listUsers() in getAllUsers.

CREATE OR REPLACE FUNCTION public.list_admin_users(
  p_page integer DEFAULT 1,
  p_limit integer DEFAULT 20,
  p_search text DEFAULT NULL,
  p_role text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  avatar_url text,
  email_confirmed_at timestamptz,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  role text,
  is_active boolean,
  teacher_class_id uuid,
  total_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  WITH filtered AS (
    SELECT
      au.id,
      au.email,
      pu.full_name,
      pu.avatar_url,
      au.email_confirmed_at,
      au.created_at,
      au.last_sign_in_at,
      COALESCE(
        (SELECT r.role::text FROM public.roles r WHERE r.user_id = au.id LIMIT 1),
        'user'
      ) AS role,
      pu.is_active,
      (
        SELECT tc.class_id
        FROM public.teacher_class tc
        WHERE tc.teacher_id = au.id
        LIMIT 1
      ) AS teacher_class_id
    FROM auth.users au
    INNER JOIN public.users pu ON pu.id = au.id
    WHERE au.email IS NOT NULL
      AND (
        p_search IS NULL
        OR btrim(p_search) = ''
        OR au.email ILIKE '%' || btrim(p_search) || '%'
        OR pu.full_name ILIKE '%' || btrim(p_search) || '%'
      )
      AND (
        p_role IS NULL
        OR btrim(p_role) = ''
        OR COALESCE(
          (SELECT r.role::text FROM public.roles r WHERE r.user_id = au.id LIMIT 1),
          'user'
        ) = btrim(p_role)
      )
  ),
  paged AS (
    SELECT
      f.*,
      COUNT(*) OVER () AS total_count
    FROM filtered f
    ORDER BY f.created_at DESC NULLS LAST
    OFFSET GREATEST(p_page - 1, 0) * GREATEST(p_limit, 1)
    LIMIT GREATEST(p_limit, 1)
  )
  SELECT * FROM paged;
$$;

REVOKE ALL ON FUNCTION public.list_admin_users(integer, integer, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.list_admin_users(integer, integer, text, text) FROM anon;
REVOKE ALL ON FUNCTION public.list_admin_users(integer, integer, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.list_admin_users(integer, integer, text, text) TO service_role;
