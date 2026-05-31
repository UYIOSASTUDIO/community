import Link from "next/link";

const LINKS: { href: string; label: string }[] = [
  { href: "/events", label: "Events" },
  { href: "/kalender", label: "Kalender" },
  { href: "/subscribe", label: "Newsletter" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-line mt-24">
      {/* Big wordmark band */}
      <div className="border-b border-line px-4 sm:px-6 py-10">
        <p className="text-[14vw] sm:text-[10vw] font-black uppercase tracking-tighter leading-[0.85]">
          Raus auf den Platz.
        </p>
      </div>

      {/* Meta row */}
      <div className="flex flex-col sm:flex-row items-stretch">
        <div className="flex items-center px-4 sm:px-6 py-4 border-b sm:border-b-0 sm:border-r border-line">
          <span className="meta">Courtside — Street Sports Community</span>
        </div>
        <nav className="flex flex-1 items-stretch">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="meta flex items-center px-4 sm:px-6 py-4 border-r border-line hover:bg-ink hover:text-bg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center px-4 sm:px-6 py-4 sm:ml-auto border-t border-line sm:border-t-0">
          <span className="meta text-muted">© {year} Courtside</span>
        </div>
      </div>
    </footer>
  );
}
