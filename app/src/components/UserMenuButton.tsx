import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

import Avatar from "@icons/Avatar";
import { cn } from "@lib/cn";
import { ROLE_LABELS, ROLE_BADGE_CLASSES } from "../features/login/mockData";
import { supabase } from "../lib/supabase";
import type { User } from "../lib/supabase.types";

interface UserMenuButtonProps {
  currentUser: User;
}

const MENU_ITEM = "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors";

export default function UserMenuButton({ currentUser }: UserMenuButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoading(false);
      alert("Couldn't log out. Please try again.");
      return;
    }
  }

  const isAdmin = currentUser.role === "admin";

  const items = [
    { label: "My Profile", icon: "👤", to: "/profile" },
    // Admins reach Admin and Request History from the sidebar instead
    ...(isAdmin ? [] : [{ label: "Request History", icon: "📋", to: "/history" }]),
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-xl border-2 bg-primary-light px-2.5 py-1",
          menuOpen ? "border-primary" : "border-transparent",
        )}>
        <Avatar name={currentUser.profile?.name ?? currentUser.email} size={28} />
        {/* Name and role are hidden on phones to keep the header on one line */}
        <div className="hidden text-left sm:block">
          <div className="text-sm leading-tight font-semibold">
            {currentUser.profile?.preferredName ?? currentUser.profile?.name ?? currentUser.email}
          </div>
          {currentUser.role && (
            <div className="text-xs tracking-wide text-primary">
              {currentUser.profile?.title ? `${currentUser.profile.title} · ` : ""}
              {ROLE_LABELS[currentUser.role].toUpperCase()}
            </div>
          )}
        </div>
        <span className={cn("ml-0.5 text-2xs transition-transform", menuOpen && "rotate-180")}>▾</span>
      </button>

      {menuOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 min-w-50 overflow-hidden rounded-xl border bg-white shadow-lg">
          {/* Profile info header */}
          <div className="border-b border-divider px-4 pt-3.5 pb-2.5">
            <div className="text-sm font-bold">{currentUser.profile?.name ?? currentUser.email}</div>
            <div className="mt-0.5 text-xs text-muted">{currentUser.email}</div>
            {currentUser.role && (
              <span
                className={cn(
                  "mt-1.5 inline-block rounded-sm px-2 py-0.5 text-2xs font-bold tracking-wider",
                  ROLE_BADGE_CLASSES[currentUser.role],
                )}>
                {ROLE_LABELS[currentUser.role].toUpperCase()}
              </span>
            )}
          </div>

          {/* Menu items */}
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setMenuOpen(false);
                navigate(item.to);
              }}
              className={cn(MENU_ITEM, "hover:bg-hover")}>
              <span className="text-base">{item.icon}</span> {item.label}
            </button>
          ))}

          <div className="border-t border-divider">
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              disabled={loading}
              className={cn(MENU_ITEM, "text-danger hover:bg-red-50")}>
              <span className="text-base">🚪</span> {loading ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
