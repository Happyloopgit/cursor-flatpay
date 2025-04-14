import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

// Define credential types (adjust as needed)
interface EmailPasswordCredentials {
  email?: string;
  password?: string;
  provider?: never; // Ensure provider is not used for email/password
}

interface ProviderCredentials {
  provider: Provider;
  email?: never; // Ensure email/password are not used for provider
  password?: never;
}

type Credentials = EmailPasswordCredentials | ProviderCredentials;

// Define the shape of the context data
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<{ error: Error | null }>;
  // Add login, signup, logout functions later
  // login: (credentials: Credentials) => Promise<void>;
  // signup: (credentials: Credentials) => Promise<void>;
  // logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false); // Ensure loading is false after potential change
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Login function implementation
  const login = async (credentials: Credentials): Promise<{ error: Error | null }> => {
    setLoading(true); // Optional: Set loading state during login attempt
    let error: Error | null = null;

    try {
      if (credentials.provider) {
        // OAuth login
        const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: credentials.provider });
        if (oauthError) throw oauthError;
        // Note: Redirection happens for OAuth, session update handled by listener
      } else if (credentials.email && credentials.password) {
        // Email/Password login
        const { error: passwordError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });
        if (passwordError) throw passwordError;
        // Session update handled by listener
      } else {
        throw new Error('Invalid credentials provided for login');
      }
    } catch (err) {
      console.error("Login error:", err);
      error = err instanceof Error ? err : new Error('An unknown login error occurred');
    }

    setLoading(false);
    return { error };
  };

  // Define the context value
  const value = {
    session,
    user,
    loading,
    login,
    // Implement functions later
    // login: async (credentials) => { /* ... */ },
    // signup: async (credentials) => { /* ... */ },
    // logout: async () => { /* ... */ },
  };

  // Provide the context value to children
  // Don't render children until initial session check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy context usage
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
