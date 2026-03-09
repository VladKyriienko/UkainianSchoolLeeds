'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardContent className="flex flex-col items-center text-center space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-muted-foreground/60">404</h1>
            <Separator className="w-16 mx-auto" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Page not found
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button asChild className="flex-1">
              <Link href="/admin">
                <Home className="mr-2 h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
