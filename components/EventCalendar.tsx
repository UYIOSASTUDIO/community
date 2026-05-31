"use client";

import { useState } from "react";
import { Event } from "@/lib/types";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const SPORT_LABELS: Record<string, string> = {
  basketball: "Basketball",
  football: "Fußball",
  volleyball: "Volleyball",
  beachvolley: "Beach Volley",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year: number, month: number) {
  // 0=Sun → convert to Mon-first (0=Mon)
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function EventCalendar({ events }: { events: Event[] }) {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstWeekday = getFirstWeekday(current.year, current.month);

  // Build lookup: "YYYY-MM-DD" -> events[]
  const eventMap: Record<string, Event[]> = {};
  events.forEach((e) => {
    if (!eventMap[e.date]) eventMap[e.date] = [];
    eventMap[e.date].push(e);
  });

  const prev = () => {
    setCurrent((c) =>
      c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }
    );
  };
  const next = () => {
    setCurrent((c) =>
      c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }
    );
  };

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-card">
      {/* Header */}
      <div className="flex items-stretch border-b border-line">
        <button
          onClick={prev}
          className="meta px-4 py-4 border-r border-line hover:bg-ink hover:text-bg transition-colors"
        >
          ←
        </button>
        <h2 className="flex-1 flex items-center justify-center text-sm font-black tracking-widest uppercase">
          {MONTHS[current.month]} {current.year}
        </h2>
        <button
          onClick={next}
          className="meta px-4 py-4 border-l border-line hover:bg-ink hover:text-bg transition-colors"
        >
          →
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 border-b border-line">
        {WEEKDAYS.map((d) => (
          <div key={d} className="meta text-muted text-center py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 bg-line gap-px border-b border-line">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="bg-card aspect-square" />;

          const dateStr = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;
          const dayEvents = eventMap[dateStr] || [];
          const isToday =
            day === today.getDate() &&
            current.month === today.getMonth() &&
            current.year === today.getFullYear();
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={dateStr}
              title={dayEvents.map((e) => e.title).join(", ")}
              className={`aspect-square flex flex-col items-center justify-center gap-1 transition-colors ${
                isToday
                  ? "bg-ink text-bg"
                  : hasEvents
                  ? "bg-card font-black"
                  : "bg-card text-muted"
              }`}
            >
              <span className="text-xs font-bold">{day}</span>
              {hasEvents && (
                <div className="flex gap-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-bg" : "bg-ink"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-4 flex flex-wrap gap-x-4 gap-y-2">
        <span className="meta flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ink" /> Event
        </span>
        <span className="meta flex items-center gap-1.5">
          <span className="w-3 h-3 bg-ink inline-block" /> Heute
        </span>
        <span className="meta text-muted">
          {Object.values(SPORT_LABELS).join(" · ")}
        </span>
      </div>
    </div>
  );
}
