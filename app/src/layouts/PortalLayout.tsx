import { Outlet } from "react-router";
import { useAuth } from "../features/login/useAuth";
import PortalHeader from "./PortalHeader";
import PortalSidebar from "./PortalSidebar";
import { usePortalStores } from "./usePortalStores";

/**
 * Shell for the signed-in portal pages: sidebar on the left (a top bar on
 * small screens), header + page on the right. Pages read the shared feature
 * stores with `usePortal()`.
 */
export default function PortalLayout() {
  const { user } = useAuth();
  const stores = usePortalStores();

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <PortalSidebar
        isAdmin={user.role === "admin"}
        unreadMessages={stores.dms.totalUnread}
        openTickets={stores.tickets.openCount}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <PortalHeader user={user} />
        {/* flex column so a page can fill the remaining height with flex-1 (Messages does) */}
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-2 py-4">
          <Outlet context={stores} />
        </main>
      </div>
    </div>
  );
}
