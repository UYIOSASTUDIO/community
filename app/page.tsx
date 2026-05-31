import Link from "next/link";
import { getUpcomingEvents } from "@/lib/events";
import Masonry from "@/components/Masonry";

const SPORTS = [
  { key: "basketball", label: "Street Basketball" },
  { key: "football", label: "Fußball" },
  { key: "volleyball", label: "Volleyball" },
  { key: "beachvolley", label: "Beach Volleyball" },
];

const STEPS = [
  {
    step: "01",
    title: "Event finden",
    text: "Schau welches Spiel oder Turnier als nächstes ist. Datum, Ort, Sportart — alles auf einen Blick.",
  },
  {
    step: "02",
    title: "Zeig dich",
    text: "Meld dich per Mail an oder komm einfach vorbei. Keine langen Prozesse, kein Papierkram.",
  },
  {
    step: "03",
    title: "Spiel mit",
    text: "Triff Menschen, die genauso Bock auf Sport haben wie du. Draußen, gemeinsam, regelmäßig.",
  },
];

export default function Home() {
  const upcomingEvents = getUpcomingEvents().slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* TITLE BAR IMAGE — 1920×180 */}
      <section className="border-b border-line grayscale py-[20px]">
        <img
          src="/sport.svg"
          alt="Courtside"
          width={1920}
          height={180}
          className="block w-full h-auto"
        />
      </section>

      {/* MISSION — Was wir sind */}
      <section className="border-b border-line">
        <div className="px-4 sm:px-6 py-4 border-b border-line">
          <p className="meta text-muted">Was wir sind</p>
        </div>
        <div className="px-4 sm:px-6 py-10">
          <p className="text-xl sm:text-3xl leading-snug font-medium max-w-4xl">
            Courtside bringt Leute wieder raus. Keine Vereinsmitgliedschaft, keine Wartelisten —
            einfach zeigen, spielen, Community aufbauen. Wir organisieren regelmäßige Treffen und
            Turniere in Street Basketball, Fußball, Volleyball und Beach Volleyball.
            Jeder ist willkommen, egal welches Level.
          </p>
        </div>
      </section>

      {/* SPORTARTEN — Buttons */}
      <section className="border-b border-line">
        <div className="px-4 sm:px-6 py-4 border-b border-line">
          <p className="meta text-muted">Sportarten — Womit wir spielen</p>
        </div>
        <div className="flex flex-wrap gap-2 px-4 sm:px-6 py-6 border-b border-line">
          {SPORTS.map((sport) => (
            <Link
              key={sport.key}
              href={`/events?sport=${sport.key}`}
              className="meta inline-flex items-center rounded-full bg-ink text-bg px-4 py-2 border border-ink hover:bg-bg hover:text-ink transition-colors"
            >
              {sport.label}
            </Link>
          ))}
        </div>
      </section>

      {/* EVENTS — Kacheln */}
      <section className="border-b border-line">
        <div className="px-4 sm:px-6 py-4 border-b border-line flex items-center justify-between">
          <p className="meta text-muted">Nächste Treffen</p>
          <Link href="/events" className="meta hover:underline">
            Alle sehen →
          </Link>
        </div>
        <Masonry events={upcomingEvents} />
      </section>

      {/* SO LÄUFT'S */}
      <section className="border-b border-line">
        <div className="px-4 sm:px-6 py-4 border-b border-line">
          <p className="meta text-muted">So läuft&apos;s</p>
        </div>
        <div className="grid md:grid-cols-3 bg-line gap-px">
          {STEPS.map((item) => (
            <div key={item.step} className="bg-card px-4 sm:px-6 py-10">
              <p className="text-5xl font-black tracking-tighter">{item.step}</p>
              <h3 className="mt-6 text-lg font-black uppercase tracking-tight">{item.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="bg-ink text-bg">
        <div className="grid lg:grid-cols-[1fr_auto] items-center gap-8 px-4 sm:px-6 py-12">
          <div>
            <p className="meta text-bg/50 mb-3">Kein Event verpassen</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
              Newsletter<br />abonnieren
            </h2>
            <p className="mt-4 text-sm text-bg/60 max-w-md">
              Neue Events, Turniere und Community-Updates direkt in dein Postfach.
            </p>
          </div>
          <Link
            href="/subscribe"
            className="meta bg-bg text-ink px-8 py-4 border border-bg hover:bg-ink hover:text-bg transition-colors shrink-0 justify-self-start"
          >
            Anmelden →
          </Link>
        </div>
      </section>
    </div>
  );
}
