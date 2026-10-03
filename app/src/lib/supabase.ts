import type { Session, AuthChangeEvent, AuthError, AuthListener } from "./supabase.types";
import type { MockUser, User } from "../features/login/types";
import { MOCK_USERS } from "../features/login/mockData";

const STORAGE_KEY = "mock-supabase-session";
const listeners = new Set<AuthListener>();

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null): void {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY)
  }
  catch {

  }
}

function toPublicUser({ password: _password, ...user }: MockUser): User {
  return user;
}

function notify(event: AuthChangeEvent, session: Session | null): void {
  listeners.forEach(cb => cb(event, session));
}

type SignInReponse =
  { data: { user: User; session: Session }; error: null } |
  { data: { user: null, session: null }, error: AuthError }

async function signInWithPassword({ email, password }: { email: string, password: string }): Promise<SignInReponse> {
  await delay(800)

  const match = MOCK_USERS.find(u => u.email.toLowerCase() == email.trim().toLowerCase());

  if (!match || match.password != password) {
    return {
      data: { user: null, session: null },
      error: { message: "Invalid login credentials", status: 400 }
    }
  }

  const user = toPublicUser(match);

  const session: Session = {
    access_token: `mock-token-${crypto.randomUUID()}`,
    token_type: "bearer",
    expires_in: 3600,
    user
  }

  writeSession(session)
  notify("SIGNED_IN", session)

  return { data: { user, session }, error: null }
}

async function signOut(): Promise<{ error: AuthError | null }> {
  await delay(300);
  writeSession(null);
  notify("SIGNED_OUT", null);

  return { error: null }
}

async function getSession(): Promise<{ data: { session: Session | null }, error: null }> {
  return { data: { session: readSession() }, error: null };
}

async function getUser(): Promise<{ data: { user: User | null }; error: null }> {
  return { data: { user: readSession()?.user ?? null }, error: null };
}

export const supabase = {
  auth: {
    signInWithPassword,
    signOut,
    getSession,
    getUser,
    onAuthStateChange(callback: AuthListener) {
      listeners.add(callback);

      return {
        data: {
          subscription: { unsubscribe: () => void listeners.delete(callback) }
        }
      }
    }
  }
}

