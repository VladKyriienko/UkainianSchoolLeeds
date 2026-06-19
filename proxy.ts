import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/lib/supabase/middleware';

/**
 * Auth gate for /admin and /teacher only. Role checks run in route layouts
 * (getCurrentUser, cached per request) to avoid a DB round-trip on every navigation.
 */
export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } =
    createMiddlewareSupabaseClient(request);
  const pathname = request.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith('/admin');
  const isTeacherRoute = pathname.startsWith('/teacher');

  if (!isAdminRoute && !isTeacherRoute) {
    return supabaseResponse;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*']
};
