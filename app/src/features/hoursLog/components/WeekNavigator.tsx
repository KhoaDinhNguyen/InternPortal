import { shortDate } from "../utils";

interface WeekNavigatorProps {
  week: string[];
  isCurrentWeek: boolean;
  moveWeek: (direction: -1 | 1) => void;
}

const BUTTON = "py-1 text-caption font-bold text-primary disabled:text-slate-400";

/** Renders "← Previous  |  Jul 14 – Jul 18  |  Next →"; next is disabled on the current week */
export default function WeekNavigator({ week, isCurrentWeek, moveWeek }: WeekNavigatorProps) {
  return (
    <div className="flex items-center justify-between px-5 pb-2">
      <button onClick={() => moveWeek(-1)} aria-label="View previous week" className={BUTTON}>
        ← Previous
      </button>
      <span className="text-xs font-semibold text-muted">
        {shortDate(week[0])} – {shortDate(week[4])}
      </span>
      <button onClick={() => moveWeek(1)} aria-label="View next week" disabled={isCurrentWeek} className={BUTTON}>
        Next →
      </button>
    </div>
  );
}
