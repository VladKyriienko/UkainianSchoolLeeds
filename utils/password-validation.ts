import { z } from 'zod';

/**
 * Password validation constants
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 6,
  MIN_LENGTH_MESSAGE: 'Password must be at least 6 characters long'
} as const;

/**
 * Base password schema for single password validation
 */
export const passwordSchema = z
  .string()
  .min(
    PASSWORD_REQUIREMENTS.MIN_LENGTH,
    PASSWORD_REQUIREMENTS.MIN_LENGTH_MESSAGE
  )
  .trim();

/**
 * Password with confirmation schema
 * Use this for sign-up and password change forms
 */
export const passwordWithConfirmSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

/**
 * Set password schema for OAuth users (first time password creation)
 * Use this when OAuth users want to add password authentication
 */
export const setPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

/**
 * Change password schema with current password validation
 * Use this for password change functionality
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword']
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword']
  });

/**
 * Sign-up form schema with password validation
 */
export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    repeatPassword: z.string(),
    fullName: z.string().optional(),
    birthdate: z.string().optional(),
    marketingConsent: z.boolean().optional()
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword']
  });

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * Update password form schema (for forgot password flow)
 */
export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm']
  });

/**
 * Email change schema
 */
export const changeEmailSchema = z.object({
  newEmail: z.string().email('Invalid email address')
});

/**
 * Helper function to validate password
 * @param password - The password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  try {
    passwordSchema.parse(password);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Invalid password'
      };
    }
    return { isValid: false, error: 'Invalid password' };
  }
}

/**
 * Helper function to validate password with confirmation
 * @param password - The password
 * @param confirmPassword - The confirmation password
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePasswordWithConfirm(
  password: string,
  confirmPassword: string
): {
  isValid: boolean;
  error?: string;
  field?: 'password' | 'confirmPassword';
} {
  try {
    passwordWithConfirmSchema.parse({ password, confirmPassword });
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        isValid: false,
        error: firstError?.message || 'Invalid passwords',
        field:
          (firstError?.path[0] as 'password' | 'confirmPassword') || 'password'
      };
    }
    return { isValid: false, error: 'Invalid passwords' };
  }
}

/**
 * Helper function to validate change password form
 * @param data - Object containing currentPassword, newPassword, and confirmPassword
 * @returns Object with isValid boolean and error details if invalid
 */
export function validateChangePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): {
  isValid: boolean;
  error?: string;
  field?: 'currentPassword' | 'newPassword' | 'confirmPassword';
} {
  try {
    changePasswordSchema.parse(data);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        isValid: false,
        error: firstError?.message || 'Invalid password data',
        field:
          (firstError?.path[0] as
            | 'currentPassword'
            | 'newPassword'
            | 'confirmPassword') || 'newPassword'
      };
    }
    return { isValid: false, error: 'Invalid password data' };
  }
}

/**
 * Helper function to validate set password form (OAuth users)
 * @param data - Object containing newPassword and confirmPassword
 * @returns Object with isValid boolean and error details if invalid
 */
export function validateSetPassword(data: {
  newPassword: string;
  confirmPassword: string;
}): {
  isValid: boolean;
  error?: string;
  field?: 'newPassword' | 'confirmPassword';
} {
  try {
    setPasswordSchema.parse(data);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        isValid: false,
        error: firstError?.message || 'Invalid password data',
        field:
          (firstError?.path[0] as 'newPassword' | 'confirmPassword') ||
          'newPassword'
      };
    }
    return { isValid: false, error: 'Invalid password data' };
  }
}

