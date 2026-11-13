import { formatDmTime, senderDisplayName } from "../utils/dmFormat";
import MessageReactions from "./MessageReactions";
import MessageHoverActions from "./MessageHoverAction";
import Avatar from "@icons/Avatar";
import { cn } from "@lib/cn";

import type { DmMessage } from "../types";
import { DM_USERS } from "../mockData";

interface MessageBubbleProps {
  authId: string;
  message: DmMessage;
  showName: boolean;
  showAvatar: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onToggleReaction: (emoji: string) => void;
  onReply: () => void;
}

/**
 * One message row: optional sender name, avatar, bubble (with reply preview,
 * text, reactions), timestamp/status column, and the hover toolbar. All the
 * layout math (who gets an avatar, left vs right alignment) is decided by the
 * caller (MessageList) — this component just renders one message.
 */
export function MessageBubble({
  authId,
  message,
  showName,
  showAvatar,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onToggleReaction,
  onReply,
}: MessageBubbleProps) {
  const isMine = message.senderId === authId;

  return (
    <div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={cn("relative flex flex-col", isMine ? "items-end" : "items-start")}>
      {showName && (
        <span className="mb-1 ml-8.5 text-xs font-semibold">{senderDisplayName(message.senderId, DM_USERS)}</span>
      )}
      <div className={cn("flex items-end gap-1.5", isMine && "flex-row-reverse")}>
        {!isMine && showAvatar ? (
          <Avatar name={senderDisplayName(message.senderId, DM_USERS)} size={26} />
        ) : (
          <div className="w-6.5" />
        )}
        <div className={cn("flex max-w-85 flex-col", isMine ? "items-end" : "items-start")}>
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2 text-sm leading-normal",
              isMine ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-divider",
            )}>
            {message.isDeleted ? <em className="opacity-60">Message deleted</em> : message.text}
            {message.isEdited && !message.isDeleted && <span className="ml-1.5 text-2xs opacity-60">(edited)</span>}
          </div>
          <MessageReactions authId={authId} reactions={message.reactions ?? []} onToggle={onToggleReaction} />
        </div>
        <span className="shrink-0 text-2xs">{formatDmTime(message.createdAt)}</span>
      </div>

      {isHovered && !message.isDeleted && (
        <MessageHoverActions isAuth={isMine} onReact={onToggleReaction} onReply={onReply} />
      )}
    </div>
  );
}
