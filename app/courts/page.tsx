"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { getAllCourts } from "@/lib/courts";
import { Sport } from "@/lib/types";

// MapLibre touches `window`, so load the map only on the client.
const CourtMap = dynamic(() => import("@/components/CourtMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink">
      <span className="meta text-bg/60">Karte lädt …</span>
    </div>
  ),
});

const SPORT_LABEL: Record<Sport, string> = {
  basketball: "Basketball",
  football: "Fußball",
  volleyball: "Volleyball",
  beachvolley: "Beach Volleyball",
};

export default function CourtsPage() {
  const courts = useMemo(() => getAllCourts(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-line px-4 sm:px-6 py-10">
        <p className="meta text-muted mb-3">Wo wir spielen</p>
        <h1 className="text-3xl sm:text-5xl font-black uppercase leading-none tracking-tight">
          Unsere Courts
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-ink/70">
          Hier findest du alle Plätze, auf denen wir regelmäßig spielen. Tippe einen
          Marker oder einen Court in der Liste an, um ihn auf der Karte zu sehen.
        </p>
      </section>

      {/* Map + list */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
        {/* Map */}
        <div className="order-1 h-[55vh] min-h-[360px] w-full border-b border-line lg:order-none lg:h-[70vh] lg:border-b-0 lg:border-r">
          <CourtMap courts={courts} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* List */}
        <ul className="order-2 divide-y divide-line lg:order-none lg:h-[70vh] lg:overflow-y-auto">
          {courts.map((court) => {
            const active = court.id === selectedId;
            return (
              <li key={court.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(court.id)}
                  className={`w-full px-4 sm:px-6 py-4 text-left transition-colors ${
                    active ? "bg-ink text-bg" : "bg-card text-ink hover:bg-ink hover:text-bg"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-extrabold leading-tight">{court.name}</span>
                    <span
                      className={`meta shrink-0 ${active ? "text-bg/70" : "text-muted"}`}
                    >
                      {court.district}
                    </span>
                  </div>
                  <div
                    className={`meta mt-2 ${active ? "text-bg/70" : "text-muted"}`}
                  >
                    {court.sports.map((s) => SPORT_LABEL[s]).join(" · ")}
                  </div>
                  <div
                    className={`mt-2 text-sm ${active ? "text-bg/80" : "text-ink/60"}`}
                  >
                    {court.address}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
