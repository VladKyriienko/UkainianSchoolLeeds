'use client';

import UserForm from './UserForm';

type Organisation = {
  id: string;
  name: string;
  slug: string;
};

type CreateUserFormProps = {
  organisations: Organisation[];
};

export default function CreateUserForm({ organisations }: CreateUserFormProps) {
  return <UserForm organisations={organisations} mode="create" />;
}
