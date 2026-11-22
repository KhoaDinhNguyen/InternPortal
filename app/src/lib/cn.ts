import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom font size from index.css, otherwise it reads
// `text-caption` as a text colour and drops it next to e.g. `text-primary`
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["caption"] } },
});

/**
 * Joins class names, skipping falsy values. When two classes set the same
 * property, the later one wins: cn("px-3", "px-2") → "px-2".
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
