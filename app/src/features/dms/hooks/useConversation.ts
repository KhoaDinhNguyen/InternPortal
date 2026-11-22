import { useCallback, useMemo, useState } from "react";
import type { DmConversation, DmUser } from "../types";

import { appendMessage, buildMessage, updateMessageStatus, toggleMessageReaction } from "../utils/dmMessage";
import { updateConversationById, sortConversations, getOtherUser, getConvoDisplayName } from "../utils/dmConversation";

/**
 * Owns conversation/message *state* and wires it up to the pure helpers in
 * utils/dmConversations and utils/dmMessages. This hook shouldn't contain any
 * business logic of its own beyond "when X happens, call setConvos with the
 * result of helper Y" — that keeps the logic testable outside of React and
 * keeps this file readable as a table of actions.
 */
export function useDmConversations(authId: string, initialConvos: DmConversation[], initialActiveId: string | null = null) {
  const [convos, setConvos] = useState<DmConversation[]>(initialConvos);
  const [activeId, setActiveId] = useState<string | null>(initialActiveId);

  const active = useMemo(() => convos.find(c => c.id === activeId) ?? null, [convos, activeId]);
  const totalUnread = useMemo(() => convos.reduce((sum, c) => sum + c.unreadCount, 0), [convos]);
  const sortedConvos = useMemo(() => sortConversations(convos), [convos]);

  const otherUser = useCallback((c: DmConversation): DmUser => getOtherUser(c, authId), [authId]);
  const convoName = useCallback((c: DmConversation): string => getConvoDisplayName(c, authId), [authId]);


  // Selects the conversation and marks it read in one go — opening a
  // conversation and clearing its unread count are the same user action,
  // not two separate ones, so they're one function rather than two.
  const openConvo = useCallback((id: string) => {
    setActiveId(id);
    setConvos(cs => cs.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  }, []);

  // Appends an optimistic message immediately, then flips its status to
  // "delivered" after a delay — a stand-in for a real send round-trip.
  // The delayed update captures `activeId` from this closure; if the
  // dependency array below is wrong, it'll flip the wrong conversation's
  // message after the user switches threads.
  const sendMessage = useCallback((text: string, opts?: { replyToMessageId?: string }) => {
    if (!text.trim() || !activeId) return null;

    const newMsg = buildMessage(authId, text, opts);

    setConvos(cs => updateConversationById(cs, activeId, (c) => appendMessage(c, newMsg)));

    setTimeout(() => {
      setConvos(cs => updateConversationById(cs, activeId, (c) => updateMessageStatus(c, newMsg.id, "delivered")));
    }, 800)

    return newMsg;
  }, [activeId, authId]);

  const toggleReaction = useCallback((convoId: string, msgId: string, emoji: string) => {
    setConvos(cs => updateConversationById(cs, convoId, (c) => toggleMessageReaction(c, msgId, emoji, authId)))
  }, [authId]);

  const togglePin = useCallback((convoId: string) => {
    setConvos(cs => updateConversationById(cs, convoId, (c) => ({ ...c, isPinned: !c.isPinned })));
  }, [])

  const toggleMute = useCallback((convoId: string) => {
    setConvos(cs => updateConversationById(cs, convoId, (c) => ({ ...c, isMuted: !c.isMuted })));
  }, [])

  return {
    // state
    sortedConvos,
    activeId, active,
    totalUnread,
    // helper
    otherUser, convoName,
    // actions
    openConvo, sendMessage, toggleReaction, togglePin, toggleMute
  }
}