interface WeeklyRequirementProps {
  weekTotal: number;
  requirement: number;
  /** Admins see an input to change the target instead of the "to go" label */
  canSetRequirement: boolean;
  setRequirement: (hours: number) => void;
}

/**
 * Renders the weekly requirement card:
 * - Hours logged vs. the weekly target
 * - Remaining hours (or an editable target for admins)
 * - Progress bar
 */
export default function WeeklyRequirement({
  weekTotal,
  requirement,
  canSetRequirement,
  setRequirement,
}: WeeklyRequirementProps) {
  const remaining = Math.max(requirement - weekTotal, 0);
  const progress = requirement > 0 ? Math.min((weekTotal / requirement) * 100, 100) : 0;

  return (
    <div className="mx-5 mb-3 rounded-xl border border-secondary/16 bg-secondary/5 px-3 py-3">
      <div className="flex items-center justify-between gap-2.5">
        <div>
          <div className="text-xs font-bold tracking-wider text-secondary">WEEKLY REQUIREMENT</div>
          <div className="mt-1 text-sm">
            <strong>{weekTotal.toFixed(1)}h</strong> of {requirement}h logged
          </div>
        </div>

        {canSetRequirement ? (
          <label className="flex items-center gap-1 text-xs">
            Target
            <input
              aria-label="Weekly hours requirement"
              value={requirement}
              onChange={(e) => setRequirement(Number(e.target.value))}
              type="number"
              min="0"
              max="80"
              step="1"
              className="w-12 rounded-md border border-secondary/35 bg-white px-1 py-1 text-center outline-none focus:border-secondary"
            />
            h
          </label>
        ) : (
          <span className="text-xs font-bold text-secondary">
            {remaining ? `${remaining.toFixed(1)}h to go` : "Target met"}
          </span>
        )}
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-secondary/20">
        {/* Width is the share of the target logged so far */}
        <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/** Late-week nudge shown when the current week's requirement isn't met yet */
export function ThursdayReminder({ remaining, requirement }: { remaining: number; requirement: number }) {
  return (
    <div role="status" className="mx-5 mb-3 rounded-lg border-l-3 border-tertiary bg-tertiary/8 px-3 py-2 text-caption leading-snug">
      <strong>Thursday check-in:</strong> you need {remaining.toFixed(1)} more hours to meet this week’s {requirement}h
      requirement.
    </div>
  );
}
