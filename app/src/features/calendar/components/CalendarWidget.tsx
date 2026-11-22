import { useMemo, useState } from "react";
import Card from "@components/Card";
import CardHeader from "@components/CardHeader";
import { toggleChipClass } from "@styles/ui";
import CalendarGrid from "./CalendarGrid";
import EventEntry from "./EventEntry";
import NewEventForm from "./NewEventForm";
import { useCalendarView, useNewEventForm } from "../hooks";
import { MONTHS } from "../mockData";
import type { CalendarStore } from "../types";

interface CalendarWidgetProps {
  calendarStore: CalendarStore;
  onExpand?: () => void;
  onClose?: () => void;
}

const NAV_BTN = "flex size-6.5 items-center justify-center rounded-md border text-base transition-colors hover:bg-primary-light";

/**
 * Renders the calendar widget, includes:
 * - Month grid with month navigation
 * - Events for the selected day
 * - Add and remove events
 */
export default function CalendarWidget({ calendarStore, onExpand, onClose }: CalendarWidgetProps) {
  const { events, addEvent, removeEvent } = calendarStore;
  const { viewYear, viewMonth, selectedDay, selectDay, setSelectedDay, prevMonth, nextMonth, cells, isCurrentMonth, today } =
    useCalendarView();
  const [adding, setAdding] = useState(false);
  const form = useNewEventForm();

  const monthEvents = useMemo(
    () => events.filter((e) => e.month === viewMonth && e.year === viewYear),
    [events, viewMonth, viewYear],
  );
  const dayEvents = useMemo(
    () => (selectedDay ? monthEvents.filter((e) => e.day === selectedDay) : []),
    [monthEvents, selectedDay],
  );

  /** Opens the form, pointed at the given day when one is selected */
  function openForm(day: number | null) {
    if (day) form.openOn(viewMonth, day, viewYear);
    setAdding(true);
  }

  function post() {
    const newEvent = form.buildEvent();

    // stop when the event is invalid
    if (!newEvent) return;

    addEvent(newEvent);
    form.reset();
    setAdding(false);

    // follow the event if it was filed on another day of the month in view
    if (newEvent.month === viewMonth && newEvent.year === viewYear) setSelectedDay(newEvent.day);
  }

  function stepMonth(step: () => void) {
    step();
    setAdding(false);
  }

  const addButton = (
    <button
      onClick={() => (adding ? setAdding(false) : openForm(selectedDay))}
      className={toggleChipClass(adding)}>
      {adding ? "Cancel" : "+ Add event"}
    </button>
  );

  return (
    <Card>
      <CardHeader
        title={`${MONTHS[viewMonth]} ${viewYear}`}
        onExpand={onExpand}
        onClose={onClose}
        action={
          <div className="flex items-center gap-1">
            <button
              onClick={() => stepMonth(prevMonth)}
              title="Previous month"
              className={NAV_BTN}>
              ‹
            </button>
            <button
              onClick={() => stepMonth(nextMonth)}
              title="Next month"
              className={NAV_BTN}>
              ›
            </button>
          </div>
        }
      />

      <CalendarGrid
        cells={cells}
        events={monthEvents}
        selectedDay={selectedDay}
        selectDay={(day) => {
          selectDay(day);
          setAdding(false);
        }}
        isCurrentMonth={isCurrentMonth}
        today={today}
      />

      {/* Events panel */}
      <div className="border-t border-divider px-5 pt-2.5 pb-1.5">
        {selectedDay ? (
          <>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs tracking-wider">
                {MONTHS[viewMonth].toUpperCase()} {selectedDay}
              </span>
              {addButton}
            </div>

            {adding && <NewEventForm form={form} post={post} />}

            {dayEvents.length > 0 ? (
              <div className="mb-3 flex flex-col gap-1">
                {dayEvents.map((ev) => (
                  <EventEntry key={ev.id} event={ev} removeEvent={removeEvent} />
                ))}
              </div>
            ) : (
              !adding && <p className="pb-3 text-sm">No events — add one above</p>
            )}
          </>
        ) : (
          <>
            <div className={adding ? "flex items-center justify-between pb-2" : "flex items-center justify-between pb-3"}>
              <span className="text-sm">Select a day to view events</span>
              {addButton}
            </div>
            {adding && <NewEventForm form={form} post={post} />}
          </>
        )}
      </div>
    </Card>
  );
}
