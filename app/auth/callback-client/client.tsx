'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/hooks';

export default function AuthCallbackClient() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const [status, setStatus] = useState('Processing...');
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Create the Supabase client inside useEffect to avoid SSR issues
      const supabase = createClient();

      try {
        setStatus('Checking URL fragment...');

        // Get the URL fragment (everything after #)
        const fragment = window.location.hash.substring(1);
        console.log('URL fragment:', fragment);

        if (!fragment) {
          console.error('No URL fragment found');
          console.log(
            'No code provided - likely an invite link with URL fragment'
          );
          setStatus('No authentication tokens found');
          window.location.href = `/auth/login?error=Invalid%20Link&error_description=The%20authentication%20link%20is%20missing%20required%20tokens.`;
          return;
        }

        const params = new URLSearchParams(fragment);

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');

        console.log('Parsed tokens:', {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
          type
        });

        if (accessToken && refreshToken) {
          setStatus('Setting up session...');

          // Set the session client-side
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Error setting OAuth session:', error);
            window.location.href = `/auth/login?error=Authentication%20Failed&error_description=${encodeURIComponent(error.message)}`;
            return;
          }

          if (!data.user) {
            console.error('No user data after setting OAuth session');
            window.location.href = `/auth/login?error=Authentication%20Failed&error_description=No%20user%20data%20received`;
            return;
          }

          console.log('OAuth session established for user:', data.user.id);

          // Check if user exists and is active
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, full_name, is_active')
            .eq('id', data.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data after OAuth:', userError);
            // Continue anyway - the user might not be in the DB yet
          } else {
            console.log('User found in database:', userData.id);

            // Check if user is active
            if (userData.is_active === false) {
              console.error('OAuth user account is deactivated:', userData.id);
              await supabase.auth.signOut();
              window.location.href = `/auth/login?error=Account%20Deactivated&error_description=Your%20account%20has%20been%20deactivated.%20Please%20contact%20support.`;
              return;
            }
          }

          // Check if this is an invite - redirect to password setup
          if (type === 'invite') {
            console.log('Processing invite callback');
            router.push(
              '/auth/update-password?status=Welcome!&status_description=Please%20set%20your%20password%20to%20complete%20your%20account%20setup.'
            );
          } else {
            console.log(
              'Processing OAuth callback, redirecting to:',
              redirectTo
            );
            // Use router.push to navigate, which will trigger the AuthProvider
            // Note: router.push automatically refreshes the target route in Next.js App Router
            router.push(redirectTo);
          }
        } else {
          console.error('Missing tokens:', {
            accessToken: !!accessToken,
            refreshToken: !!refreshToken
          });
          setStatus('Missing authentication tokens');
          window.location.href = `/auth/login?error=Invalid%20Link&error_description=The%20authentication%20link%20is%20missing%20required%20tokens.`;
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus(
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        window.location.href = `/auth/login?error=Authentication%20Error&error_description=An%20unexpected%20error%20occurred.`;
      }
    };

    // Add a small delay to ensure the page is fully loaded
    setTimeout(handleAuthCallback, 100);
  }, [redirectTo, router]);

  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
      <p className="mt-4 text-muted-foreground">{status}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Please wait while we process your authentication...
      </p>
    </div>
  );
}
