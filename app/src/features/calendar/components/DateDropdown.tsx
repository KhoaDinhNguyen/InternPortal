import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@lib/cn";
import { pickerFieldClass } from "@styles/ui";
import { buildFullCalendar } from "../hooks";
import { MONTHS } from "../mockData";

interface DateDropdownProps {
  month: number;
  day: number;
  year: number;
  onChange: (month: number, day: number, year: number) => void;
}

const POPUP_H = 310;
const POPUP_W = 272;

const NAV_BTN = "flex size-6.5 shrink-0 items-center justify-center rounded-md hover:bg-primary-light";

/**
 * Renders a date field that opens a month picker, includes:
 * - Year and month navigation
 * - A grid that spills into the neighbouring months, so any date is reachable
 *
 * The picker is rendered through a portal so it is never clipped by the card
 * it sits in, and it flips above the field when there is no room below.
 */
export default function DateDropdown({ month, day, year, onChange }: DateDropdownProps) {
  const [open, setOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(month);
  const [calYear, setCalYear] = useState(year);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const today = new Date();

  /** Positions the picker against the field before showing it */
  function openCal() {
    setCalMonth(month);
    setCalYear(year);

    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const openUp = window.innerHeight - r.bottom < POPUP_H + 8;
      const clampedLeft = Math.min(r.left + window.scrollX, window.innerWidth + window.scrollX - POPUP_W - 8);

      setPopupPos({
        top: openUp ? r.top + window.scrollY - POPUP_H - 4 : r.bottom + window.scrollY + 4,
        left: Math.max(8, clampedLeft),
      });
    }

    setOpen(true);
  }

  {/** Closes the picker when the user clicks outside of it */ }
  useEffect(() => {
    if (!open) return;

    function handler(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current && !triggerRef.current.contains(target)) {
        const popup = document.getElementById("date-dropdown-popup");
        if (!popup || !popup.contains(target)) setOpen(false);
      }
    }

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function stepMonth(delta: number) {
    const next = calMonth + delta;

    if (next < 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else if (next > 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else {
      setCalMonth(next);
    }
  }

  const cells = buildFullCalendar(calMonth, calYear);
  const displayDate = `${month + 1}/${day}/${String(year).slice(2)}`;

  const popup = open ? (
    <div
      id="date-dropdown-popup"
      className="absolute z-9999 w-68 rounded-xl border bg-white px-3.5 pt-3.5 pb-3 shadow-xl"
      // Position is measured from the trigger at open time
      style={{ top: popupPos.top, left: popupPos.left }}>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex gap-px">
          <button onClick={() => setCalYear((y) => y - 1)} title="Previous year" className={NAV_BTN}>
            «
          </button>
          <button onClick={() => stepMonth(-1)} title="Previous month" className={NAV_BTN}>
            ‹
          </button>
        </div>
        <span className="text-sm font-bold">
          {MONTHS[calMonth]} {calYear}
        </span>
        <div className="flex gap-px">
          <button onClick={() => stepMonth(1)} title="Next month" className={NAV_BTN}>
            ›
          </button>
          <button onClick={() => setCalYear((y) => y + 1)} title="Next year" className={NAV_BTN}>
            »
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-0.5 text-center text-2xs font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell) => {
          const isToday =
            cell.day === today.getDate() && cell.month === today.getMonth() && cell.year === today.getFullYear();
          const isSelected = cell.day === day && cell.month === month && cell.year === year;

          return (
            <button
              key={`${cell.year}-${cell.month}-${cell.day}`}
              onClick={() => {
                onChange(cell.month, cell.day, cell.year);
                setOpen(false);
              }}
              className={cn(
                "flex aspect-square w-full items-center justify-center rounded-full border-2 text-caption transition-colors",
                isSelected ? "border-transparent bg-primary font-bold text-white" : "hover:bg-primary-light",
                !isSelected && (isToday ? "border-primary font-bold" : "border-transparent"),
                !isSelected && !cell.current && "text-gray-400",
              )}>
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative min-w-0 flex-1">
      <div className={pickerFieldClass(open)}>
        <button
          ref={triggerRef}
          onClick={() => (open ? setOpen(false) : openCal())}
          className="h-full flex-1 px-3 text-left text-sm">
          {displayDate}
        </button>
      </div>
      {popup && createPortal(popup, document.body)}
    </div>
  );
}
