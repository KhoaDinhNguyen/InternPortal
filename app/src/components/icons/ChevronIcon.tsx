import { cn } from "@lib/cn";

export default function ChevronIcon({ size = 10, flipped = false }: { size?: number; flipped?: boolean }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 10 6"
      fill="none"
      className={cn("transition-transform", flipped && "rotate-180")}>
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
