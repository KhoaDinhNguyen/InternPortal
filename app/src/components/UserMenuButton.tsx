import { useState, useRef, useEffect } from "react";

import Avatar from "@icons/Avatar";
import colors from "@styles/colors";
import { ROLE_LABELS, ROLE_COLORS } from "../features/login/mockData";
import { supabase } from "../lib/supabase";
import type { User } from "../lib/supabase.types";

interface UserMenuButtonProps {
  currentUser: User;
}

export default function UserMenuButton({ currentUser }: UserMenuButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "5px 10px",
          borderRadius: 10,
          background: colors.MAGENTA_LIGHT,
          border: `1.5px solid ${menuOpen ? colors.MAGENTA : "transparent"}`,
          cursor: "pointer",
        }}>
        <Avatar name={currentUser.profile?.name ?? currentUser.email} size={28} />
        <div className="user-menu-label" style={{ textAlign: "left" }}>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}>
            {currentUser.profile?.preferredName ?? currentUser.profile?.name ?? currentUser.email}
          </div>
          {currentUser.role && (
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 12,
                color: colors.MAGENTA,
                letterSpacing: "0.04em",
              }}>
              {currentUser.profile?.title ? `${currentUser.profile.title} · ` : ""}
              {ROLE_LABELS[currentUser.role].toUpperCase()}
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: 10,
            color: "#1A1A1A",
            marginLeft: 2,
            transition: "transform 0.2s",
            display: "inline-block",
            transform: menuOpen ? "rotate(180deg)" : "none",
          }}>
          ▾
        </span>
      </button>

      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 200,
            background: "#fff",
            border: "1px solid #C8DCF0",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(10,26,50,0.12)",
            overflow: "hidden",
            zIndex: 50,
          }}>
          {/* Profile info header */}
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #D4E6F5" }}>
            <div
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>
              {currentUser.profile?.name ?? currentUser.email}
            </div>
            <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 12, color: "#4A6B8A", marginTop: 2 }}>
              {currentUser.email}
            </div>
            {currentUser.role && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: ROLE_COLORS[currentUser.role].bg,
                  color: ROLE_COLORS[currentUser.role].text,
                }}>
                {ROLE_LABELS[currentUser.role].toUpperCase()}
              </span>
            )}
          </div>
          {/* Menu items */}
          {[
            {
              label: "My Profile",
              icon: "👤",
              action: () => {
                setMenuOpen(false);
                // onEditProfile();
              },
            },
            ...(isAdmin
              ? [
                  {
                    label: "Admin Dashboard",
                    icon: "⚙️",
                    action: () => {
                      setMenuOpen(false);
                      window.open("/admin", "_blank", "noopener,noreferrer");
                    },
                  },
                ]
              : []),
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 14,
                color: "#1A1A1A",
                textAlign: "left",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F9FF")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontSize: 16 }}>{item.icon}</span> {item.label}
            </button>
          ))}
          <div style={{ borderTop: "1px solid #D4E6F5" }}>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 14,
                color: "#C0392B",
                textAlign: "left",
                transition: "background 0.1s",
              }}
              disabled={loading}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF0F0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontSize: 16 }}>🚪</span> {loading ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
