import { AuthError, Session, User } from "@supabase/supabase-js";
import React from "react";

import { supabase } from "../lib/supabase";

export enum UserRole {
  PET_OWNER = "pet_owner",
  PET_SITTER = "pet_sitter",
}

export interface ExtendedUser extends User {
  user_role: UserRole;
}

type AuthContextType = {
  session: Session | null;
  user: ExtendedUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<ExtendedUser | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(`Error fetching role: ${error.message}`);
      }

      return data?.role || null;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Error fetching user role: ${error.message}`);
      }

      throw new Error("Unexpected error occurred while fetching user role.");
    }
  };

  React.useEffect(() => {
    const loadSessionData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        setUser({
          ...session.user,
          user_role: role || null,
        } as ExtendedUser);
      }
      setLoading(false);
    };

    loadSessionData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        fetchUserRole(session.user.id).then(role => {
          setUser({
            ...session.user,
            user_role: role || null,
          } as ExtendedUser);
        });
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp() {}
  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }
  async function signOut() {
    await supabase.auth.signOut();
  }
  async function updateUserProfile() {}

  const value = React.useMemo(
    () => ({
      user,
      session,
      loading,
      signIn,
      signOut,
      signUp,
      updateUserProfile,
    }),
    [user, session, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
