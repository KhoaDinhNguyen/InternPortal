import { useEffect, useState } from "react";
import { requestsApi } from "../../lib/requestsApi";
import type { ProfileUpdateRequest, ReviewDecision, UserNotification } from "./types";

/** Requests visible to the signed-in user (all for admins, own for everyone else) */
export function useProfileRequests() {
  const [requests, setRequests] = useState<ProfileUpdateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    requestsApi.listProfileRequests().then(({ data, error }) => {
      setRequests(data);
      setError(error?.message ?? "");
      setLoading(false);
    });
  }, []);

  /** Returns true when the review went through */
  async function review(id: string, decision: ReviewDecision, note?: string) {
    const { data, error } = await requestsApi.reviewProfileRequest(id, decision, note);

    if (error || !data) {
      setError(error?.message ?? "Review failed");
      return false;
    }

    setRequests((rs) => rs.map((r) => (r.id === id ? data : r)));
    return true;
  }

  return { requests, loading, error, review };
}

/** Approval / rejection notices for the signed-in user */
export function useNotifications() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  useEffect(() => {
    requestsApi.listNotifications().then(({ data }) => setNotifications(data));
  }, []);

  async function dismiss(id: number) {
    setNotifications((ns) => ns.filter((n) => n.id !== id));
    await requestsApi.dismissNotification(id);
  }

  return { notifications, dismiss };
}
