import { useLocation, useNavigate } from "react-router";
import AppHeader from "@components/AppHeader";
import Avatar from "@icons/Avatar";
import { cn } from "@lib/cn";
import { pillClass, sectionCardClass, tableHeadClass } from "@styles/ui";
import { useAuth } from "../login/useAuth";
import { useProfileRequests } from "./hooks";
import { STATUS_META, changedFields, formatDate } from "./utils";

const CELL = "px-5 py-3.5";

export default function HistoryPage() {
  const { user } = useAuth();
  const { requests, loading, error } = useProfileRequests();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const headers = isAdmin ? ["User", "Submitted", "Status", "Changes", "Reviewed"] : ["Submitted", "Status", "Changes", "Admin Note"];

  // Opened directly (e.g. in a new tab) there is no previous page to go back to
  const goBack = () => (location.key === "default" ? navigate("/") : navigate(-1));

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex max-w-215 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-xl font-extrabold">Request History</h1>
          <p className="mt-1 text-sm text-muted">{isAdmin ? "All profile update requests across users." : "Your profile update requests."}</p>
        </div>

        {error && <p className="text-caption text-danger">{error}</p>}

        <div className={sectionCardClass}>
          {loading || requests.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-subtle">{loading ? "Loading…" : "No requests yet"}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className={tableHeadClass}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-caption">
                  {requests.map((req) => {
                    const meta = STATUS_META[req.status];
                    const changes = changedFields(req);

                    return (
                      <tr key={req.id}>
                        {isAdmin && (
                          <td className={CELL}>
                            <div className="flex items-center gap-2">
                              <Avatar name={req.userName} size={28} />
                              <div>
                                <div className="font-semibold">{req.userName}</div>
                                <div className="text-2xs text-muted">{req.userEmail}</div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td className={cn(CELL, "whitespace-nowrap")}>{formatDate(req.submittedAt)}</td>
                        <td className={CELL}>
                          <span className={cn(pillClass, meta.className)}>{meta.label}</span>
                        </td>
                        <td className={CELL}>
                          {changes.length === 0 ? (
                            <span className="text-xs text-subtle">No changes</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {changes.map((f) => (
                                <span key={f.key} className="rounded-md bg-primary-light px-2 py-0.5 text-2xs font-semibold text-primary">
                                  {f.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        {isAdmin ? (
                          <td className={cn(CELL, "whitespace-nowrap")}>{req.reviewedAt ? formatDate(req.reviewedAt) : "—"}</td>
                        ) : (
                          <td className={cn(CELL, "max-w-55 text-muted")}>{req.adminNote || "—"}</td>
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
