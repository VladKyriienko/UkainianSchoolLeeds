import { updateSession } from '@/utils/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access auth pages
  if (pathname.startsWith('/auth/')) {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    // If authenticated, redirect to home EXCEPT for allowed auth paths
    if (user) {
      const allowedAuthPaths = [
        '/auth/update-password',
        '/auth/callback-client',
        '/auth/callback',
        '/auth/error'
      ];

      const shouldAllowAccess = allowedAuthPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (!shouldAllowAccess) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  // Continue with existing session update logic
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
