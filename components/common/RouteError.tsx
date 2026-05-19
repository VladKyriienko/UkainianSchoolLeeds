'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home, RotateCcw } from 'lucide-react';

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
  homeLabel?: string;
  title?: string;
};

export function RouteError({
  error,
  reset,
  homeHref = '/',
  homeLabel = 'Go home',
  title = 'Something went wrong'
}: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50svh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold font-display text-foreground">{title}</h1>
            <Separator className="mx-auto w-16" />
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            An unexpected error occurred. You can try again or return to a safe page.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" className="flex-1" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button asChild className="flex-1">
              <Link href={homeHref}>
                <Home className="mr-2 h-4 w-4" />
                {homeLabel}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
