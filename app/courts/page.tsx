"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const SPORTS = Object.keys(SPORT_LABEL) as Sport[];

export default function CourtsPage() {
  const courts = useMemo(() => getAllCourts(), []);
  const courtItemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeSports, setActiveSports] = useState<Sport[]>([]);

  const filteredCourts = useMemo(() => {
    if (activeSports.length === 0) return courts;
    return courts.filter((court) =>
      court.sports.some((sport) => activeSports.includes(sport))
    );
  }, [activeSports, courts]);

  const visibleCourtIds = useMemo(
    () => filteredCourts.map((court) => court.id),
    [filteredCourts]
  );

  function toggleSport(sport: Sport) {
    setActiveSports((current) =>
      current.includes(sport)
        ? current.filter((activeSport) => activeSport !== sport)
        : [...current, sport]
    );
  }

  useEffect(() => {
    if (window.matchMedia("(min-width: 640px)").matches) {
      setIsPanelOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    if (!filteredCourts.some((court) => court.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredCourts, selectedId]);

  useEffect(() => {
    if (!selectedId || !isPanelOpen) return;

    courtItemRefs.current[selectedId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [filteredCourts, isPanelOpen, selectedId]);

  return (
    <section className="courts-page relative -mt-16 h-[calc(100svh-1.75rem)] overflow-hidden bg-ink">
      <CourtMap
        courts={courts}
        visibleCourtIds={visibleCourtIds}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <aside
        aria-label="Court-Liste"
        className={`absolute inset-x-3 bottom-3 z-10 overflow-hidden rounded-[6px] border border-bg/20 bg-bg/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-[height,width] duration-300 ease-out sm:inset-x-auto sm:right-4 sm:top-20 sm:bottom-auto lg:right-6 lg:top-[5.5rem] ${
          isPanelOpen
            ? "h-[calc(100%-5.75rem)] min-h-0 sm:h-[min(560px,calc(100%-6rem))] sm:w-[360px] lg:h-[min(600px,calc(100%-7rem))]"
            : "h-12 sm:h-12 sm:w-[230px]"
        }`}
      >
        <div
          className={`flex h-12 items-center justify-between gap-3 px-4 ${
            isPanelOpen ? "border-b border-ink/15" : ""
          }`}
        >
          <div className="min-w-0">
            <h1 className="meta text-ink">Courts</h1>
            <div className="meta mt-1 truncate text-ink/45">
              {filteredCourts.length} Spots
            </div>
          </div>

          <button
            type="button"
            aria-expanded={isPanelOpen}
            aria-controls="court-panel-content"
            aria-label={isPanelOpen ? "Court-Liste einklappen" : "Court-Liste aufklappen"}
            onClick={() => setIsPanelOpen((open) => !open)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-ink/10"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className={`h-5 w-5 transition-transform duration-200 ease-out ${
                isPanelOpen ? "rotate-0" : "rotate-180"
              }`}
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {isPanelOpen && (
          <div id="court-panel-content" className="flex h-[calc(100%-3rem)] flex-col">
            <ul
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            >
              {filteredCourts.map((court) => {
                const active = court.id === selectedId;
                return (
                  <li
                    key={court.id}
                    ref={(node) => {
                      courtItemRefs.current[court.id] = node;
                    }}
                    className="border-b border-ink/10 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(court.id)}
                      className={`group w-full px-4 py-4 text-left transition-colors ${
                        active
                          ? "bg-ink text-bg"
                          : "text-ink hover:bg-ink/55 hover:text-bg"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-base font-extrabold uppercase leading-[0.95] tracking-normal">
                          {court.name}
                        </span>
                        <span
                          className={`meta mt-1 shrink-0 ${
                            active
                              ? "text-bg/65"
                              : "text-ink/45 group-hover:text-bg/65"
                          }`}
                        >
                          {court.district}
                        </span>
                      </div>

                      <div
                        className={`meta mt-3 ${
                          active ? "text-bg/65" : "text-ink/50 group-hover:text-bg/65"
                        }`}
                      >
                        {court.sports.map((s) => SPORT_LABEL[s]).join(" · ")}
                      </div>

                      <div
                        className={`mt-2 text-sm leading-snug ${
                          active ? "text-bg/75" : "text-ink/60 group-hover:text-bg/75"
                        }`}
                      >
                        {court.address}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-ink/15 px-2 py-1">
              <div className="flex flex-wrap gap-1">
                {SPORTS.map((sport) => {
                  const active = activeSports.includes(sport);

                  return (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleSport(sport)}
                      className={`meta rounded-full border px-1.5 py-0.5 text-[8px] leading-none transition-colors ${
                        active
                          ? "border-ink bg-ink text-bg"
                          : "border-ink/20 text-ink hover:bg-ink hover:text-bg"
                      }`}
                    >
                      {SPORT_LABEL[sport]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </aside>
    </section>
  );
}
