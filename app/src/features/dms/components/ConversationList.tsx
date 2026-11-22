import { cn } from "@lib/cn";
import ConversationItem from "./ConversationlItem";
import type { DmConversation, DmUser } from "../types";

interface ConversationListProps {
  /** Should already be sorted (see utils/dmConversations sortConversations). */
  authId: string;
  conversations: DmConversation[];
  activeId: string | null;
  fullscreen: boolean;
  otherUser: (c: DmConversation) => DmUser;
  convoName: (c: DmConversation) => string;
  onSelect: (id: string) => void;
}

/** Scrollable list of conversations — shared by the compact card and the fullscreen sidebar. */
export default function ConversationList({
  authId,
  conversations,
  activeId,
  fullscreen,
  otherUser,
  convoName,
  onSelect,
}: ConversationListProps) {
  return (
    <div className={cn("flex flex-col overflow-y-auto", fullscreen && "flex-1")}>
      {conversations.map((c) => (
        <ConversationItem
          authId={authId}
          key={c.id}
          convo={c}
          name={convoName(c)}
          otherUser={c.type === "direct" ? otherUser(c) : null}
          isActive={c.id === activeId}
          fullscreen={fullscreen}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
