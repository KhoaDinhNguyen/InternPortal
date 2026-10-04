import { useState } from "react";
import AnnouncementsWidget from "../features/announcements/components/AnnouncementsWidget";
import HoursLogWidget from "../features/hoursLog/components/HoursLogWidget";
import Modal from "@components/Modal";
import { useAnnouncements } from "../features/announcements/hooks";
import { useHoursEntries } from "../features/hoursLog/hooks";
import { useDmConversations } from "../features/dms/hooks/useConversation";
import TodoWidget from "../features/todo/components/TodoWidget";
import DmsWidget from "../features/dms/components/DmsWidget";
import { INITIAL_TODOS } from "../features/todo/mockData";
import { INITIAL_DMS, ME_ID } from "../features/dms/mockData";
import { useTodos } from "../features/todo/hooks";
import CalendarWidget from "../features/calendar/components/CalendarWidget";
import { useCalendarEvents } from "../features/calendar/hooks";
import { CALENDAR_EVENTS } from "../features/calendar/mockData";
import QuickDocsWidget from "../features/quickDocs/components/QuickDocsWidget";
import { useDocs } from "../features/quickDocs/hooks";
import { QUICK_DOCS } from "../features/quickDocs/mockData";
import QuickLinksNav from "../features/quickLinks/components/QuickLinksNav";
import QuickLinksWidget from "../features/quickLinks/components/QuickLinksWidget";
import UserMenuButton from "@components/UserMenuButton";
import { Link } from "react-router";
import colors from "@styles/colors";
import { useAuth } from "../features/login/useAuth";
import { useNotifications } from "../features/requests/hooks";
import type { Announcement } from "../features/announcements/types";

type ExpandedPanel = "todo" | "calendar" | "announcements" | "links" | "docs" | "dms" | "hours" | null;

const text = (fontSize: number, color = "#1A1A1A"): React.CSSProperties => ({
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize,
  color,
});

export default function DashboardPage() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<ExpandedPanel>(null);
  const { notifications, dismiss } = useNotifications();
  const notices: Announcement[] = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    date: new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tag: n.kind === "approved" ? "Approved" : "Rejected",
    pinned: true,
  }));

  const annStore = useAnnouncements(notices, dismiss);

  const { entries, addEntries } = useHoursEntries();
  const {
    activeId,
    otherUser,
    convoName,
    openConvo,
    sendMessage,
    sortedConvos,
    toggleReaction,
    active,
    totalUnread,
    togglePin,
  } = useDmConversations(ME_ID, INITIAL_DMS, null);
  const todoStore = useTodos(INITIAL_TODOS);
  const calendarStore = useCalendarEvents(CALENDAR_EVENTS);
  const docStore = useDocs(QUICK_DOCS);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      {/* Top bar */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #C8DCF0",
          padding: "0 32px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 12,
              color: "#1A1A1A",
              letterSpacing: "0.06em",
            }}>
            {dateStr.toUpperCase()}
          </div>
        </div>
        <UserMenuButton currentUser={user} />
      </header>

      {isAdmin && (
        <nav
          className="app-subnav"
          style={{ background: "#fff", borderBottom: "1px solid #C8DCF0", display: "flex", alignItems: "stretch" }}>
          <div
            style={{
              ...text(14, colors.MAGENTA),
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              fontWeight: 700,
              borderBottom: `2px solid ${colors.MAGENTA}`,
            }}>
            Portal
          </div>
          <Link
            to="/admin"
            target="_blank"
            style={{
              ...text(14),
              padding: "0 20px",
              height: 44,
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              textDecoration: "none",
              borderBottom: "2px solid transparent",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.MAGENTA;
              e.currentTarget.style.borderBottomColor = `${colors.MAGENTA}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#1A1A1A";
              e.currentTarget.style.borderBottomColor = "transparent";
            }}>
            Admin
          </Link>
        </nav>
      )}

      <main style={{ padding: "28px 32px", maxWidth: 1280, margin: "0 auto" }}>
        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: "#1A1A1A",
              margin: 0,
              lineHeight: 1.1,
            }}>
            {greeting}, {user.profile?.preferredName ?? user.email} 👋
          </h1>
          <p style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 16, color: "#1A1A1A", margin: "5px 0 0" }}>
            {"Here's what's happening in your internship portal today."}
          </p>
        </div>
        <QuickLinksNav onExpand={() => setExpanded("links")} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AnnouncementsWidget annStore={annStore} onExpand={() => setExpanded("announcements")} />

            <TodoWidget todoStore={todoStore} onExpand={() => setExpanded("todo")} />
            <HoursLogWidget entries={entries} addEntries={addEntries} onExpand={() => setExpanded("hours")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CalendarWidget calendarStore={calendarStore} onExpand={() => setExpanded("calendar")} />
            <DmsWidget
              onExpand={() => setExpanded("dms")}
              fullscreen={false}
              active={active}
              activeId={activeId}
              convoName={convoName}
              openConvo={(id: string) => {
                openConvo(id);
                setExpanded("dms");
              }}
              otherUser={otherUser}
              sendMessage={sendMessage}
              sortedConvos={sortedConvos}
              togglePin={togglePin}
              toggleReaction={toggleReaction}
              totalUnread={totalUnread}
            />
            <QuickDocsWidget docStore={docStore} onExpand={() => setExpanded("docs")} />
          </div>
        </div>
      </main>
      {expanded === "announcements" && (
        <Modal onClose={() => setExpanded(null)}>
          <Modal onClose={() => setExpanded(null)}>
            <AnnouncementsWidget annStore={annStore} onClose={() => setExpanded(null)} />
          </Modal>
        </Modal>
      )}

      {expanded === "hours" && (
        <Modal onClose={() => setExpanded(null)}>
          <HoursLogWidget entries={entries} addEntries={addEntries} onClose={() => setExpanded(null)} />
        </Modal>
      )}

      {expanded === "links" && (
        <Modal onClose={() => setExpanded(null)}>
          <QuickLinksWidget onClose={() => setExpanded(null)} />
        </Modal>
      )}

      {expanded === "calendar" && (
        <Modal onClose={() => setExpanded(null)}>
          <CalendarWidget calendarStore={calendarStore} onClose={() => setExpanded(null)} />
        </Modal>
      )}

      {expanded === "docs" && (
        <Modal onClose={() => setExpanded(null)}>
          <QuickDocsWidget docStore={docStore} onClose={() => setExpanded(null)} />
        </Modal>
      )}

      {expanded === "todo" && (
        <Modal onClose={() => setExpanded(null)}>
          <TodoWidget todoStore={todoStore} onClose={() => setExpanded(null)} />
        </Modal>
      )}

      {expanded === "dms" && (
        <Modal onClose={() => setExpanded(null)}>
          <DmsWidget
            fullscreen={true}
            active={active}
            activeId={activeId}
            convoName={convoName}
            openConvo={openConvo}
            otherUser={otherUser}
            sendMessage={sendMessage}
            sortedConvos={sortedConvos}
            togglePin={togglePin}
            toggleReaction={toggleReaction}
            totalUnread={totalUnread}
          />
        </Modal>
      )}
    </div>
  );
}
