/**
 * Central application types — import domain types from `@/types`.
 * Generated Supabase types stay in `@/lib/supabase/types`.
 * UI primitive props (Button, Card, …) stay colocated under `components/ui/`.
 */

export type { Database, Tables, TablesInsert, TablesUpdate, Enums, Json } from '@/lib/supabase/types';

export * from '@/types/navigation';
export * from '@/types/auth';
export * from '@/types/admin';
export * from '@/types/public';
export * from '@/types/calendar';
export * from '@/types/phone';
export * from '@/types/forms';
export * from '@/types/content';
export * from '@/types/content/home';
export * from '@/types/utils';
export * from '@/types/supabase-client';
export * from '@/types/components';
