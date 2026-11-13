const BADGE_CLASSES: Record<string, string> = {
  Welcome: "bg-primary-light text-primary",
  HR: "bg-secondary/13 text-secondary",
  Events: "bg-tertiary/10 text-tertiary",
  Operations: "bg-tertiary/10 text-tertiary",
  General: "bg-primary-light",
  Approved: "bg-secondary/13 text-secondary",
  Rejected: "bg-red-50 text-danger",
};

export default function TagBadge({ label }: { label: string }) {
  return (
    <span
      className={`rounded-sm px-2 py-0.5 text-xs font-medium tracking-wider ${BADGE_CLASSES[label] ?? "bg-gray-100 text-gray-500"}`}>
      {label.toUpperCase()}
    </span>
  );
}
