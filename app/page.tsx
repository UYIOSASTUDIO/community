import Link from "next/link";
import { getUpcomingEvents } from "@/lib/events";
import Masonry from "@/components/Masonry";
import HeroVideo from "@/components/HeroVideo";

const SPORTS = [
  { key: "basketball", label: "Street Basketball" },
  { key: "football", label: "Fußball" },
  { key: "volleyball", label: "Volleyball" },
  { key: "beachvolley", label: "Beach Volleyball" },
];

// Motto im Blocksatz — jede Gruppe (ein oder mehrere Wörter) bekommt einen
// eigenen Background. Mehrwort-Gruppen bleiben als Block zusammen, nur die
// Lücken zwischen den Gruppen werden im Blocksatz gestreckt.
const SLOGAN = [
  "NO MEMBERSHIP",
  "NO WAITLIST",
  "NO EXCUSES",
  "JUST SHOW UP",
  "PLAY HARD",
  "OWN THE GAME",
  "RUN IT BACK",
  "BELONG HERE",
  "EVERY SINGLE DAY",
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
      {/* HERO video — FIXED background. It stays put while the SVG and the
          content below scroll up and over it. z-0 keeps it behind the opaque
          content sheet; the transparent hero spacer reveals it. Click toggles
          play/pause. */}
      <HeroVideo />

      {/* HERO spacer — transparent, full viewport height. Reveals the fixed
          video behind it. The SVG is pinned to its bottom and scrolls up over
          the video as the page moves. -mt-16 pulls it under the fixed chrome.
          pointer-events-none lets clicks fall through to the video. */}
      <section className="pointer-events-none relative z-10 -mt-16 h-[100svh] w-full">
        {/* SVG overlay — full width minus header padding, pinned to bottom.
            Two variants: sport-desktop.svg from lg up (desktop + iPad landscape ≥1024px),
            sport-mobile.svg below that (phones + iPad portrait). */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <img
            src="/sport-mobile.svg"
            alt="Courtside"
            width={217}
            height={53}
            className="block lg:hidden w-full h-auto mix-blend-exclusion"
          />
          <img
            src="/sport-desktop.svg"
            alt="Courtside"
            width={217}
            height={33}
            className="hidden lg:block w-full h-auto mix-blend-exclusion"
          />
        </div>
      </section>

      {/* CONTENT SHEET — opaque; scrolls up over the fixed hero video and
          covers it. Everything below the hero lives in here. */}
      <div className="relative z-20 bg-bg">

      {/* SLOGAN — Motto im Blocksatz, Wortgruppen mit eigenem Background */}
      <section className="border-b border-line px-4 sm:px-6 py-12 sm:py-16">
        <p
          className="font-black uppercase tracking-tight text-[clamp(1rem,4vw,1.875rem)] leading-[2.2] sm:leading-[2.1]"
          style={{ textAlign: "justify", textAlignLast: "justify" }}
        >
          {SLOGAN.map((group, i) => (
            <span key={i}>
              <span className="inline-block whitespace-nowrap leading-[0.8] text-[#9a9a9a] px-[0.12em] py-[0.04em]">
                {group}
              </span>{" "}
            </span>
          ))}
        </p>
      </section>

      {/* MISSION — Was wir sind */}
      <section className="border-b border-line px-4 sm:px-6 py-10">
        <p className="meta text-muted mb-3">Was wir sind</p>
        <p className="text-xl sm:text-3xl leading-snug font-extrabold max-w-4xl">
          Courtside bringt Leute wieder raus. Keine Vereinsmitgliedschaft, keine Wartelisten —
          einfach zeigen, spielen, Community aufbauen. Wir organisieren regelmäßige Treffen und
          Turniere in Street Basketball, Fußball, Volleyball und Beach Volleyball.
          Jeder ist willkommen, egal welches Level.
        </p>
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
    </div>
  );
}
