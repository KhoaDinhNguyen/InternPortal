export type UserRole = "admin" | "northstar" | "intern"

export interface AppUser {
  email: string
  password: string
  role: UserRole | null
  profile: {
    name: string
    preferredName: string
    title: string
    phone: string
  } | null
}

export interface User {
  id: string;
  email: string;
}

export interface MockUser extends User {
  password: string;
}