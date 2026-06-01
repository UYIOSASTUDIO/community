"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Trägt das gesamte Fenster-Scrolling über Lenis ab, damit sich das Scrollen
 * weich / "lazy" anfühlt (das Viewport zieht der Maus mit etwas Verzögerung
 * hinterher). Auf Touch-Geräten bleibt das native Scrolling aktiv
 * (smoothTouch: false) — wichtig für das iOS-Safari-Verhalten der Adressleiste.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Respektiere die System-Einstellung "Bewegung reduzieren".
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      // Kleinerer Wert = träger / mehr Nachlauf.
      lerp: 0.075,
      wheelMultiplier: 1,
      smoothWheel: true,
      // Touch bleibt nativ (kein Smooth) für gutes Mobile-Verhalten.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
