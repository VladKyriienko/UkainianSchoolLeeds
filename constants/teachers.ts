export const TEACHER_CATEGORIES = {
  HEADTEACHER: 'headteacher',
  TEACHING_STAFF: 'teaching_staff',
  SUPPORT_STAFF: 'support_staff',
} as const;

export type TeacherCategory =
  (typeof TEACHER_CATEGORIES)[keyof typeof TEACHER_CATEGORIES];

export const TEACHER_CATEGORY_LABELS: Record<
  TeacherCategory,
  string
> = {
  [TEACHER_CATEGORIES.HEADTEACHER]: 'Headteacher',
  [TEACHER_CATEGORIES.TEACHING_STAFF]: 'Teaching Staff',
  [TEACHER_CATEGORIES.SUPPORT_STAFF]: 'Support Staff',
};

export const TEACHER_CATEGORY_OPTIONS = Object.entries(
  TEACHER_CATEGORY_LABELS
).map(([value, label]) => ({
  value,
  label,
}));






