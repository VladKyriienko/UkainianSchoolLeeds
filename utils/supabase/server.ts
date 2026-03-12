import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database, Tables } from './types';
// Note: We avoid importing PostgrestBuilder here because runtime shapes vary by
// client version and we treat the incoming query as `unknown`.

// Type to access the protected url property
// Some PostgrestBuilder instances expose an internal `url` property at runtime
// but it's not part of the public types. We'll access it via `any` at the call
// site to avoid TypeScript errors and guard its use at runtime.

// User with roles type for auth context
export type UserWithRoles = {
  roles: Tables<'roles'>[];
} & Tables<'users'>;

// Simple wrapper to store query metadata for hooks
export type QueryResult<T = Record<string, unknown>> = {
  queryKey: string;
  data: T[];
  tableName: string;
  url: string;
  searchParams: Record<string, string>;
  // Optional RPC function support
  rpcName?: string;
  rpcParams?: Record<string, unknown>;
};

// Create server client function
export const createClient = (): SupabaseClient<Database> => {
  if (typeof window !== 'undefined') {
    throw new Error(
      'createClient must be called from the server. Use createClient from hooks instead.'
    );
  }

  const cookieStorePromise = cookies();

  // First-party cookie options so Chrome doesn't treat session as third-party
  const firstPartyCookieOptions: Partial<CookieOptions> = {
    path: '/',
    sameSite: 'lax'
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookieStorePromise;
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookieStorePromise;
            cookieStore.set({
              name,
              value,
              ...firstPartyCookieOptions,
              ...options
            });
          } catch (error) {
            // Silently ignore cookie set errors in Server Components
            // Cookies can only be modified in Server Actions or Route Handlers
            // Middleware will handle session refresh, so this is safe to ignore
            // Only log if it's not the expected Server Component error
            if (
              error instanceof Error &&
              !error.message.includes('Cookies can only be modified')
            ) {
              console.error('Unexpected cookie set error:', error);
            }
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookieStorePromise;
            cookieStore.set({
              name,
              value: '',
              ...firstPartyCookieOptions,
              ...options
            });
          } catch (error) {
            // Silently ignore cookie remove errors in Server Components
            // Cookies can only be modified in Server Actions or Route Handlers
            // Middleware will handle session refresh, so this is safe to ignore
            // Only log if it's not the expected Server Component error
            if (
              error instanceof Error &&
              !error.message.includes('Cookies can only be modified')
            ) {
              console.error('Unexpected cookie remove error:', error);
            }
          }
        }
      }
    }
  ) as unknown as SupabaseClient<Database>;
};

// Utility function to execute a query and capture its metadata
export async function executeWithMetadata<T extends Record<string, unknown>>(
  query: unknown
): Promise<QueryResult<T>> {
  // The Postgrest builder types from the client can be complex and vary with
  // the installed supabase/postgrest versions. For robustness we accept
  // `unknown` here and treat the runtime value more loosely.
  // The incoming `query` is usually a thenable Postgrest builder. Cast it to
  // a Promise-like unknown and await it, then narrow the response shape.
  const resp = await (query as unknown as Promise<unknown>);
  const { data, error } = resp as { data?: unknown; error?: unknown };
  if (error) {
    // Handle different types of errors
    let message = 'Unknown error';
    let details = 'No details available';
    let hint = 'No hint available';
    // let code = 'No error code';

    if (error && typeof error === 'object') {
      const errorObj = error as {
        message?: string;
        details?: string;
        hint?: string;
        code?: string;
      };
      message = errorObj?.message || message;
      details = errorObj?.details || details;
      hint = errorObj?.hint || hint;
      // code = errorObj?.code || code;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Create a more descriptive error message
    const errorMessage =
      message !== 'Unknown error'
        ? `Supabase query failed: ${message}${details !== 'No details available' ? ` - ${details}` : ''}${hint !== 'No hint available' ? ` (Hint: ${hint})` : ''}`
        : `Supabase query failed with error: ${JSON.stringify(error)}`;

    throw new Error(errorMessage);
  }

  // Try to read an internal `url` value if present. This is not guaranteed and
  // may not be available in all runtime environments, so treat it as optional.
  // Access the internal `url` property when present without using `any` in the
  // surrounding scope. We cast to a narrow shape via `unknown` -> typed object.
  const maybe = query as unknown as { url?: URL | string };
  const maybeUrl = maybe?.url;
  const rawUrl = maybeUrl ? String(maybeUrl) : '';

  const searchParams: Record<string, string> = {};
  let tableName = '';
  let rpcName: string | undefined;
  let rpcParams: Record<string, unknown> | undefined;

  if (rawUrl) {
    try {
      const urlObj = new URL(rawUrl);
      // table name is last segment of pathname (may be rpc name for rpc calls)
      tableName = urlObj.pathname.split('/').pop() || '';

      urlObj.searchParams.forEach((value, key) => {
        searchParams[key] = value;
      });

      const isRpcCall = urlObj.pathname.includes('/rpc/');
      if (isRpcCall) {
        rpcName = tableName;
        // collect rpc params (skip PostgREST control params)
        urlObj.searchParams.forEach((value, key) => {
          if (!['select', 'order', 'limit', 'offset', 'range'].includes(key)) {
            rpcParams = rpcParams ?? {};
            rpcParams[key] = value;
          }
        });
      }
    } catch {
      // If the URL is malformed or unavailable, fall back to empty values.
      tableName = '';
    }
  }

  const queryKey = `${tableName}_${rawUrl}`;
  // Ensure the returned data matches the expected T[] shape. If the
  // runtime `data` isn't an array, fall back to an empty array.
  const resultData: T[] = Array.isArray(data) ? (data as T[]) : [];

  const queryResult: QueryResult<T> = {
    queryKey,
    data: resultData,
    tableName,
    url: rawUrl,
    searchParams,
    ...(rpcName && { rpcName }),
    ...(rpcParams && Object.keys(rpcParams).length > 0 && { rpcParams })
  };

  return queryResult;
}

export async function getCurrentUserQueryResult(
  supabase?: SupabaseClient<Database>
) {
  if (!supabase) {
    supabase = createClient();
  }
  const { data: userData } = await supabase.auth.getUser();
  if (userData.user) {
    return executeWithMetadata<UserWithRoles>(
      supabase
        .from('users')
        .select('*, roles(*)')
        .eq('id', userData.user.id)
        .limit(1)
    );
  } else {
    return {
      queryKey: 'current_user',
      data: [],
      tableName: 'users',
      url: '',
      searchParams: {}
    };
  }
}
