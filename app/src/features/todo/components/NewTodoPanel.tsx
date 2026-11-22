import { useNewTodoForm } from "../hooks";

import Avatar from "@icons/Avatar";
import { cn } from "@lib/cn";
import { inputClass, primaryButtonClass } from "@styles/ui";

import { authUser, TEAM_MEMBERS } from "../mockData";
import type { AssignMode, Todo } from "../types";

interface NewTaskPanelProps {
  addTodo: (todo: Omit<Todo, "id">) => void;
}

/** Ring colour, and fill when selected, for each priority dot */
const PRIORITY_CLASSES = {
  low: { ring: "border-emerald-500", fill: "bg-emerald-500" },
  medium: { ring: "border-amber-500", fill: "bg-amber-500" },
  high: { ring: "border-red-500", fill: "bg-red-500" },
} as const;

/**
 * Renders the input form for new to-do task, includes
 * - mode toggle (self vs. delegate)
 * - text input (task's description)
 * - priority button
 * - team member's dropdown selection (when delegate task to someone else)
 * - assignee input (custom assignee)
 */
export default function NewTodoPanel({ addTodo }: NewTaskPanelProps) {
  // prettier-ignore
  const {
    text, setText,
    priority, setPriority,
    assignMode, setAssignMode,
    delegateTo, setDelegateTo,
    customDelegate, setCustomDelegate ,
    buildTodo, reset
  } = useNewTodoForm(authUser);

  function post() {
    const newTodo = buildTodo();

    if (newTodo) {
      addTodo(newTodo);
      reset();
    }
  }

  return (
    <div className="border-t border-divider px-5 pt-3.5 pb-4.5">
      {/* Mode toggle */}
      <div className="mb-2.5 flex gap-1.5">
        {(["self", "delegate"] as AssignMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setAssignMode(mode)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3.5 py-1 text-sm font-semibold transition-colors",
              assignMode === mode ? "border-primary bg-primary text-white" : "bg-white hover:bg-hover",
            )}>
            {mode === "self" ? (
              <>
                <Avatar name={authUser} size={14} />
                For myself
              </>
            ) : (
              <>
                <span className="text-base">→</span>
                Delegate to someone
              </>
            )}
          </button>
        ))}
      </div>

      {/* Delegate target picker */}
      {assignMode === "delegate" && (
        <div className="mb-2 flex flex-col gap-1.5">
          <select value={delegateTo} onChange={(e) => setDelegateTo(e.target.value)} className={cn(inputClass, "w-full")}>
            <option value="">Select a team member…</option>
            {TEAM_MEMBERS.filter((m) => m !== authUser).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value="__custom__">+ Enter a name…</option>
          </select>
          {delegateTo === "__custom__" && (
            <input
              value={customDelegate}
              onChange={(e) => setCustomDelegate(e.target.value)}
              placeholder="Enter their name"
              className={cn(inputClass, "w-full")}
            />
          )}
        </div>
      )}

      {/* Task input row */}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post()}
          placeholder={assignMode === "self" ? "Add a task for yourself…" : "Describe the task to delegate…"}
          className={cn(inputClass, "min-w-0 flex-1")}
        />

        {/* Priority dots */}
        <div className="flex items-center gap-1.5">
          {(["low", "medium", "high"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              title={`${p} priority`}
              className={cn(
                "size-3.5 rounded-full border-2 transition-colors",
                PRIORITY_CLASSES[p].ring,
                priority === p && PRIORITY_CLASSES[p].fill,
              )}
            />
          ))}
        </div>

        <button onClick={post} className={cn(primaryButtonClass, "shrink-0 whitespace-nowrap")}>
          {assignMode === "self" ? "Add Task" : "Delegate"}
        </button>
      </div>
    </div>
  );
}
