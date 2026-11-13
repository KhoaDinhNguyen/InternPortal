import ThreadHeader from "./ThreadHeader";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";
import type { DmConversation, DmMessage, DmUser } from "../types";

interface ThreadPanelProps {
  authId: string;
  active: DmConversation | null;
  name: string;
  otherUser: DmUser | null;
  onToggleMute: () => void;
  onTogglePin: () => void;
  hoveredId: string | null;
  handlersFor: (id: string) => { onMouseEnter: () => void; onMouseLeave: () => void };
  onToggleReaction: (msgId: string, emoji: string) => void;
  onReply: (msg: DmMessage) => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  draft: string;
  onDraftChange: (text: string) => void;
  onSend: () => void;
  replyTo: DmMessage | null;
  onCancelReply: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * Right-hand thread column: header + message list + composer, or an empty state when nothing is selected.
 */
export default function ThreadPanel({
  authId,
  active,
  name,
  otherUser,
  onToggleMute,
  onTogglePin,
  hoveredId,
  handlersFor,
  onToggleReaction,
  onReply,
  bottomRef,
  draft,
  onDraftChange,
  onSend,
  replyTo,
  onCancelReply,
  inputRef,
}: ThreadPanelProps) {
  if (!active)
    return (
      <div className="flex flex-1 items-center justify-center text-center">
        <div>
          <div className="mb-2.5 text-3xl">💬</div>
          <p>Select a conversation</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <ThreadHeader
        convo={active}
        name={name}
        otherUser={otherUser}
        onToggleMute={onToggleMute}
        onTogglePin={onTogglePin}
      />
      <MessageList
        authId={authId}
        convo={active}
        hoveredId={hoveredId}
        handlersFor={handlersFor}
        onToggleReaction={onToggleReaction}
        onReply={onReply}
        bottomRef={bottomRef}
      />

      <MessageComposer
        authId={authId}
        placeholder={`Message ${name}…`}
        draft={draft}
        onDraftChange={onDraftChange}
        onSend={onSend}
        replyTo={replyTo}
        onCancelReply={onCancelReply}
        inputRef={inputRef}
      />
    </div>
  );
}
