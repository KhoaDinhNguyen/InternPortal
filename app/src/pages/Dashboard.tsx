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

import { useAuth } from "../features/login/useAuth";

type ExpandedPanel = "todo" | "calendar" | "announcements" | "links" | "docs" | "dms" | "hours" | null;

export default function DashboardPage() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<ExpandedPanel>(null);
  const { anns, pushAnn, openIds, toggleBody, deleteAnn } = useAnnouncements();
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
            <AnnouncementsWidget
              onExpand={() => setExpanded("announcements")}
              anns={anns}
              pushAnn={pushAnn}
              openIds={openIds}
              toggleBody={toggleBody}
              deleteAnn={deleteAnn}
            />
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
          <AnnouncementsWidget
            onClose={() => setExpanded(null)}
            anns={anns}
            pushAnn={pushAnn}
            openIds={openIds}
            toggleBody={toggleBody}
            deleteAnn={deleteAnn}
          />
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
