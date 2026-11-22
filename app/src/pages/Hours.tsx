import HoursLogWidget from "../features/hoursLog/components/HoursLogWidget";
import { usePortal } from "../layouts/usePortal";

/** Hours Log page; the weekly target is set per intern by admins on Intern Configuration */
export default function HoursPage() {
  const { hours } = usePortal();

  return (
    <div className="w-full">
      <HoursLogWidget hoursStore={hours} />
    </div>
  );
}
