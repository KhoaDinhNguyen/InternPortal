import Avatar from "@icons/Avatar";
import { cn } from "@lib/cn";
import type { OrgMember } from "../types";

/** Badge colours: team lead → green, same title → pink, everyone else → blue */
function relationClass(member: OrgMember) {
  if (member.lead) return "bg-secondary/10 text-secondary";
  if (member.relation === "Same title") return "bg-tertiary/10 text-tertiary";
  return "bg-primary-light text-primary";
}

/** Renders one teammate: avatar, name, title and how they relate to you */
export default function OrgMemberRow({ member }: { member: OrgMember }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-divider px-3 py-2.5">
      <Avatar name={member.name} size={34} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold">{member.name}</div>
        <div className="mt-0.5 text-xs text-muted">{member.title}</div>
      </div>
      <span className={cn("rounded-md px-2 py-0.5 text-2xs font-bold whitespace-nowrap", relationClass(member))}>
        {member.relation}
      </span>
    </div>
  );
}
