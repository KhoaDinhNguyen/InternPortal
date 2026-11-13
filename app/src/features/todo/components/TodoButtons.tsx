import { cn } from "@lib/cn";
import { dismissButtonClass, toggleChipClass } from "@styles/ui";
import type { FilterConfig, TodoFilter } from "../types";

interface FilterButtonProps {
  filter: string;
  filterConfig: FilterConfig;
  setFilter: (id: TodoFilter) => void;
}

export function FilterButton({ filter, filterConfig, setFilter }: FilterButtonProps) {
  const active = filter === filterConfig.id;

  return (
    <button
      onClick={() => setFilter(filterConfig.id)}
      className={cn(toggleChipClass(active), "flex items-center gap-1 px-3 font-medium")}>
      {filterConfig.label}
      {/* If the filter includes statistics summaries (like # of delegated tasks), display it */}
      {filterConfig.count !== undefined && filterConfig.count > 0 && (
        <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-primary text-white" : "bg-line")}>
          {filterConfig.count}
        </span>
      )}
    </button>
  );
}

export function DismissCompleteButton({ dismiss }: { dismiss: () => void }) {
  return (
    <div className="flex justify-end border-b border-divider px-5 py-1.5">
      <button onClick={dismiss} className={dismissButtonClass}>
        Dismiss completed
      </button>
    </div>
  );
}
