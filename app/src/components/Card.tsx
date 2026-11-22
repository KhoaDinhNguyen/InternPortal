import { cn } from "@lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return <div className={cn("overflow-hidden rounded-xl border bg-white", className)}>{children}</div>;
}
