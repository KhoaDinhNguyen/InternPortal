import { cn } from "@lib/cn";
import BrandMark from "./BrandMark";

interface CenteredCardLayoutProps {
  title: string;
  subtitle: string;
  /** Rendered above the logo, e.g. a back link */
  top?: React.ReactNode;
  /** Rendered below the card, e.g. demo credentials */
  bottom?: React.ReactNode;
  /** Tailwind max-width class for the column */
  widthClass?: string;
  children: React.ReactNode;
}

/** Full-screen centered column: logo, title, subtitle, then a white card (Login, Profile) */
export default function CenteredCardLayout({
  title,
  subtitle,
  top,
  bottom,
  widthClass = "max-w-100",
  children,
}: CenteredCardLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className={cn("w-full", widthClass)}>
        {top}

        <div className="mb-8 text-center">
          <div className="mb-3.5">
            <BrandMark size="lg" />
          </div>
          <h1 className="text-xl font-extrabold">{title}</h1>
          <p className="mt-1 text-caption text-muted">{subtitle}</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">{children}</div>

        {bottom}
      </div>
    </div>
  );
}
