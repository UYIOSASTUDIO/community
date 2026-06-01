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
    <footer className="h-7 w-full select-none overflow-hidden border-t border-bg/10 bg-ink text-bg">
      <div className="flex h-full items-center justify-between gap-6 px-4 sm:px-6">
        <span className="meta">© {year} Courtside — Street Sports Community</span>

        <nav className="hidden items-center gap-6 md:flex">
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

        <nav className="hidden items-center gap-6 md:flex">
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
    </footer>
  );
}
