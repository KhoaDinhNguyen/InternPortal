import { cn } from "@lib/cn";
import { inputClass, primaryButtonClass } from "@styles/ui";
import { useNewQuickLinkForm } from "../hooks";

interface AddQuickLinkFormProps {
  addLink: (label: string, url: string) => boolean;
}

const SMALL_INPUT = cn(inputClass, "rounded-md px-2 py-1.5 text-xs");

/**
 * Renders the "Add quick link" button at the end of the nav bar, which turns
 * into an inline form (short name + url) while adding.
 */
export default function AddQuickLinkForm({ addLink }: AddQuickLinkFormProps) {
  const { adding, setAdding, label, setLabel, url, setUrl, reset } = useNewQuickLinkForm();

  function save() {
    if (addLink(label, url)) reset();
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="rounded-lg border border-dashed border-subtle px-2.5 py-2 text-caption font-bold text-primary hover:bg-primary-light">
        Add quick link
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-0.5 py-1">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        aria-label="Quick link name"
        placeholder="Short name"
        className={cn(SMALL_INPUT, "w-28")}
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        aria-label="Quick link URL"
        placeholder="URL"
        className={cn(SMALL_INPUT, "w-40")}
      />
      <button onClick={save} className={cn(primaryButtonClass, "rounded-md px-2.5 py-1.5 text-xs font-bold")}>
        Save
      </button>
      <button onClick={reset} className="px-1 py-1.5 text-xs text-muted">
        Cancel
      </button>
    </div>
  );
}
