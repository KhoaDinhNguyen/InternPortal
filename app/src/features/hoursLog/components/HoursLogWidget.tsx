import type { HoursStore } from "../types";
import { useHoursWeek } from "../hooks";
import Card from "@components/Card";
import CardHeader from "@components/CardHeader";
import PostHoursLog from "./PostHoursLog";
import HoursBar from "./HoursBar";
import HoursEntry from "./HoursEntry";
import WeekNavigator from "./WeekNavigator";
import WeeklyRequirement, { ThursdayReminder } from "./WeeklyRequirement";

/** Renders hours log tab, include
 * - Weekly requirement progress (+ a late-week reminder)
 * - Week navigation and the hours bar of the selected week
 * - Display the hours log of selected day
 * - Add new log
 */
interface HoursLogWidgetProps {
  hoursStore: HoursStore;
  /** Admins can change the weekly hours target */
  canSetRequirement?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
}

export default function HoursLogWidget({ hoursStore, canSetRequirement = false, onExpand, onClose }: HoursLogWidgetProps) {
  const { entries, addEntries, weeklyRequirement, setWeeklyRequirement } = hoursStore;
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
    <Card>
      <CardHeader
        title="Hours Log"
        onExpand={onExpand}
        onClose={onClose}
        action={
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-primary">{weekTotal.toFixed(1)}h this week</span>
            <span className="text-2xs text-muted">{allTimeTotal.toFixed(1)}h total</span>
          </div>
        }
      />

      <WeeklyRequirement
        weekTotal={weekTotal}
        requirement={weeklyRequirement}
        canSetRequirement={canSetRequirement}
        setRequirement={setWeeklyRequirement}
      />

      {showReminder && <ThursdayReminder remaining={hoursRemaining} requirement={weeklyRequirement} />}

      <WeekNavigator week={selectedWeek} isCurrentWeek={isCurrentWeek} moveWeek={moveWeek} />

      <HoursBar entries={entries} week={selectedWeek} viewDate={viewDate} setViewDate={setViewDate} />

      {/* Selected day entries */}
      <div className="border-t border-divider px-5 pt-2.5">
        {/** Date display + number of hours  */}
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="tracking-wider">
            {new Date(viewDate + "T12:00:00")
              .toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
              .toUpperCase()}
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
    </Card>
  );
}
