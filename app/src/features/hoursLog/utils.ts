/** `YYYY-MM-DD` key used to match entries to days */
export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Returns the Monday–Friday date keys of the week containing `anchor`.
 * Dates are pinned to noon so the UTC conversion in `dateKey` never shifts a day.
 */
export function getWeekDates(anchor: Date) {
  const monday = new Date(anchor);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(12, 0, 0, 0);

  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return dateKey(date);
  });
}

/** Formats a date key as e.g. "Jul 18" */
export function shortDate(key: string) {
  return new Date(key + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
