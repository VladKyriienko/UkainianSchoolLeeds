'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';
import { type QueryResult } from './server';

// Mutation result type
export type MutationResult<T = Record<string, unknown>> = {
  data: T | T[] | null;
  error: unknown;
  count?: number;
};

// Create browser client
export const createClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('This client must be used within a client component');
  }

  // Check if we're in a browser environment
  if (!window.location) {
    throw new Error('Browser environment not available');
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Hook return type for queries
export type UseSupabaseStoreReturn<T = Record<string, unknown>> = {
  data: T[];
  filters: Record<string, unknown>;
  loading: boolean;
  error: string | null;
  updateFilters: (newFilters: Record<string, unknown>) => void;
  refetch: () => Promise<void>;
  setRpcParams: (rpcName: string | null, params?: Record<string, unknown>) => void;
};

// Hook return type for mutations
export type UseMutationReturn<T = Record<string, unknown>> = {
  mutate: (...args: unknown[]) => Promise<MutationResult<T>>;
  loading: boolean;
  error: string | null;
  data: T | T[] | null;
};

// Client-side store class for mutations
class ClientSupabaseStore {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  // Insert operations
  async insert<T = Record<string, unknown>>(
    tableName: keyof Database['public']['Tables'],
    values: unknown
  ): Promise<MutationResult<T>> {
    const response = await this.supabase
      .from(tableName)
      .insert(values as never)
      .select();

    return {
      data: response.data as T | T[] | null,
      error: response.error,
      ...(response.count !== null &&
        response.count !== undefined && { count: response.count })
    };
  }

  // Update operations
  async update<T = Record<string, unknown>>(
    tableName: keyof Database['public']['Tables'],
    values: unknown,
    filters?: Record<string, unknown>
  ): Promise<MutationResult<T>> {
    let query = this.supabase.from(tableName).update(values as never);

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([column, value]) => {
        query = query.eq(column, value as never);
      });
    }

    const response = await query.select();
    return {
      data: response.data as T | T[] | null,
      error: response.error,
      ...(response.count !== null &&
        response.count !== undefined && { count: response.count })
    };
  }

  // Delete operations
  async delete<T = Record<string, unknown>>(
    tableName: keyof Database['public']['Tables'],
    filters: Record<string, unknown>
  ): Promise<MutationResult<T>> {
    let query = this.supabase.from(tableName).delete();

    // Apply filters - required for delete operations
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value as never);
    });

    const response = await query.select();
    return {
      data: response.data as T | T[] | null,
      error: response.error,
      ...(response.count !== null &&
        response.count !== undefined && { count: response.count })
    };
  }

  // Upsert operations
  async upsert<T = Record<string, unknown>>(
    tableName: keyof Database['public']['Tables'],
    values: unknown
  ): Promise<MutationResult<T>> {
    const response = await this.supabase
      .from(tableName)
      .upsert(values as never)
      .select();

    return {
      data: response.data as T | T[] | null,
      error: response.error,
      ...(response.count !== null &&
        response.count !== undefined && { count: response.count })
    };
  }

  // Get the underlying client
  getClient() {
    return this.supabase;
  }
}

// Singleton instance for client store
let clientStore: ClientSupabaseStore | null = null;

const getClientStore = () => {
  // If we're rendering on the server, avoid creating a browser client
  // and instead return a lightweight dummy that surfaces clear errors
  // if its methods are used. This prevents crashes during SSR while
  // making the problem obvious if code tries to run mutations on server.
  if (typeof window === 'undefined') {
    const dummy = {
      insert: async () => ({ data: null, error: new Error('Supabase client not available on server') }),
      update: async () => ({ data: null, error: new Error('Supabase client not available on server') }),
      delete: async () => ({ data: null, error: new Error('Supabase client not available on server') }),
      upsert: async () => ({ data: null, error: new Error('Supabase client not available on server') }),
      getClient: () => { throw new Error('Supabase client not available on server'); }
    } as unknown as ClientSupabaseStore;
    return dummy;
  }

  if (!clientStore) {
    clientStore = new ClientSupabaseStore(createClient());
  }
  return clientStore;
};

