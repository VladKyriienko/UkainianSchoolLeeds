'use client';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons/Google';
import { signInWithOAuth } from '@/lib/auth/client';
import { useState } from 'react';

type GoogleOAuthButtonProps = {
  text?: string;
  className?: string;
};

export function GoogleOAuthButton({
  text = 'Continue with Google',
  className
}: GoogleOAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    try {
      await signInWithOAuth(e);
    } catch (error) {
      console.error('Google OAuth error:', error);
      setIsLoading(false);
    }
    // Note: Don't set loading to false here as the user will be redirected
  };

  return (
    <form onSubmit={handleGoogleSignIn} className={className}>
      <input type="hidden" name="provider" value="google" />
      <Button
        type="submit"
        variant="outline"
        className="w-full"
        disabled={isLoading}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        {isLoading ? 'Redirecting...' : text}
      </Button>
    </form>
  );
}
