'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, updateUser } from '@/app/admin/users/actions';
import type { AdminClass, AdminUser, CreateUserData } from '@/types';
import { getOrganisationSettings } from '@/lib/auth/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type Organisation = {
  id: string;
  name: string;
  slug: string;
};

type UserFormProps = {
  organisations: Organisation[];
  classes?: AdminClass[];
  user?: AdminUser; // If provided, we're editing; otherwise creating
  mode: 'create' | 'edit';
};

export default function UserForm({
  organisations,
  classes = [],
  user,
  mode
}: UserFormProps) {
  const router = useRouter();
  const { allowOrganisations } = getOrganisationSettings();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    full_name: user?.full_name || '',
    role: (user?.role as 'admin' | 'teacher' | 'user') || 'user',
    class_id: user?.teacher_class_id || '',
    organisation_id: '',
    organisation_role: 'user'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'create') {
        const createData: CreateUserData = {
          email: formData.email.trim(),
          role: formData.role as 'admin' | 'teacher' | 'user',
          ...(formData.full_name.trim() && {
            full_name: formData.full_name.trim()
          }),
          ...(formData.role === 'teacher' && formData.class_id
            ? { class_id: formData.class_id }
            : {}),
          ...(formData.organisation_id && {
            organisation_id: formData.organisation_id
          }),
          ...(formData.organisation_role && {
            organisation_role: formData.organisation_role
          })
        };

        const createResult = await createUser(createData);
        if (!createResult.success) {
          throw new Error(createResult.error ?? 'Failed to create user');
        }
        router.push('/admin/users');
      } else {
        const updateData = {
          email: formData.email.trim(),
          role: formData.role,
          ...(formData.role === 'teacher'
            ? { class_id: formData.class_id }
            : { class_id: '' }),
          ...(formData.full_name.trim() && {
            full_name: formData.full_name.trim()
          })
        };

        if (!user?.id) {
          throw new Error('User ID is required for editing');
        }

        await updateUser(user.id, updateData);
        router.push('/admin/users');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save user';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="user@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            placeholder="John Doe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">System Role *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              role: value as 'admin' | 'teacher' | 'user'
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.role === 'teacher' && (
        <div className="space-y-2">
          <Label htmlFor="class_id">Teacher Class</Label>
          <Select
            value={formData.class_id || 'none'}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                class_id: value === 'none' ? '' : value
              })
            }
          >
            <SelectTrigger id="class_id">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No class</SelectItem>
              {classes.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {mode === 'create' && allowOrganisations && organisations.length > 0 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="organisation_id">
              Add to Organisation (Optional)
            </Label>
            <Select
              value={formData.organisation_id}
              onValueChange={(value) =>
                setFormData({ ...formData, organisation_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an organisation..." />
              </SelectTrigger>
              <SelectContent>
                {organisations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.organisation_id && (
            <div className="space-y-2">
              <Label htmlFor="organisation_role">Organisation Role</Label>
              <Select
                value={formData.organisation_role}
                onValueChange={(value) =>
                  setFormData({ ...formData, organisation_role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create User'
              : 'Update User'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/users')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
