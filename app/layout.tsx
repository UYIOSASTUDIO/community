import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Ticker from "@/components/Ticker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ebebeb",
};

export const metadata: Metadata = {
  title: "Courtside — Street Sports Community",
  description:
    "Wir bringen Leute wieder raus auf den Platz. Street Basketball, Fußball, Volleyball und mehr — find dein nächstes Game.",
  openGraph: {
    title: "Courtside — Street Sports Community",
    description: "Street Basketball, Fußball, Volleyball und mehr. Komm spielen.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg">
        {/* Fixed chrome stays pinned to the top of the visual viewport. */}
        <div className="fixed inset-x-0 top-0 z-50">
          <Ticker />
          <Navbar />
        </div>

        {/* Natural document scroll — no inner scroll container, no fixed
            viewport-height box. This is what lets content reach the true
            bottom edge on iOS Safari instead of stopping above its bar. */}
        <div className="pt-16">
          <main className="w-full">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
