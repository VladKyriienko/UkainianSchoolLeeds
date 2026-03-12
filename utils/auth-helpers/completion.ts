import { createClient } from '@/utils/supabase/server';
import { getPostSignupSettings } from './settings';
import type { Database } from '@/utils/supabase/types';

// Type-safe table and field configuration
type TableName = keyof Database['public']['Tables'];
type UsersFields = keyof Database['public']['Tables']['users']['Row'];

// Define completion field configuration type with proper DB constraints
export type CompletionFieldConfig = {
  id: string;
  label: string;
  table?: TableName; // Optional table name, defaults to 'users'
  field: string; // Field name - will be validated at runtime
  required?: boolean;
  validator?: (value: unknown) => boolean; // Custom validation function
};

// Type-safe field configuration for users table
export type UsersCompletionFieldConfig = {
  id: string;
  label: string;
  table?: 'users';
  field: UsersFields;
  required?: boolean;
  validator?: (value: unknown) => boolean;
};

/**
 * Default completion fields configuration
 * This can be customized per project by modifying this array
 */
export const DEFAULT_COMPLETION_FIELDS: UsersCompletionFieldConfig[] = [
  {
    id: 'full_name',
    label: 'Full Name',
    table: 'users',
    field: 'full_name'
  },
  {
    id: 'birthdate',
    label: 'Birth Date',
    table: 'users',
    field: 'birthdate'
  },
];

export type ProfileCompletionResult = {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  totalFields: number;
};

/**
 * Compute completion from already-fetched table data (no DB call).
 */
function computeCompletionFromTableData(
  tableData: Record<string, Record<string, unknown>>,
  fields: CompletionFieldConfig[]
): ProfileCompletionResult {
  const completedFields: string[] = [];
  const missingFields: string[] = [];

  fields.forEach((fieldConfig) => {
    const table = fieldConfig.table || 'users';
    const data = tableData[table];
    const fieldValue = data?.[fieldConfig.field];

    const isCompleted = fieldConfig.validator
      ? fieldConfig.validator(fieldValue)
      : fieldValue !== null &&
        fieldValue !== undefined &&
        fieldValue !== '' &&
        (typeof fieldValue !== 'string' || fieldValue.trim().length > 0);

    if (isCompleted) {
      completedFields.push(fieldConfig.id);
    } else {
      missingFields.push(fieldConfig.id);
    }
  });

  const percentage = Math.round(
    (completedFields.length / fields.length) * 100
  );

  return {
    percentage,
    completedFields,
    missingFields,
    totalFields: fields.length
  };
}

/**
 * Calculate profile completion from an existing user row (no DB call).
 * Use when profile is already loaded (e.g. from getCurrentUser).
 */
export function calculateProfileCompletionFromUserRow(
  userRow: Record<string, unknown>,
  customFields?: CompletionFieldConfig[]
): ProfileCompletionResult {
  const fields = customFields || DEFAULT_COMPLETION_FIELDS;
  const tableData: Record<string, Record<string, unknown>> = {
    users: userRow as Record<string, unknown>
  };
  return computeCompletionFromTableData(tableData, fields);
}

/**
 * Calculate profile completion percentage based on configured fields
 */
export async function calculateProfileCompletion(
  userId: string,
  customFields?: CompletionFieldConfig[]
): Promise<ProfileCompletionResult> {
  const supabase = createClient();
  const fields = customFields || DEFAULT_COMPLETION_FIELDS;

  try {
    const fieldsByTable = fields.reduce(
      (acc, field) => {
        const table = field.table || 'users';
        if (!acc[table]) acc[table] = [];
        acc[table].push(field);
        return acc;
      },
      {} as Record<string, CompletionFieldConfig[]>
    );

    const tableData: Record<string, Record<string, unknown>> = {};

    for (const [tableName, tableFields] of Object.entries(fieldsByTable)) {
      const selectFields = tableFields.map((f) => f.field).join(', ');

      try {
        const query = supabase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .from(tableName as any)
          .select(selectFields)
          .eq('id', userId)
          .single();
        const { data, error } = await query;

        if (error && tableName === 'users') {
          console.error(
            'Error fetching user data for completion calculation:',
            error
          );
          return {
            percentage: 0,
            completedFields: [],
            missingFields: fields.map((f) => f.id),
            totalFields: fields.length
          };
        }

        tableData[tableName] =
          (data as unknown as Record<string, unknown>) || {};
      } catch (queryError) {
        console.error(`Could not query table ${tableName}:`, queryError);
        tableData[tableName] = {};
      }
    }

    return computeCompletionFromTableData(tableData, fields);
  } catch (error) {
    console.error('Error calculating profile completion:', error);
    return {
      percentage: 0,
      completedFields: [],
      missingFields: fields.map((f) => f.id),
      totalFields: fields.length
    };
  }
}

/**
 * Check if user can complete their profile based on required fields
 * Returns validation result with missing fields if any
 */
export async function validateProfileCompletion(userId: string): Promise<{
  canComplete: boolean;
  missingRequiredFields: string[];
  completionData: {
    percentage: number;
    completedFields: string[];
    missingFields: string[];
    totalFields: number;
  };
}> {
  // Calculate current profile completion
  const completionData = await calculateProfileCompletion(
    userId,
    DEFAULT_COMPLETION_FIELDS
  );

  // Check if all required fields are completed
  const requiredFields = DEFAULT_COMPLETION_FIELDS;

  const missingRequiredFields = requiredFields
    .filter((field) => completionData.missingFields.includes(field.id))
    .map((field) => field.label);

  return {
    canComplete: missingRequiredFields.length === 0,
    missingRequiredFields,
    completionData
  };
}

/**
 * Check if a user has completed the required post-signup action
 * Now directly checks if all required fields are filled
 */
export async function checkUserCompletionStatus(
  userId: string
): Promise<boolean> {
  try {
    const validation = await validateProfileCompletion(userId);
    return validation.canComplete;
  } catch (error) {
    console.error('Error in checkUserCompletionStatus:', error);
    return false;
  }
}

/**
 * Check if user needs to complete post-signup requirements
 */
export async function userNeedsCompletion(userId: string): Promise<boolean> {
  const settings = getPostSignupSettings();

  // If post-signup completion is not required, return false
  if (!settings.requirePostSignupCompletion) {
    return false;
  }

  const isCompleted = await checkUserCompletionStatus(userId);

  // User needs completion if not completed
  return !isCompleted;
}

/**
 * Mark user completion as complete (only if validation passes)
 * Now simply validates that all required fields are filled
 */
export async function markUserCompletionComplete(
  userId: string
): Promise<boolean> {
  try {
    const validation = await validateProfileCompletion(userId);

    if (!validation.canComplete) {
      console.log(
        'Cannot mark completion as complete - missing required fields:',
        validation.missingRequiredFields
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markUserCompletionComplete:', error);
    return false;
  }
}

/**
 * Get the completion redirect path from settings
 */
export function getCompletionRedirectPath(): string {
  const settings = getPostSignupSettings();
  return settings.postSignupCompletionPath;
}

/**
 * Check if a path should be excluded from completion checks
 */
export function isExcludedPath(pathname: string): boolean {
  const excludedPaths = ['/auth', '/signin', '/signup', '/api'];

  const settings = getPostSignupSettings();
  const completionPath = settings.postSignupCompletionPath;

  // Add the completion path to excluded paths
  excludedPaths.push(completionPath);

  return excludedPaths.some((path) => pathname.startsWith(path));
}
