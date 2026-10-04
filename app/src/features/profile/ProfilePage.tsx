import { useState } from "react";
import { useNavigate } from "react-router";
import colors from "@styles/colors";
import { supabase } from "../../lib/supabase";
import type { User } from "../../lib/supabase.types";
import { ROLE_COLORS, ROLE_LABELS } from "../login/mockData";
import { useAuth } from "../login/useAuth";
import { requestsApi } from "../../lib/requestsApi";

type Field = "name" | "phone" | "form";

const field: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1.5px solid #C8DCF0",
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: 14,
  color: "#1A1A1A",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

const label: React.CSSProperties = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "#1A1A1A",
  letterSpacing: "0.04em",
  display: "block",
  marginBottom: 6,
};

const errorText: React.CSSProperties = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: 12,
  color: "#C0392B",
  marginTop: 4,
};

const required = <span style={{ color: "#C0392B" }}>*</span>;

export default function ProfilePage() {
  const { user } = useAuth();

  // ProtectedRoute guarantees a user; this only narrows the type
  return user ? <ProfileForm user={user} /> : null;
}

function ProfileForm({ user }: { user: User }) {
  const navigate = useNavigate();

  // Captured once: after the first save `user.profile` becomes non-null,
  // and the heading shouldn't flip to "Edit" during the redirect
  const [isEditing] = useState(!!user.profile);
  const [name, setName] = useState(user.profile?.name ?? "");
  const [preferredName, setPreferredName] = useState(user.profile?.preferredName ?? "");
  const [title, setTitle] = useState(user.profile?.title ?? "");
  const [phone, setPhone] = useState(user.profile?.phone ?? "");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [saving, setSaving] = useState(false);
  const needsApproval = isEditing && user.role !== "admin";
  const [submitted, setSubmitted] = useState(false);

  const roleInfo = user.role ? ROLE_COLORS[user.role] : null;

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const next: typeof errors = {};
    if (!name.trim()) next.name = "Full name is required";
    if (!phone.trim()) next.phone = "Phone number is required";
    if (Object.keys(next).length) return setErrors(next);

    const profile = {
      name: name.trim(),
      preferredName: preferredName.trim() || name.trim().split(" ")[0],
      title: title.trim(),
      phone: phone.trim(),
    };

    setSaving(true);

    const { error } = needsApproval
      ? await requestsApi.submitProfileUpdate(profile)
      : await supabase.auth.updateUser({ profile });

    setSaving(false);

    if (error) return setErrors({ form: error.message });

    if (needsApproval) {
      setSubmitted(true);
      setTimeout(() => navigate("/", { replace: true }), 1200);
      return;
    }

    navigate("/", { replace: true });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {isEditing && (
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: colors.MAGENTA,
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            ← Back to Dashboard
          </button>
        )}

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: colors.MAGENTA,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}>
            <span style={{ fontSize: 26, color: "#fff" }}>✦</span>
          </div>
          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 800, fontSize: 22, color: "#1A1A1A" }}>
            {needsApproval ? "Update Your Profile" : isEditing ? "Edit Your Profile" : "Complete Your Profile"}
          </div>
          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, color: "#4A6B8A", marginTop: 4 }}>
            {needsApproval
              ? "Changes require admin approval before going live."
              : isEditing
                ? "Update your information below."
                : "Welcome! Tell us a bit about yourself before continuing."}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #C8DCF0",
            boxShadow: "0 4px 24px rgba(10,26,50,0.08)",
            padding: 32,
          }}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Role display (read-only) */}
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: roleInfo ? roleInfo.bg : "#F5F5F5",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
              <span
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  color: roleInfo ? roleInfo.text : "#666",
                }}>
                YOUR ROLE
              </span>
              <span
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: roleInfo ? roleInfo.text : "#666",
                }}>
                {user.role ? ROLE_LABELS[user.role] : "—"}
              </span>
              <span
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 11,
                  color: "#8FA5BC",
                  marginLeft: "auto",
                }}>
                Set by administrator
              </span>
            </div>

            <div>
              <label htmlFor="profile-name" style={label}>
                FULL NAME {required}
              </label>
              <input
                id="profile-name"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((ev) => ({ ...ev, name: "" }));
                }}
                placeholder="Jordan Lee"
                style={{ ...field, borderColor: errors.name ? "#FFCCCC" : "#C8DCF0" }}
              />
              {errors.name && <div style={errorText}>{errors.name}</div>}
            </div>

            <div>
              <label htmlFor="profile-preferred" style={label}>
                PREFERRED NAME
              </label>
              <input
                id="profile-preferred"
                autoComplete="nickname"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="Jordan (optional)"
                style={field}
              />
            </div>

            <div>
              <label htmlFor="profile-title" style={label}>
                TITLE / TEAM
              </label>
              <input
                id="profile-title"
                autoComplete="organization-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineering Intern"
                style={field}
              />
            </div>

            <div>
              <label htmlFor="profile-phone" style={label}>
                PHONE NUMBER {required}
              </label>
              <input
                id="profile-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((ev) => ({ ...ev, phone: "" }));
                }}
                placeholder="555-123-4567"
                style={{ ...field, borderColor: errors.phone ? "#FFCCCC" : "#C8DCF0" }}
              />
              {errors.phone && <div style={errorText}>{errors.phone}</div>}
            </div>

            {errors.form && <div style={errorText}>{errors.form}</div>}

            {submitted ? (
              <div
                style={{
                  padding: 13,
                  borderRadius: 9,
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  textAlign: "center",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 14,
                  color: "#15803D",
                  fontWeight: 600,
                }}>
                ✓ Update request submitted — redirecting…
              </div>
            ) : (
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%",
                  padding: 11,
                  borderRadius: 9,
                  border: "none",
                  background: colors.MAGENTA,
                  color: "#fff",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: saving ? "default" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.MAGENTA_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.background = colors.MAGENTA)}>
                {saving
                  ? "Saving…"
                  : needsApproval
                    ? "Submit for Approval →"
                    : isEditing
                      ? "Save Changes"
                      : "Save & Continue to Portal →"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
