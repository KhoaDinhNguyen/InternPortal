import { NavLink } from "react-router";
import { cn } from "@lib/cn";

interface PortalSidebarProps {
  isAdmin: boolean;
  unreadMessages: number;
  openTickets: number;
}

interface NavItem {
  to: string;
  label: string;
  badge?: number;
  /** Screen-reader text for the badge, e.g. "unseen messages" */
  badgeLabel?: string;
}

const NAV_CLASS = "flex overflow-x-auto md:flex-col md:overflow-visible";

/** Sidebar link; NavLink tells us when it matches the current page */
function SidebarLink({ to, label, badge, badgeLabel }: NavItem) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex shrink-0 items-center justify-between border-l-4 border-transparent gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-gray-200 md:w-full",
          isActive ? "font-bold text-primary bg-primary-light border-primary hover:bg-primary-light" : "font-medium",
        )
      }>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          aria-label={`${badge} ${badgeLabel ?? ""}`.trim()}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-2xs font-bold text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

/**
 * Renders the left sidebar:
 * - Portal pages (Dashboard, Direct Messages with unread badge, Hours Log, Organization,
 *   and Tickets last, with an open-ticket badge)
 * - Admin shortcuts, for admins only
 * Below the `md` breakpoint it becomes a horizontal bar above the page.
 */
export default function PortalSidebar({ isAdmin, unreadMessages, openTickets }: PortalSidebarProps) {
  const pages: NavItem[] = [
    { to: "/", label: "Dashboard" },
    { to: "/messages", label: "Direct Messages", badge: unreadMessages, badgeLabel: "unseen messages" },
    { to: "/hours", label: "Hours Log" },
    { to: "/organization", label: "Organization" },
    // Keep Tickets last in the navigation
    { to: "/tickets", label: "Tickets", badge: openTickets, badgeLabel: "open tickets" },
  ];

  const adminPages: NavItem[] = [
    { to: "/admin", label: "Admin" },
    { to: "/history", label: "Request History" },
    { to: "/intern-config", label: "Intern Configuration" },
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-gray-50 md:border-r md:border-b-0 py-4 md:sticky md:top-0 md:h-screen md:w-56 md:py-6">
      <div className="px-2.5 pt-1 pb-3.5 text-l tracking-widest text-primary md:pb-7">Intern Portal</div>

      <nav className={NAV_CLASS}>
        {pages.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      {isAdmin && (
        <nav aria-label="Admin" className={cn(NAV_CLASS, "mt-3 border-t border-gray-300 pt-3 md:mt-5 md:pt-4")}>
          {adminPages.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>
      )}
    </aside>
  );
}
