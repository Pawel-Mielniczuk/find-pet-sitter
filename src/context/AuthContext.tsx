import { AuthError, Session, User } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { supabase } from "../lib/supabase";

export enum UserRole {
  PET_OWNER = "pet_owner",
  PET_SITTER = "pet_sitter",
}

export interface ExtendedUser extends User {
  user_role: UserRole;
  first_name: string | null;
  last_name: string | null;
  location: string | null;
}

type AuthContextType = {
  session: Session | null;
  user: ExtendedUser | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    password_confirmation: string,
  ) => Promise<{ success: boolean }>;

  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: any) => Promise<{ error: any }>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<ExtendedUser | null>(null);
  const queryClient = useQueryClient();

  const { data: sessionData, isPending: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
    staleTime: Infinity,
  });

  const fetchUserRoleAndProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role, first_name, last_name, location")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(`Error fetching role: ${error.message}`);
      }
      return {
        role: data?.role || null,
        first_name: data?.first_name || null,
        last_name: data?.last_name || null,
        location: data?.location || null,
      };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Error fetching user role: ${error.message}`);
      }
      throw new Error("Unexpected error occurred while fetching user role.");
    }
  };

  const { data: userProfileData, isPending: isProfileLoading } = useQuery({
    queryKey: ["userProfile", sessionData?.user?.id],
    queryFn: () => fetchUserRoleAndProfile(sessionData?.user?.id as string),
    enabled: !!sessionData?.user?.id,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (sessionData) {
      setSession(sessionData);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      queryClient.invalidateQueries({ queryKey: ["session"] });
      if (newSession?.user?.id) {
        queryClient.invalidateQueries({ queryKey: ["userProfile", newSession.user.id] });
      } else {
        queryClient.setQueryData(["userProfile", sessionData?.user?.id], null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [sessionData, queryClient]);

  React.useEffect(() => {
    if (sessionData?.user) {
      setUser({
        ...sessionData.user,
        user_role: userProfileData?.role || null,
        first_name: userProfileData?.first_name || null,
        last_name: userProfileData?.last_name || null,
        location: userProfileData?.location || null,
      });
    } else {
      setUser(null);
    }
  }, [sessionData, userProfileData]);

  const loading = isSessionLoading || (!!sessionData?.user && isProfileLoading);

  const signUpMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      password_confirmation,
    }: {
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      if (password !== password_confirmation) {
        throw new Error("Passwords do not match");
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        return { success: true, user: data.user };
      } catch (error: any) {
        throw error;
      }
    },
  });

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const userId = sessionData?.user?.id;
      if (!userId) throw new Error("No user logged in");

      const { error } = await supabase.from("profiles").update(data).eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      if (sessionData?.user?.id) {
        queryClient.invalidateQueries({ queryKey: ["userProfile", sessionData.user.id] });
      }
    },
    onError: error => {
      throw error;
    },
  });

  async function signUp(email: string, password: string, password_confirmation: string) {
    try {
      await signUpMutation.mutateAsync({ email, password, password_confirmation });
      return { success: true };
    } catch (error: any) {
      throw error;
    } finally {
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const result = await signInMutation.mutateAsync({ email, password });
      return result;
    } finally {
    }
  }

  async function signOut() {
    try {
      await signOutMutation.mutateAsync();
    } finally {
    }
  }

  const updateUserProfile = async (data: any) => {
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user?.id, ...data })
      .select();

    return { error };
  };

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
    [user, session, loading, signIn, signUp],
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
