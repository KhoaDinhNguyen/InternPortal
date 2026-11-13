export interface OrgMember {
  name: string
  title: string
  team: string
  /** How this person relates to the signed-in user, e.g. "Same title" */
  relation: string
  lead?: boolean
}

export interface Organization {
  department: string
  team: string
  teamLead: string
}
