import type { HourEntry } from "../types";

/**
 * Renders information for each log, include
 * - Number of hours
 * - Log description
 * - Log project
 */
export default function HoursEntry({ entry }: { entry: HourEntry }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-neutral-50 px-2.5 py-1.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-light text-xs font-bold text-primary">
        {entry.hours}h
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{entry.description}</div>
        <div className="mt-px text-xs">{entry.project}</div>
      </div>
    </div>
  );
}
