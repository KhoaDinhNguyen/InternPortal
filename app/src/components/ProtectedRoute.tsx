import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { supabase } from "../lib/supabase";
import type { Session } from "../lib/supabase.types";

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check for an existing session on first render
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    // React to sign-in / sign-out whle the page is open
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (checking) {
    return <p style={{ padding: "2rem" }}>Loading…</p>;
  }

  if (!session) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
