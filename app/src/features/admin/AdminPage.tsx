import { useState } from "react";
import { Link } from "react-router";
import AppHeader from "@components/AppHeader";
import Avatar from "@icons/Avatar";
import { cn } from "@lib/cn";
import { inputClass, labelClass, primaryButtonClass, sectionCardClass, tableHeadClass } from "@styles/ui";
import { ROLE_LABELS, ROLE_BADGE_CLASSES } from "../login/mockData";
import type { UserRole } from "../login/types";
import { useAuth } from "../login/useAuth";
import { useAdminUsers } from "./hooks";
import ProfileRequestsCard from "../requests/components/ProfileRequestsCard";
import { useProfileRequests } from "../requests/hooks";
import type { ReviewDecision } from "../requests/types";

const ROLE_OPTIONS: UserRole[] = ["intern", "northstar", "admin"];

const CELL = "px-5 py-3";
const TAB = "flex h-11 items-center border-b-2 px-5 text-sm";

/** Portal / Admin / Request History tabs under the header */
function AdminTabs() {
  const link = cn(TAB, "border-transparent font-medium transition-colors hover:border-primary/35 hover:text-primary");

  return (
    <nav className="flex overflow-x-auto border-b bg-white px-4 sm:px-8">
      <Link to="/" className={link}>
        Portal
      </Link>
      <div className={cn(TAB, "border-primary font-bold text-primary")}>Admin</div>
      <Link to="/history" className={link}>
        Request History
      </Link>
    </nav>
  );
}

export default function AdminPage() {
  const { user: me } = useAuth();
  const { users, loading, error, createUser, setRole, reload } = useAdminUsers();
  const { requests, review, error: requestsError } = useProfileRequests();

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

  async function handleReview(id: string, decision: ReviewDecision, note?: string) {
    const ok = await review(id, decision, note);
    // Approval changed that user's profile; refresh the table below
    if (ok && decision === "approved") await reload();
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <AdminTabs />

      <main className="mx-auto flex max-w-225 flex-col gap-7 px-4 py-5 sm:px-8 sm:py-7">
        {/* Create user card */}
        <div className={sectionCardClass}>
          <div className="border-b px-6 py-4">
            <h2 className="font-bold">Create New User</h2>
            <p className="mt-0.5 text-caption text-muted">Only admins can create accounts and assign roles.</p>
          </div>
          <div className="px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="new-email" className={labelClass}>
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
                  className={cn(inputClass, "w-full text-caption")}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="new-password" className={labelClass}>
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
                  className={cn(inputClass, "w-full text-caption")}
                />
              </div>
              <div>
                <label htmlFor="new-role" className={labelClass}>
                  ROLE
                </label>
                <select
                  id="new-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className={cn(inputClass, "w-full text-caption")}>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={handleCreate} disabled={creating} className={cn(primaryButtonClass, "text-caption font-bold")}>
                {creating ? "Creating…" : "Create"}
              </button>
            </div>
            {createError && <p className="mt-2.5 text-caption text-danger">{createError}</p>}
            {createSuccess && <p className="mt-2.5 text-caption text-green-500">{createSuccess}</p>}
          </div>
        </div>

        <ProfileRequestsCard
          requests={requests.filter((r) => r.status === "pending")}
          error={requestsError}
          onReview={handleReview}
        />

        {/* Users table */}
        <div className={sectionCardClass}>
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-bold">All Users</h2>
            <span className="text-caption text-muted">{loading ? "Loading…" : `${users.length} total`}</span>
          </div>
          {error && <p className="px-6 py-2.5 text-caption text-danger">{error}</p>}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["User", "Email", "Role", "Profile", "Actions"].map((h) => (
                    <th key={h} className={tableHeadClass}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-divider text-xs">
                {users.map((u) => {
                  const isMe = u.id === me?.id;

                  return (
                    <tr key={u.id}>
                      <td className={CELL}>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={u.profile?.name ?? u.email} size={30} />
                          <div>
                            <div className="text-sm font-semibold">
                              {u.profile?.name ?? "—"}
                              {isMe && <span className="text-xs font-normal text-muted"> (you)</span>}
                            </div>
                            {u.profile?.preferredName && u.profile.preferredName !== u.profile.name && (
                              <div className="text-muted">"{u.profile.preferredName}"</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={cn(CELL, "text-caption")}>{u.email}</td>
                      <td className={CELL}>
                        <select
                          value={u.role ?? ""}
                          disabled={isMe}
                          title={isMe ? "You can't change your own role" : undefined}
                          onChange={(e) => setRole(u.id, e.target.value as UserRole)}
                          className={cn(
                            "rounded-md border px-2.5 py-1 font-semibold outline-none disabled:cursor-not-allowed",
                            u.role ? ROLE_BADGE_CLASSES[u.role] : "bg-white text-neutral-500",
                          )}>
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
                      <td className={CELL}>
                        {u.profile ? (
                          <span className="font-semibold text-green-500">✓ Complete</span>
                        ) : (
                          <span className="text-subtle">Pending</span>
                        )}
                      </td>
                      <td className={CELL}>
                        {u.profile && (
                          <>
                            {u.profile.title && <div>{u.profile.title}</div>}
                            {u.profile.phone && <div className="text-muted">{u.profile.phone}</div>}
                          </>
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
