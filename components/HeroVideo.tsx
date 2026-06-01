"use client";

import { useEffect, useRef } from "react";

/**
 * Hero-Video mit Tap/Klick = Play/Pause.
 *
 * - Startet das Video aktiv beim Mount (zuverlässiger als nur das autoPlay-
 *   Attribut, das bei nachgeladenen/fixierten Elementen manchmal nicht feuert).
 * - Eine transparente Button-Ebene LIEGT ÜBER dem Video und fängt die Taps ab.
 *   Sonst kollidiert auf iOS Safari der native Play-Button mit unserem Handler
 *   (nativer Button startet, unser Handler pausiert sofort wieder → man müsste
 *   zweimal tippen).
 * - `className` steuert die Positionierung des Wrappers, damit dieselbe
 *   Komponente als fixierter Desktop-Hintergrund und als Inline-Video auf
 *   Mobile genutzt werden kann.
 */
export default function HeroVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // muted ist Voraussetzung für Autoplay
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        /* Autoplay vom Browser/iOS geblockt — dann startet der erste Tap. */
      });
    }
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.muted = true;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  return (
    <div className={`overflow-hidden bg-ink ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/title-bar.png"
        tabIndex={-1}
      >
        <source src="/video/nike-vid.mp4" type="video/mp4" />
      </video>

      {/* Transparente Tap-Ebene über dem Video — fängt Taps ab, bevor iOS'
          nativer Play-Button sie bekommt. Ein Tap = Play/Pause. */}
      <button
        type="button"
        aria-label="Video abspielen oder pausieren"
        onClick={toggle}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer bg-transparent focus:outline-none"
      />
    </div>
  );
}
