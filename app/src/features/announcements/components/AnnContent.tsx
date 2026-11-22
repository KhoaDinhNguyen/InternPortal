import type { Announcement } from "../types";
import TagBadge from "@components/badges/TagBadge";
import { cn } from "@lib/cn";
import { dismissButtonClass } from "@styles/ui";

interface AnnContentProps {
  ann: Announcement;
  toggleAnnBody: (id: number) => void;
  openIds: Set<number>;
  deleteAnn: (id: number) => void;
}

/** Pinned notices: profile decisions green/red, ticket alerts pink, resolved tickets green */
const NOTICE_CLASSES: Record<string, { row: string; chevron: string }> = {
  Approved: { row: "bg-secondary/7", chevron: "text-secondary" },
  Rejected: { row: "bg-red-50", chevron: "text-danger" },
  Ticket: { row: "bg-tertiary/7", chevron: "text-tertiary" },
  Resolved: { row: "bg-secondary/7", chevron: "text-secondary" },
};

/* Renders the content of the annoucement
- Title
- Body (only when the user expand the announcement)
- delete function
*/
export default function AnnContent({ ann, toggleAnnBody, openIds, deleteAnn }: AnnContentProps) {
  const notice = NOTICE_CLASSES[ann.tag];
  const isOpen = openIds.has(ann.id);

  return (
    <div className={cn("border-b border-divider", notice?.row)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => toggleAnnBody(ann.id)}
        onKeyDown={(e) => e.key === "Enter" && toggleAnnBody(ann.id)}
        className={cn("flex items-start gap-2.5 px-5 py-3 text-left transition-colors", !notice && "hover:bg-hover")}>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <TagBadge label={ann.tag} />
            <span className="text-xs tracking-wide">{ann.date}</span>
          </div>
          <div className="leading-snug font-semibold">{ann.title}</div>
        </div>
        <span
          className={cn(
            "mt-px shrink-0 text-lg leading-none transition-transform",
            notice?.chevron ?? "text-primary",
            isOpen ? "-rotate-90" : "rotate-90",
          )}>
          ›
        </span>
      </div>

      {isOpen && (
        <div className="px-5 pb-3.5">
          {ann.body && <p className="mb-2.5 text-sm leading-relaxed">{ann.body}</p>}
          <button onClick={() => deleteAnn(ann.id)} className={dismissButtonClass}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
