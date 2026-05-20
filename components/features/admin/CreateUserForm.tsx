'use client';

import UserForm from './UserForm';
import type { AdminClass } from '@/types';

type Organisation = {
  id: string;
  name: string;
  slug: string;
};

type CreateUserFormProps = {
  organisations: Organisation[];
  classes: AdminClass[];
};

export default function CreateUserForm({
  organisations,
  classes
}: CreateUserFormProps) {
  return <UserForm organisations={organisations} classes={classes} mode="create" />;
}
