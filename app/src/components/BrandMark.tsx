import { cn } from "@lib/cn";

/** The blue ✦ logo tile: `lg` on sign-in style pages, `sm` in page headers */
export default function BrandMark({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-primary text-white",
        size === "lg" ? "size-13 rounded-2xl text-2xl" : "size-8 rounded-lg",
      )}>
      ✦
    </div>
  );
}
