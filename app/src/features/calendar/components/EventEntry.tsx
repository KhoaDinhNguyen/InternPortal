import type { CalendarEvent } from "../types";

interface EventEntryProps {
  event: CalendarEvent;
  removeEvent: (id: number) => void;
}

/** Renders one event row: its colour bar, title and remove button */
export default function EventEntry({ event, removeEvent }: EventEntryProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Bar colour is chosen per event */}
      <div className="h-7 w-0.75 shrink-0 rounded-xs" style={{ background: event.color }} />
      <span className="flex-1 text-sm">{event.title}</span>
      <button
        onClick={() => removeEvent(event.id)}
        title="Remove event"
        className="rounded-sm px-0.5 text-base leading-none transition-colors hover:text-primary">
        ×
      </button>
    </div>
  );
}
