export interface QuickLink {
  id: number
  label: string
  url: string
  icon: string
  color: string
}

/** What `useQuickLinks` returns; passed to the nav bar as one object */
export interface QuickLinkStore {
  links: QuickLink[]
  addLink: (label: string, url: string) => boolean
  removeLink: (id: number) => void
}
