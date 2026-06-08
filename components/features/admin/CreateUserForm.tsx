'use client';

import UserForm from './UserForm';
import type { AdminClass } from '@/types';

type CreateUserFormProps = {
  classes: AdminClass[];
};

export default function CreateUserForm({ classes }: CreateUserFormProps) {
  return <UserForm classes={classes} mode="create" />;
}
