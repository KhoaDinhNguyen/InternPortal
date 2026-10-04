import colors from "@styles/colors";
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

export const STATUS_META: Record<RequestStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "PENDING", bg: `${colors.MAGENTA}18`, text: colors.MAGENTA },
  approved: { label: "APPROVED", bg: `${colors.SECONDARY}18`, text: colors.SECONDARY },
  rejected: { label: "REJECTED", bg: "#FFEEEE", text: "#C0392B" },
};
