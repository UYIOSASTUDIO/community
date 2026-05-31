"use client";

import { useState } from "react";

const PERKS = [
  "Neue Events und Treffen — sobald sie online gehen",
  "Turnierankündigungen mit frühem Anmeldezugang",
  "Community-Updates und neue Sportarten",
  "Kein Spam. Abmeldung jederzeit.",
];

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Du bist dabei!");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Etwas hat nicht geklappt. Versuch es nochmal.");
      }
    } catch {
      setStatus("error");
      setMessage("Verbindungsfehler. Bitte nochmal versuchen.");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-line px-4 sm:px-6 py-10">
        <p className="meta text-muted mb-4">Immer auf dem Stand</p>
        <h1 className="text-[14vw] lg:text-[7vw] font-black uppercase tracking-tighter leading-[0.85]">
          Newsletter
        </h1>
      </section>

      <div className="grid lg:grid-cols-2">
        {/* Perks */}
        <div className="lg:border-r border-line">
          <div className="px-4 sm:px-6 py-4 border-b border-line">
            <p className="meta text-muted">Was du bekommst</p>
          </div>
          <div className="flex flex-col">
            {PERKS.map((item, i) => (
              <div key={item} className="flex gap-4 px-4 sm:px-6 py-6 border-b border-line">
                <span className="meta text-muted shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="border-t lg:border-t-0 border-line">
          <div className="px-4 sm:px-6 py-4 border-b border-line">
            <p className="meta text-muted">Anmeldung</p>
          </div>

          {status === "success" ? (
            <div className="px-4 sm:px-6 py-20 text-center">
              <p className="text-3xl font-black uppercase tracking-tighter mb-3">Du bist dabei!</p>
              <p className="meta text-muted">
                Check dein Postfach — wir melden uns bei den nächsten Events.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 border-b border-line">
                <label className="meta text-muted">Name (optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dein Vorname"
                  className="bg-bg border border-line px-4 py-3 text-sm font-medium placeholder:text-muted outline-none focus:bg-card transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 border-b border-line">
                <label className="meta text-muted">E-Mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@mail.de"
                  required
                  className="bg-bg border border-line px-4 py-3 text-sm font-medium placeholder:text-muted outline-none focus:bg-card transition-colors"
                />
              </div>

              {status === "error" && (
                <p className="meta text-red-600 px-4 sm:px-6 pt-4">{message}</p>
              )}

              <div className="px-4 sm:px-6 py-6">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="meta w-full bg-ink text-bg border border-line px-6 py-4 hover:bg-bg hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Wird angemeldet…" : "Newsletter abonnieren →"}
                </button>
                <p className="text-[11px] text-muted mt-4 leading-relaxed">
                  Mit der Anmeldung stimmst du zu, E-Mails über Events und Updates zu erhalten.
                  Abmeldung jederzeit möglich.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
