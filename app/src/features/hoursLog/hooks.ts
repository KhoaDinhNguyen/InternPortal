import { useState } from "react";
import type { HourEntry, HoursStore } from "./types";
import { DEFAULT_WEEKLY_REQUIREMENT, INITIAL_HOURS, TODAY } from "./mockData";
import { getWeekDates } from "./utils";

/** `useHoursEntries` controls all hours log entries, include
 * - A list of entries
 * - Add function
 * - The weekly hours requirement (editable by admins)
 */
export function useHoursEntries(): HoursStore {
  const [entries, setEntries] = useState<HourEntry[]>(INITIAL_HOURS);
  const [weeklyRequirement, setRequirement] = useState(DEFAULT_WEEKLY_REQUIREMENT);

  function addEntries(description: string, hours: string, project: string, viewDate: string): boolean {
    const h = parseFloat(hours);
    if (!description.trim() || isNaN(h) || h <= 0) return false;

    setEntries((es) => [...es, { id: Date.now(), date: viewDate, project, description: description.trim(), hours: h }]);

    return true;
  }

  /** Clamps to a non-negative number of hours */
  function setWeeklyRequirement(hours: number) {
    setRequirement(Math.max(0, Number.isFinite(hours) ? hours : 0));
  }

  return { entries, addEntries, weeklyRequirement, setWeeklyRequirement };
}

/**
 * `useHoursWeek` controls which week and day the widget is looking at:
 * - `selectedWeek`: Monday–Friday date keys of the week in view
 * - `viewDate`: the day whose entries are listed (new logs are filed here)
 * - `moveWeek()`: step one week back / forward (never past the current week)
 */
export function useHoursWeek() {
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(TODAY);

  const selectedWeek = getWeekDates(weekAnchor);
  const isCurrentWeek = selectedWeek[0] >= getWeekDates(new Date())[0];

  function moveWeek(direction: -1 | 1) {
    if (direction === 1 && isCurrentWeek) return;

    const next = new Date(weekAnchor);
    next.setDate(next.getDate() + direction * 7);
    setWeekAnchor(next);
    setViewDate(getWeekDates(next)[0]);
  }

  return { selectedWeek, isCurrentWeek, viewDate, setViewDate, moveWeek };
}

/**
 * `usePosHoursLog` manages the input from new entries, include:
 * - A description
 * - An amount of hours
 * - Project types
 *
 * *Note*: the date of log is controlled by the `HoursLogWidge`'s `viewDate`, not by this hook
 */
export function usePostHoursLog() {
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [project, setProject] = useState("Engineering");

  function reset() {
    setDescription("");
    setHours("");
    setProject("Engineering");
  }

  return {
    description, setDescription,
    hours, setHours,
    project, setProject,
    reset
  }
}
