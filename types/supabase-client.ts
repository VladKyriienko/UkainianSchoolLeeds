export type MutationResult<T = Record<string, unknown>> = {
  data: T | T[] | null;
  error: unknown;
  count?: number;
};

export type UseSupabaseStoreReturn<T = Record<string, unknown>> = {
  data: T[];
  filters: Record<string, unknown>;
  loading: boolean;
  error: string | null;
  updateFilters: (newFilters: Record<string, unknown>) => void;
  refetch: () => Promise<void>;
  setRpcParams: (
    rpcName: string | null,
    params?: Record<string, unknown>
  ) => void;
};

export type UseMutationReturn<T = Record<string, unknown>> = {
  mutate: (...args: unknown[]) => Promise<MutationResult<T>>;
  loading: boolean;
  error: string | null;
  data: T | T[] | null;
};

export type UseInfiniteSupabaseReturn<T = Record<string, unknown>> = {
  data: T[];
  filters: Record<string, unknown>;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  updateFilters: (newFilters: Record<string, unknown>) => void;
  refetch: () => Promise<void>;
  setRpcParams: (
    rpcName: string | null,
    params?: Record<string, unknown>
  ) => void;
  loadMore: () => Promise<void>;
};

export type UseInfiniteSupabaseOptions = {
  pageSize?: number;
  initialPage?: number;
};

export type QueryResult<T = Record<string, unknown>> = {
  queryKey: string;
  data: T[];
  tableName: string;
  url: string;
  searchParams: Record<string, string>;
  rpcName?: string;
  rpcParams?: Record<string, unknown>;
};
