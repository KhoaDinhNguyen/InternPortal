import type { AuthError } from "./supabase.types";
import { DEFAULT_WEEKLY_REQUIREMENT } from "../features/hoursLog/mockData";
import type { InternConfig } from "../features/internConfig/types";
import { readList, writeList } from "./mockStore";
import { delay, readSession, readUsers } from "./supabase";

const WEEKLY_HOURS_KEY = "mock-weekly-hours";

/** Upper bound for a weekly target, so a typo can't set e.g. 400h */
export const MAX_WEEKLY_HOURS = 80;

interface WeeklyHoursRow {
  userId: string;
  hours: number;
}

type Result<T> = { data: T; error: AuthError | null };
const fail = (message: string, status: number): AuthError => ({ message, status });
const isAdmin = () => readSession()?.user.role === "admin";

/** userId → hours; interns without a row use the default target */
function hoursByUser(): Map<string, number> {
  return new Map(readList<WeeklyHoursRow>(WEEKLY_HOURS_KEY).map((r) => [r.userId, r.hours]));
}

/** Admin only: every intern account with their weekly hours target, sorted by name */
async function listInterns(): Promise<Result<InternConfig[]>> {
  await delay(200);
  if (!isAdmin()) return { data: [], error: fail("Only admins can view intern configuration", 403) };

  const hours = hoursByUser();
  const interns = readUsers()
    .filter((u) => u.role === "intern")
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.profile?.name ?? "",
      title: u.profile?.title ?? "",
      weeklyHours: hours.get(u.id) ?? DEFAULT_WEEKLY_REQUIREMENT,
    }))
    .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

  return { data: interns, error: null };
}

/** Admin only: sets the same weekly target for one or many interns */
async function setWeeklyHours(userIds: string[], hours: number): Promise<Result<null>> {
  await delay(300);
  if (!isAdmin()) return { data: null, error: fail("Only admins can change weekly hours", 403) };
  if (userIds.length === 0) return { data: null, error: fail("Select at least one intern", 400) };
  if (!Number.isFinite(hours) || hours < 0 || hours > MAX_WEEKLY_HOURS) {
    return { data: null, error: fail(`Weekly hours must be between 0 and ${MAX_WEEKLY_HOURS}`, 400) };
  }

  const internIds = new Set(readUsers().filter((u) => u.role === "intern").map((u) => u.id));
  if (userIds.some((id) => !internIds.has(id))) return { data: null, error: fail("Only interns can be configured", 400) };

  const targets = new Set(userIds);
  const rows = readList<WeeklyHoursRow>(WEEKLY_HOURS_KEY).filter((r) => !targets.has(r.userId));
  writeList(WEEKLY_HOURS_KEY, [...rows, ...userIds.map((userId) => ({ userId, hours }))]);

  return { data: null, error: null };
}

/** The signed-in user's own weekly target (default when an admin hasn't set one) */
async function getMyWeeklyHours(): Promise<Result<number>> {
  const me = readSession()?.user;
  if (!me) return { data: DEFAULT_WEEKLY_REQUIREMENT, error: fail("Not signed in", 401) };

  return { data: hoursByUser().get(me.id) ?? DEFAULT_WEEKLY_REQUIREMENT, error: null };
}

export const internConfigApi = { listInterns, setWeeklyHours, getMyWeeklyHours };
