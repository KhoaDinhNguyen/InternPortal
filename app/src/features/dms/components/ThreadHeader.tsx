import { formatDmTime } from "../utils/dmFormat";
import Avatar from "@icons/Avatar";
import GroupAvatar from "@icons/GroupAvatar";
import OnlineDot from "@icons/OnlineDot";
import { cn } from "@lib/cn";
import type { DmConversation, DmUser } from "../types";

interface ThreadHeaderProps {
  convo: DmConversation;
  name: string;
  otherUser: DmUser | null;
  onToggleMute: () => void;
  onTogglePin: () => void;
}

/** Square toggle button; light blue while switched on */
const toggleClass = (on?: boolean) =>
  cn("flex size-7 items-center justify-center rounded-md border text-caption", on ? "bg-primary-light" : "hover:bg-hover");

/** Top bar of the active thread: avatar, name, presence line, mute/pin toggles. */
export default function ThreadHeader({ convo, name, otherUser, onToggleMute, onTogglePin }: ThreadHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-divider px-5 py-3">
      <div className="relative">
        {convo.type === "group" ? <GroupAvatar size={34} /> : <Avatar name={name} size={34} />}
        {convo.type === "direct" && otherUser?.isOnline && <OnlineDot />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-xs">
          {convo.type === "group" ? (
            `${convo.participants.length} members · ${convo.participants.filter((p) => p.isOnline).length} online`
          ) : otherUser?.isOnline ? (
            <span className="text-green-500">● Active now</span>
          ) : otherUser?.lastSeenAt ? (
            `Last seen ${formatDmTime(otherUser.lastSeenAt)}`
          ) : (
            "Offline"
          )}
        </div>
      </div>

      {/* Mute / pin toggles */}
      <button onClick={onToggleMute} title={convo.isMuted ? "Unmute" : "Mute"} className={toggleClass(convo.isMuted)}>
        {convo.isMuted ? "🔇" : "🔔"}
      </button>
      <button onClick={onTogglePin} title={convo.isPinned ? "Unpin" : "Pin"} className={toggleClass(convo.isPinned)}>
        📌
      </button>
    </div>
  );
}
