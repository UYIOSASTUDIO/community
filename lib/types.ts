export type Sport = "basketball" | "football" | "volleyball" | "beachvolley";
export type EventType = "pickup" | "tournament";

export interface Event {
  id: string;
  title: string;
  sport: Sport;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  address: string;
  description: string;
  type: EventType;
  spots: number;
  spotsLeft: number;
  contact: string;
  /** Besondere Events bekommen eine Bildkarte. */
  featured?: boolean;
  /** Pfad zum Karten-Bild (z.B. /events/basketball.jpg). */
  image?: string;
  /** Kurzinfo fürs Hover-Overlay (Spielart, Regeln …). */
  details?: string;
}
