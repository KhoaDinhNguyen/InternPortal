import { useEffect, useState } from "react";
import { ticketsApi } from "../../lib/ticketsApi";
import type { NewTicket, Ticket } from "./types";

/** Team-wide ticket list; lives in the portal layout so the sidebar can show the open count */
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ticketsApi.listTickets().then(({ data, error }) => {
      setTickets(data);
      setError(error?.message ?? "");
      setLoading(false);
    });
  }, []);

  /** Returns true when the ticket was created */
  async function submit(input: NewTicket) {
    const { data, error } = await ticketsApi.submitTicket(input);
    if (error || !data) {
      setError(error?.message ?? "Could not submit the ticket");
      return false;
    }

    setError("");
    setTickets((ts) => [data, ...ts]);
    return true;
  }

  /** Interns only; `note` says what's new after the fix. Returns true when saved. */
  async function resolve(id: string, note: string) {
    const { data, error } = await ticketsApi.resolveTicket(id, note);
    if (error || !data) {
      setError(error?.message ?? "Could not resolve the ticket");
      return false;
    }

    setError("");
    setTickets((ts) => ts.map((t) => (t.id === id ? data : t)));
    return true;
  }

  const openCount = tickets.filter((t) => t.status === "open").length;

  return { tickets, loading, error, openCount, submit, resolve };
}

export type TicketStore = ReturnType<typeof useTickets>;
