import { useState } from "react";
import { useNavigate } from "react-router";
import CenteredCardLayout from "@components/CenteredCardLayout";
import { cn } from "@lib/cn";
import { inputClass, labelClass, primaryButtonClass } from "@styles/ui";
import { supabase } from "../../lib/supabase";
import type { User } from "../../lib/supabase.types";
import { ROLE_BADGE_CLASSES, ROLE_LABELS } from "../login/mockData";
import { useAuth } from "../login/useAuth";
import { requestsApi } from "../../lib/requestsApi";

type Field = "name" | "phone" | "form";

const required = <span className="text-danger">*</span>;

/** Input classes, with a red border when the field has an error */
const fieldClass = (hasError?: boolean) => cn(inputClass, "w-full", hasError && "border-red-200");

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

    const { error } = needsApproval ? await requestsApi.submitProfileUpdate(profile) : await supabase.auth.updateUser({ profile });

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
    <CenteredCardLayout
      widthClass="max-w-120"
      title={needsApproval ? "Update Your Profile" : isEditing ? "Edit Your Profile" : "Complete Your Profile"}
      subtitle={
        needsApproval
          ? "Changes require admin approval before going live."
          : isEditing
            ? "Update your information below."
            : "Welcome! Tell us a bit about yourself before continuing."
      }>
      <form onSubmit={submit} className="flex flex-col gap-4.5">
        {/* Role display (read-only) */}
        <div
          className={cn("flex items-center gap-2.5 rounded-lg px-3.5 py-2.5", user.role ? ROLE_BADGE_CLASSES[user.role] : "bg-neutral-100 text-neutral-500")}>
          <span className="text-xs font-semibold tracking-wider">YOUR ROLE</span>
          <span className="text-sm font-bold">{user.role ? ROLE_LABELS[user.role] : "—"}</span>
          <span className="ml-auto text-2xs text-subtle">Set by administrator</span>
        </div>

        <div>
          <label htmlFor="profile-name" className={labelClass}>
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
            className={fieldClass(!!errors.name)}
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="profile-preferred" className={labelClass}>
            PREFERRED NAME
          </label>
          <input
            id="profile-preferred"
            autoComplete="nickname"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            placeholder="Jordan (optional)"
            className={fieldClass()}
          />
        </div>

        <div>
          <label htmlFor="profile-title" className={labelClass}>
            TITLE / TEAM
          </label>
          <input
            id="profile-title"
            autoComplete="organization-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Software Engineering Intern"
            className={fieldClass()}
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className={labelClass}>
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
            className={fieldClass(!!errors.phone)}
          />
          {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
        </div>

        {errors.form && <p className="text-xs text-danger">{errors.form}</p>}

        {submitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm font-semibold text-green-700">
            ✓ Update request submitted — redirecting…
          </div>
        ) : (
          <button type="submit" disabled={saving} className={cn(primaryButtonClass, "w-full py-2.5 font-bold")}>
            {saving ? "Saving…" : needsApproval ? "Submit for Approval →" : isEditing ? "Save Changes" : "Save & Continue to Portal →"}
          </button>
        )}
      </form>
    </CenteredCardLayout>
  );
}
