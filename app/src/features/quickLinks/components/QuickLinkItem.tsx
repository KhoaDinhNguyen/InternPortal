import CloseIcon from "@icons/CloseIcon";
import type { QuickLink } from "../types";

interface QuickLinkItemProps {
  link: QuickLink;
  onRemove: (id: number) => void;
}

/**
 * Renders one shortcut in the nav bar
 * - Placeholder links (`#`) stay in the same tab, real links open a new one
 * - Hovering shows a small remove button in the corner (`group-hover`)
 */
export default function QuickLinkItem({ link, onRemove }: QuickLinkItemProps) {
  const isPlaceholder = link.url === "#";

  return (
    <div className="group relative flex items-center rounded-lg border py-1.5 pr-1.5 pl-2 transition-colors border-primary/50">
      <a
        href={link.url}
        target={isPlaceholder ? undefined : "_blank"}
        rel={isPlaceholder ? undefined : "noreferrer"}
        className="flex min-w-0 items-center gap-1.5">
        <span className="text-sm font-medium whitespace-nowrap group-hover:text-primary">{link.label}</span>
      </a>

      <button
        onClick={() => onRemove(link.id)}
        aria-label={`Remove ${link.label}`}
        title={`Remove ${link.label}`}
        className="absolute -top-2 -right-2 hidden size-4.5 items-center justify-center rounded-full border border-primary/35 bg-white text-primary shadow-sm group-hover:flex focus-visible:flex">
        <CloseIcon size={9} />
      </button>
    </div>
  );
}
