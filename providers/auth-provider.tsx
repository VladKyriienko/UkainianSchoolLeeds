'use client';

import { createClient } from '@/utils/supabase/hooks';
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from 'react';
import { UserWithRoles } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/utils/supabase/types';
import { type User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext<{
  user?: User | null;
  userData?: UserWithRoles | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}>({
  user: null,
  userData: null,
  loading: false,
  signOut: async () => { },
  refreshUserData: async () => { }
});

export const AuthProvider = ({
  children,
  userResponse,
  userWithRoles
}: {
  children: React.ReactNode;
  userResponse?: User | null | undefined;
  userWithRoles?: UserWithRoles | null | undefined;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(userResponse || null);
  const [userData, setUserData] = useState<UserWithRoles | null>(
    userWithRoles || null
  );
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(
    null
  );

  // Sync state from server-passed props when they change
  useEffect(() => {
    setUser(userResponse ?? null);
    setUserData(userWithRoles ?? null);
  }, [userResponse, userWithRoles]);

  // Refresh user data by re-fetching on the server (no DB access from browser)
  const refreshUserData = useCallback(async () => {
    router.refresh();
  }, [router]);

  const signOut = useCallback(async () => {
    setUser(null);
    setUserData(null);

    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Error signing out:', error);
      }
    }
  }, [supabase]);

  useEffect(() => {
    const client = createClient();
    setSupabase(client as unknown as SupabaseClient<Database>);

    const {
      data: { subscription }
    } = client.auth.onAuthStateChange((event: string, session) => {
      setTimeout(() => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserData(null);
          setLoading(false);
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            setUser(session.user);
            setLoading(false);
          } else {
            setUser(null);
            setUserData(null);
            setLoading(false);
          }
        } else if (event === 'RECOVERY' && session?.user) {
          setUser(session.user);
          setLoading(false);
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue = useMemo(
    () => ({ user, userData, loading, signOut, refreshUserData }),
    [user, userData, loading, signOut, refreshUserData]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
