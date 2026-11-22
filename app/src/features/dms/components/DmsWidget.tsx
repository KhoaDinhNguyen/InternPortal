import { useEffect } from "react";
import { useMessageComposer } from "../hooks/useMessageComposer";
import { useHoverMessageId } from "../hooks/useHoverMessageId";
import Card from "@components/Card";
import CardHeader from "@components/CardHeader";

import { useAutoScrollBottom } from "../hooks/useAutoScrollBottom";

import ThreadPanel from "./ThreadPanel";

import { ME_ID } from "../mockData";
import ConversationList from "./ConversationList";
import type { DmUser, DmConversation, DmMessage } from "../types";

interface DmsWidgetProps {
  onExpand?: () => void;
  fullscreen: boolean;
  sortedConvos: DmConversation[];
  activeId: string | null;
  active: DmConversation | null;
  totalUnread: number;
  otherUser: (c: DmConversation) => DmUser;
  convoName: (c: DmConversation) => string;
  openConvo: (id: string) => void;
  sendMessage: (
    text: string,
    opts?: {
      replyToMessageId?: string;
    },
  ) => DmMessage | null;
  toggleReaction: (convoId: string, msgId: string, emoji: string) => void;
  togglePin: (convoId: string) => void;
  toggleMute: (convoId: string) => void;
}

export default function DmsWidget(props: DmsWidgetProps) {
  const {
    activeId,
    otherUser,
    convoName,
    openConvo,
    sendMessage,
    sortedConvos,
    toggleReaction,
    active,
    totalUnread,
    togglePin,
    toggleMute,
    fullscreen,
    onExpand,
  } = props;

  const { draft, setDraft, replyTo, inputRef, startReply, cancelReply, send } = useMessageComposer(
    sendMessage,
    activeId,
  );

  const { hoveredMsgId, handlersFor } = useHoverMessageId();

  const bottomRef = useAutoScrollBottom(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, active?.messages.length]);

  if (!fullscreen) {
    return (
      <Card>
        <CardHeader title="Direct Messages" count={totalUnread > 0 ? totalUnread : undefined} onExpand={onExpand} />
        <ConversationList
          authId={ME_ID}
          activeId={activeId}
          conversations={sortedConvos}
          convoName={convoName}
          fullscreen={fullscreen}
          onSelect={openConvo}
          otherUser={otherUser}
        />
      </Card>
    );
  }

  return (
    <div className="flex h-full min-h-120">
      {/* Conversation list */}
      <div className="flex w-68 shrink-0 flex-col border-r border-divider">
        <div className="border-b border-divider px-5 pt-3.5 pb-2.5 text-2xs font-semibold tracking-widest">MESSAGES</div>
        <ConversationList
          authId={ME_ID}
          activeId={activeId}
          conversations={sortedConvos}
          convoName={convoName}
          fullscreen={fullscreen}
          onSelect={openConvo}
          otherUser={otherUser}
        />
      </div>

      <ThreadPanel
        authId={ME_ID}
        active={active}
        name={active ? convoName(active) : ""}
        otherUser={active?.type === "direct" ? otherUser(active) : null}
        onToggleMute={() => active && toggleMute(active.id)}
        onTogglePin={() => active && togglePin(active.id)}
        hoveredId={hoveredMsgId}
        handlersFor={handlersFor}
        onToggleReaction={(msgId: string, emoji: string) => active && toggleReaction(active.id, msgId, emoji)}
        onReply={startReply}
        bottomRef={bottomRef}
        draft={draft}
        onDraftChange={(text: string) => {
          setDraft(text);
        }}
        onSend={send}
        replyTo={replyTo}
        onCancelReply={cancelReply}
        inputRef={inputRef}
      />
    </div>
  );
}
