'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, User, X } from 'lucide-react';
import type { CompletionFieldConfig } from '@/utils/auth-helpers/completion';
import type { CompletionData } from './types';

type CompletionBannerProps = {
  completionData: CompletionData;
  settings: {
    showCompletionBanner: boolean;
  };
  postSignupSettings: {
    requirePostSignupCompletion: boolean;
    postSignupCompletionPath: string;
  };
  fieldConfig: CompletionFieldConfig[];
  className?: string;
  variant?: 'sidebar' | 'top-banner' | 'card';
  showDismiss?: boolean;
  onDismiss?: () => void;
  showCompleteProfileButton?: boolean;
};

export function CompletionBanner({
  completionData,
  postSignupSettings,
  fieldConfig,
  className = '',
  variant = 'card',
  showDismiss = false,
  onDismiss,
  showCompleteProfileButton = true
}: CompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Handle dismiss
  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  // Don't render if dismissed
  if (isDismissed) {
    return null;
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80)
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (percentage >= 50)
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  const getMissingFieldLabels = () => {
    return completionData.missingFields
      .map((fieldId) => {
        const config = fieldConfig.find((f) => f.id === fieldId);
        return config?.label || fieldId;
      })
      .slice(0, 3); // Show max 3 missing fields
  };

  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'top-banner':
        return {
          container: 'border-b bg-gradient-to-r from-primary/5 to-primary/10',
          card: 'border-0 shadow-none bg-transparent',
          content: 'py-3 px-4'
        };
      case 'sidebar':
        return {
          container: 'border-l-4 border-l-primary',
          card: 'rounded-l-none',
          content: 'p-3'
        };
      case 'card':
      default:
        return {
          container: '',
          card: '',
          content: 'p-4'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      <Card className={styles.card}>
        <CardContent className={styles.content}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(completionData.percentage)}
                <div>
                  <h3 className="font-semibold text-sm">
                    Complete Your Profile
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {completionData.percentage}% complete (
                    {completionData.completedFields.length} of{' '}
                    {completionData.totalFields} fields)
                  </p>
                </div>
              </div>
              {showDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {variant !== 'top-banner' && (
              <Progress value={completionData.percentage} className="h-2" />
            )}

            {completionData.missingFields.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Missing: {getMissingFieldLabels().join(', ')}
                  {completionData.missingFields.length > 3 &&
                    ` and ${completionData.missingFields.length - 3} more`}
                </p>

                {showCompleteProfileButton && (
                  <div className="flex items-center gap-2">
                    <Link href={postSignupSettings.postSignupCompletionPath}>
                      <Button size="sm" className="h-7 text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
