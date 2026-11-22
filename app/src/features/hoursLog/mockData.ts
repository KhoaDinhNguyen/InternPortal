import type { HourEntry } from "./types";
import { getWeekDates } from "./utils";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const TODAY = new Date().toISOString().slice(0, 10);

export const thisWeek = getWeekDates(new Date());
const lastWeek = getWeekDates(new Date(Date.now() - WEEK_MS));
const twoWeeksAgo = getWeekDates(new Date(Date.now() - 2 * WEEK_MS));

export const INITIAL_HOURS: HourEntry[] = [
  { id: 101, date: twoWeeksAgo[0], project: "Onboarding", description: "Orientation and program overview", hours: 4 },
  { id: 102, date: twoWeeksAgo[1], project: "Engineering", description: "Shadowed the platform team", hours: 5.5 },
  { id: 103, date: twoWeeksAgo[3], project: "Learning", description: "Completed technical onboarding modules", hours: 6.5 },
  { id: 104, date: lastWeek[0], project: "Engineering", description: "Paired on the account settings flow", hours: 5 },
  { id: 105, date: lastWeek[2], project: "Team Meetings", description: "Design critique and sprint planning", hours: 3.5 },
  { id: 106, date: lastWeek[4], project: "Engineering", description: "Resolved onboarding portal UI issues", hours: 7.5 },
  { id: 1, date: thisWeek[0], project: "Onboarding", description: "Completed HR paperwork and IT setup", hours: 3 },
  { id: 2, date: thisWeek[0], project: "Team Meetings", description: "Intern kickoff session", hours: 1.5 },
  { id: 3, date: thisWeek[1], project: "Engineering", description: "Reviewed codebase and style guidelines", hours: 4 },
  { id: 4, date: thisWeek[1], project: "Team Meetings", description: "Mentor 1:1 intro call", hours: 0.5 },
  { id: 5, date: TODAY, project: "Engineering", description: "Set up local dev environment", hours: 2.5 },
]

export const PROJECTS = ["Engineering", "Design", "Product", "Research", "Learning", "Onboarding", "Team Meetings", "Admin", "Other"]

export const DAY_LABELS: Record<string, string> = { 0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri" }

/** Weekly target for interns an admin hasn't configured yet (see Intern Configuration) */
export const DEFAULT_WEEKLY_REQUIREMENT = 16
