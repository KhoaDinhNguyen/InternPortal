import { useState } from "react";
import { cn } from "@lib/cn";
import { formPanelClass, inputClass, labelClass, primaryButtonClass } from "@styles/ui";
import { TICKET_CATEGORIES, type NewTicket, type TicketCategory, type TicketUrgency } from "../types";

interface NewTicketFormProps {
  /** Resolves true when the ticket was saved */
  onSubmit: (ticket: NewTicket) => Promise<boolean>;
}

const URGENCY_OPTIONS: { value: TicketUrgency; label: string }[] = [
  { value: "low", label: "Low — whenever someone has time" },
  { value: "medium", label: "Medium — slowing me down" },
  { value: "high", label: "High — I'm blocked" },
];

/** Form for reporting a technical issue to the digital team */
export default function NewTicketForm({ onSubmit }: NewTicketFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>(TICKET_CATEGORIES[0]);
  const [urgency, setUrgency] = useState<TicketUrgency>("medium");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const canSubmit = title.trim() !== "" && description.trim() !== "" && !busy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setBusy(true);
    const ok = await onSubmit({ title, description, category, urgency });
    setBusy(false);

    if (ok) {
      setTitle("");
      setDescription("");
      setUrgency("medium");
      setSent(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn(formPanelClass, "gap-3 p-4")}>
      <div>
        <label htmlFor="ticket-title" className={labelClass}>
          WHAT'S WRONG?
        </label>
        <input
          id="ticket-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSent(false);
          }}
          placeholder="e.g. Can't sign in to GitHub"
          className={cn(inputClass, "w-full")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="ticket-category" className={labelClass}>
            CATEGORY
          </label>
          <select
            id="ticket-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TicketCategory)}
            className={cn(inputClass, "w-full")}>
            {TICKET_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ticket-urgency" className={labelClass}>
            URGENCY
          </label>
          <select
            id="ticket-urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as TicketUrgency)}
            className={cn(inputClass, "w-full")}>
            {URGENCY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ticket-description" className={labelClass}>
          DETAILS
        </label>
        <textarea
          id="ticket-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="What were you doing, what happened, and any error message you saw."
          className={cn(inputClass, "w-full resize-y")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
          {busy ? "Sending…" : "Send to digital team"}
        </button>
        {sent && <span className="text-caption font-semibold text-secondary">✓ Sent — the whole team has been notified.</span>}
      </div>
    </form>
  );
}
