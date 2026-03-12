'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/app/admin/profile/components/DatePicker';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  updateProfileAction,
  uploadAvatarAction,
  deleteAvatarAction
} from './actions';
import { compressImage, validateImageFile } from '@/utils/image-compression';
import type { Tables } from '@/utils/supabase/types';
import { useAuthContext } from '@/providers/auth-provider';
import { ChangeEmailDialog } from './components/ChangeEmailDialog';
import { ChangePasswordDialog } from './components/ChangePasswordDialog';

type ProfileFormProps = {
  user: User;
  userData: Tables<'users'> | null;
  isEmailAuth: boolean;
};

export function ProfileForm({ user, userData, isEmailAuth }: ProfileFormProps) {
  const router = useRouter();
  const { refreshUserData } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(userData?.full_name || '');
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    userData?.birthdate ? new Date(userData.birthdate) : undefined
  );
  const [marketingConsent, setMarketingConsent] = useState(
    userData?.marketing_consent || false
  );

  // Generate user initials for avatar fallback
  const userInitials = (userData?.full_name || user.email || 'U')
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSaveProfile = async () => {
    setIsLoading(true);

    try {
      const profileData = {
        fullName: fullName.trim(),
        birthdate: birthdate ? birthdate.toISOString() : null,
        marketingConsent
      };

      const result = await updateProfileAction(profileData);

      if (result.success) {
        toast.success('Profile updated successfully!');
        // Refresh user data in auth context to update NavUser
        await refreshUserData();
        // Refresh the page to get updated data
        setTimeout(() => {
          try {
            router.refresh();
          } catch (error) {
            console.error('Router refresh error:', error);
            // Fallback to window reload if router fails
            window.location.reload();
          }
        }, 500);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Show compression progress
      toast.info('Compressing image...', { duration: 2000 });

      // Compress the image
      const compressedFile = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
        maxSizeKB: 500
      });

      // Show size reduction info
      const originalSizeKB = Math.round(file.size / 1024);
      const compressedSizeKB = Math.round(compressedFile.size / 1024);
      const reduction = Math.round(
        ((file.size - compressedFile.size) / file.size) * 100
      );

      if (reduction > 10) {
        toast.success(
          `Image compressed: ${originalSizeKB}KB → ${compressedSizeKB}KB (${reduction}% smaller)`,
          { duration: 3000 }
        );
      }

      // Upload the compressed image
      const result = await uploadAvatarAction(compressedFile);

      if (result.success) {
        toast.success('Avatar updated successfully!');
        // Refresh user data in auth context to update NavUser
        await refreshUserData();
        // Refresh the page to show new avatar
        setTimeout(() => {
          try {
            router.refresh();
          } catch (error) {
            console.error('Router refresh error:', error);
            window.location.reload();
          }
        }, 500);
      } else {
        toast.error(result.error || 'Failed to upload avatar');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploadingAvatar(false);
      // Clear the input so the same file can be selected again
      event.target.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!userData?.avatar_url) return;

    setIsUploadingAvatar(true);

    try {
      const result = await deleteAvatarAction();

      if (result.success) {
        toast.success('Avatar removed successfully!');
        // Refresh user data in auth context to update NavUser
        await refreshUserData();
        // Refresh the page to remove avatar
        setTimeout(() => {
          try {
            router.refresh();
          } catch (error) {
            console.error('Router refresh error:', error);
            window.location.reload();
          }
        }, 500);
      } else {
        toast.error(result.error || 'Failed to remove avatar');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Avatar Section */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload your profile picture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 lg:h-32 lg:w-32">
                <AvatarImage
                  className="object-cover"
                  src={userData?.avatar_url || undefined}
                  alt={userData?.full_name || user.email || 'User'}
                />
                <AvatarFallback className="text-lg lg:text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUploadingAvatar}
                  onClick={() =>
                    document.getElementById('avatar-upload')?.click()
                  }
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUploadingAvatar || !userData?.avatar_url}
                  onClick={handleDeleteAvatar}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>

              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Profile Information */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 gap-x-4 sm:flex-row items-start sm:items-center justify-between">
              <div className="space-y-2">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences.
                  <br />
                  Click "Save Changes" to apply updates.
                </CardDescription>
              </div>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="bg-muted"
              />
              {isEmailAuth ? (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <ChangeEmailDialog currentEmail={user.email} />
                  <span>•</span>
                  <ChangePasswordDialog />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Email and password cannot be changed because you signed in
                  with a social provider (Google, etc.). These settings are
                  managed by your social account.
                </p>
              )}
            </div>

            <Separator />

            {/* Full Name */}
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

            {/* Birth Date */}
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

            {/* Marketing Consent */}
            <div className="space-y-2">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
