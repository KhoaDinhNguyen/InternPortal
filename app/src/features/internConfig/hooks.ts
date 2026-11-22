import { useEffect, useState } from "react";
import { internConfigApi } from "../../lib/internConfigApi";
import type { InternConfig } from "./types";

/** Admin view of every intern and their weekly hours target */
export function useInternConfig() {
  const [interns, setInterns] = useState<InternConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    internConfigApi.listInterns().then(({ data, error }) => {
      setInterns(data);
      setError(error?.message ?? "");
      setLoading(false);
    });
  }, []);

  /** Applies one target to all `ids`. Returns true when saved. */
  async function setWeeklyHours(ids: string[], hours: number) {
    const { error } = await internConfigApi.setWeeklyHours(ids, hours);
    if (error) {
      setError(error.message);
      return false;
    }

    setError("");
    const targets = new Set(ids);
    setInterns((list) => list.map((i) => (targets.has(i.id) ? { ...i, weeklyHours: hours } : i)));
    return true;
  }

  return { interns, loading, error, setWeeklyHours };
}
