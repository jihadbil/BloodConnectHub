import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { authApi } from "@/api/auth";
import type { ApiUser, LoginRequest, RegisterRequest } from "@/types/api";

type AppRole = "admin" | "staff" | "donor";
type AuthMode = "supabase" | "api" | "auto";

// Configuration - set to 'api' to use backend API, 'supabase' for Supabase, 'auto' tries API first
const AUTH_MODE: AuthMode = "api";

interface AuthContextType {
  // Common properties
  user: User | ApiUser | null;
  userRole: AppRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth functions
  signUp: (username: string, email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null; data?: ApiUser }>;
  signIn: (username: string, password: string) => Promise<{ error: Error | null; data?: ApiUser }>;
  signOut: () => Promise<void>;

  // Role helpers
  isStaff: boolean;
  isAdmin: boolean;
  isDonor: boolean;

  // Auth mode
  authMode: AuthMode;

  // Supabase-specific (for backward compatibility)
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Supabase state
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // API state
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);

  // Common state
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine which user to use
  const user = AUTH_MODE === "supabase" ? supabaseUser : apiUser || supabaseUser;
  const isAuthenticated = !!user;

  // Fetch Supabase user role
  const fetchSupabaseUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_role', { _user_id: userId });
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      return data as AppRole;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  // Load stored API user on mount
  useEffect(() => {
    const loadStoredApiUser = () => {
      const stored = localStorage.getItem('api_user');
      if (stored) {
        try {
          const userData = JSON.parse(stored) as ApiUser;
          setApiUser(userData);

          // Determine role from user data - using new API response format with roles array
          if (userData.roles && userData.roles.length > 0) {
            if (userData.roles.includes('Admin')) {
              setUserRole('admin');
            } else if (
              userData.roles.includes('BloodBankStaff') ||
              userData.roles.includes('Doctor') ||
              userData.roles.includes('Nurse')
            ) {
              setUserRole('staff');
            } else {
              setUserRole('donor');
            }
          } else {
            // Default fallback
            setUserRole('donor');
          }
        } catch {
          localStorage.removeItem('api_user');
        }
      }
    };

    if (AUTH_MODE === "api" || AUTH_MODE === "auto") {
      loadStoredApiUser();
    }

    // Also set up Supabase listener for backward compatibility
    if (AUTH_MODE === "supabase" || AUTH_MODE === "auto") {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setSupabaseUser(session?.user ?? null);

          if (session?.user) {
            setTimeout(async () => {
              const role = await fetchSupabaseUserRole(session.user.id);
              if (AUTH_MODE === "supabase" || !apiUser) {
                setUserRole(role);
              }
              setIsLoading(false);
            }, 0);
          } else if (AUTH_MODE === "supabase") {
            setUserRole(null);
            setIsLoading(false);
          }
        }
      );

      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session);
        setSupabaseUser(session?.user ?? null);

        if (session?.user && (AUTH_MODE === "supabase" || !apiUser)) {
          const role = await fetchSupabaseUserRole(session.user.id);
          setUserRole(role);
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Sign Up function
  const signUp = async (username: string, email: string, password: string, fullName: string, phone?: string) => {
    if (AUTH_MODE === "api" || AUTH_MODE === "auto") {
      try {
        const response = await authApi.register({
          userName: username,
          email: email,
          password,
          fullName,
          phoneNumber: phone || "",
        });

        if (response.isSuccess && response.data) {
          const userData = response.data;
          localStorage.setItem('api_user', JSON.stringify(userData));
          setApiUser(userData);
          setUserRole('donor');
          return { error: null, data: userData };
        } else {
          // Return the actual error message from the API
          const errMsg = response.errors && response.errors.length > 0
            ? response.errors.join(', ')
            : (response.message || "فشل التسجيل");
          return { error: new Error(errMsg) };
        }
      } catch (err) {
        // If API fails and mode is auto, try Supabase
        if (AUTH_MODE === "auto") {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: { full_name: fullName },
            },
          });
          return { error };
        }
        return { error: err as Error };
      }
    } else {
      // Supabase mode
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      });
      return { error };
    }
  };

  // Sign In function
  const signIn = async (username: string, password: string) => {
    if (AUTH_MODE === "api" || AUTH_MODE === "auto") {
      try {
        const response = await authApi.login({ userName: username, password });

        if (response.isSuccess && response.data) {
          const userData = response.data;
          // Note: authApi.login already sets api_user and api_token in localStorage
          setApiUser(userData);

          // Determine role - using roles array
          if (userData.roles && userData.roles.length > 0) {
            if (userData.roles.includes('Admin')) {
              setUserRole('admin');
            } else if (
              userData.roles.includes('BloodBankStaff') ||
              userData.roles.includes('Doctor') ||
              userData.roles.includes('Nurse')
            ) {
              setUserRole('staff');
            } else {
              setUserRole('donor');
            }
          } else {
            setUserRole('donor');
          }

          return { error: null, data: userData };
        } else {
          return { error: new Error(response.message || "بيانات الدخول غير صحيحة") };
        }
      } catch (err) {
        // If API fails and mode is auto, try Supabase
        if (AUTH_MODE === "auto") {
          const { error } = await supabase.auth.signInWithPassword({
            email: username,
            password,
          });
          return { error };
        }
        return { error: err as Error };
      }
    } else {
      // Supabase mode
      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });
      return { error };
    }
  };

  // Sign Out function
  const signOut = async () => {
    // Clear API auth
    localStorage.removeItem('api_user');
    localStorage.removeItem('api_token');
    setApiUser(null);

    // Clear Supabase auth
    if (AUTH_MODE === "supabase" || AUTH_MODE === "auto") {
      await supabase.auth.signOut();
    }

    setSupabaseUser(null);
    setSession(null);
    setUserRole(null);
  };

  const value = {
    user,
    session,
    userRole,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    isStaff: userRole === "staff" || userRole === "admin",
    isAdmin: userRole === "admin",
    isDonor: userRole === "donor",
    authMode: AUTH_MODE,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
