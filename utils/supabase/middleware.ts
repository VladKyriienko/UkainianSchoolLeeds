import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
  userNeedsCompletion,
  getCompletionRedirectPath,
  isExcludedPath
} from '@/utils/auth-helpers/completion';

export const updateSession = async (request: NextRequest) => {
  const supabase = createClient();

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Check for post-signup completion requirements
  if (user && !isExcludedPath(request.nextUrl.pathname)) {
    try {
      const needsCompletion = await userNeedsCompletion(user.id);

      if (needsCompletion) {
        const completionPath = getCompletionRedirectPath();
        const redirectUrl = new URL(completionPath, request.url);

        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error(
        'Error checking user completion status in middleware:',
        error
      );
      // Continue with the request if there's an error to avoid blocking the user
    }
  }

  return NextResponse.next();
};
