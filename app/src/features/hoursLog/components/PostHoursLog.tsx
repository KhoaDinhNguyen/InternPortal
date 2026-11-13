import { cn } from "@lib/cn";
import { inputClass, primaryButtonClass } from "@styles/ui";
import { usePostHoursLog } from "../hooks";
import { PROJECTS } from "../mockData";

interface PostHoursLogProps {
  logHours: (description: string, hours: string, project: string) => boolean;
}

/**
 * Renders a form for new log, include
 * - A text area description
 * - A number hour input
 * - A projects' selection
 */
export default function PostHoursLog({ logHours }: PostHoursLogProps) {
  const { description, setDescription, hours, setHours, project, setProject, reset } = usePostHoursLog();

  /** Creates new log, if success, then reset the input */
  const post = () => {
    const success = logHours(description, hours, project);

    if (success) reset();
  };

  return (
    <div className="flex flex-col gap-2 border-t border-divider bg-neutral-50 px-5 pt-3 pb-4.5">
      <div className="flex gap-2">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post()}
          placeholder="What did you work on?"
          className={cn(inputClass, "min-w-0 flex-1")}
        />
        <input
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post()}
          placeholder="hrs"
          type="number"
          min="0.25"
          max="12"
          step="0.25"
          className={cn(inputClass, "w-15 px-2.5 text-center")}
        />
      </div>
      <div className="flex gap-2">
        <select value={project} onChange={(e) => setProject(e.target.value)} className={cn(inputClass, "flex-1")}>
          {PROJECTS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button onClick={post} className={cn(primaryButtonClass, "px-4.5")}>
          Log
        </button>
      </div>
    </div>
  );
}
