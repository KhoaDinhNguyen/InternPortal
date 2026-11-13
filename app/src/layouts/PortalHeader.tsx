import UserMenuButton from "@components/UserMenuButton";
import type { User } from "../lib/supabase.types";

/** Sticky top bar of the content column: today's date and the account menu */
export default function PortalHeader({ user }: { user: User }) {
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <header className="sticky top-0 z-10 flex h-15 items-center justify-between gap-3 border-b bg-white px-4 md:px-8">
      <div className="text-xs tracking-wider">{dateStr.toUpperCase()}</div>
      <UserMenuButton currentUser={user} />
    </header>
  );
}
