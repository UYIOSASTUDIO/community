import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "E-Mail-Versand ist nicht konfiguriert." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse." }, { status: 400 });
    }

    // 1. Add subscriber to Resend audience
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        firstName: name || undefined,
        audienceId: process.env.RESEND_AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // 2. Send welcome email to subscriber
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "PICKUP <onboarding@resend.dev>",
      to: email,
      subject: "Du bist dabei — willkommen bei PICKUP 🏀",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 560px; margin: 0 auto; background: #ebebeb; padding: 40px 24px;">
          <div style="background: #fff; padding: 40px; box-shadow: 6px 6px 0px rgba(0,0,0,0.10);">
            <p style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #888; margin: 0 0 16px;">
              PICKUP — Street Sports Community
            </p>
            <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1; margin: 0 0 20px; color: #111;">
              ${name ? `Hey ${name},` : "Hey,"}<br/>du bist dabei.
            </h1>
            <p style="font-size: 13px; line-height: 1.7; color: #555; margin: 0 0 24px;">
              Ab jetzt kriegst du als Erstes Bescheid wenn neue Events, Treffen oder Turniere
              angekündigt werden. Wir freuen uns, dass du Teil der Community bist.
            </p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://pickup-community.vercel.app"}/events"
               style="display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; background: #111; color: #fff; padding: 12px 24px; text-decoration: none;">
              Events ansehen →
            </a>
            <p style="font-size: 10px; color: #aaa; margin: 32px 0 0; letter-spacing: 0.05em;">
              Du bekommst diese Mail weil du dich auf pickup-community.vercel.app angemeldet hast.
            </p>
          </div>
        </div>
      `,
    });

    // 3. Notify admin
    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "PICKUP <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: `Neuer Newsletter-Abonnent: ${email}`,
        html: `<p>Neuer Abonnent: <strong>${email}</strong>${name ? ` (${name})` : ""}</p>`,
      });
    }

    return NextResponse.json({ message: "Erfolgreich angemeldet!" }, { status: 200 });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Anmeldung fehlgeschlagen. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
