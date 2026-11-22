import { cn } from "@lib/cn";

/**
 * Class strings shared by many components. Anything used in one place stays
 * inline in that component instead.
 */

/** Text input / select / textarea */
export const inputClass =
  "rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-subtle focus:border-primary";

/** Uppercase field label above an input */
export const labelClass = "mb-1.5 block text-xs font-semibold tracking-wider";

/** Filled blue call-to-action button */
export const primaryButtonClass =
  "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60";

/** Small outline button that turns red on hover (Dismiss, Dismiss completed) */
export const dismissButtonClass =
  "rounded-md border px-3.5 py-1 text-xs font-semibold tracking-wider transition-colors hover:border-red-200 hover:bg-red-50 hover:text-danger";

/** Square outline icon button (expand / close in card headers) */
export const iconButtonClass =
  "flex size-6.5 items-center justify-center rounded-md border transition-colors hover:border-primary hover:bg-primary-light hover:text-primary";

/** Outline button that turns blue while its panel is open (+ Post, + Add, filters) */
export function toggleChipClass(active: boolean) {
  return cn(
    "rounded-md border px-2.5 py-1 text-caption font-semibold transition-colors",
    active ? "border-primary bg-primary-light text-primary" : "hover:bg-hover",
  );
}

/** 40px-tall field wrapper for the date / time pickers; blue border while open */
export function pickerFieldClass(open: boolean) {
  return cn(
    "flex h-10 items-center overflow-hidden rounded-lg border bg-white transition-colors",
    open && "border-primary",
  );
}

/** White bordered section used on the Admin and Request History pages */
export const sectionCardClass = "overflow-hidden rounded-2xl border bg-white";

/** Uppercase table header cell */
export const tableHeadClass = "border-b px-5 py-2.5 text-left text-2xs font-bold tracking-wider text-muted";

/** Small rounded status pill (PENDING / APPROVED / REJECTED) */
export const pillClass = "inline-block rounded-full px-2.5 py-0.5 text-2xs font-bold tracking-wider";

/** Light-blue panel that wraps the inline "create" forms */
export const formPanelClass = "flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary-light p-3.5";
