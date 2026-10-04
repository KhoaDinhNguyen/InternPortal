import type { Profile } from "../login/types";

export type RequestStatus = "pending" | "approved" | "rejected";
export type ReviewDecision = Exclude<RequestStatus, "pending">;

export interface ProfileUpdateRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  submittedAt: string;
  status: RequestStatus;
  oldProfile: Profile;
  newProfile: Profile;
  reviewedAt?: string;
  adminNote?: string;
}

export interface UserNotification {
  /** Numeric so it can be shown through the existing Announcement widget */
  id: number;
  userId: string;
  kind: ReviewDecision;
  title: string;
  body: string;
  createdAt: string;
}
