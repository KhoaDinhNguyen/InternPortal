import type { HoursStore } from "../types";
import { useHoursWeek } from "../hooks";
import PostHoursLog from "./PostHoursLog";
import HoursBar from "./HoursBar";
import HoursEntry from "./HoursEntry";
import WeekNavigator from "./WeekNavigator";
import WeeklyRequirement, { ThursdayReminder } from "./WeeklyRequirement";

interface HoursLogWidgetProps {
  hoursStore: HoursStore;
}

/**
 * Full-width Hours Log page content (no card frame, like Organization):
 * - Heading with this week's and all-time totals
 * - Left: weekly requirement progress (+ late-week reminder), week navigation, hours bar
 * - Right: the selected day's entries and the form to log new hours
 * The two columns stack below the `lg` breakpoint.
 */
export default function HoursLogWidget({ hoursStore }: HoursLogWidgetProps) {
  const { entries, addEntries, weeklyRequirement } = hoursStore;
  const { selectedWeek, isCurrentWeek, viewDate, setViewDate, moveWeek } = useHoursWeek();

  const dayEntries = entries.filter((e) => e.date === viewDate);
  const dayTotal = dayEntries.reduce((s, e) => s + e.hours, 0);
  const weekTotal = entries.filter((e) => selectedWeek.includes(e.date)).reduce((s, e) => s + e.hours, 0);
  const allTimeTotal = entries.reduce((s, e) => s + e.hours, 0);
  const throughSelectedDay = entries.filter((e) => e.date <= viewDate).reduce((s, e) => s + e.hours, 0);

  const hoursRemaining = Math.max(weeklyRequirement - weekTotal, 0);
  // Thursday through Saturday of the current week, while the target isn't met yet
  const weekday = new Date().getDay();
  const showReminder = weekday >= 4 && weekday <= 6 && isCurrentWeek && hoursRemaining > 0;

  function logHours(description: string, hours: string, project: string) {
    return addEntries(description, hours, project, viewDate);
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-2 px-5 pt-4.5 pb-4">
        <h1 className="text-xl font-extrabold">Hours Log</h1>
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-primary">{weekTotal.toFixed(1)}h this week</span>
          <span className="text-xs text-muted">{allTimeTotal.toFixed(1)}h total</span>
        </div>
      </div>

      <div>
        {/* Week overview */}
        <div>
          <WeeklyRequirement weekTotal={weekTotal} requirement={weeklyRequirement} />

          {showReminder && <ThursdayReminder remaining={hoursRemaining} requirement={weeklyRequirement} />}

          <WeekNavigator week={selectedWeek} isCurrentWeek={isCurrentWeek} moveWeek={moveWeek} />

          <HoursBar entries={entries} week={selectedWeek} viewDate={viewDate} setViewDate={setViewDate} />
        </div>

        {/* Selected day entries + log form */}
        <div className="flex flex-col border-t border-divider lg:border-t-0 lg:border-l">
          <div className="flex-1 px-5 pt-2.5">
            {/** Date display + number of hours  */}
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="tracking-wider">
                {new Date(viewDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).toUpperCase()}
              </span>
              <span className="font-semibold text-primary">{dayTotal.toFixed(1)}h</span>
            </div>

            {!dayEntries.length ? (
              <p className="pt-2 pb-3 text-center text-sm">No hours logged for this day</p>
            ) : (
              <div className="mb-3 flex flex-col gap-0.5">
                {dayEntries.map((e) => (
                  <HoursEntry entry={e} key={e.id} />
                ))}
              </div>
            )}

            {/** Running total up to and including the selected day */}
            <div className="flex justify-between gap-2.5 border-t border-divider pt-2 pb-3 text-xs text-muted">
              <span>Total through this day</span>
              <strong className="text-primary">{throughSelectedDay.toFixed(1)}h logged to date</strong>
            </div>
          </div>

          <PostHoursLog logHours={logHours} />
        </div>
      </div>
    </div>
  );
}
