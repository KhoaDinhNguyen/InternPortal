export interface Announcement {
  id: number;
  title: string;
  body: string;
  date: string;
  tag: string;
  pinned?: boolean;
}

/** What `useAnnouncements` returns; passed to the widget as one object */
export interface AnnouncementStore {
  anns: Announcement[];
  openIds: Set<number>;
  pushAnn: (title: string, body: string, tag: string) => Announcement | null;
  toggleBody: (id: number) => void;
  deleteAnn: (id: number) => void;
}