/** Explicit PostgREST column lists — avoids select('*') and documents fetched fields. */

export const USER_PROFILE_COLUMNS =
  'id, full_name, avatar_url, birthdate, is_active, marketing_consent, created_at, updated_at' as const;

export const USER_PROFILE_WITH_ROLES =
  `${USER_PROFILE_COLUMNS}, roles(id, user_id, role)` as const;

export const NEWS_COLUMNS =
  'id, title, title_uk, description, description_uk, date, photo, order, created_at, updated_at' as const;

export const NEWS_LIST_COLUMNS =
  'id, title, title_uk, description, description_uk, date, photo, order, created_at' as const;

export const EVENT_COLUMNS =
  'id, title, title_uk, description, description_uk, date, start_time, end_time, location, location_uk, photo, created_at, updated_at' as const;

export const EVENT_LIST_COLUMNS =
  'id, title, title_uk, description, description_uk, date, start_time, end_time, location, location_uk, photo, created_at' as const;

export const SCHEDULE_COLUMNS =
  'id, date, file, created_at, updated_at' as const;

export const SCHEDULE_LIST_COLUMNS = 'id, date, file' as const;

export const TEACHER_COLUMNS =
  'id, name, name_uk, title, title_uk, description, description_uk, email, phone, photo, category, created_at, updated_at' as const;

export const CLASS_COLUMNS =
  'id, title, title_uk, description, description_uk, photo, order, created_at, updated_at' as const;

export const CLASS_PHOTO_GALLERY_COLUMNS =
  'id, class_id, photo, order, created_at, updated_at' as const;

export const GALLERY_COLUMNS =
  'id, photo, order, created_at, updated_at' as const;

export const MESSAGE_COLUMNS =
  'id, name, email, phone, subject, message, read, created_at, updated_at' as const;

export const DOCUMENT_COLUMNS =
  'id, title, title_uk, content, content_uk, type, created_at, updated_at' as const;

export const DOCUMENT_LIST_COLUMNS =
  'id, title, title_uk, type, created_at, updated_at' as const;

export const CLASS_LIST_COLUMNS =
  'id, title, title_uk, description, photo, order, created_at' as const;

export const REVIEW_COLUMNS =
  'id, content, content_uk, perens, perens_uk, data, created_at, updated_at' as const;
