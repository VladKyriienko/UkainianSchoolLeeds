import type { Database, Tables } from '@/lib/supabase/types';

type TableName = keyof Database['public']['Tables'];
type UsersFields = keyof Database['public']['Tables']['users']['Row'];

export type UserWithRoles = {
  roles: Tables<'roles'>[];
} & Tables<'users'>;

export type CompletionFieldConfig = {
  id: string;
  label: string;
  table?: TableName;
  field: string;
  required?: boolean;
  validator?: (value: unknown) => boolean;
};

export type UsersCompletionFieldConfig = {
  id: string;
  label: string;
  table?: 'users';
  field: UsersFields;
  required?: boolean;
  validator?: (value: unknown) => boolean;
};

export type ProfileCompletionResult = {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  totalFields: number;
};

export type CompletionData = {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  totalFields: number;
};

export type CompletionBannerData = {
  completionData: CompletionData;
  settings: {
    showCompletionBanner: boolean;
  };
  postSignupSettings: {
    requirePostSignupCompletion: boolean;
    postSignupCompletionPath: string;
  };
  fieldConfig: CompletionFieldConfig[];
};
