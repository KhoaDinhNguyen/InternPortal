import { useState } from "react";
import Avatar from "@icons/Avatar";
import { cn } from "@lib/cn";
import { inputClass, pillClass, sectionCardClass } from "@styles/ui";
import type { ProfileUpdateRequest, ReviewDecision } from "../types";
import { PROFILE_FIELDS, formatDate } from "../utils";

interface ProfileRequestsCardProps {
  /** Pending requests only */
  requests: ProfileUpdateRequest[];
  error?: string;
  onReview: (id: string, decision: ReviewDecision, note?: string) => Promise<unknown>;
}

const DECISION_BUTTON = "rounded-lg px-5 py-2 text-caption font-bold disabled:opacity-70";

/**
 * Admin card listing pending profile changes. Each row expands into a
 * field-by-field diff with an optional rejection note and Approve / Reject.
 */
export default function ProfileRequestsCard({ requests, error, onReview }: ProfileRequestsCardProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  async function decide(id: string, decision: ReviewDecision) {
    setBusyId(id);
    await onReview(id, decision, notes[id]);
    setBusyId(null);
    setExpanded(null);
  }

  return (
    <div className={cn(sectionCardClass, requests.length > 0 && "border-primary")}>
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="font-bold">Profile Update Requests</h2>
          <p className="mt-0.5 text-caption text-muted">Review and approve or reject user profile changes.</p>
        </div>
        {requests.length > 0 && (
          <span className="inline-flex size-6.5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {requests.length}
          </span>
        )}
      </div>

      {error && <p className="px-6 py-2.5 text-caption text-danger">{error}</p>}

      {requests.length === 0 ? (
        <p className="px-6 py-7 text-center text-sm text-subtle">No pending requests</p>
      ) : (
        <div className="divide-y divide-divider">
          {requests.map((req) => {
            const isOpen = expanded === req.id;
            const busy = busyId === req.id;

            return (
              <div key={req.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : req.id)}
                  className="flex w-full items-center gap-3.5 px-6 py-3.5 text-left">
                  <Avatar name={req.userName} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{req.userName}</div>
                    <div className="text-xs text-muted">
                      {req.userEmail} · Submitted {formatDate(req.submittedAt)}
                    </div>
                  </div>
                  <span className={cn(pillClass, "bg-primary/10 text-primary")}>PENDING</span>
                  <span className={cn("text-caption text-muted transition-transform", isOpen && "rotate-90")}>›</span>
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-4 px-6 pb-5">
                    {/* Field-by-field diff */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {PROFILE_FIELDS.map(({ key, label }) => {
                        const oldVal = req.oldProfile[key] || "—";
                        const newVal = req.newProfile[key] || "—";
                        const changed = oldVal !== newVal;

                        return (
                          <div key={key} className={cn("overflow-hidden rounded-lg border", !changed && "border-divider")}>
                            <div className="bg-hover px-2.5 py-1.5 text-2xs font-bold tracking-wider text-muted">
                              {label.toUpperCase()}
                            </div>
                            <div className="flex flex-col gap-1 px-2.5 py-2">
                              <div className={cn("text-xs text-subtle", changed && "line-through")}>{oldVal}</div>
                              {changed && <div className="text-caption font-semibold text-secondary">{newVal}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <label
                        htmlFor={`note-${req.id}`}
                        className="mb-1 block text-2xs font-bold tracking-wider text-muted">
                        REJECTION NOTE (optional)
                      </label>
                      <input
                        id={`note-${req.id}`}
                        value={notes[req.id] ?? ""}
                        onChange={(e) => setNotes((n) => ({ ...n, [req.id]: e.target.value }))}
                        placeholder="Reason for rejection…"
                        className={cn(inputClass, "w-full text-caption")}
                      />
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => decide(req.id, "approved")}
                        className={cn(DECISION_BUTTON, "bg-secondary text-white")}>
                        ✓ Approve
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => decide(req.id, "rejected")}
                        className={cn(DECISION_BUTTON, "border border-red-200 bg-red-50 text-danger")}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
