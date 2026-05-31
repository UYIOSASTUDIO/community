import { Event } from "./types";
import eventsData from "@/data/events.json";

export function getAllEvents(): Event[] {
  return eventsData as Event[];
}

export function getUpcomingEvents(): Event[] {
  const today = new Date().toISOString().split("T")[0];
  return getAllEvents()
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date > b.date ? 1 : -1));
}

export function getEventsBySport(sport: string): Event[] {
  return getUpcomingEvents().filter((e) => e.sport === sport);
}
