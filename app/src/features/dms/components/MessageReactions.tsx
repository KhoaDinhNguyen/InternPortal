import { cn } from "@lib/cn";
import type { MessageReaction } from "../types";

interface MessageReactionsProps {
  authId: string;
  reactions: MessageReaction[];
  onToggle: (emoji: string) => void;
}

/** Row of reaction pills under a message bubble; clicking a pill toggles your own reaction. */
export default function MessageReactions({ reactions, onToggle, authId }: MessageReactionsProps) {
  if (reactions.length === 0) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {reactions.map((r) => {
        const mine = r.userIds.includes(authId);

        return (
          <button
            key={r.emoji}
            onClick={() => onToggle(r.emoji)}
            className={cn(
              "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
              mine ? "border-primary bg-primary-light" : "bg-white",
            )}>
            {r.emoji} <span>{r.count}</span>
          </button>
        );
      })}
    </div>
  );
}
