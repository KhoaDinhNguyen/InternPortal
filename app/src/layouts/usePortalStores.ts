import { useAnnouncements } from "../features/announcements/hooks";
import type { Announcement } from "../features/announcements/types";
import { useCalendarEvents } from "../features/calendar/hooks";
import { CALENDAR_EVENTS } from "../features/calendar/mockData";
import { useDmConversations } from "../features/dms/hooks/useConversation";
import { INITIAL_DMS, ME_ID } from "../features/dms/mockData";
import { useHoursEntries } from "../features/hoursLog/hooks";
import { useDocs } from "../features/quickDocs/hooks";
import { QUICK_DOCS } from "../features/quickDocs/mockData";
import { useQuickLinks } from "../features/quickLinks/hooks";
import { QUICK_LINKS } from "../features/quickLinks/mockData";
import { useNotifications } from "../features/requests/hooks";
import { useTickets } from "../features/tickets/hooks";
import { useTodos } from "../features/todo/hooks";
import { INITIAL_TODOS } from "../features/todo/mockData";
import type { NotificationKind } from "../features/requests/types";

/** Announcement tag shown for each kind of pinned notice */
const NOTICE_TAGS: Record<NotificationKind, string> = {
  approved: "Approved",
  rejected: "Rejected",
  ticket: "Ticket",
  ticketResolved: "Resolved",
};

/**
 * Creates every feature store the portal pages share.
 *
 * It lives in the layout (not in each page) so switching between Dashboard,
 * Messages, Hours and Organization keeps what the user typed, and so the
 * sidebar can show the unread message and open ticket counts.
 */
export function usePortalStores() {
  // Profile-request decisions and ticket alerts are pinned to the top of the announcements
  const { notifications, dismiss } = useNotifications();
  const notices: Announcement[] = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    date: new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tag: NOTICE_TAGS[n.kind],
    pinned: true,
  }));

  const announcements = useAnnouncements(notices, dismiss);
  const todos = useTodos(INITIAL_TODOS);
  const calendar = useCalendarEvents(CALENDAR_EVENTS);
  const docs = useDocs(QUICK_DOCS);
  const quickLinks = useQuickLinks(QUICK_LINKS);
  const hours = useHoursEntries();
  const tickets = useTickets();
  // The Messages page opens on the first conversation, like the design
  const dms = useDmConversations(ME_ID, INITIAL_DMS, INITIAL_DMS[0]?.id ?? null);

  return { announcements, todos, calendar, docs, quickLinks, hours, dms, tickets };
}

export type PortalStores = ReturnType<typeof usePortalStores>;
