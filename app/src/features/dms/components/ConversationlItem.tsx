import type { DmConversation, DmUser } from "../types";

import { formatDmTime, senderDisplayName } from "../utils/dmFormat";
import { DM_USERS } from "../mockData";

import Avatar from "@icons/Avatar";
import GroupAvatar from "@icons/GroupAvatar";
import OnlineDot from "@icons/OnlineDot";
import { cn } from "@lib/cn";

interface ConversationItemProps {
  authId: string;
  convo: DmConversation;
  name: string;
  otherUser: DmUser | null;
  isActive: boolean;
  fullscreen: boolean;
  onSelect: (id: string) => void;
}

/** One row in the conversation list: avatar, name, last message preview, unread badge. */
export default function ConversationItem(props: ConversationItemProps) {
  const { convo, onSelect, isActive, fullscreen, name, otherUser, authId } = props;
  const last = convo.messages[convo.messages.length - 1];
  const unread = convo.unreadCount > 0;

  return (
    <button
      onClick={() => onSelect(convo.id)}
      className={cn(
        "flex items-center gap-2.5 border-b border-divider px-5 py-2.5 text-left transition-colors",
        isActive && fullscreen ? "bg-primary-light" : "hover:bg-hover",
      )}>
      {/* Avatar with online dot */}
      <div className="relative shrink-0">
        {convo.type === "group" ? <GroupAvatar /> : <Avatar name={name} size={36} />}
        {otherUser?.isOnline && <OnlineDot />}
        {convo.isPinned && <span className="absolute -top-0.5 -right-0.5 text-2xs">📌</span>}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={cn("text-sm", unread ? "font-bold" : "font-medium")}>{name}</span>
          <div className="flex shrink-0 items-center gap-1 text-2xs">
            {convo.isMuted && <span>🔇</span>}
            <span>{formatDmTime(convo.updatedAt)}</span>
          </div>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className={cn("truncate text-caption", unread && "font-medium")}>
            {last?.senderId === authId
              ? "You: "
              : convo.type === "group"
                ? `${senderDisplayName(last.senderId, DM_USERS).split(" ")[0]}: `
                : ""}
            {last?.text ?? ""}
          </span>
          {unread && !convo.isMuted && (
            <span className="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-2xs font-bold text-white">
              {convo.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
