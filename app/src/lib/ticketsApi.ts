import type { AuthError } from "./supabase.types";
import type { MockUser } from "../features/login/types";
import type { UserNotification } from "../features/requests/types";
import type { NewTicket, Ticket } from "../features/tickets/types";
import { NOTIFICATIONS_KEY, readList, writeList } from "./mockStore";
import { delay, readSession, readUsers } from "./supabase";

const TICKETS_KEY = "mock-tickets";

type Result<T> = { data: T; error: AuthError | null };
const fail = (message: string, status: number): AuthError => ({ message, status });

const displayName = (u: MockUser) => u.profile?.name || u.email;

/**
 * The digital team = every activated portal account. A new ticket alerts all of
 * them except the reporter. Narrow this filter if tickets should only reach a
 * subset (e.g. admins or an IT group) once teams exist on user records.
 */
const digitalTeam = () => readUsers().filter((u) => u.role !== null);

/** Appends one notice per recipient; ids stay unique when sent in the same millisecond */
function notify(userIds: string[], notice: Omit<UserNotification, "id" | "userId" | "createdAt">) {
  const createdAt = new Date().toISOString();
  const base = Date.now() * 1000;
  const added = userIds.map((userId, i) => ({ ...notice, id: base + i, userId, createdAt }));
  writeList(NOTIFICATIONS_KEY, [...readList<UserNotification>(NOTIFICATIONS_KEY), ...added]);
}

/** Any signed-in user can report an issue; the rest of the team is notified */
async function submitTicket(input: NewTicket): Promise<Result<Ticket | null>> {
  await delay(300);

  const session = readSession();
  const me = session && readUsers().find((u) => u.id === session.user.id);
  if (!me) return { data: null, error: fail("Not signed in", 401) };

  const title = input.title.trim();
  const description = input.description.trim();
  if (!title) return { data: null, error: fail("Give the issue a short title", 400) };
  if (!description) return { data: null, error: fail("Describe what is going wrong", 400) };

  const ticket: Ticket = {
    id: crypto.randomUUID(),
    authorId: me.id,
    authorName: displayName(me),
    authorEmail: me.email,
    title,
    description,
    category: input.category,
    urgency: input.urgency,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  writeList(TICKETS_KEY, [...readList<Ticket>(TICKETS_KEY), ticket]);

  const urgent = ticket.urgency === "high" ? "Urgent: " : "";
  notify(
    digitalTeam()
      .filter((u) => u.id !== me.id)
      .map((u) => u.id),
    {
      kind: "ticket",
      title: `${urgent}${ticket.authorName} needs tech help`,
      body: `[${ticket.category}] ${ticket.title} — ${ticket.description} Open the Tickets page to help out.`,
    },
  );

  return { data: ticket, error: null };
}

/** Tickets are shared with the whole team. Newest first. */
async function listTickets(): Promise<Result<Ticket[]>> {
  await delay(200);
  if (!readSession()) return { data: [], error: fail("Not signed in", 401) };

  return { data: [...readList<Ticket>(TICKETS_KEY)].reverse(), error: null };
}

/**
 * Interns only: closing a ticket requires a note on what's new after the fix,
 * which is saved on the ticket and sent to the reporter.
 */
async function resolveTicket(id: string, note: string): Promise<Result<Ticket | null>> {
  await delay(300);

  const session = readSession();
  const me = session && readUsers().find((u) => u.id === session.user.id);
  if (!me) return { data: null, error: fail("Not signed in", 401) };
  if (me.role !== "intern") return { data: null, error: fail("Only interns can resolve tickets", 403) };

  const resolutionNote = note.trim();
  if (!resolutionNote) return { data: null, error: fail("Describe what's new after the fix", 400) };

  const tickets = readList<Ticket>(TICKETS_KEY);
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket || ticket.status !== "open") return { data: null, error: fail("Ticket not found or already resolved", 404) };

  const resolved: Ticket = {
    ...ticket,
    status: "resolved",
    resolvedAt: new Date().toISOString(),
    resolvedByName: displayName(me),
    resolutionNote,
  };
  writeList(TICKETS_KEY, tickets.map((t) => (t.id === id ? resolved : t)));

  if (ticket.authorId !== me.id) {
    notify([ticket.authorId], {
      kind: "ticketResolved",
      title: "Your ticket was resolved ✓",
      body: `${resolved.resolvedByName} fixed "${ticket.title}". What's new: ${resolutionNote} If it's still broken, open a new ticket.`,
    });
  }

  return { data: resolved, error: null };
}

export const ticketsApi = { submitTicket, listTickets, resolveTicket };
