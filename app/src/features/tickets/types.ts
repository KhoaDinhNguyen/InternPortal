export type TicketStatus = "open" | "resolved";
export type TicketUrgency = "low" | "medium" | "high";

export const TICKET_CATEGORIES = ["Account & Access", "Hardware", "Software", "Network / Wi-Fi", "Other"] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

/** A technical issue reported to the whole digital team */
export interface Ticket {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  title: string;
  description: string;
  category: TicketCategory;
  urgency: TicketUrgency;
  status: TicketStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedByName?: string;
  /** Required from the intern who fixed it: what's new after the fix */
  resolutionNote?: string;
}

export type NewTicket = Pick<Ticket, "title" | "description" | "category" | "urgency">;
