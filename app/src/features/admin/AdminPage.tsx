import { useState } from "react";
import { Link } from "react-router";
import Avatar from "@icons/Avatar";
import colors from "@styles/colors";
import { ROLE_LABELS, ROLE_COLORS } from "../login/mockData";
import type { UserRole } from "../login/types";
import { useAuth } from "../login/useAuth";
import { useAdminUsers } from "./hooks";

const ROLE_OPTIONS: UserRole[] = ["intern", "northstar", "admin"];

const field: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 7,
  border: "1.5px solid #C8DCF0",
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: 13,
  color: "#1A1A1A",
  outline: "none",
  background: "#fff",
};

const label: React.CSSProperties = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.05em",
  color: "#1A1A1A",
  display: "block",
  marginBottom: 5,
};

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #C8DCF0",
  overflow: "hidden",
};
const cell: React.CSSProperties = { padding: "12px 20px" };

const text = (fontSize: number, color = "#1A1A1A"): React.CSSProperties => ({
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize,
  color,
});

export default function AdminPage() {
  const { user: me } = useAuth();
  const { users, loading, error, createUser, setRole } = useAdminUsers();

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("intern");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!newEmail.trim()) return setCreateError("Email is required");
    if (!newPassword.trim()) return setCreateError("Password is required");

    setCreating(true);
    const err = await createUser({ email: newEmail, password: newPassword.trim(), role: newRole });
    setCreating(false);

    if (err) return setCreateError(err.message);

    setCreateSuccess(`User ${newEmail.trim()} created successfully.`);
    setNewEmail("");
    setNewPassword("");
    setCreateError("");
    setTimeout(() => setCreateSuccess(""), 3000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      {/* Header */}
      <header
        className="app-header"
        style={{
          background: "#fff",
          borderBottom: "1px solid #C8DCF0",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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

      {/* Admin sub-nav */}
      <nav
        className="app-subnav"
        style={{ background: "#fff", borderBottom: "1px solid #C8DCF0", display: "flex", alignItems: "stretch" }}>
        <Link
          to="/"
          style={{
            ...text(14),
            padding: "0 20px",
            height: 44,
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            textDecoration: "none",
            borderBottom: "2px solid transparent",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.MAGENTA;
            e.currentTarget.style.borderBottomColor = `${colors.MAGENTA}55`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#1A1A1A";
            e.currentTarget.style.borderBottomColor = "transparent";
          }}>
          Portal
        </Link>
        <div
          style={{
            ...text(14, colors.MAGENTA),
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            fontWeight: 700,
            borderBottom: `2px solid ${colors.MAGENTA}`,
          }}>
          Admin
        </div>
      </nav>

      <main
        className="app-main"
        style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Create user card */}
        <div style={card}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #C8DCF0" }}>
            <div style={{ ...text(16), fontWeight: 700 }}>Create New User</div>
            <div style={{ ...text(13, "#4A6B8A"), marginTop: 2 }}>
              Only admins can create accounts and assign roles.
            </div>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div className="admin-create-grid" style={{ alignItems: "end" }}>
              <div>
                <label htmlFor="new-email" style={label}>
                  EMAIL
                </label>
                <input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setCreateError("");
                  }}
                  placeholder="user@portal.com"
                  style={{ ...field, width: "100%", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label htmlFor="new-password" style={label}>
                  PASSWORD
                </label>
                <input
                  id="new-password"
                  type="text"
                  autoComplete="off"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setCreateError("");
                  }}
                  placeholder="temporary password"
                  style={{ ...field, width: "100%", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label htmlFor="new-role" style={label}>
                  ROLE
                </label>
                <select
                  id="new-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  style={{ ...field, cursor: "pointer" }}>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreate}
                disabled={creating}
                style={{
                  ...text(13, "#fff"),
                  padding: "8px 18px",
                  borderRadius: 7,
                  border: "none",
                  background: colors.MAGENTA,
                  fontWeight: 700,
                  cursor: creating ? "default" : "pointer",
                  opacity: creating ? 0.7 : 1,
                }}>
                {creating ? "Creating…" : "Create"}
              </button>
            </div>
            {createError && <div style={{ ...text(13, "#C0392B"), marginTop: 10 }}>{createError}</div>}
            {createSuccess && <div style={{ ...text(13, "#22C55E"), marginTop: 10 }}>{createSuccess}</div>}
          </div>
        </div>

        {/* Users table */}
        <div style={card}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #C8DCF0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <div style={{ ...text(16), fontWeight: 700 }}>All Users</div>
            <span style={text(13, "#4A6B8A")}>{loading ? "Loading…" : `${users.length} total`}</span>
          </div>
          {error && <div style={{ ...text(13, "#C0392B"), padding: "10px 24px" }}>{error}</div>}
          <div className="admin-table-wrap" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["User", "Email", "Role", "Profile", "Actions"].map((h) => (
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
                {users.map((u, i) => {
                  const roleInfo = u.role ? ROLE_COLORS[u.role] : null;
                  const isMe = u.id === me?.id;

                  return (
                    <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? "1px solid #D4E6F5" : "none" }}>
                      <td style={cell}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={u.profile?.name ?? u.email} size={30} />
                          <div>
                            <div style={{ ...text(14), fontWeight: 600 }}>
                              {u.profile?.name ?? "—"}
                              {isMe && <span style={text(12, "#4A6B8A")}> (you)</span>}
                            </div>
                            {u.profile?.preferredName && u.profile.preferredName !== u.profile.name && (
                              <div style={text(12, "#4A6B8A")}>"{u.profile.preferredName}"</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ ...cell, ...text(13) }}>{u.email}</td>
                      <td style={cell}>
                        <select
                          value={u.role ?? ""}
                          disabled={isMe}
                          title={isMe ? "You can't change your own role" : undefined}
                          onChange={(e) => setRole(u.id, e.target.value as UserRole)}
                          style={{
                            ...text(12, roleInfo ? roleInfo.text : "#666"),
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: `1.5px solid ${roleInfo ? roleInfo.text : "#C8DCF0"}`,
                            background: roleInfo ? roleInfo.bg : "#fff",
                            fontWeight: 600,
                            cursor: isMe ? "not-allowed" : "pointer",
                            outline: "none",
                          }}>
                          <option value="" disabled>
                            — assign —
                          </option>
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={cell}>
                        {u.profile ? (
                          <span style={{ ...text(12, "#22C55E"), fontWeight: 600 }}>✓ Complete</span>
                        ) : (
                          <span style={text(12, "#8FA5BC")}>Pending</span>
                        )}
                      </td>
                      <td style={cell}>
                        {u.profile && (
                          <div style={text(12)}>
                            {u.profile.title && <div>{u.profile.title}</div>}
                            {u.profile.phone && <div style={{ color: "#4A6B8A" }}>{u.profile.phone}</div>}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
