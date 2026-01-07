'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changeEmailSchema } from '@/utils/password-validation';
import { Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { changeEmailAction } from '../actions';

type ChangeEmailDialogProps = {
  currentEmail?: string | undefined;
};

export function ChangeEmailDialog({ currentEmail }: ChangeEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const validation = changeEmailSchema.safeParse({ newEmail });
    if (!validation.success) {
      toast.error(validation.error.errors[0]?.message || 'Invalid email');
      return;
    }

    setIsLoading(true);

    try {
      const result = await changeEmailAction(newEmail);

      if (result.success) {
        toast.success(result.message || 'Email change initiated successfully!');

        // Reset form and close dialog
        setNewEmail('');
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to update email');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-xs">
          Change email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Change Email Address
          </DialogTitle>
          <DialogDescription>Update your email address</DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertDescription>
            You&apos;ll need to confirm the change by clicking links sent to
            both your current and new email addresses.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email-display">Current Email</Label>
            <Input
              id="current-email-display"
              type="email"
              value={currentEmail || ''}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-email">New Email Address</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter your new email address"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Change Email'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
