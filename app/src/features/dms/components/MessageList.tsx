import type { RefObject } from "react";
import { MessageBubble } from "./MessageBubble";
import type { DmConversation, DmMessage } from "../types";

interface MessageListProps {
  authId: string;
  convo: DmConversation;
  hoveredId: string | null;
  handlersFor: (id: string) => { onMouseEnter: () => void; onMouseLeave: () => void };
  onToggleReaction: (msgId: string, emoji: string) => void;
  onReply: (msg: DmMessage) => void;
  bottomRef: RefObject<HTMLDivElement | null>;
}

/**
 * Scrollable message history for the active conversation. Owns the
 * "consecutive messages from the same sender collapse the avatar/name"
 * layout rule, and renders the typing indicator + scroll anchor at the end.
 */
export default function MessageList({
  authId,
  convo,
  hoveredId,
  handlersFor,
  onToggleReaction,
  onReply,
  bottomRef,
}: MessageListProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-4">
      {convo.messages.map((msg, i) => {
        const isMine = msg.senderId === authId;
        const prevSameSender = i > 0 && convo.messages[i - 1].senderId === msg.senderId;
        const { onMouseEnter, onMouseLeave } = handlersFor(msg.id);

        return (
          <MessageBubble
            key={msg.id}
            authId={authId}
            message={msg}
            showName={!isMine && !prevSameSender}
            showAvatar={!isMine && !prevSameSender}
            isHovered={hoveredId === msg.id}
            onHoverStart={onMouseEnter}
            onHoverEnd={onMouseLeave}
            onToggleReaction={(emoji) => onToggleReaction(msg.id, emoji)}
            onReply={() => onReply(msg)}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
