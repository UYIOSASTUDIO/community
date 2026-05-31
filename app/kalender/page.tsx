import { getAllEvents } from "@/lib/events";
import EventCalendar from "@/components/EventCalendar";
import EventCard from "@/components/EventCard";

export default function KalenderPage() {
  const events = getAllEvents();
  const today = new Date().toISOString().split("T")[0];
  const upcoming = events
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-line px-4 sm:px-6 py-10">
        <p className="meta text-muted mb-4">Monatsübersicht</p>
        <h1 className="text-[14vw] lg:text-[7vw] font-black uppercase tracking-tighter leading-[0.85]">
          Kalender
        </h1>
      </section>

      <div className="grid lg:grid-cols-[1fr_380px]">
        {/* Event list */}
        <div className="lg:border-r border-line">
          <div className="px-4 sm:px-6 py-4 border-b border-line">
            <p className="meta text-muted">Kommende Events</p>
          </div>
          {upcoming.length > 0 ? (
            <div className="px-4 sm:px-6 py-6">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="px-4 sm:px-6 py-24 text-center border-b border-line">
              <p className="text-2xl font-black uppercase tracking-tight text-muted">
                Keine Events geplant
              </p>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="border-t lg:border-t-0 border-line">
          <div className="px-4 sm:px-6 py-4 border-b border-line">
            <p className="meta text-muted">Monatsansicht</p>
          </div>
          <div className="lg:sticky lg:top-[97px]">
            <EventCalendar events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
