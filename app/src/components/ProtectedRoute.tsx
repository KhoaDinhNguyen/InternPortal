import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../features/login/useAuth";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export default function ProtectedRoute({ redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p style={{ padding: "2rem" }}>Loading…</p>;

  return user ? <Outlet /> : <Navigate to={redirectTo} replace state={{ from: location }} />;
}
