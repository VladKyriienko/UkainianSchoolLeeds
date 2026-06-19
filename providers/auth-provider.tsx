'use client';

import { createClient } from '@/lib/supabase/hooks';
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from 'react';
import { UserWithRoles } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import { type User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext<{
  user?: User | null;
  userData?: UserWithRoles | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  hydrateSession: (user: User, profileData: UserWithRoles | null) => void;
  hydrateProfile: (data: UserWithRoles | null) => void;
}>({
  user: null,
  userData: null,
  loading: false,
  signOut: async () => { },
  refreshUserData: async () => { },
  hydrateSession: () => { },
  hydrateProfile: () => { }
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

  const hydrateProfile = useCallback((data: UserWithRoles | null) => {
    setUserData(data);
  }, []);

  const hydrateSession = useCallback(
    (nextUser: User, profileData: UserWithRoles | null) => {
      setUser(nextUser);
      setUserData(profileData);
      setLoading(false);
    },
    []
  );

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
    () => ({
      user,
      userData,
      loading,
      signOut,
      refreshUserData,
      hydrateSession,
      hydrateProfile
    }),
    [user, userData, loading, signOut, refreshUserData, hydrateSession, hydrateProfile]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
