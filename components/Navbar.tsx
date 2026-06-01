"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Community" },
  { href: "/events", label: "Events" },
  { href: "/courts", label: "Courts" },
  { href: "/kalender", label: "Kalender" },
  { href: "/subscribe", label: "Newsletter" },
];

const MOBILE_LINKS = LINKS.filter((link) => link.href !== "/subscribe");

const SOCIAL_LINKS: { href: string; label: string }[] = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "TikTok" },
  { href: "#", label: "YouTube" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // `render` keeps the overlay in the DOM only while it's open or animating
  // out. `shown` drives the slide transition. Unmounting when closed is what
  // stops iOS Safari from treating a permanent full-screen fixed element as a
  // modal and leaving its address bar (grey band) expanded.
  const [render, setRender] = useState(false);
  const [shown, setShown] = useState(false);

  // Portal target is only available on the client.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Open: mount the overlay, then flip `shown` true one frame later so the
  // slide-down transition runs.
  // Close: flip `shown` false to play the slide-up transition, then unmount
  // once it finishes (matches the 300ms transition duration).
  useEffect(() => {
    if (open) {
      setRender(true);
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    if (!render) return;

    setShown(false);
    const timeout = window.setTimeout(() => setRender(false), 320);
    return () => window.clearTimeout(timeout);
  }, [open, render]);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape while the menu is open. (No body scroll-lock: on iOS
  // Safari that forces the address bar open and leaves a grey band.)
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Auto-close if the viewport grows to desktop.
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  // Slides down from behind the fixed chrome (z-40 < chrome z-50).
  // Content is pushed below the chrome via pt-16 so nothing hides behind it.
  const overlay = (
    <div
      id="mobile-navigation"
      aria-hidden={!shown}
      className={`fixed inset-0 z-40 flex flex-col bg-bg pt-16 md:hidden transition-transform duration-300 ease-out ${
        shown ? "translate-y-0" : "pointer-events-none -translate-y-full"
      }`}
    >
      {/* Pages — stacked at the top */}
      <nav className="flex flex-1 flex-col justify-start gap-6 px-4 sm:px-6 pt-10">
        {MOBILE_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-3xl font-black uppercase leading-none tracking-tight ${
                active ? "opacity-100" : "opacity-40"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Newsletter + Social — pinned to the bottom */}
      <div className="shrink-0 border-t border-ink/10 px-4 sm:px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-7">
        <Link
          href="/subscribe"
          onClick={() => setOpen(false)}
          className="flex items-center justify-between rounded-full bg-ink px-6 py-4 text-bg transition-opacity hover:opacity-80"
        >
          <span className="meta text-bg">Newsletter abonnieren</span>
          <span aria-hidden className="text-lg leading-none">
            →
          </span>
        </Link>

        <div className="mt-7 flex items-center gap-7">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="meta opacity-55 transition-opacity hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <header className="relative z-50 w-full bg-bg/70 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-bg/60">
      <div className="flex h-9 items-center justify-between px-4 sm:px-6">
        {/* Wordmark — left */}
        <Link href="/" className="text-sm font-black uppercase leading-none tracking-tight">
          Courtside
        </Link>

        {/* Links — desktop */}
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`meta transition-opacity hover:opacity-100 ${
                  active ? "opacity-100" : "opacity-45"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger / Close toggle — mobile */}
        <button
          type="button"
          aria-label={open ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
          className="relative -mr-2 h-9 w-9 md:hidden"
        >
          <span
            aria-hidden
            className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-ink transition-transform duration-300 ease-out ${
              open ? "rotate-45" : "-translate-y-1"
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-ink transition-transform duration-300 ease-out ${
              open ? "-rotate-45" : "translate-y-1"
            }`}
          />
        </button>
      </div>

      {/* Mobile overlay — portaled to <body> so it escapes the header's
          backdrop-filter containing block. Only mounted while open/animating
          so it never lingers as a permanent full-screen fixed element. */}
      {mounted && render ? createPortal(overlay, document.body) : null}
    </header>
  );
}
