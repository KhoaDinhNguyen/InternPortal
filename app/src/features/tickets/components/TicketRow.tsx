import { useState } from "react";
import Avatar from "@icons/Avatar";
import PriorityDot from "@icons/PriorityDot";
import { cn } from "@lib/cn";
import { inputClass, labelClass, pillClass } from "@styles/ui";
import { formatDate } from "../../requests/utils";
import type { Ticket } from "../types";

interface TicketRowProps {
  ticket: Ticket;
  /** Only interns can resolve tickets */
  canResolve: boolean;
  /** Resolves true when the ticket was closed */
  onResolve: (id: string, note: string) => Promise<boolean>;
}

const URGENCY_LABEL = { low: "Low", medium: "Medium", high: "High" } as const;

/**
 * One ticket: reporter, title, category and urgency. Expands to show details;
 * interns also get a required "what's new after the fix" note to resolve it.
 */
export default function TicketRow({ ticket, canResolve, onResolve }: TicketRowProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const isOpen = ticket.status === "open";
  const noteId = `fix-note-${ticket.id}`;

  async function resolve() {
    if (!note.trim()) return;
    setBusy(true);
    const ok = await onResolve(ticket.id, note);
    setBusy(false);
    if (ok) setNote("");
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-hover">
        <Avatar name={ticket.authorName} size={34} />
        <div className="min-w-0 flex-1">
          <div className={cn("truncate text-sm font-semibold", !isOpen && "text-muted")}>{ticket.title}</div>
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
            <span>{ticket.authorName}</span>
            <span>·</span>
            <span>{ticket.category}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <PriorityDot priority={ticket.urgency} />
              {URGENCY_LABEL[ticket.urgency]}
            </span>
            <span>·</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
        </div>
        <span
          className={cn(
            pillClass,
            "shrink-0",
            isOpen ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary",
          )}>
          {isOpen ? "OPEN" : "RESOLVED"}
        </span>
        <span className={cn("text-caption text-muted transition-transform", open && "rotate-90")}>›</span>
      </button>

      {open && (
        <div className="flex flex-col gap-3 px-5 pb-4 sm:pl-17.5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          <div className="text-xs text-muted">Reported by {ticket.authorEmail}</div>

          {isOpen && canResolve && (
            <div className="flex flex-col gap-2 rounded-lg border border-secondary/30 bg-secondary/5 p-3">
              <label htmlFor={noteId} className={cn(labelClass, "mb-0")}>
                WHAT'S NEW AFTER THE FIX? <span className="text-danger">*</span>
              </label>
              <textarea
                id={noteId}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. Reset the VPN profile and pushed v2.4 config — reconnect from the tray icon."
                className={cn(inputClass, "w-full resize-y")}
              />
              <button
                type="button"
                disabled={busy || !note.trim()}
                onClick={resolve}
                className="self-start rounded-lg bg-secondary px-4 py-1.5 text-caption font-bold text-white disabled:opacity-60">
                {busy ? "Saving…" : "✓ Mark resolved"}
              </button>
            </div>
          )}

          {isOpen && !canResolve && (
            <div className="text-caption text-muted">Waiting for an intern to fix this.</div>
          )}

          {!isOpen && (
            <div className="flex flex-col gap-1 rounded-lg border border-secondary/30 bg-secondary/5 p-3">
              <div className="text-2xs font-bold tracking-wider text-secondary">WHAT'S NEW AFTER THE FIX</div>
              {ticket.resolutionNote && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{ticket.resolutionNote}</p>
              )}
              <div className="text-xs text-muted">
                Resolved by {ticket.resolvedByName ?? "an intern"}
                {ticket.resolvedAt && ` on ${formatDate(ticket.resolvedAt)}`}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
