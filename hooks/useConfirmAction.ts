'use client';

import { useState } from 'react';

type ConfirmActionOptions = {
  confirmMessage: string;
  onAction: () => Promise<void>;
  onError?: (error: unknown) => void;
};

export function useConfirmAction() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runWithConfirm = async ({
    confirmMessage,
    onAction,
    onError
  }: ConfirmActionOptions) => {
    if (!confirm(confirmMessage)) return false;

    setIsSubmitting(true);
    try {
      await onAction();
      return true;
    } catch (error) {
      onError?.(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, runWithConfirm };
}
