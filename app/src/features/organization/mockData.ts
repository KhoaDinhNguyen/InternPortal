import type { OrgMember, Organization } from "./types"

export const ORGANIZATION: Organization = {
  department: "Engineering",
  team: "Platform Experience",
  teamLead: "Priya K.",
}

export const ORGANIZATION_MEMBERS: OrgMember[] = [
  { name: "Priya K.", title: "Senior Software Engineer", team: "Platform Experience", relation: "Your direct team lead", lead: true },
  { name: "Jordan Lee", title: "Software Engineering Intern", team: "Platform Experience", relation: "You" },
  { name: "Maya R.", title: "Software Engineering Intern", team: "Platform Experience", relation: "Same title" },
  { name: "Dev S.", title: "Software Engineering Intern", team: "Platform Experience", relation: "Same title" },
  { name: "Chris T.", title: "Product Designer", team: "Platform Experience", relation: "Cross-functional partner" },
  { name: "Fatima A.", title: "Product Manager", team: "Platform Experience", relation: "Cross-functional partner" },
]
