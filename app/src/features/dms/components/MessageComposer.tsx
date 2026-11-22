import type { RefObject, KeyboardEvent } from "react";

import { cn } from "@lib/cn";
import { inputClass, primaryButtonClass } from "@styles/ui";
import type { DmMessage } from "../types";
import { senderDisplayName } from "../utils/dmFormat";
import { DM_USERS } from "../mockData";

interface MessageComposerProps {
  authId: string;
  placeholder: string;
  draft: string;
  replyTo: DmMessage | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onDraftChange: (text: string) => void;
  onSend: () => void;
  onCancelReply: () => void;
}

/** Bottom-of-thread composer: optional reply bar, text input, send button. */
export default function MessageComposer(props: MessageComposerProps) {
  const { placeholder, draft, onDraftChange, onSend, replyTo, onCancelReply, inputRef, authId } = props;

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <>
      {replyTo && <ReplyBar authId={authId} replyTo={replyTo} onCancel={onCancelReply} />}

      <div className="flex shrink-0 gap-2 border-t border-divider px-5 py-3">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(inputClass, "min-w-0 flex-1 rounded-xl px-3.5")}
        />
        <button onClick={onSend} className={cn(primaryButtonClass, "rounded-xl px-4.5")}>
          Send
        </button>
      </div>
    </>
  );
}

interface ReplyBarProps {
  authId: string;
  replyTo: DmMessage;
  onCancel: () => void;
}

/** The "Replying to X: ..." strip shown above the composer input. */
export function ReplyBar({ authId, replyTo, onCancel }: ReplyBarProps) {
  return (
    <div className="flex items-center gap-2.5 border-t border-divider bg-hover px-5 py-2">
      <div className="flex-1 border-l-3 border-primary pl-2 text-caption">
        Replying to{" "}
        <strong>{replyTo.senderId === authId ? "yourself" : senderDisplayName(replyTo.senderId, DM_USERS)}</strong>:{" "}
        {replyTo.text}
      </div>

      <button onClick={onCancel} aria-label="Cancel reply" className="text-base leading-none text-gray-400">
        ×
      </button>
    </div>
  );
}
