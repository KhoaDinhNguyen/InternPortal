import { useState } from "react";
import Avatar from "@icons/Avatar";
import colors from "@styles/colors";
import type { ProfileUpdateRequest, ReviewDecision } from "../types";
import { PROFILE_FIELDS, formatDate } from "../utils";

interface ProfileRequestsCardProps {
  /** Pending requests only */
  requests: ProfileUpdateRequest[];
  error?: string;
  onReview: (id: string, decision: ReviewDecision, note?: string) => Promise<unknown>;
}

const text = (fontSize: number, color = "#1A1A1A"): React.CSSProperties => ({
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize,
  color,
});

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
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${requests.length ? colors.MAGENTA : "#C8DCF0"}`,
        overflow: "hidden",
      }}>
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #C8DCF0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div>
          <div style={{ ...text(16), fontWeight: 700 }}>Profile Update Requests</div>
          <div style={{ ...text(13, "#4A6B8A"), marginTop: 2 }}>Review and approve or reject user profile changes.</div>
        </div>
        {requests.length > 0 && (
          <span
            style={{
              ...text(12, "#fff"),
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: colors.MAGENTA,
              fontWeight: 700,
            }}>
            {requests.length}
          </span>
        )}
      </div>

      {error && <div style={{ ...text(13, "#C0392B"), padding: "10px 24px" }}>{error}</div>}

      {requests.length === 0 ? (
        <div style={{ ...text(14, "#8FA5BC"), padding: "28px 24px", textAlign: "center" }}>No pending requests</div>
      ) : (
        requests.map((req, i) => {
          const isOpen = expanded === req.id;
          const busy = busyId === req.id;

          return (
            <div key={req.id} style={{ borderBottom: i < requests.length - 1 ? "1px solid #D4E6F5" : "none" }}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : req.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 24px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                }}>
                <Avatar name={req.userName} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...text(14), fontWeight: 600 }}>{req.userName}</div>
                  <div style={text(12, "#4A6B8A")}>
                    {req.userEmail} · Submitted {formatDate(req.submittedAt)}
                  </div>
                </div>
                <span
                  style={{
                    ...text(11, colors.MAGENTA),
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: `${colors.MAGENTA}18`,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}>
                  PENDING
                </span>
                <span
                  style={{
                    ...text(13, "#4A6B8A"),
                    transition: "transform 0.2s",
                    display: "inline-block",
                    transform: isOpen ? "rotate(90deg)" : "none",
                  }}>
                  ›
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: "0 24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Field-by-field diff */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {PROFILE_FIELDS.map(({ key, label }) => {
                      const oldVal = req.oldProfile[key] || "—";
                      const newVal = req.newProfile[key] || "—";
                      const changed = oldVal !== newVal;

                      return (
                        <div
                          key={key}
                          style={{
                            borderRadius: 8,
                            border: `1px solid ${changed ? "#C8DCF0" : "#E8EFF8"}`,
                            overflow: "hidden",
                          }}>
                          <div
                            style={{
                              ...text(11, "#4A6B8A"),
                              padding: "6px 10px",
                              background: "#F5F9FF",
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                            }}>
                            {label.toUpperCase()}
                          </div>
                          <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ ...text(12, "#8FA5BC"), textDecoration: changed ? "line-through" : "none" }}>
                              {oldVal}
                            </div>
                            {changed && <div style={{ ...text(13, colors.SECONDARY), fontWeight: 600 }}>{newVal}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label
                      htmlFor={`note-${req.id}`}
                      style={{
                        ...text(11, "#4A6B8A"),
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        display: "block",
                        marginBottom: 5,
                      }}>
                      REJECTION NOTE (optional)
                    </label>
                    <input
                      id={`note-${req.id}`}
                      value={notes[req.id] ?? ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [req.id]: e.target.value }))}
                      placeholder="Reason for rejection…"
                      style={{
                        ...text(13),
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 7,
                        border: "1.5px solid #C8DCF0",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => decide(req.id, "approved")}
                      style={{
                        ...text(13, "#fff"),
                        padding: "9px 20px",
                        borderRadius: 8,
                        border: "none",
                        background: colors.SECONDARY,
                        fontWeight: 700,
                        cursor: busy ? "default" : "pointer",
                        opacity: busy ? 0.7 : 1,
                      }}>
                      ✓ Approve
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => decide(req.id, "rejected")}
                      style={{
                        ...text(13, "#C0392B"),
                        padding: "9px 20px",
                        borderRadius: 8,
                        border: "1.5px solid #FFCCCC",
                        background: "#FFF0F0",
                        fontWeight: 700,
                        cursor: busy ? "default" : "pointer",
                        opacity: busy ? 0.7 : 1,
                      }}>
                      ✕ Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