// Function to extract user-modifiable filters from server searchParams
function extractUserFilters(
  searchParams: Record<string, string>
): Record<string, unknown> {
  const userFilters: Record<string, unknown> = {};

  Object.entries(searchParams).forEach(([key, value]) => {
    // Only skip truly structural query parameters, not relational filters
    if (key === 'select') {
      return;
    }

    // Parse different filter patterns
    if (value.startsWith('eq.')) {
      const filterValue = value.replace('eq.', '');
      // Convert string values to appropriate types
      if (filterValue === 'true') {
        userFilters[key] = true;
      } else if (filterValue === 'false') {
        userFilters[key] = false;
      } else if (!isNaN(Number(filterValue))) {
        userFilters[key] = Number(filterValue);
      } else {
        userFilters[key] = filterValue;
      }
    } else if (value.startsWith('neq.')) {
      userFilters[`${key}_neq`] = value.replace('neq.', '');
    } else if (value.startsWith('gt.')) {
      userFilters[`${key}_gt`] = value.replace('gt.', '');
    } else if (value.startsWith('gte.')) {
      userFilters[`${key}_gte`] = value.replace('gte.', '');
    } else if (value.startsWith('lt.')) {
      userFilters[`${key}_lt`] = value.replace('lt.', '');
    } else if (value.startsWith('lte.')) {
      userFilters[`${key}_lte`] = value.replace('lte.', '');
    } else if (value.startsWith('like.')) {
      userFilters[`${key}_like`] = value.replace('like.', '');
    } else if (value.startsWith('ilike.')) {
      userFilters[`${key}_ilike`] = value.replace('ilike.', '');
    } else if (value.startsWith('in.(')) {
      const values = value.replace('in.(', '').replace(')', '').split(',');
      userFilters[`${key}_in`] = values;
    } else {
      // Default case - treat as equality filter
      const num = Number(value);
      if (!isNaN(num)) {
        userFilters[key] = num;
      } else {
        userFilters[key] = value;
      }
    }
  });

  return userFilters;
}

