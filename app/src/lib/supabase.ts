import type { Session, AuthChangeEvent, AuthError, AuthListener, User } from "./supabase.types";
import type { MockUser, Profile, UserRole } from "../features/login/types";
import { MOCK_USERS } from "../features/login/mockData";

const STORAGE_KEY = "mock-supabase-session";
const USERS_KEY = "mock-supabase-users";

const listeners = new Set<AuthListener>();

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session | null): void {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY)
  }
  catch {

  }
}

// Users live in localStorage (seeded from MOCK_USERS) so accounts created on /admin
// survive reloads and are visible to other tabs — the admin page opens in its own tab.
export function readUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to the seed data
  }
  return MOCK_USERS;
}

export function writeUsers(users: MockUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // storage unavailable — changes are lost on reload
  }
}

function toPublicUser({ password: _password, ...user }: MockUser): User {
  return user;
}

function notify(event: AuthChangeEvent, session: Session | null): void {
  listeners.forEach(cb => cb(event, session));
}

type SignInResponse =
  { data: { user: User; session: Session }; error: null } |
  { data: { user: null, session: null }, error: AuthError }


const fail = (message: string, status: number): SignInResponse => ({
  data: { user: null, session: null },
  error: { message, status },
});

async function signInWithPassword({ email, password }: { email: string, password: string }): Promise<SignInResponse> {
  await delay(800)

  const match = readUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!match || match.password !== password) return fail("Invalid login credentials", 400);
  if (!match.role) return fail("Account not activated", 403);

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

const forbidden: AuthError = { message: "Only admins can manage users", status: 403 };
type UserResponse = { data: { user: User | null }; error: AuthError | null };

const isAdmin = () => readSession()?.user.role === "admin";

async function listUsers(): Promise<{ data: { users: User[] }; error: AuthError | null }> {
  await delay(300);

  if (!isAdmin()) return { data: { users: [] }, error: null };

  return { data: { users: readUsers().map(toPublicUser) }, error: null };
}

async function createUser({ email, password, role }: { email: string; password: string; role: UserRole }): Promise<UserResponse> {
  await delay(300);
  if (!isAdmin()) return { data: { user: null }, error: forbidden };

  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return { data: { user: null }, error: { message: "A user with that email already exists", status: 422 } };
  }

  const created: MockUser = { id: crypto.randomUUID(), email: email.trim(), password, role, profile: null };
  writeUsers([...users, created]);

  return { data: { user: toPublicUser(created) }, error: null };
}

/** Updates the signed-in user's own profile. Role is deliberately not editable here. */
async function updateUser({ profile }: { profile: Profile }): Promise<UserResponse> {
  await delay(300);

  const session = readSession();
  if (!session) return { data: { user: null }, error: { message: "Not signed in", status: 401 } };

  const users = readUsers();
  const target = users.find((u) => u.id === session.user.id);
  if (!target) return { data: { user: null }, error: { message: "User not found", status: 404 } };

  const updated: MockUser = { ...target, profile };
  writeUsers(users.map((u) => (u.id === updated.id ? updated : u)));

  const user = toPublicUser(updated);
  const newSession: Session = { ...session, user };
  writeSession(newSession);
  notify("USER_UPDATED", newSession);

  return { data: { user }, error: null };
}

async function updateUserById(id: string, attrs: Partial<Pick<User, "role" | "profile">>): Promise<UserResponse> {
  await delay(300);
  if (!isAdmin()) return { data: { user: null }, error: forbidden };

  const users = readUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return { data: { user: null }, error: { message: "User not found", status: 404 } };

  const updated = { ...target, ...attrs };
  writeUsers(users.map((u) => (u.id === id ? updated : u)));

  return { data: { user: toPublicUser(updated) }, error: null };
}

/** Re-reads the signed-in user from the store, e.g. after an admin approved their profile change */
async function refreshSession(): Promise<{ data: { session: Session | null }; error: null }> {
  const session = readSession();
  const stored = session && readUsers().find((u) => u.id === session.user.id);
  if (!session || !stored) return { data: { session }, error: null };

  const user = toPublicUser(stored);
  if (JSON.stringify(user) === JSON.stringify(session.user)) return { data: { session }, error: null };

  const newSession: Session = { ...session, user };
  writeSession(newSession);
  notify("USER_UPDATED", newSession);

  return { data: { session: newSession }, error: null };
}

export const supabase = {
  auth: {
    signInWithPassword,
    signOut,
    getSession,
    getUser,
    updateUser,
    refreshSession,
    onAuthStateChange(callback: AuthListener) {
      listeners.add(callback);

      return {
        data: {
          subscription: { unsubscribe: () => void listeners.delete(callback) }
        }
      }
    },
    admin: { listUsers, createUser, updateUserById }
  }
}

