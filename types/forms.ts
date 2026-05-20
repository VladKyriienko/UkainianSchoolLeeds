import type { z } from 'zod';
import type { emailSchema } from '@/utils/contact-validation';
import type {
  changeEmailSchema,
  changePasswordSchema,
  loginSchema,
  setPasswordSchema,
  signUpSchema,
  updatePasswordSchema
} from '@/utils/password-validation';

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

export type EmailSchemaValue = z.infer<typeof emailSchema>;
