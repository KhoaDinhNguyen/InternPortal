import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import type { Session } from "../../lib/supabase.types";
import { AuthContext } from "./useAuth";

/** The only place that subscribes to auth changes; everything else reads `useAuth()` */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore an existing session on first render
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // React to sign-in / sign-out while the app is open
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, loading: loading }}>{children}</AuthContext.Provider>
  );
}
