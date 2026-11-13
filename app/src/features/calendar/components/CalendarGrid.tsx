import { cn } from "@lib/cn";
import { DAYS } from "../mockData";
import type { CalendarEvent, MonthCell } from "../types";

interface CalendarGridProps {
  cells: MonthCell[];
  events: CalendarEvent[];
  selectedDay: number | null;
  selectDay: (day: number) => void;
  isCurrentMonth: boolean;
  today: Date;
}

/**
 * Renders the month grid
 * - Each day is a button that selects the day shown in the events panel
 * - A dot marks days that already have events
 */
export default function CalendarGrid({ cells, events, selectedDay, selectDay, isCurrentMonth, today }: CalendarGridProps) {
  return (
    <div className="px-4 pb-1.5">
      {/* The day cells are square, so the grid is capped (max-w-80, the width it has
          on the dashboard). Without the cap the cells balloon inside the modal. */}
      <div className="mx-auto max-w-80">
        <div className="mb-1 grid grid-cols-7">
          {DAYS.map((d) => (
            <div key={d} className="py-0.5 text-center text-xs tracking-wider">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} />;

            const isToday = isCurrentMonth && day === today.getDate();
            const isSelected = day === selectedDay;
            const hasEvent = events.some((e) => e.day === day);

            return (
              <button
                key={day}
                onClick={() => selectDay(day)}
                className={cn(
                  "relative flex aspect-square w-full items-center justify-center rounded-md text-sm transition-colors",
                  isSelected
                    ? "bg-primary text-white"
                    : isToday
                      ? "bg-primary-light font-bold text-primary"
                      : "hover:bg-primary-light",
                )}>
                {day}
                {hasEvent && (
                  <span
                    className={cn(
                      "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full",
                      isSelected ? "bg-white/70" : "bg-primary",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
