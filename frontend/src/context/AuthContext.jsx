import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [configError, setConfigError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setConfigError(
        "Supabase is not configured. Create frontend/.env.local from .env.example and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
      );
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error(error);
        setSession(data.session ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        if (active) setLoading(false);
      });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      supabase,
      session,
      user: session?.user ?? null,
      accessToken: session?.access_token ?? null,
      loading,
      configError
    }),
    [session, loading, configError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}