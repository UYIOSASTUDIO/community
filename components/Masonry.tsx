"use client";

import { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import EventCard from "./EventCard";

function computeCols(w: number): number {
  if (w >= 1280) return 5;
  if (w >= 1024) return 4;
  if (w >= 768) return 3;
  if (w >= 640) return 2;
  return 1;
}

export default function Masonry({ events }: { events: Event[] }) {
  // null until mounted → SSR + hydration both use the `?? 5` fallback (no mismatch)
  const [cols, setCols] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setCols(computeCols(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const n = cols ?? 5;
  const columns: Event[][] = Array.from({ length: n }, () => []);
  events.forEach((event, i) => columns[i % n].push(event));

  return (
    <div className="flex items-start gap-4 px-4 sm:px-6 py-6">
      {columns.map((col, ci) => (
        <div key={ci} className="flex min-w-0 flex-1 flex-col">
          {col.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ))}
    </div>
  );
}
