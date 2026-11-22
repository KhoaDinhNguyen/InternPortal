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
  /** Hours per week the signed-in user must log; admins set it per intern */
  weeklyRequirement: number
}
