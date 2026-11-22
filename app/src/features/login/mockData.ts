import type { MockUser, UserRole } from "./types";

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
    profile: null
  },
  {
    id: "8f1c2a4e-0004",
    email: "priya@portal.com",
    password: "priya123",
    role: "northstar",
    profile: null,
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  northstar: "NorthStar",
  intern: "Intern",
};

/** Badge classes per role (border colour is used by the admin role picker) */
export const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  admin: "border-primary bg-primary/13 text-primary",
  northstar: "border-tertiary bg-tertiary/13 text-tertiary",
  intern: "border-secondary bg-secondary/13 text-secondary",
};