// Main hook that takes a QueryResult and makes it reactive
export function useSupabaseStore<T = Record<string, unknown>>(
  initialQuery: QueryResult<T> | undefined
): UseSupabaseStoreReturn<T> {
  // Track the query URL to detect when server provides completely new query
  const queryUrl = initialQuery?.url;
  const lastQueryUrl = useRef<string | undefined>(queryUrl);
  
  const [data, setData] = useState<T[]>(initialQuery?.data || []);
  // Initialize filters with user-modifiable filters from server query
  const extractedFilters = extractUserFilters(initialQuery?.searchParams || {});
  
  const [filters, setFilters] = useState<Record<string, unknown>>(extractedFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for dynamic RPC queries
  const [rpcName, setRpcName] = useState<string | null>(initialQuery?.rpcName || null);
  const [rpcParams, setRpcParamsState] = useState<Record<string, unknown>>(initialQuery?.rpcParams || {});

  // Ref to prevent initial fetch
  const isInitial = useRef(true);
  
  // Reset filters when query URL changes (server provided new query with different filters)
  useEffect(() => {
    if (queryUrl !== lastQueryUrl.current && lastQueryUrl.current !== undefined) {
      const newFilters = extractUserFilters(initialQuery?.searchParams || {});
      setFilters(newFilters);
      setData(initialQuery?.data || []);
      isInitial.current = true; // Reset to prevent immediate refetch
    }
    lastQueryUrl.current = queryUrl;
  }, [queryUrl, initialQuery]);

  // Function to update RPC parameters dynamically
  const setRpcParams = useCallback((newRpcName: string | null, newParams?: Record<string, unknown>) => {
    setRpcName(newRpcName);
    if (newParams) {
      setRpcParamsState(newParams);
    }
  }, []);

  // Function to execute a query based on current filters
  const executeQuery = useCallback(
    async (currentFilters: Record<string, unknown>) => {
      // On the very first call, skip re-fetch only when the server provided
      // initial data. If the server returned an empty dataset we should still
      // perform a client-side fetch so the page can load rows that require
      // client auth/session (common when SSR didn't have a session cookie).
      if (isInitial.current) {
        isInitial.current = false;
        const hasServerData = Array.isArray(initialQuery?.data) && initialQuery!.data.length > 0;
        if (hasServerData) {
          return;
        }
        // Otherwise fall through and perform the client fetch
      }

      // If initialQuery is undefined, we can't execute a query
      if (!initialQuery) {
        return;
      }

      const supabase = createClient();
      setLoading(true);
      setError(null);

      try {
        // Create a base query - use dynamic RPC params if available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query: any;
        if (rpcName) {
          // Use RPC query - only pass non-pagination params
          // Pagination (limit/offset) will be applied as query modifiers below
          query = supabase.rpc(
            rpcName as keyof Database['public']['Functions'],
            rpcParams as never
          );
        } else {
          // Use table query from initialQuery
          const selectParam = initialQuery.searchParams.select || '*';
          query = supabase
            .from(initialQuery.tableName as keyof Database['public']['Tables'])
            .select(selectParam);
        }

        // Apply additional filters based on the filter updates
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') return;

          // Handle different filter types based on key suffixes
          if (key.endsWith('_neq')) {
            const column = key.replace(/_neq$/, '');
            query = query.neq(column, value as never);
          } else if (key.endsWith('_gt')) {
            const column = key.replace(/_gt$/, '');
            query = query.gt(column, value as never);
          } else if (key.endsWith('_gte')) {
            const column = key.replace(/_gte$/, '');
            query = query.gte(column, value as never);
          } else if (key.endsWith('_lt')) {
            const column = key.replace(/_lt$/, '');
            query = query.lt(column, value as never);
          } else if (key.endsWith('_lte')) {
            const column = key.replace(/_lte$/, '');
            query = query.lte(column, value as never);
          } else if (key.endsWith('_like')) {
            const column = key.replace(/_like$/, '');
            query = query.like(column, value as string);
          } else if (key.endsWith('_ilike')) {
            const column = key.replace(/_ilike$/, '');
            query = query.ilike(column, value as string);
          } else if (key.endsWith('_in')) {
            const column = key.replace(/_in$/, '');
            // Normalize values to a clean array of strings.
            // Cases we've seen in the wild:
            // - value already an array of strings -> keep
            // - value a comma-separated string -> split on commas
            // - value a single scalar -> wrap in array
            // We also trim and dedupe values to avoid accidental character
            // splitting or repeated entries being sent to PostgREST.
            let vals: string[] = [];
            if (Array.isArray(value)) {
              // flatten any nested arrays and coerce all entries to string
              vals = (value as unknown[])
                .flatMap((v) => (v == null ? [] : (typeof v === 'string' ? [v] : [String(v)])))
                .map(s => s.trim())
                .filter(Boolean);
            } else if (typeof value === 'string') {
              // If comma-separated, split; otherwise treat the whole string
              // as one value (wrap it).
              vals = value.includes(',') ? value.split(',').map(s => s.trim()).filter(Boolean) : [value.trim()];
            } else if (value != null) {
              vals = [String(value).trim()];
            }

            // Deduplicate and ensure we pass an array of primitives to .in()
            const uniqueVals = Array.from(new Set(vals));
            query = query.in(column, uniqueVals as never[]);
          } else if (key === 'order') {
            const values = (value as string).split('.');
            const ascending = values.pop() === 'asc';
            query = query.order(values.join('.'), { ascending });
          } else if (key === 'limit') {
            query = query.limit(value as number);
          } else if (key === 'offset') {
            query = query.range(value as number, currentFilters['limit'] as number ? (value as number) + (currentFilters['limit'] as number) - 1 : undefined);
          } else {
            // Default to equality - key can include dots for relational filters
            query = query.eq(key, value as never);
          }
        });

        const { data: result, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }

        setData((result || []) as T[]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [initialQuery, rpcName, rpcParams]
  );

  // Function to update filters
  const updateFilters = useCallback((newFilters: Record<string, unknown>) => {
    setFilters((prev) => {
      const updated = { ...prev };

      // Add or update new filters, removing null/empty values
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          delete updated[key];
        } else {
          updated[key] = value;
        }
      });

      // Only update if changed
      if (JSON.stringify(updated) === JSON.stringify(prev)) {
        return prev;
      }
      return updated;
    });
  }, []);

  // Function to manually refetch
  const refetch = useCallback(() => {
    return executeQuery(filters);
  }, [executeQuery, filters]);

  // Effect to refetch when filters change
  useEffect(() => {
    // Only refetch if filters have actually changed from initial and we're on the client
    if (typeof window !== 'undefined') {
      const filtersChanged = Object.keys(filters).length > 0;
      const RpcParamsChanged = Object.keys(rpcParams || {}).length > 0;
      if (filtersChanged || RpcParamsChanged) {
        executeQuery(filters);
      } else {
        setData(initialQuery?.data || []);
      }
    }
  }, [filters, executeQuery, initialQuery?.data, rpcParams, rpcName]);

  return { data, filters, loading, error, updateFilters, refetch, setRpcParams };
}

