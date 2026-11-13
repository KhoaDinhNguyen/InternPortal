import { cn } from "@lib/cn";
import { formPanelClass, inputClass, primaryButtonClass } from "@styles/ui";
import DateDropdown from "./DateDropdown";
import TimeDropdown from "./TimeDropdown";
import { EVENT_COLORS } from "../mockData";
import { authUser, TEAM_MEMBERS } from "../../../data/team";
import type { RepeatEnds, RepeatFreq } from "../types";
import type { useNewEventForm } from "../hooks";

interface NewEventFormProps {
  form: ReturnType<typeof useNewEventForm>;
  post: () => void;
}

const FREQ_OPTIONS: { id: RepeatFreq; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

const END_OPTIONS: RepeatEnds[] = ["never", "on", "after"];

const LABEL = "mb-1 text-xs font-semibold";

/**
 * Renders the input form for a new event, includes:
 * - title
 * - start and end date + time
 * - repeat toggle, frequency pills and end condition
 * - colour swatches
 * - teammate to share the event with
 */
export default function NewEventForm({ form, post }: NewEventFormProps) {
  return (
    <div className={cn(formPanelClass, "mb-2.5 w-full gap-2.5 overflow-hidden")}>
      {/* Title */}
      <input
        value={form.title}
        onChange={(e) => form.setTitle(e.target.value)}
        placeholder="Event title…"
        className={cn(inputClass, "h-10 w-full py-0")}
      />

      {/* Start */}
      <div className="flex flex-col">
        <div className={LABEL}>Start</div>
        <div className="flex min-w-0 gap-1.5">
          <DateDropdown
            month={form.startMonth}
            day={form.startDay}
            year={form.startYear}
            onChange={(m, d, y) => {
              form.setStartMonth(m);
              form.setStartDay(d);
              form.setStartYear(y);
            }}
          />
          <TimeDropdown value={form.startTime} onChange={form.setStartTime} />
        </div>
      </div>

      {/* End */}
      <div className="flex flex-col">
        <div className={LABEL}>End</div>
        <div className="flex min-w-0 gap-1.5">
          <DateDropdown
            month={form.endMonth}
            day={form.endDay}
            year={form.endYear}
            onChange={(m, d, y) => {
              form.setEndMonth(m);
              form.setEndDay(d);
              form.setEndYear(y);
            }}
          />
          <TimeDropdown value={form.endTime} onChange={form.setEndTime} />
        </div>
      </div>

      {/* Repeat */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => form.setRepeat(!form.repeat)}
          role="switch"
          aria-checked={form.repeat}
          className="flex w-fit items-center gap-2">
          {/* Toggle switch */}
          <span
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full transition-colors",
              form.repeat ? "bg-primary" : "bg-gray-300",
            )}>
            <span
              className={cn(
                "absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all",
                form.repeat ? "left-4.5" : "left-0.5",
              )}
            />
          </span>
          <span className="text-caption font-semibold">Repeat event</span>
        </button>

        {form.repeat && (
          <div className="flex flex-col gap-2 rounded-lg border bg-white px-3 py-2.5">
            {/* Frequency */}
            <div className="flex flex-wrap gap-1.5">
              {FREQ_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => form.setRepeatFreq(f.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                    form.repeatFreq === f.id ? "border-primary bg-primary-light text-primary" : "hover:bg-hover",
                  )}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Ends */}
            <div>
              <div className={cn(LABEL, "mb-1.5")}>Ends</div>
              <div className="flex flex-col gap-1.5 text-caption">
                {END_OPTIONS.map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    {/* Radio button */}
                    <button
                      onClick={() => form.setRepeatEnds(opt)}
                      title={`Ends ${opt}`}
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                        form.repeatEnds === opt ? "border-primary bg-primary" : "border-gray-300",
                      )}>
                      {form.repeatEnds === opt && <span className="size-1.5 rounded-full bg-white" />}
                    </button>

                    {opt === "never" && <span>Never</span>}

                    {opt === "on" && (
                      <div className="flex flex-1 items-center gap-1.5">
                        <span>On</span>
                        <DateDropdown
                          month={form.repeatEndMonth}
                          day={form.repeatEndDay}
                          year={form.repeatEndYear}
                          onChange={(m, d, y) => {
                            form.setRepeatEndMonth(m);
                            form.setRepeatEndDay(d);
                            form.setRepeatEndYear(y);
                            form.setRepeatEnds("on");
                          }}
                        />
                      </div>
                    )}

                    {opt === "after" && (
                      <div className="flex items-center gap-1.5">
                        <span>After</span>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={form.repeatCount}
                          onChange={(e) => {
                            form.setRepeatCount(Math.max(1, +e.target.value));
                            form.setRepeatEnds("after");
                          }}
                          className={cn(inputClass, "w-12 rounded-md px-1.5 py-1 text-center text-caption")}
                        />
                        <span>occurrences</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Colour */}
      <div className="flex items-center gap-1.5">
        <span className={cn(LABEL, "mr-0.5 mb-0")}>Color</span>
        {EVENT_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => form.setColor(c)}
            title={`Use ${c}`}
            className={cn(
              "size-5 shrink-0 rounded-full border-2 transition-colors",
              form.color === c ? "border-ink" : "border-transparent",
            )}
            // Swatch colour comes from the event palette
            style={{ background: c }}
          />
        ))}
      </div>

      {/* Share */}
      <div className="flex flex-col">
        <div className={LABEL}>Also add to teammate's calendar</div>
        <select
          value={form.shareWith}
          onChange={(e) => form.setShareWith(e.target.value)}
          className={cn(inputClass, "w-full")}>
          <option value="">— None —</option>
          {TEAM_MEMBERS.filter((m) => m !== authUser).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {form.shareWith && <p className="mt-1 text-xs text-primary">Event will be shared with {form.shareWith}</p>}
      </div>

      <button onClick={post} className={cn(primaryButtonClass, "w-full")}>
        Save event
      </button>
    </div>
  );
}
