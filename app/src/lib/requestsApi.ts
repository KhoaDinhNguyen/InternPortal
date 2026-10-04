import type { AuthError } from "./supabase.types";
import type { Profile } from "../features/login/types";
import type { ProfileUpdateRequest, ReviewDecision, UserNotification } from "../features/requests/types";
import { delay, readSession, readUsers, writeUsers } from "./supabase";

const REQUESTS_KEY = "mock-profile-requests";
const NOTIFICATIONS_KEY = "mock-notifications";

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // storage unavailable — changes are lost on reload
  }
}

type Result<T> = { data: T; error: AuthError | null };
const fail = (message: string, status: number): AuthError => ({ message, status });
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** Non-admins call this instead of updateUser once they already have a profile */
async function submitProfileUpdate(newProfile: Profile): Promise<Result<ProfileUpdateRequest | null>> {
  await delay(300);

  const session = readSession();
  const me = session && readUsers().find((u) => u.id === session.user.id);
  if (!me?.profile) return { data: null, error: fail("Complete your profile first", 400) };
  if (me.role === "admin") return { data: null, error: fail("Admins update their profile directly", 400) };

  const requests = read<ProfileUpdateRequest>(REQUESTS_KEY);
  if (requests.some((r) => r.userId === me.id && r.status === "pending")) {
    return { data: null, error: fail("You already have a profile update waiting for review", 409) };
  }

  const request: ProfileUpdateRequest = {
    id: crypto.randomUUID(),
    userId: me.id,
    userEmail: me.email,
    userName: me.profile.name,
    submittedAt: new Date().toISOString(),
    status: "pending",
    oldProfile: me.profile,
    newProfile,
  };
  write(REQUESTS_KEY, [...requests, request]);

  return { data: request, error: null };
}

/** Admins see every request; everyone else only their own. Newest first. */
async function listProfileRequests(): Promise<Result<ProfileUpdateRequest[]>> {
  await delay(200);

  const me = readSession()?.user;
  if (!me) return { data: [], error: fail("Not signed in", 401) };

  const all = read<ProfileUpdateRequest>(REQUESTS_KEY);
  const visible = me.role === "admin" ? all : all.filter((r) => r.userId === me.id);

  return { data: [...visible].reverse(), error: null };
}

/** Admin only: approve applies the new profile; both outcomes notify the user */
async function reviewProfileRequest(
  id: string,
  decision: ReviewDecision,
  note?: string,
): Promise<Result<ProfileUpdateRequest | null>> {
  await delay(300);
  if (readSession()?.user.role !== "admin") return { data: null, error: fail("Only admins can review requests", 403) };

  const requests = read<ProfileUpdateRequest>(REQUESTS_KEY);
  const req = requests.find((r) => r.id === id);
  if (!req || req.status !== "pending") return { data: null, error: fail("Request not found or already reviewed", 404) };

  const reviewed: ProfileUpdateRequest = {
    ...req,
    status: decision,
    reviewedAt: new Date().toISOString(),
    adminNote: note?.trim() || undefined,
  };
  write(REQUESTS_KEY, requests.map((r) => (r.id === id ? reviewed : r)));

  if (decision === "approved") {
    writeUsers(readUsers().map((u) => (u.id === req.userId ? { ...u, profile: req.newProfile } : u)));
  }

  const submitted = shortDate(req.submittedAt);
  const notification: UserNotification = {
    id: Date.now(),
    userId: req.userId,
    kind: decision,
    createdAt: new Date().toISOString(),
    ...(decision === "approved"
      ? {
        title: "Profile Update Approved ✓",
        body: `Your profile update request (submitted ${submitted}) has been approved by an administrator. Your profile is now live.`,
      }
      : {
        title: "Profile Update Not Approved",
        body: `Your profile update request (submitted ${submitted}) was not approved.${reviewed.adminNote ? ` Admin note: "${reviewed.adminNote}"` : " Please contact an administrator for details."
          }`,
      }),
  };
  write(NOTIFICATIONS_KEY, [...read<UserNotification>(NOTIFICATIONS_KEY), notification]);

  return { data: reviewed, error: null };
}

async function listNotifications(): Promise<Result<UserNotification[]>> {
  await delay(200);
  const me = readSession()?.user;

  return { data: me ? read<UserNotification>(NOTIFICATIONS_KEY).filter((n) => n.userId === me.id) : [], error: null };
}

async function dismissNotification(id: number): Promise<Result<null>> {
  write(NOTIFICATIONS_KEY, read<UserNotification>(NOTIFICATIONS_KEY).filter((n) => n.id !== id));
  return { data: null, error: null };
}

export const requestsApi = {
  submitProfileUpdate,
  listProfileRequests,
  reviewProfileRequest,
  listNotifications,
  dismissNotification,
};