// Hook for insert mutations
export function useInsert<T = Record<string, unknown>>(
  tableName: keyof Database['public']['Tables']
): UseMutationReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | T[] | null>(null);
  const store = getClientStore();

  const mutate = useCallback(
    async (...args: unknown[]): Promise<MutationResult<T>> => {
      const values = args[0];
      setLoading(true);
      setError(null);

      try {
        const result = await store.insert<T>(tableName, values);
        if (result.error) {
          throw result.error;
        }
        setData(result.data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store, tableName]
  );

  return { mutate, loading, error, data };
}

// Hook for update mutations
export function useUpdate<T = Record<string, unknown>>(
  tableName: keyof Database['public']['Tables']
): UseMutationReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | T[] | null>(null);
  const store = getClientStore();

  const mutate = useCallback(
    async (...args: unknown[]): Promise<MutationResult<T>> => {
      const values = args[0];
      const options = args[1] as
        | { filters?: Record<string, unknown> }
        | undefined;
      setLoading(true);
      setError(null);

      try {
        const result = await store.update<T>(
          tableName,
          values,
          options?.filters
        );
        if (result.error) {
          throw result.error;
        }
        setData(result.data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store, tableName]
  );

  return { mutate, loading, error, data };
}

// Hook for delete mutations
export function useDelete<T = Record<string, unknown>>(
  tableName: keyof Database['public']['Tables']
): UseMutationReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | T[] | null>(null);
  const store = getClientStore();

  const mutate = useCallback(
    async (...args: unknown[]): Promise<MutationResult<T>> => {
      const filters = args[0] as Record<string, unknown>;
      setLoading(true);
      setError(null);

      try {
        const result = await store.delete<T>(tableName, filters);
        if (result.error) {
          throw result.error;
        }
        setData(result.data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store, tableName]
  );

  return { mutate, loading, error, data };
}

// Hook for upsert mutations
export function useUpsert<T = Record<string, unknown>>(
  tableName: keyof Database['public']['Tables']
): UseMutationReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | T[] | null>(null);
  const store = getClientStore();

  const mutate = useCallback(
    async (...args: unknown[]): Promise<MutationResult<T>> => {
      const values = args[0];
      setLoading(true);
      setError(null);

      try {
        const result = await store.upsert<T>(tableName, values);
        if (result.error) {
          throw result.error;
        }
        setData(result.data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store, tableName]
  );

  return { mutate, loading, error, data };
}

// Hook return type for infinite queries
export type UseInfiniteSupabaseReturn<T = Record<string, unknown>> = {
  data: T[];
  filters: Record<string, unknown>;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  updateFilters: (newFilters: Record<string, unknown>) => void;
  refetch: () => Promise<void>;
  setRpcParams: (rpcName: string | null, params?: Record<string, unknown>) => void;
  loadMore: () => Promise<void>;
};

// Infinite scroll hook options
export type UseInfiniteSupabaseOptions = {
  pageSize?: number;
  initialPage?: number;
};

// Hook for infinite scroll pagination
export function useInfiniteSupabase<T = Record<string, unknown>>(
  initialQuery: QueryResult<T> | undefined,
  options: UseInfiniteSupabaseOptions = {}
): UseInfiniteSupabaseReturn<T> {
  const { pageSize = initialQuery?.data.length || 20, initialPage = 0 } = options;
  
  // Track the query identity to detect when server provides a completely new query
  const queryIdentity = useMemo(() => {
    if (!initialQuery) return null;
    // Use the URL as the identity since it includes all the filters from the server
    return initialQuery.url;
  }, [initialQuery?.url]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [allData, setAllData] = useState<T[]>(initialQuery?.data || []);
  const [hasMore, setHasMore] = useState(initialQuery?.data ? initialQuery.data.length >= pageSize : true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Track the last page we loaded to prevent duplicate appends
  // Start at initialPage since we already have that data loaded
  const lastLoadedPage = useRef(initialPage);
  const isLoadingPage = useRef(false);
  // Track if we've appended the initial data
  const hasSetInitialData = useRef(false);
  // Track the last seen page snapshot (stringified) to detect when new data arrives
  // We compare the full page content (not just ids) because RPCs or server-side
  // enrichments may change fields for the same IDs (e.g. resolving option values).
  const lastSeenPageSnapshot = useRef<string>(
    JSON.stringify(initialQuery?.data || [])
  );
  // Track the last query identity to detect server-side query changes
  const lastQueryIdentity = useRef<string | null>(queryIdentity);

  // Use the regular hook with the original initialQuery
  const { 
    data: pageData, 
    filters, 
    loading, 
    error, 
    updateFilters, 
    refetch, 
    setRpcParams 
  } = useSupabaseStore(initialQuery);

  // CRITICAL: Reset everything when the server provides a new query (e.g., tab change)
  // This must run BEFORE the pageData effect to ensure clean state
  useEffect(() => {
    if (queryIdentity !== lastQueryIdentity.current && lastQueryIdentity.current !== null) {
      console.log('[InfiniteScroll] Server query changed, resetting completely:', {
        oldQuery: lastQueryIdentity.current,
        newQuery: queryIdentity
      });
      // Complete reset - server provided new filtered data
      setAllData(initialQuery?.data || []);
      setHasMore((initialQuery?.data?.length || 0) >= pageSize);
      setCurrentPage(initialPage);
      lastLoadedPage.current = initialPage;
      hasSetInitialData.current = false;
      isLoadingPage.current = false;
      setLoadingMore(false);
      lastSeenPageSnapshot.current = JSON.stringify(initialQuery?.data || []);
    }
    lastQueryIdentity.current = queryIdentity;
  }, [queryIdentity, initialQuery, pageSize, initialPage]);

  // Don't set initial pagination filters - the server already did this
  // Keeping this commented out for reference:
  // const hasSetInitialFilters = useRef(false);
  // useEffect(() => {
  //   if (!hasSetInitialFilters.current) {
  //     hasSetInitialFilters.current = true;
  //     updateFilters({ limit: pageSize, offset: 0 });
  //   }
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update allData when pageData changes - only for new pages
  useEffect(() => {
    // Skip if no data
    if (!pageData.length) {
      console.log('[InfiniteScroll] No pageData, skipping');
      return;
    }
    
  // Check if this is actually new data by comparing the full page snapshot
  const currentPageSnapshot = JSON.stringify(pageData);
  const isNewData = currentPageSnapshot !== lastSeenPageSnapshot.current;
    
    console.log('[InfiniteScroll] Effect triggered:', {
      currentPage,
      lastLoadedPage: lastLoadedPage.current,
      isLoadingPage: isLoadingPage.current,
      hasSetInitialData: hasSetInitialData.current,
      loading,
      pageDataLength: pageData.length,
      isNewData
    });
    
    // Check if we're on the initial page
    const isInitialPage = currentPage === initialPage;
    
    // If we're on page 0 AND we've already set initial data AND the data is new,
    // it means we switched query modes (e.g., from table to RPC) - do a full reset
    if (isInitialPage && hasSetInitialData.current && isNewData && !loading) {
      console.log('[InfiniteScroll] Query mode changed (e.g., RPC switch), resetting with new data');
      setAllData(pageData);
      setHasMore(pageData.length >= pageSize);
      lastLoadedPage.current = initialPage;
      isLoadingPage.current = false;
      setLoadingMore(false);
  lastSeenPageSnapshot.current = currentPageSnapshot;
      return;
    }
    
    // Skip initial data if we're still loading the first page
    if (isInitialPage && !hasSetInitialData.current) {
      if (loading) {
        console.log('[InfiniteScroll] Waiting for initial load to complete');
        return; // Wait for initial load to complete
      }
      // First page - replace all data (only once on initial load)
      console.log('[InfiniteScroll] Setting initial page data:', pageData.length, 'items');
      setAllData(pageData);
      setHasMore(pageData.length >= pageSize);
      lastLoadedPage.current = initialPage;
      hasSetInitialData.current = true;
      isLoadingPage.current = false;
      setLoadingMore(false);
  lastSeenPageSnapshot.current = currentPageSnapshot;
    } else if (currentPage > lastLoadedPage.current && isLoadingPage.current && !loading && isNewData) {
      // New page loaded - append data only if:
      // 1. We're on a new page (currentPage > lastLoadedPage)
      // 2. We initiated a page load (isLoadingPage)
      // 3. Loading is complete (!loading)
      // 4. The data is actually different (isNewData)
      console.log('[InfiniteScroll] Appending page', currentPage, 'data:', pageData.length, 'items');
      setAllData(prev => {
        console.log('[InfiniteScroll] Previous data length:', prev.length);
        // Check for duplicates before appending
        const existingIds = new Set(prev.map((item: T) => (item as { id?: unknown }).id));
        const newItems = pageData.filter((item: T) => !existingIds.has((item as { id?: unknown }).id));
        console.log('[InfiniteScroll] New items to add:', newItems.length);
        const result = [...prev, ...newItems];
        console.log('[InfiniteScroll] Total items after append:', result.length);
        return result;
      });
      setHasMore(pageData.length >= pageSize);
      lastLoadedPage.current = currentPage;
      isLoadingPage.current = false;
      setLoadingMore(false);
  lastSeenPageSnapshot.current = currentPageSnapshot;
    } else {
      console.log('[InfiniteScroll] Conditions not met for update - currentPage:', currentPage, 'lastLoadedPage:', lastLoadedPage.current, 'isLoadingPage:', isLoadingPage.current, 'loading:', loading, 'isNewData:', isNewData);
    }
  }, [pageData, loading, currentPage, initialPage, pageSize]);

  // Reset pagination when non-pagination filters change
  const nonPaginationFilters = useMemo(() => {
    const filtered = Object.fromEntries(
      Object.entries(filters).filter(([k]) => k !== 'offset' && k !== 'limit')
    );
    return JSON.stringify(filtered);
  }, [filters]);
  
  const prevNonPaginationFilters = useRef(nonPaginationFilters);
  useEffect(() => {
    // Check if non-pagination filters changed
    const filtersChanged = prevNonPaginationFilters.current !== nonPaginationFilters && prevNonPaginationFilters.current !== '{}';
    
    if (filtersChanged) {
      console.log('[InfiniteScroll] Non-pagination filters changed, resetting pagination');
      setCurrentPage(initialPage);
      setAllData([]);
      setHasMore(true);
      lastLoadedPage.current = initialPage - 1; // Set to before initial so first page loads
      hasSetInitialData.current = false; // Reset initial data flag
      isLoadingPage.current = false;
  lastSeenPageSnapshot.current = '[]'; // Reset seen IDs
      updateFilters({ limit: pageSize, offset: 0 });
    }
    prevNonPaginationFilters.current = nonPaginationFilters;
  }, [nonPaginationFilters, initialPage, pageSize, updateFilters]);

  // Load more function
  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || isLoadingPage.current) {
      console.log('Skipping loadMore:', { loading, loadingMore, hasMore, isLoadingPage: isLoadingPage.current });
      return;
    }
    
    console.log('Loading more, current page:', currentPage);
    isLoadingPage.current = true;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    const newOffset = nextPage * pageSize;
    setCurrentPage(nextPage);
    updateFilters({ offset: newOffset, limit: pageSize });
  }, [loading, loadingMore, hasMore, currentPage, pageSize, updateFilters]);

  // Custom updateFilters that preserves pagination state
  const customUpdateFilters = useCallback((newFilters: Record<string, unknown>) => {
    // If we're updating pagination filters, just pass through
    if ('offset' in newFilters || 'limit' in newFilters) {
      updateFilters(newFilters);
    } else {
      // For other filters, reset pagination
      console.log('Updating non-pagination filters:', newFilters);
      setCurrentPage(initialPage);
      setAllData([]);
      setHasMore(true);
      lastLoadedPage.current = initialPage - 1;
      hasSetInitialData.current = false; // Reset initial data flag
      isLoadingPage.current = false;
      updateFilters({ ...newFilters, limit: pageSize, offset: 0 });
    }
  }, [updateFilters, initialPage, pageSize]);

  return {
    data: allData,
    filters,
    loading: loading && currentPage === initialPage, // Only show loading for initial page
    loadingMore,
    error,
    hasMore,
    updateFilters: customUpdateFilters,
    refetch: useCallback(async () => {
      console.log('Refetching data');
      setCurrentPage(initialPage);
      setAllData([]);
      setHasMore(true);
      lastLoadedPage.current = initialPage - 1;
      hasSetInitialData.current = false; // Reset initial data flag
      isLoadingPage.current = false;
      setLoadingMore(false);
      updateFilters({ limit: pageSize, offset: 0 });
      await refetch();
    }, [refetch, initialPage, pageSize, updateFilters]),
    setRpcParams,
    loadMore
  };
}
