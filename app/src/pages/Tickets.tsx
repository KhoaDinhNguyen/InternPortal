import { useState } from "react";
import { cn } from "@lib/cn";
import { sectionCardClass, toggleChipClass } from "@styles/ui";
import NewTicketForm from "../features/tickets/components/NewTicketForm";
import TicketRow from "../features/tickets/components/TicketRow";
import type { TicketStatus } from "../features/tickets/types";
import { useAuth } from "../features/login/useAuth";
import { usePortal } from "../layouts/usePortal";

type Filter = TicketStatus | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
  { id: "all", label: "All" },
];

/**
 * Tickets page: report a technical issue and every member of the digital team
 * gets a notice on their dashboard. The board below is shared; only interns
 * can mark a ticket resolved, and they must say what's new after the fix.
 */
export default function TicketsPage() {
  const { user } = useAuth();
  const { tickets: store } = usePortal();
  const canResolve = user?.role === "intern";
  const { tickets, loading, error, openCount, submit, resolve } = store;
  const [filter, setFilter] = useState<Filter>("open");

  const visible = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
  const counts: Record<Filter, number> = {
    open: openCount,
    resolved: tickets.length - openCount,
    all: tickets.length,
  };

  return (
    <div className="flex w-full max-w-215 flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold">Tech Support Tickets</h1>
        <p className="mt-1 text-sm text-muted">
          Having a technical issue? Send it here and the whole digital team is notified.
        </p>
      </div>

      <NewTicketForm onSubmit={submit} />

      {error && <p className="text-caption text-danger">{error}</p>}

      <div className={sectionCardClass}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3.5">
          <h2 className="font-bold">Team tickets</h2>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(toggleChipClass(active), "flex items-center gap-1 px-3 font-medium")}>
                  {f.label}
                  {counts[f.id] > 0 && (
                    <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-primary text-white" : "bg-line")}>
                      {counts[f.id]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {loading || visible.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-subtle">
            {loading ? "Loading…" : filter === "open" ? "No open tickets — everything's working 🎉" : "No tickets yet"}
          </p>
        ) : (
          <div className="divide-y divide-divider">
            {visible.map((t) => (
              <TicketRow key={t.id} ticket={t} canResolve={canResolve} onResolve={resolve} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
