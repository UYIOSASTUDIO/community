# Events hinzufügen

Öffne die Datei `data/events.json` und füge ein neues Objekt am Ende des Arrays hinzu:

```json
{
  "id": "9",
  "title": "Street Basketball Pickup",
  "sport": "basketball",
  "date": "2026-07-05",
  "time": "16:00",
  "location": "Sportplatz Schillerpark, Berlin",
  "address": "Schillerstraße 12, 13409 Berlin",
  "description": "Kurze Beschreibung des Events.",
  "type": "pickup",
  "spots": 20,
  "spotsLeft": 20,
  "contact": "deine@mail.de"
}
```

## Felder

| Feld | Wert |
|------|------|
| `id` | Eindeutige Zahl — einfach um 1 erhöhen |
| `sport` | `basketball` / `football` / `volleyball` / `beachvolley` |
| `date` | Format `YYYY-MM-DD` |
| `time` | Format `HH:MM` |
| `type` | `pickup` (casual) oder `tournament` (Turnier) |
| `spots` | Gesamtplätze |
| `spotsLeft` | Freie Plätze (aktuell halten) |
| `contact` | E-Mail für Anmeldungen |

Nach dem Speichern von `events.json`: einfach auf Vercel deployen (automatisch via Git Push wenn verbunden), das Event erscheint sofort.

## Vercel Deploy

```bash
git add data/events.json
git commit -m "Add new event: [Titel]"
git push
```

Vercel baut automatisch neu und das Event ist live.
