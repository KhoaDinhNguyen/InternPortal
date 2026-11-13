import DmsWidget from "../features/dms/components/DmsWidget";
import { usePortal } from "../layouts/usePortal";

/** Direct Messages page: conversation list + thread, filling the rest of the screen */
export default function MessagesPage() {
  const { dms } = usePortal();

  return (
    <div className="min-h-135 w-full flex-1 overflow-hidden">
      <DmsWidget fullscreen {...dms} />
    </div>
  );
}
