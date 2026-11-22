import { cn } from "@lib/cn";
import { QUICK_REACTIONS } from "../utils/dmFormat";

interface MessageHoverActionsProps {
  isAuth: boolean;
  onReact: (emoji: string) => void;
  onReply: () => void;
}

const HOVER_BUTTON = "flex size-6.5 items-center justify-center rounded-md text-sm transition-colors hover:bg-gray-100";

/** Floating quick-reaction + reply toolbar that appears when hovering a message. */
export default function MessageHoverActions({ isAuth, onReact, onReply }: MessageHoverActionsProps) {
  return (
    <div
      className={cn(
        "absolute -top-2.5 z-5 flex gap-0.5 rounded-lg border bg-white px-1 py-0.5 shadow-md",
        isAuth ? "left-50" : "right-50",
      )}>
      {QUICK_REACTIONS.map((e) => (
        <button key={e} onClick={() => onReact(e)} className={HOVER_BUTTON}>
          {e}
        </button>
      ))}
      <button onClick={onReply} title="Reply" className={HOVER_BUTTON}>
        ↩
      </button>
    </div>
  );
}
