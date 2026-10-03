import type { MockUser, UserRole } from "./types";
import colors from "@styles/colors";

// Single source of truth for the mock backend: credentials, role and profile live together.
// `role: null` means the account exists but hasn't been activated by an admin yet.
export const MOCK_USERS: MockUser[] = [
  { id: "8f1c2a4e-0001", email: "new@portal.com", password: "new123", role: null, profile: null },
  {
    id: "8f1c2a4e-0002",
    email: "admin@portal.com",
    password: "admin123",
    role: "admin",
    profile: { name: "Admin User", preferredName: "Admin", title: "Portal Administrator", phone: "555-000-0000" },
  },
  {
    id: "8f1c2a4e-0003",
    email: "maya@portal.com",
    password: "maya123",
    role: "intern",
    profile: { name: "Maya R.", preferredName: "Maya", title: "Intern", phone: "" },
  },
  {
    id: "8f1c2a4e-0004",
    email: "priya@portal.com",
    password: "priya123",
    role: "northstar",
    profile: { name: "Priya K.", preferredName: "Priya", title: "Program Associate", phone: "" },
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  northstar: "NorthStar",
  intern: "Intern",
};

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  admin: { bg: `${colors.MAGENTA}22`, text: colors.MAGENTA },
  northstar: { bg: `${colors.TERTIARY}22`, text: colors.TERTIARY },
  intern: { bg: `${colors.SECONDARY}22`, text: colors.SECONDARY },
};
