import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../features/login/useAuth";
import type { UserRole } from "../features/login/types";

interface ProtectedRouteProps {
  redirectTo?: string;
  /** Roles allowed through; omit to allow any signed-in user */
  allow?: UserRole[];
}

export default function ProtectedRoute({ redirectTo = "/login", allow }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p style={{ padding: "2rem" }}>Loading…</p>;
  if (!user) return <Navigate to={redirectTo} replace state={{ from: location }} />;
  // First login: nothing else is reachable until the profile is filled in
  if (!user.profile && location.pathname !== "/profile") return <Navigate to="/profile" replace />;
  if (allow && !(user.role && allow.includes(user.role))) return <Navigate to="/" replace />;

  return <Outlet />;
}
