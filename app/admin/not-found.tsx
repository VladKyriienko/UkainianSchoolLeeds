'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/common/BackButton';

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
            <h2 className="font-semibold leading-snug font-display text-foreground">Page not found</h2>
            <p className="max-w-sm text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <BackButton href="/admin" variant="default" size="default" className="flex-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
