/**
 * localStorage-backed lists shared by the mock APIs (requests, tickets).
 * Stand-in for real tables until Supabase is connected.
 */

/** In-app notices for every user; read by `requestsApi.listNotifications` */
export const NOTIFICATIONS_KEY = "mock-notifications";

export function readList<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

export function writeList<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // storage unavailable — changes are lost on reload
  }
}
