import { cn } from "@lib/cn";
import type { HourEntry } from "../types";
import { DAY_LABELS, TODAY } from "../mockData";

interface HoursBarProps {
  entries: HourEntry[];
  /** Monday–Friday date keys of the week in view */
  week: string[];
  viewDate: string;
  setViewDate: (d: string) => void;
}

/** Height of the tallest bar, in px */
const BAR_HEIGHT = 40;

/**
 * Renders bar column for numbers of hours in the selected week
 * - Each bar is also a button to select the `viewDate`
 */
export default function HoursBar({ entries, week, viewDate, setViewDate }: HoursBarProps) {
  const weekBars = week.map((date, i) => {
    const total = entries.filter((e) => e.date === date).reduce((s, e) => s + e.hours, 0);
    return { date, label: DAY_LABELS[i] ?? "—", total, isToday: date === TODAY, isSelected: date === viewDate };
  });

  const maxBar = Math.max(...weekBars.map((b) => b.total), 8);

  return (
    <div className="flex items-end gap-1.5 px-5 pb-3.5">
      {weekBars.map((bar) => (
        <button key={bar.date} onClick={() => setViewDate(bar.date)} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-full items-end">
            <div
              className={cn(
                "w-full rounded-t transition-all",
                bar.isSelected ? "bg-primary" : bar.isToday ? "bg-primary/35" : "bg-line",
              )}
              // Bar height is proportional to the hours logged that day
              style={{ height: bar.total > 0 ? Math.round((bar.total / maxBar) * BAR_HEIGHT) : 3 }}
            />
          </div>
          <span className={cn("text-xs", bar.isSelected && "text-primary", bar.isToday && "font-bold")}>
            {bar.label}
          </span>
        </button>
      ))}
    </div>
  );
}
