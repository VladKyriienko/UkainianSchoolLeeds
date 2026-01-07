'use client';

import { cn } from '@/utils/cn';
import { createClient } from '@/utils/supabase/hooks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  getSignupFormSettings,
  getAuthTypes
} from '@/utils/auth-helpers/settings';
import { PasswordInput } from '@/components/common/PasswordInput';
import { DatePicker } from '@/app/(authenticated)/profile/components/DatePicker';
import { GoogleOAuthButton } from '@/components/common/GoogleOAuthButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  signUpSchema,
  PASSWORD_REQUIREMENTS
} from '@/utils/password-validation';

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showFullForm = getSignupFormSettings().enableFullSignupForm;
  const showMarketingConsent = getSignupFormSettings().enableMarketingConsent;
  const { allowOauth } = getAuthTypes();

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Validate form data
    const validation = signUpSchema.safeParse({
      email,
      password,
      repeatPassword,
      fullName: showFullForm ? fullName : undefined,
      birthdate: showFullForm && birthdate ? birthdate.toISOString() : undefined,
      marketingConsent: showFullForm ? marketingConsent : undefined
    });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Validation failed');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=/`,
          data: {
            full_name: showFullForm ? fullName : null,
            birthdate:
              showFullForm && birthdate ? birthdate.toISOString() : null,
            marketing_consent: showFullForm ? marketingConsent : false
          }
        }
      });
      if (error) throw error;
      router.push('/auth/sign-up-success');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          {allowOauth && (
            <div className="mb-6">
              <GoogleOAuthButton text="Sign up with Google" />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {showFullForm && (
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  required
                  minLength={PASSWORD_REQUIREMENTS.MIN_LENGTH}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {PASSWORD_REQUIREMENTS.MIN_LENGTH_MESSAGE}
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <PasswordInput
                  id="repeat-password"
                  placeholder="Repeat your password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {showFullForm && (
                <>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="birthdate">
                        Date of Birth (Optional)
                      </Label>
                    </div>
                    <DatePicker
                      date={birthdate}
                      onDateChange={setBirthdate}
                      placeholder="Pick your date of birth"
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </div>
                </>
              )}
              {showMarketingConsent && (
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="marketing-consent"
                    checked={marketingConsent}
                    onCheckedChange={(checked) =>
                      setMarketingConsent(checked as boolean)
                    }
                  />
                  <Label htmlFor="marketing-consent" className="text-sm">
                    I would like to receive marketing updates
                  </Label>
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating an account...' : 'Sign up'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
