import { useActionState, useState } from "react";
import { useLocation, Navigate, type Location } from "react-router";
import CenteredCardLayout from "@components/CenteredCardLayout";
import { cn } from "@lib/cn";
import { inputClass, labelClass, primaryButtonClass } from "@styles/ui";
import { supabase } from "../lib/supabase";
import { useAuth } from "../features/login/useAuth";

const DEMO_ACCOUNTS = [
  ["Admin", "admin@portal.com", "admin123"],
  ["Intern (Maya)", "maya@portal.com", "maya123"],
  ["NorthStar", "priya@portal.com", "priya123"],
];

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

  const demoHint = (
    <div className="mt-4 rounded-xl border bg-primary-light px-4 py-3">
      <div className="mb-1.5 text-2xs font-bold tracking-wider text-primary">DEMO CREDENTIALS</div>
      {DEMO_ACCOUNTS.map(([label, em, pw]) => (
        <button
          key={em}
          onClick={() => {
            setEmail(em);
            setPassword(pw);
          }}
          className="block w-full py-0.5 text-left text-xs">
          <strong>{label}:</strong> {em} / {pw}
        </button>
      ))}
    </div>
  );

  return (
    <CenteredCardLayout title="Intern Portal" subtitle="Sign in to your account" bottom={demoHint}>
      <form action={submit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@portal.com"
            className={cn(inputClass, "w-full")}
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            PASSWORD
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(inputClass, "w-full pr-10")}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-subtle">
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-caption text-danger">{error}</div>
        )}

        <button type="submit" disabled={pending} className={cn(primaryButtonClass, "w-full py-2.5 font-bold")}>
          {pending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-subtle">Don't have access? Contact your program administrator.</p>
    </CenteredCardLayout>
  );
}
