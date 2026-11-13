import type { Profile } from "../login/types";
import type { ProfileUpdateRequest, RequestStatus } from "./types";

export const PROFILE_FIELDS: { key: keyof Profile; label: string }[] = [
  { key: "name", label: "Full Name" },
  { key: "preferredName", label: "Preferred Name" },
  { key: "title", label: "Title" },
  { key: "phone", label: "Phone" },
];

export const changedFields = (req: ProfileUpdateRequest) =>
  PROFILE_FIELDS.filter((f) => req.oldProfile[f.key] !== req.newProfile[f.key]);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Label and pill classes per request status */
export const STATUS_META: Record<RequestStatus, { label: string; className: string }> = {
  pending: { label: "PENDING", className: "bg-primary/10 text-primary" },
  approved: { label: "APPROVED", className: "bg-secondary/10 text-secondary" },
  rejected: { label: "REJECTED", className: "bg-red-50 text-danger" },
};
