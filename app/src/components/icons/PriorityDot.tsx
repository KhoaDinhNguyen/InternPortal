const DOT_CLASSES = { high: "bg-primary", medium: "bg-tertiary", low: "bg-secondary" };

export default function PriorityDot({ priority }: { priority: "low" | "medium" | "high" }) {
  return <span className={`inline-block size-2 shrink-0 rounded-full ${DOT_CLASSES[priority]}`} />;
}
