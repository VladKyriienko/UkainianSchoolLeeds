'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PublicHomeClient() {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-4xl mx-auto py-8 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to Ukrainia School
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A school for Ukrainian children.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
