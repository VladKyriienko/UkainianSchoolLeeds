import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/lib/supabase/middleware';
import { hasAdminRole, hasTeacherRole } from '@/lib/auth/roles';
import type { UserWithRoles } from '@/lib/supabase/server';

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } =
    createMiddlewareSupabaseClient(request);
  const pathname = request.nextUrl.pathname;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.startsWith('/admin');
  const isTeacherRoute = pathname.startsWith('/teacher');

  if (!isAdminRoute && !isTeacherRoute) {
    return supabaseResponse;
  }

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profileData } = await supabase
    .from('users')
    .select('*, roles(*)')
    .eq('id', user.id)
    .single();

  const profile = profileData as UserWithRoles | null;

  if (isAdminRoute && !hasAdminRole(profile)) {
    if (hasTeacherRole(profile)) {
      return NextResponse.redirect(new URL('/teacher', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isTeacherRoute) {
    if (hasAdminRole(profile)) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (!hasTeacherRole(profile)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*']
};
