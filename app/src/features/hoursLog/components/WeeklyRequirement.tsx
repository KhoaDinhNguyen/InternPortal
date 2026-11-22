interface WeeklyRequirementProps {
  weekTotal: number;
  requirement: number;
}

/**
 * Renders the weekly requirement card:
 * - Hours logged vs. the weekly target
 * - Remaining hours (admins set the target per intern on Intern Configuration)
 * - Progress bar
 */
export default function WeeklyRequirement({ weekTotal, requirement }: WeeklyRequirementProps) {
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

        <span className="text-xs font-bold text-secondary">
          {remaining ? `${remaining.toFixed(1)}h to go` : "Target met"}
        </span>
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
