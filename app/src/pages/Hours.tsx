import HoursLogWidget from "../features/hoursLog/components/HoursLogWidget";
import { useAuth } from "../features/login/useAuth";
import { usePortal } from "../layouts/usePortal";

/** Hours Log page; admins can also change the weekly hours requirement */
export default function HoursPage() {
  const { user } = useAuth();
  const { hours } = usePortal();

  return (
    <div className="w-full max-w-180">
      <HoursLogWidget hoursStore={hours} canSetRequirement={user?.role === "admin"} />
    </div>
  );
}
