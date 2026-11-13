import OrganizationWidget from "../features/organization/components/OrganizationWidget";
import { ORGANIZATION, ORGANIZATION_MEMBERS } from "../features/organization/mockData";

/** Organization page: your department, team and teammates */
export default function OrganizationPage() {
  return (
    <div className="w-full">
      <h1 className="px-5 pt-4.5 text-xl font-extrabold">Organization</h1>
      <OrganizationWidget organization={ORGANIZATION} members={ORGANIZATION_MEMBERS} />
    </div>
  );
}
