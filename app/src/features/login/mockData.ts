import type { AppUser, UserRole, MockUser } from "./types";
import colors from "@styles/colors";

export const MOCK_USERS: MockUser[] = [
  { id: "8f1c2a4e-0001", email: "new@portal.com", password: "new123" },
  { id: "8f1c2a4e-0002", email: "admin@portal.com", password: "admin123" },
  { id: "8f1c2a4e-0003", email: "maya@portal.com", password: "maya123" },
  { id: "8f1c2a4e-0004", email: "priya@portal.com", password: "priya123" },
]

export const SEED_USERS: AppUser[] = [
  { email: "admin@portal.com", password: "admin123", role: "admin", profile: { name: "Admin User", preferredName: "Admin", title: "Portal Administrator", phone: "555-000-0000" } },
  { email: "maya@portal.com", password: "maya123", role: "intern", profile: null },
  { email: "priya@portal.com", password: "priya123", role: "northstar", profile: null },
  { email: "new@portal.com", password: "new123", role: null, profile: null },
]

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  northstar: "NorthStar",
  intern: "Intern",
}

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  admin: { bg: `${colors.MAGENTA}22`, text: colors.MAGENTA },
  northstar: { bg: `${colors.TERTIARY}22`, text: colors.TERTIARY },
  intern: { bg: `${colors.SECONDARY}22`, text: colors.SECONDARY },
}
