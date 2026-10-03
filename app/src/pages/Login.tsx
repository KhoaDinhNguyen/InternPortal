import { useActionState, useState } from "react";
import { useLocation, Navigate, type Location } from "react-router";
import { supabase } from "../lib/supabase";
import colors from "@styles/colors";
import { useAuth } from "../features/login/useAuth";

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

export default function LoginPage() {
  const { user } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [error, submit, pending] = useActionState(async () => {
    const { error } = await supabase.auth.signInWithPassword({ email: email, password: password });

    if (!error) return "";

    return error.status === 403
      ? "Your account hasn't been activated yet. Please contact an administrator."
      : "Incorrect email or password.";
  }, "");

  if (user) {
    const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/";
    return <Navigate to={from} replace />;
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
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo / wordmark */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
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
            Intern Portal
          </div>
          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, color: "#4A6B8A", marginTop: 4 }}>
            Sign in to your account
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #C8DCF0",
            boxShadow: "0 4px 24px rgba(10,26,50,0.08)",
            padding: "32px 32px 28px",
          }}>
          <form action={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label htmlFor="email" style={label}>
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@portal.com"
                style={field}
              />
            </div>
            <div>
              <label htmlFor="password" style={label}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...field, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#8FA5BC",
                    padding: 0,
                  }}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: "#FFF0F0",
                  border: "1px solid #FFCCCC",
                  borderRadius: 8,
                  padding: "9px 13px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 13,
                  color: "#C0392B",
                }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 9,
                border: "none",
                background: colors.MAGENTA,
                color: "#fff",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = colors.MAGENTA_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.background = colors.MAGENTA)}>
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 12,
              color: "#8FA5BC",
            }}>
            Don't have access? Contact your program administrator.
          </div>
        </div>

        {/* Demo hint */}
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "#EBF4FF",
            borderRadius: 10,
            border: "1px solid #C8DCF0",
          }}>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: colors.MAGENTA,
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}>
            DEMO CREDENTIALS
          </div>
          {[
            ["Admin", "admin@portal.com", "admin123"],
            ["Intern (Maya)", "maya@portal.com", "maya123"],
            ["NorthStar", "priya@portal.com", "priya123"],
          ].map(([label, em, pw]) => (
            <button
              key={em}
              onClick={() => {
                setEmail(em);
                setPassword(pw);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "2px 0",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 12,
                color: "#1A1A1A",
              }}>
              <strong>{label}:</strong> {em} / {pw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
