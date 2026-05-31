# PICKUP — Setup Guide

## 1. Dependencies installieren

```bash
npm install
```

## 2. Umgebungsvariablen einrichten

```bash
cp .env.example .env.local
```

Dann `.env.local` ausfüllen:

- **RESEND_API_KEY** — Kostenloser Account auf [resend.com](https://resend.com). Unter "API Keys" erstellen.
- **RESEND_AUDIENCE_ID** — In Resend unter "Audiences" eine neue Audience erstellen, ID kopieren.
- **FROM_EMAIL** — Erst wenn du eine eigene Domain in Resend verifiziert hast. Zum Testen: `onboarding@resend.dev` (sendet nur an deine Resend-Account-Mail).
- **ADMIN_EMAIL** — Deine E-Mail für Benachrichtigungen bei neuen Abonnenten.

## 3. Lokal starten

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## 4. Auf Vercel deployen

### Option A: Via CLI
```bash
npx vercel
```

### Option B: Via GitHub (empfohlen)
1. Repo auf GitHub pushen
2. Auf [vercel.com](https://vercel.com) einloggen
3. "New Project" → GitHub Repo auswählen
4. Umgebungsvariablen aus `.env.example` unter "Environment Variables" eintragen
5. Deploy!

Bei jedem `git push` auf `main` deployt Vercel automatisch.

## 5. Events hinzufügen

Siehe `HOW_TO_ADD_EVENTS.md`

## 6. Community-Name ändern

Suche nach `PICKUP` in diesen Dateien und ersetze mit deinem Namen:
- `app/layout.tsx` (Metadata)
- `components/Navbar.tsx`
- `components/Footer.tsx`
- `app/page.tsx`
