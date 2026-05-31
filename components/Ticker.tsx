import { getUpcomingEvents } from "@/lib/events";

const SPORT_LABELS: Record<string, string> = {
  basketball: "Street Basketball",
  football: "Fußball",
  volleyball: "Volleyball",
  beachvolley: "Beach Volleyball",
};

function formatShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");

  return `${day}.${month}.`;
}

export default function Ticker() {
  const events = getUpcomingEvents().slice(0, 6);

  const items =
    events.length > 0
      ? events.map(
          (e) =>
            `NÄCHSTES GAME — ${SPORT_LABELS[e.sport] ?? e.sport} · ${e.location} · ${formatShort(
              e.date
            )} · ${e.time} UHR`
        )
      : ["RAUS AUF DEN PLATZ — KEINE VEREINE, KEINE WARTELISTEN, EINFACH SPIELEN"];

  // Duplicate the sequence so the marquee loops seamlessly at -50%.
  const sequence = [...items, ...items];

  return (
    <div className="marquee-mask w-full overflow-hidden bg-ink text-bg border-b border-line select-none">
      <div className="marquee-track py-2">
        {sequence.map((text, i) => (
          <span key={i} className="meta inline-flex items-center">
            <span className="px-6">{text}</span>
            <span aria-hidden className="opacity-50">
              ●○
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
