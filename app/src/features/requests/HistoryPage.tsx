import { useLocation, useNavigate } from "react-router";
import Avatar from "@icons/Avatar";
import colors from "@styles/colors";
import { useAuth } from "../login/useAuth";
import { useProfileRequests } from "./hooks";
import { STATUS_META, changedFields, formatDate } from "./utils";

const text = (fontSize: number, color = "#1A1A1A"): React.CSSProperties => ({
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize,
  color,
});
const cell: React.CSSProperties = { padding: "14px 20px" };

export default function HistoryPage() {
  const { user } = useAuth();
  const { requests, loading, error } = useProfileRequests();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const headers = isAdmin
    ? ["User", "Submitted", "Status", "Changes", "Reviewed"]
    : ["Submitted", "Status", "Changes", "Admin Note"];

  // Opened directly (e.g. in a new tab) there is no previous page to go back to
  const goBack = () => (location.key === "default" ? navigate("/") : navigate(-1));

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #C8DCF0",
          padding: "0 32px",
          height: 60,
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: colors.MAGENTA,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <span style={{ fontSize: 16, color: "#fff" }}>✦</span>
          </div>
          <span style={{ ...text(16), fontWeight: 700 }}>Intern Portal</span>
        </div>
      </header>

      <main
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}>
        <button
          type="button"
          onClick={goBack}
          style={{
            ...text(13, colors.MAGENTA),
            alignSelf: "flex-start",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
          ← Back
        </button>

        <div>
          <div style={{ ...text(22), fontWeight: 800 }}>Request History</div>
          <div style={{ ...text(14, "#4A6B8A"), marginTop: 4 }}>
            {isAdmin ? "All profile update requests across users." : "Your profile update requests."}
          </div>
        </div>

        {error && <div style={text(13, "#C0392B")}>{error}</div>}

        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #C8DCF0", overflow: "hidden" }}>
          {loading ? (
            <div style={{ ...text(14, "#8FA5BC"), padding: "48px 24px", textAlign: "center" }}>Loading…</div>
          ) : requests.length === 0 ? (
            <div style={{ ...text(14, "#8FA5BC"), padding: "48px 24px", textAlign: "center" }}>No requests yet</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h}
                        style={{
                          ...text(11, "#4A6B8A"),
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          borderBottom: "1px solid #C8DCF0",
                        }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, i) => {
                    const meta = STATUS_META[req.status];
                    const changes = changedFields(req);

                    return (
                      <tr key={req.id} style={{ borderBottom: i < requests.length - 1 ? "1px solid #D4E6F5" : "none" }}>
                        {isAdmin && (
                          <td style={cell}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <Avatar name={req.userName} size={28} />
                              <div>
                                <div style={{ ...text(13), fontWeight: 600 }}>{req.userName}</div>
                                <div style={text(11, "#4A6B8A")}>{req.userEmail}</div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td style={{ ...cell, ...text(13), whiteSpace: "nowrap" }}>{formatDate(req.submittedAt)}</td>
                        <td style={cell}>
                          <span
                            style={{
                              ...text(11, meta.text),
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: 20,
                              background: meta.bg,
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                            }}>
                            {meta.label}
                          </span>
                        </td>
                        <td style={cell}>
                          {changes.length === 0 ? (
                            <span style={text(12, "#8FA5BC")}>No changes</span>
                          ) : (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {changes.map((f) => (
                                <span
                                  key={f.key}
                                  style={{
                                    ...text(11, colors.MAGENTA),
                                    padding: "2px 8px",
                                    borderRadius: 5,
                                    background: colors.MAGENTA_LIGHT,
                                    fontWeight: 600,
                                  }}>
                                  {f.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        {isAdmin ? (
                          <td style={{ ...cell, ...text(13), whiteSpace: "nowrap" }}>
                            {req.reviewedAt ? formatDate(req.reviewedAt) : "—"}
                          </td>
                        ) : (
                          <td style={{ ...cell, ...text(13, "#4A6B8A"), maxWidth: 220 }}>{req.adminNote || "—"}</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
