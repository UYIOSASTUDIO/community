"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Court } from "@/lib/courts";
import { Sport } from "@/lib/types";

/** Free, key-less dark vector basemap (WebGL → buttery smooth). */
const STYLE_URL = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const SPORT_ICON: Record<Sport, string> = {
  basketball: "/sports/basketball.png",
  football: "/sports/basketball.png",
  volleyball: "/sports/basketball.png",
  beachvolley: "/sports/basketball.png",
};

const SPORT_LABEL: Record<Sport, string> = {
  basketball: "Basketball",
  football: "Fußball",
  volleyball: "Volleyball",
  beachvolley: "Beach Volleyball",
};

function getCameraPadding(container: HTMLDivElement): maplibregl.PaddingOptions {
  const compact = container.clientWidth < 640;

  return compact
    ? { top: 112, bottom: Math.round(container.clientHeight * 0.48), left: 40, right: 40 }
    : { top: 134, bottom: 70, left: 70, right: 430 };
}

function getCameraOffset(container: HTMLDivElement): [number, number] {
  const compact = container.clientWidth < 640;

  return compact ? [0, -container.clientHeight * 0.18] : [-180, 0];
}

interface Props {
  courts: Court[];
  visibleCourtIds: string[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CourtMap({
  courts,
  visibleCourtIds,
  selectedId,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const visibleCourtIdsRef = useRef(visibleCourtIds);
  visibleCourtIdsRef.current = visibleCourtIds;
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

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
    map.on("click", () => onSelectRef.current(null));

    // Build a marker per court.
    courts.forEach((court) => {
      const primarySport = court.sports[0];

      const el = document.createElement("button");
      el.type = "button";
      el.className = "court-marker";
      el.setAttribute("aria-label", court.name);
      if (!visibleCourtIdsRef.current.includes(court.id)) {
        el.style.display = "none";
      }

      const iconWrap = document.createElement("span");
      iconWrap.className = "court-marker__icon";

      const icon = document.createElement("img");
      icon.src = SPORT_ICON[primarySport] ?? SPORT_ICON.basketball;
      icon.alt = "";
      icon.decoding = "async";
      icon.draggable = false;

      iconWrap.appendChild(icon);
      el.appendChild(iconWrap);

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
        map.fitBounds(bounds, {
          padding: getCameraPadding(containerRef.current!),
          maxZoom: 14,
          duration: 0,
        });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [courts]);

  useEffect(() => {
    const visible = new Set(visibleCourtIds);

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.getElement().style.display = visible.has(id) ? "" : "none";
    });
  }, [visibleCourtIds]);

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

    map.flyTo({
      center: [court.lng, court.lat],
      zoom: 14,
      offset: getCameraOffset(containerRef.current!),
      speed: 1.2,
      essential: true,
    });

    const popup = new maplibregl.Popup({
      offset: 34,
      closeButton: false,
      closeOnClick: false,
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

  return <div ref={containerRef} className="courts-map h-full w-full" />;
}
