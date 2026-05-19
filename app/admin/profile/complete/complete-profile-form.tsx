'use client';

import { DatePicker } from '@/components/common/admin/DatePicker';
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
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  completeProfileAction,
  getProfileValidationAction,
  saveProfileDataAction
} from './actions';

type CompleteProfileFormProps = {
  userData?: {
    full_name?: string | null;
    birthdate?: string | null;
  } | null;
};

export function CompleteProfileForm({ userData }: CompleteProfileFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(userData?.full_name || '');
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    userData?.birthdate ? new Date(userData.birthdate) : undefined
  );

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Save profile data
  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      const profileData = {
        fullName: fullName.trim(),
        birthdate: birthdate ? birthdate.toISOString() : null
      };

      const result = await saveProfileDataAction(profileData);

      if (result.success) {
        toast.success('Profile data saved successfully!');
      } else {
        toast.warning(result.error || 'Failed to save profile data');
      }
    } catch (err) {
      toast.warning(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  // Complete profile
  const handleCompleteProfile = async () => {
    setIsLoading(true);

    try {
      // Save profile data first
      const profileData = {
        fullName: fullName.trim(),
        birthdate: birthdate ? birthdate.toISOString() : null
      };

      const saveResult = await saveProfileDataAction(profileData);
      if (!saveResult.success) {
        toast.warning(saveResult.error || 'Failed to save profile data');
        return;
      }

      // Then validate required fields after saving
      const validation = await getProfileValidationAction();
      if (validation.success && !validation.canComplete) {
        toast.warning(
          `Please complete the following required fields: ${validation.missingRequiredFields?.join(', ')}`
        );
        return;
      }

      // Finally complete the profile
      const completeResult = await completeProfileAction();
      if (completeResult.success) {
        toast.success('Profile completed successfully!');
        router.push('/');
      } else {
        toast.warning(completeResult.error || 'Failed to complete profile');
      }
    } catch (err) {
      toast.warning(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission - always auto-complete when form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-complete when form is submitted and all required fields are filled
    await handleCompleteProfile();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Please provide the required information to complete your profile
          setup.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Birth Date Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="birthdate">Date of Birth</Label>
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

          {/* Buttons based on settings */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSaveChanges}
              disabled={isSaving || isLoading}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>

            <Button
              type="button"
              className="w-full"
              onClick={handleCompleteProfile}
              disabled={isLoading || isSaving}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Completing Profile...' : 'Complete Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
