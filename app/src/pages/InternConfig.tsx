import { useState } from "react";
import Avatar from "@icons/Avatar";
import { cn } from "@lib/cn";
import { inputClass, primaryButtonClass, sectionCardClass, tableHeadClass } from "@styles/ui";
import { MAX_WEEKLY_HOURS } from "../lib/internConfigApi";
import { useInternConfig } from "../features/internConfig/hooks";

const CELL = "px-5 py-3";
const CHECKBOX = "size-4 cursor-pointer accent-primary";

/**
 * Admin-only Intern Configuration page:
 * - List of interns, filterable by name (or email, for interns without a profile yet)
 * - Tick one or more interns, then set how many hours per week they must log
 */
export default function InternConfigPage() {
  const { interns, loading, error, setWeeklyHours } = useInternConfig();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hours, setHours] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q
    ? interns.filter((i) => i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q))
    : interns;

  const visibleSelected = visible.filter((i) => selected.has(i.id)).length;
  const allVisibleSelected = visible.length > 0 && visibleSelected === visible.length;

  const parsedHours = Number(hours);
  const hoursValid = hours.trim() !== "" && Number.isFinite(parsedHours) && parsedHours >= 0 && parsedHours <= MAX_WEEKLY_HOURS;
  const canApply = selected.size > 0 && hoursValid && !saving;

  function toggle(id: string) {
    setSaved("");
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /** Header checkbox: selects / clears every intern matching the current filter */
  function toggleAllVisible() {
    setSaved("");
    setSelected((s) => {
      const next = new Set(s);
      visible.forEach((i) => (allVisibleSelected ? next.delete(i.id) : next.add(i.id)));
      return next;
    });
  }

  async function apply() {
    if (!canApply) return;

    setSaving(true);
    const count = selected.size;
    const ok = await setWeeklyHours([...selected], parsedHours);
    setSaving(false);

    if (ok) {
      setSaved(`Set ${parsedHours}h/week for ${count} intern${count === 1 ? "" : "s"}.`);
      setSelected(new Set());
      setHours("");
    }
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="px-5 pt-4.5">
        <h1 className="text-xl font-extrabold">Intern Configuration</h1>
        <p className="mt-1 text-sm text-muted">Set how many hours per week each intern must log.</p>
      </div>

      <div className={sectionCardClass}>
        {/* Filter + bulk action bar */}
        <div className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name…"
            aria-label="Filter interns by name"
            className={cn(inputClass, "w-full lg:w-72")}
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("text-caption", selected.size ? "font-semibold text-primary" : "text-muted")}>
              {selected.size ? `${selected.size} selected` : "Select interns to set hours"}
            </span>
            <label className="flex items-center gap-1.5 text-caption">
              <input
                type="number"
                min={0}
                max={MAX_WEEKLY_HOURS}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && apply()}
                placeholder="e.g. 20"
                aria-label="Weekly hours"
                className={cn(inputClass, "w-24 text-center")}
              />
              h / week
            </label>
            <button type="button" onClick={apply} disabled={!canApply} className={primaryButtonClass}>
              {saving ? "Saving…" : "Apply"}
            </button>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="px-1 text-caption font-semibold text-muted hover:text-primary">
                Clear
              </button>
            )}
          </div>
        </div>

        {hours.trim() !== "" && !hoursValid && (
          <p className="px-5 pt-2.5 text-caption text-danger">Enter between 0 and {MAX_WEEKLY_HOURS} hours.</p>
        )}
        {error && <p className="px-5 pt-2.5 text-caption text-danger">{error}</p>}
        {saved && <p className="px-5 pt-2.5 text-caption font-semibold text-secondary">✓ {saved}</p>}

        {loading || visible.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-subtle">
            {loading ? "Loading…" : interns.length === 0 ? "No intern accounts yet" : `No interns match "${query.trim()}"`}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={cn(tableHeadClass, "w-12")}>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = visibleSelected > 0 && !allVisibleSelected;
                      }}
                      onChange={toggleAllVisible}
                      aria-label="Select all shown interns"
                      className={CHECKBOX}
                    />
                  </th>
                  <th className={tableHeadClass}>INTERN</th>
                  <th className={tableHeadClass}>TITLE</th>
                  <th className={cn(tableHeadClass, "text-right")}>WEEKLY HOURS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider text-caption">
                {visible.map((intern) => {
                  const isSelected = selected.has(intern.id);
                  const label = intern.name || intern.email;

                  return (
                    <tr
                      key={intern.id}
                      onClick={() => toggle(intern.id)}
                      className={cn("cursor-pointer transition-colors", isSelected ? "bg-primary-light" : "hover:bg-hover")}>
                      <td className={CELL}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggle(intern.id)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${label}`}
                          className={CHECKBOX}
                        />
                      </td>
                      <td className={CELL}>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={label} size={28} />
                          <div className="min-w-0">
                            <div className="font-semibold">{intern.name || <span className="text-subtle">No profile yet</span>}</div>
                            <div className="text-2xs text-muted">{intern.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className={cn(CELL, "text-muted")}>{intern.title || "—"}</td>
                      <td className={cn(CELL, "text-right font-bold whitespace-nowrap text-primary")}>
                        {intern.weeklyHours}h
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
