import DocIcon from "@icons/DocIcon";
import DocTypeBadge from "@components/badges/DocTypeBadge";
import type { Doc } from "../types";

/** Renders one document row: icon, title, last updated date and type badge */
export default function DocEntry({ doc }: { doc: Doc }) {
  return (
    <a href={doc.url} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-hover">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-divider">
        <DocIcon />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{doc.title}</div>
        <div className="mt-px text-xs">Updated {doc.updatedAt}</div>
      </div>

      <DocTypeBadge type={doc.type} />
    </a>
  );
}
