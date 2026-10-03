import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import colors from "@styles/colors";
import { SEED_USERS } from "../features/login/mockData";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function attempt() {
    if (loading) return;

    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setError("Incorrect email or password.");
      return;
    }

    const found = SEED_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found?.role) {
      setError("Your account hasn't been activated yet. Please contact an administrator.");
      setLoading(false);
      return;
    }

    setError("");
    setLoading(false);

    navigate("/");
  }

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
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1A1A1A",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: 6,
                }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && attempt()}
                placeholder="you@portal.com"
                style={field}
              />
            </div>
            <div>
              <label
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1A1A1A",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: 6,
                }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && attempt()}
                  placeholder="••••••••"
                  style={{ ...field, paddingRight: 40 }}
                />
                <button
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
              onClick={attempt}
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
              Sign In
            </button>
          </div>

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
                setError("");
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
