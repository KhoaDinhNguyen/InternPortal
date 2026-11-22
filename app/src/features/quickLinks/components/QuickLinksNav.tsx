import QuickLinkItem from "./QuickLinkItem";
import AddQuickLinkForm from "./AddQuickLinkForm";
import type { QuickLinkStore } from "../types";

interface QuickLinksNavProps {
  linkStore: QuickLinkStore;
}

/**
 * Renders the quick links nav bar that sits above the dashboard grid
 * - One shortcut per link; hover a shortcut to remove it
 * - "Add quick link" at the end adds a new shortcut
 */
export default function QuickLinksNav({ linkStore }: QuickLinksNavProps) {
  const { links, addLink, removeLink } = linkStore;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-white p-2">
      {links.map((link) => (
        <QuickLinkItem key={link.id} link={link} onRemove={removeLink} />
      ))}

      <AddQuickLinkForm addLink={addLink} />
    </div>
  );
}
