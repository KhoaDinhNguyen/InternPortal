import CheckIcon from "@icons/CheckIcon";
import PriorityDot from "@icons/PriorityDot";
import Avatar from "@icons/Avatar";
import ArrowIcon from "@icons/ArrowIcon";
import { cn } from "@lib/cn";

import type { Todo } from "../types";

interface TodoViewProps {
  todo: Todo;
  toggleComplete: (id: number) => void;
  authUser: string;
}

const TAG = "rounded-xs px-1.5 py-px text-xs";

/**
 * Renders information for one to-do task:
 * - Checkbox (toggle incomplete/complete)
 * - Task's description
 * - Author and assignee information
 */
export default function TodoView({ todo, toggleComplete, authUser }: TodoViewProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 border-b border-divider py-2.5 transition-opacity",
        todo.done && "opacity-50",
      )}>
      {/* Checkbox */}
      <button
        onClick={() => toggleComplete(todo.id)}
        aria-label={todo.done ? "Mark as not done" : "Mark as done"}
        className={cn(
          "mt-px flex size-4.5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          todo.done ? "border-primary bg-primary" : "border-pink-200",
        )}>
        {todo.done && <CheckIcon size={10} />}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className={cn("leading-snug", todo.done && "line-through")}>{todo.text}</div>

        {/* Assignee / author row */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
          <PriorityDot priority={todo.priority} />
          {todo.delegated ? (
            <>
              <Avatar name={todo.author} size={16} />
              <span>{todo.author === authUser ? "You" : todo.author}</span>
              <span className="flex items-center text-primary">
                <ArrowIcon size={10} />
              </span>
              <Avatar name={todo.assignee} size={16} />
              <span className="font-semibold text-primary">{todo.assignee === authUser ? "You" : todo.assignee}</span>
              {todo.assignee !== authUser && <span className={cn(TAG, "bg-primary-light text-primary")}>DELEGATED</span>}
              {todo.assignee === authUser && todo.author !== authUser && (
                <span className={cn(TAG, "bg-tertiary/13 text-tertiary")}>ASSIGNED TO YOU</span>
              )}
            </>
          ) : (
            <>
              <Avatar name={authUser} size={16} />
              <span>Personal</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
