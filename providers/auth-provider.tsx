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
  const [user, setUser] = useState<User | null>(userResponse || null);
  const [userData, setUserData] = useState<UserWithRoles | null>(
    userWithRoles || null
  );
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(
    null
  );

  // Function to refresh user data from the database
  const refreshUserData = useCallback(async () => {
    if (!supabase || !user) {
      return;
    }

    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('id', user.id)
        .limit(1)
        .single();

      if (error) {
        console.error('AuthProvider: Error refreshing user data:', error);
      } else {
        setUserData(userData as UserWithRoles);
      }
    } catch (error) {
      console.error('AuthProvider: Error in refreshUserData:', error);
    }
  }, [supabase, user]);

  // Manual sign-out function that immediately clears the state
  const signOut = useCallback(async () => {
    setUser(null);
    setUserData(null);

    if (supabase) {
      // Use client-side sign out directly instead of server action
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Error signing out:', error);
      }
    }
  }, [supabase]);

  useEffect(() => {
    // Initialize Supabase client only on the client side
    const client = createClient();
    setSupabase(client as unknown as SupabaseClient<Database>);

    // Subscribe to auth state changes
    const {
      data: { subscription }
    } = client.auth.onAuthStateChange(async (event: string, session) => {
      // Use setTimeout to prevent recursive loop bug in Supabase
      setTimeout(async () => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setLoading(false);

          try {
            const { data: userData, error } = await client
              .from('users')
              .select('*, roles(*)')
              .eq('id', session.user.id)
              .limit(1)
              .single();

            if (error) {
              console.error('AuthProvider: Error fetching user data:', error);
              setUserData(null);
            } else {
              setUserData(userData as UserWithRoles);
            }
          } catch (error) {
            console.error(
              'AuthProvider: Error in auth state change handler:',
              error
            );
            setUserData(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserData(null);
          setLoading(false);
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            setUser(session.user);
            setLoading(false);

            try {
              const { data: userData, error } = await client
                .from('users')
                .select('*, roles(*)')
                .eq('id', session.user.id)
                .limit(1)
                .single();

              if (!error && userData) {
                setUserData(userData as UserWithRoles);
              }
            } catch (error) {
              console.error(
                'AuthProvider: Error in INITIAL_SESSION handler:',
                error
              );
            }
          } else {
            setUser(null);
            setUserData(null);
            setLoading(false);
          }
        } else if (event === 'RECOVERY' && session?.user) {
          setUser(session.user);
          setLoading(false);

          try {
            const { data: userData, error } = await client
              .from('users')
              .select('*, roles(*)')
              .eq('id', session.user.id)
              .limit(1)
              .single();

            if (error) {
              console.error(
                'AuthProvider: Error fetching user data on password recovery:',
                error
              );
            } else {
              setUserData(userData as UserWithRoles);
            }
          } catch (error) {
            console.error(
              'AuthProvider: Error in password recovery handler:',
              error
            );
          }
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user);
          setLoading(false);

          try {
            const { data: userData, error } = await client
              .from('users')
              .select('*, roles(*)')
              .eq('id', session.user.id)
              .limit(1)
              .single();

            if (error) {
              console.error(
                'AuthProvider: Error fetching user data on user update:',
                error
              );
            } else {
              setUserData(userData as UserWithRoles);
            }
          } catch (error) {
            console.error('AuthProvider: Error in user update handler:', error);
          }
        } else {
          setLoading(false);
        }
      }, 0);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only set up subscription once

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ user, userData, loading, signOut, refreshUserData }),
    [user, userData, loading, signOut, refreshUserData]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
