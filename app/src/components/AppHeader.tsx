import BrandMark from "./BrandMark";

/** Sticky logo header for the pages outside the sidebar layout (Admin, Request History) */
export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-15 items-center gap-3 border-b bg-white px-4 sm:px-8">
      <BrandMark />
      <span className="font-bold">Intern Portal</span>
    </header>
  );
}
