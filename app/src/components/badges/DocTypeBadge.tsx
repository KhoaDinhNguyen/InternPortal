const BADGE_CLASSES: Record<string, string> = {
  PDF: "bg-primary/13 text-primary",
  Doc: "bg-tertiary/13 text-tertiary",
  Form: "bg-secondary/13 text-secondary",
  Sheet: "bg-secondary/13 text-secondary",
  Slide: "bg-tertiary/13 text-tertiary",
};

export default function DocTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`rounded-xs px-1.5 py-0.5 text-xs font-medium tracking-wider ${BADGE_CLASSES[type] ?? "bg-gray-500/13 text-gray-500"}`}>
      {type}
    </span>
  );
}
