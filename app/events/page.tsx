"use client";

import { useState, useMemo } from "react";
import { getAllEvents } from "@/lib/events";
import Masonry from "@/components/Masonry";
import { Sport } from "@/lib/types";

const SPORTS: { key: Sport | "all"; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "basketball", label: "Basketball" },
  { key: "football", label: "Fußball" },
  { key: "volleyball", label: "Volleyball" },
  { key: "beachvolley", label: "Beach Volleyball" },
];

const TYPES = [
  { key: "all", label: "Alle" },
  { key: "pickup", label: "Pickup" },
  { key: "tournament", label: "Turnier" },
];

export default function EventsPage() {
  const [sport, setSport] = useState<Sport | "all">("all");
  const [type, setType] = useState<"all" | "pickup" | "tournament">("all");

  const today = new Date().toISOString().split("T")[0];
  const allEvents = getAllEvents();

  const filtered = useMemo(() => {
    return allEvents
      .filter((e) => e.date >= today)
      .filter((e) => sport === "all" || e.sport === sport)
      .filter((e) => type === "all" || e.type === type)
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [allEvents, sport, type, today]);

  const pill = (active: boolean) =>
    `meta border border-line rounded-full px-3 py-1.5 transition-colors ${
      active ? "bg-ink text-bg" : "bg-card text-ink hover:bg-ink hover:text-bg"
    }`;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-line px-4 sm:px-6 py-10">
        <p className="meta text-muted mb-4">Alle Treffen &amp; Turniere</p>
        <h1 className="text-[14vw] lg:text-[7vw] font-black uppercase tracking-tighter leading-[0.85]">
          Events
        </h1>
      </section>

      {/* Filters */}
      <section className="border-b border-line">
        <div className="px-4 sm:px-6 py-5 border-b border-line flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="meta text-muted mr-2">Sportart</span>
            {SPORTS.map((s) => (
              <button key={s.key} onClick={() => setSport(s.key)} className={pill(sport === s.key)}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="meta text-muted mr-2">Format</span>
            {TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setType(t.key as typeof type)}
                className={pill(type === t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-6 py-3">
          <p className="meta text-muted">
            {filtered.length} {filtered.length === 1 ? "Event" : "Events"} gefunden
          </p>
        </div>
      </section>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="border-b border-line">
          <Masonry events={filtered} />
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-24 text-center border-b border-line">
          <p className="text-2xl font-black uppercase tracking-tight text-muted">
            Keine Events gefunden
          </p>
          <p className="meta text-muted mt-3">
            Andere Filter versuchen oder bald zurückschauen.
          </p>
        </div>
      )}
    </div>
  );
}
