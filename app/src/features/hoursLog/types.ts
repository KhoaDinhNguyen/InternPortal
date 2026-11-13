export interface HourEntry {
  id: number,
  date: string,
  project: string,
  description: string,
  hours: number
}

/** What `useHoursEntries` returns; passed to the widget as one object */
export interface HoursStore {
  entries: HourEntry[],
  addEntries: (description: string, hours: string, project: string, viewDate: string) => boolean,
  weeklyRequirement: number,
  setWeeklyRequirement: (hours: number) => void
}
