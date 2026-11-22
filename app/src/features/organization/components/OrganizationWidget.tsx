import OrgMemberRow from "./OrgMemberRow";
import type { OrgMember, Organization } from "../types";

interface OrganizationWidgetProps {
  organization: Organization;
  members: OrgMember[];
}

/**
 * Renders the organization directory:
 * - Summary banner (department · team, team size)
 * - Department / team / lead tiles
 * - Team member list
 */
export default function OrganizationWidget({ organization, members }: OrganizationWidgetProps) {
  const sameTitleCount = members.filter((m) => m.relation === "Same title").length;

  const tiles = [
    { label: "Department", value: organization.department, labelClass: "text-primary" },
    { label: "Your team", value: organization.team, labelClass: "text-secondary" },
    { label: "Team lead", value: organization.teamLead, labelClass: "text-tertiary" },
  ];

  return (
    <div className="p-5">
      <div className="mb-4.5 rounded-xl bg-primary-light px-4 py-3.5">
        <div className="text-xs font-bold tracking-wider text-primary">YOUR ORGANIZATION</div>
        <div className="mt-1 text-lg font-bold">
          {organization.department} · {organization.team}
        </div>
        <p className="mt-1 text-caption text-muted">
          {members.length} people on your direct team, including {sameTitleCount} interns with your title.
        </p>
      </div>

      <div className="mb-4.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {tiles.map((item) => (
          <div key={item.label} className="rounded-xl border px-3 py-3">
            <div className={`text-2xs font-bold tracking-wider ${item.labelClass}`}>{item.label.toUpperCase()}</div>
            <div className="mt-1 text-caption leading-tight font-semibold">{item.value}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-caption font-bold">{organization.team} team</h2>
      <div className="flex flex-col gap-1">
        {members.map((member) => (
          <OrgMemberRow key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}
