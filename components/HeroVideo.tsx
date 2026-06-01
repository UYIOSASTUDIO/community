"use client";

import { useRef } from "react";

/**
 * Fixierter Video-Hintergrund. Klick aufs Video schaltet Play/Pause —
 * praktisch, falls der Browser den Autoplay blockt. Der Hero-Spacer darüber
 * ist pointer-events-none, damit die Klicks bis hierher durchkommen.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink">
      <video
        ref={ref}
        onClick={toggle}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/title-bar.png"
      >
        <source src="/video/nike-vid.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
