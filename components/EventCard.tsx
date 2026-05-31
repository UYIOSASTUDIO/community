import { Event } from "@/lib/types";

const SPORT_LABELS: Record<string, string> = {
  basketball: "Basketball",
  football: "Fußball",
  volleyball: "Volleyball",
  beachvolley: "Beach Volleyball",
};

const TYPE_LABELS: Record<string, string> = {
  pickup: "Pickup",
  tournament: "Turnier",
};

const WEEKDAYS = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${WEEKDAYS[date.getDay()]} ${day}.${month}.${date.getFullYear()}`;
}

function Pill({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`meta inline-flex items-center rounded-full px-2.5 py-1 border ${
        light ? "border-bg/70 text-bg" : "border-line text-ink"
      }`}
    >
      {children}
    </span>
  );
}

function SignupButton({ event, full }: { event: Event; full: boolean }) {
  return (
    <a
      href={`mailto:${event.contact}?subject=Anmeldung: ${event.title}`}
      className={`meta border border-line px-4 py-2 transition-colors ${
        full
          ? "pointer-events-none opacity-30"
          : "bg-ink text-bg hover:bg-bg hover:text-ink"
      }`}
    >
      {full ? "Ausgebucht" : "Dabei sein →"}
    </a>
  );
}

/* Info text with a per-line highlight background that hugs each line's width */
function HighlightText({ children }: { children: React.ReactNode }) {
  return (
    <span className="box-decoration-clone bg-ink px-0 py-0.5 text-bg">
      {children}
    </span>
  );
}

/* ---------- Featured card (with image) ---------- */
function FeaturedCard({ event }: { event: Event }) {
  const full = event.spotsLeft === 0;

  return (
    <article className="mb-4 break-inside-avoid border border-black/10 bg-card overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]">
      {/* Image with overlays — hover only here */}
      <div className="group relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.image}
          alt={event.title}
          className="block w-full aspect-[4/5] object-cover grayscale"
        />

        {/* legibility gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/70 to-transparent" />

        {/* top row: sport (left) + tags (right) */}
        <div className="absolute top-0 inset-x-0 flex items-start justify-between gap-2 p-3 text-bg">
          <span className="meta">{SPORT_LABELS[event.sport]}</span>
          <div className="flex flex-wrap justify-end gap-1.5">
            <Pill light>{TYPE_LABELS[event.type]}</Pill>
          </div>
        </div>

        {/* bottom block: title, location, time */}
        <div className="absolute bottom-0 inset-x-0 p-4 text-bg">
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-[0.9]">
            {event.title}
          </h3>
          <p className="meta mt-2 text-bg/80">{event.location}</p>
          <p className="meta mt-3">
            {formatDate(event.date)} · {event.time} Uhr
          </p>
        </div>

        {/* hover blur overlay — covers only the image */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end gap-3 p-5 bg-bg/30 backdrop-blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="meta">
            <HighlightText>Details — {TYPE_LABELS[event.type]}</HighlightText>
          </p>
          <p className="text-sm leading-[1.5]">
            <HighlightText>{event.details || event.description}</HighlightText>
          </p>
        </div>
      </div>

      {/* below image: spots + button — always visible & clickable */}
      <div className="flex items-end justify-between gap-4 p-4 border-t border-black/10">
        <div className="leading-none">
          <span className="text-2xl font-black">{event.spotsLeft}</span>
          <span className="meta text-muted"> / {event.spots} frei</span>
        </div>
        <SignupButton event={event} full={full} />
      </div>
    </article>
  );
}

/* ---------- Simple card (no image) ---------- */
function SimpleCard({ event }: { event: Event }) {
  const full = event.spotsLeft === 0;

  return (
    <article className="mb-4 break-inside-avoid border border-black/10 bg-card overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] flex flex-col">
      {/* upper content — info text reveals on hover */}
      <div className="group relative p-5">
        {/* tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Pill>{SPORT_LABELS[event.sport]}</Pill>
          <Pill>{TYPE_LABELS[event.type]}</Pill>
        </div>

        {/* title */}
        <h3 className="mt-5 text-xl sm:text-2xl font-black uppercase tracking-tight leading-[0.95]">
          {event.title}
        </h3>

        {/* location + time */}
        <p className="meta mt-3">{event.location}</p>
        <p className="meta mt-2 text-muted">
          {formatDate(event.date)} · {event.time} Uhr
        </p>

        {/* hover blur overlay — info text only here */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end gap-3 p-5 bg-bg/30 backdrop-blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="meta">
            <HighlightText>Details — {TYPE_LABELS[event.type]}</HighlightText>
          </p>
          <p className="text-sm leading-[1.5]">
            <HighlightText>{event.details || event.description}</HighlightText>
          </p>
        </div>
      </div>

      {/* footer — full-width divider, always visible */}
      <div className="flex items-end justify-between gap-4 p-4 border-t border-black/10">
        <div className="leading-none">
          <span className="text-2xl font-black">{event.spotsLeft}</span>
          <span className="meta text-muted"> / {event.spots} frei</span>
        </div>
        <SignupButton event={event} full={full} />
      </div>
    </article>
  );
}

export default function EventCard({ event }: { event: Event }) {
  if (event.featured && event.image) {
    return <FeaturedCard event={event} />;
  }
  return <SimpleCard event={event} />;
}
