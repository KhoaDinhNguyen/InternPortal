export interface User {
  id: string;
  email: string;
}

export interface Session {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: User;
}

export interface AuthError {
  message: string;
  status: number;
}

export type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT";

export type AuthListener = (event: AuthChangeEvent, session: Session | null) => void;

export interface MockUser extends User {
  password: string;
}