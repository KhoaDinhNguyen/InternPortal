import { useState } from "react";
import type { Announcement, AnnouncementStore } from "./types";
import { ANNOUNCEMENTS } from "./mockData";

/** useAnnouncements controls announcement list and current expanded announcements */
export function useAnnouncements(notices: Announcement[] = [], onDismissNotice?: (id: number) => void): AnnouncementStore {
  const [teamAnns, setTeamAnns] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [openIds, setOpenIds] = useState<Set<number>>(new Set([1]));

  const anns = [...notices, ...teamAnns];

  /**
   * - create new announcement
   * - add it to announcement list
   */
  function pushAnn(title: string, body: string, tag: string): Announcement | null {
    if (!title.trim()) return null;

    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const ann: Announcement = { id: Date.now(), title: title.trim(), body: body.trim(), date, tag };

    setTeamAnns((a) => [ann, ...a]);
    setOpenIds((s) => new Set([...s, ann.id]));

    return ann;
  }

  /** Toggle the display of announcement's body */
  function toggleBody(id: number) {
    setOpenIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  /** Remove the announcement from the list */
  function deleteAnn(id: number) {
    if (notices.some((n) => n.id === id)) onDismissNotice?.(id);
    else setTeamAnns((a) => a.filter((x) => x.id !== id));

    setOpenIds((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  }

  return { anns, openIds, pushAnn, toggleBody, deleteAnn }
}

{/* usePostAnnouncements controls the form's input */ }
export function usePostAnnouncements() {
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("General");

  function reset() {
    setTitle("");
    setBody("");
    setTag("General");
    setComposing(false);
  }

  return {
    composing, setComposing,
    title, setTitle,
    body, setBody,
    tag, setTag,
    reset
  }
}