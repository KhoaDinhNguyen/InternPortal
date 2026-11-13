import { useState } from "react";
import Modal from "@components/Modal";
import AnnouncementsWidget from "../features/announcements/components/AnnouncementsWidget";
import CalendarWidget from "../features/calendar/components/CalendarWidget";
import QuickDocsWidget from "../features/quickDocs/components/QuickDocsWidget";
import QuickLinksNav from "../features/quickLinks/components/QuickLinksNav";
import TodoWidget from "../features/todo/components/TodoWidget";
import { useAuth } from "../features/login/useAuth";
import { usePortal } from "../layouts/usePortal";

type ExpandedPanel = "todo" | "calendar" | "announcements" | "docs" | null;

/**
 * Dashboard page (inside `PortalLayout`), includes:
 * - Greeting
 * - Quick links bar
 * - Announcements + to-do on the left, calendar + quick docs on the right
 * - Each card can be expanded into a modal
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const { announcements, todos, calendar, docs, quickLinks } = usePortal();
  const [expanded, setExpanded] = useState<ExpandedPanel>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.profile?.preferredName || user?.profile?.name?.split(" ")[0] || "there";

  const close = () => setExpanded(null);

  return (
    <>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl leading-tight font-extrabold">
          {greeting}, {firstName} 👋
        </h1>
        <p className="mt-1">{"Here's what's happening in your internship portal today."}</p>
      </div>

      <QuickLinksNav linkStore={quickLinks} />

      {/* Main grid: one column until lg, then a fixed-width right column */}
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <AnnouncementsWidget annStore={announcements} onExpand={() => setExpanded("announcements")} />
          <TodoWidget todoStore={todos} onExpand={() => setExpanded("todo")} />
        </div>
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-85">
          <CalendarWidget calendarStore={calendar} onExpand={() => setExpanded("calendar")} />
          <QuickDocsWidget docStore={docs} onExpand={() => setExpanded("docs")} />
        </div>
      </div>

      {/* Expanded modals */}
      {expanded === "announcements" && (
        <Modal onClose={close}>
          <AnnouncementsWidget annStore={announcements} onClose={close} />
        </Modal>
      )}

      {expanded === "todo" && (
        <Modal onClose={close}>
          <TodoWidget todoStore={todos} onClose={close} />
        </Modal>
      )}

      {expanded === "calendar" && (
        <Modal onClose={close}>
          <CalendarWidget calendarStore={calendar} onClose={close} />
        </Modal>
      )}

      {expanded === "docs" && (
        <Modal onClose={close}>
          <QuickDocsWidget docStore={docs} onClose={close} />
        </Modal>
      )}
    </>
  );
}
