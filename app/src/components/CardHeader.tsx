import { iconButtonClass } from "@styles/ui";
import ExpandIcon from "./icons/ExpandIcon";
import CloseIcon from "./icons/CloseIcon";

interface CardHeaderProps {
  title: string;
  count?: number;
  action?: React.ReactNode;
  onExpand?: () => void;
  onClose?: () => void;
}

/**
 * CardHeader contains following information:
 * - title
 * - count (number, for instance, the number of announcement)
 * - action: child component
 * - onExpand / onClose: expand the card into a modal, or close that modal
 */
export default function CardHeader({ title, count, action, onExpand, onClose }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 pt-4.5 pb-3.5">
      <div className="flex items-center gap-2">
        <span className="font-bold">{title}</span>
        {count !== undefined && (
          <span className="rounded-full bg-primary-light px-2 py-px text-xs font-medium text-primary">{count}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {action}
        {onExpand && (
          <button onClick={onExpand} title="Expand" className={iconButtonClass}>
            <ExpandIcon size={12} />
          </button>
        )}
        {onClose && (
          <button onClick={onClose} title="Close" className={iconButtonClass}>
            <CloseIcon size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
