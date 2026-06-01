import Link from "next/link";

const PAGES: { href: string; label: string }[] = [
  { href: "/events", label: "Events" },
  { href: "/courts", label: "Courts" },
  { href: "/kalender", label: "Kalender" },
  { href: "/subscribe", label: "Newsletter" },
];

// TODO: echte Profil-URLs eintragen.
const SOCIALS: { href: string; label: string }[] = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "TikTok" },
  { href: "#", label: "YouTube" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full select-none border-t border-bg/10 bg-ink text-bg">
      {/* DESKTOP — schmale Bar im Marquee-Stil (gleiche Dicke py-2, meta-Text),
          aber statisch ohne Scroll. */}
      <div className="hidden items-center justify-between gap-6 px-4 py-2 sm:px-6 md:flex">
        <span className="meta">© {year} Courtside — Street Sports Community</span>

        <nav className="flex items-center gap-6">
          {PAGES.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="meta opacity-70 transition-opacity hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="flex items-center gap-6">
          {SOCIALS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="meta opacity-70 transition-opacity hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* MOBILE — Links untereinander, nach Kategorie gruppiert. */}
      <div className="flex flex-col gap-8 px-4 py-10 md:hidden">
        <div>
          <p className="meta mb-4 opacity-50">Seiten</p>
          <div className="flex flex-col gap-3">
            {PAGES.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.12em] opacity-80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="meta mb-4 opacity-50">Social</p>
          <div className="flex flex-col gap-3">
            {SOCIALS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.12em] opacity-80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <p className="meta border-t border-bg/10 pt-6 opacity-50">
          © {year} Courtside — Street Sports Community
        </p>
      </div>
    </footer>
  );
}
