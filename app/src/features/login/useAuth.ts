import { createContext, useContext } from "react";
import type { User } from "../../lib/supabase.types";

export interface AuthState {
  user: User | null;
  loading: boolean
}

export const AuthContext = createContext<AuthState>({ user: null, loading: true });

/** Current signed-in user; re-renders on every sign-in / sign-out */
export const useAuth = () => useContext(AuthContext)