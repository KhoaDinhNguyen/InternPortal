import type { User } from "../../lib/supabase.types"

export type UserRole = "admin" | "northstar" | "intern";

export interface Profile {
  name: string;
  preferredName: string;
  title: string;
  phone: string;
}

export interface MockUser extends User {
  password: string;
}