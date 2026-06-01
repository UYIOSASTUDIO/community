"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Court } from "@/lib/courts";
import { Sport } from "@/lib/types";

/** Free, key-less dark vector basemap (WebGL → buttery smooth). */
const STYLE_URL = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const SPORT_COLOR: Record<Sport, string> = {
  basketball: "#ff6a2b",
  football: "#3ddc84",
  volleyball: "#ffd23f",
  beachvolley: "#36c5f0",
};

const SPORT_LABEL: Record<Sport, string> = {
  basketball: "Basketball",
  football: "Fußball",
  volleyball: "Volleyball",
  beachvolley: "Beach Volleyball",
};

interface Props {
  courts: Court[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CourtMap({ courts, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  // Keep the latest onSelect without re-initialising the map.
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // ---- Initialise the map once. ----
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [13.404, 52.508],
      zoom: 10,
      attributionControl: false,
      cooperativeGestures: true, // page scroll stays smooth; ctrl/2-finger to zoom
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    // Build a marker per court.
    courts.forEach((court) => {
      const color = SPORT_COLOR[court.sports[0]] ?? "#ffffff";

      const el = document.createElement("button");
      el.type = "button";
      el.className = "court-marker";
      el.setAttribute("aria-label", court.name);
      el.innerHTML = `<span class="court-marker__dot" style="--c:${color}"></span>`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current(court.id);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([court.lng, court.lat])
        .addTo(map);

      markersRef.current[court.id] = marker;
    });

    // Frame all courts once the style is ready.
    map.on("load", () => {
      const bounds = new maplibregl.LngLatBounds();
      courts.forEach((c) => bounds.extend([c.lng, c.lat]));
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 70, maxZoom: 14, duration: 0 });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [courts]);

  // ---- React to selection: highlight marker, fly to it, show popup. ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.getElement().classList.toggle("is-active", id === selectedId);
    });

    if (!selectedId) return;
    const court = courts.find((c) => c.id === selectedId);
    if (!court) return;

    map.flyTo({ center: [court.lng, court.lat], zoom: 14, speed: 1.2, essential: true });

    const popup = new maplibregl.Popup({
      offset: 18,
      closeButton: false,
      className: "court-popup",
    })
      .setLngLat([court.lng, court.lat])
      .setHTML(
        `<div class="court-popup__name">${court.name}</div>
         <div class="court-popup__meta">${court.sports
           .map((s) => SPORT_LABEL[s])
           .join(" · ")}</div>
         <div class="court-popup__addr">${court.address}</div>`
      )
      .addTo(map);

    return () => {
      popup.remove();
    };
  }, [selectedId, courts]);

  return <div ref={containerRef} className="h-full w-full" />;
}
