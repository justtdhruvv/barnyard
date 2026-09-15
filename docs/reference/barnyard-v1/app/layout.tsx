import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { cafe, siteUrl } from "@/lib/cafe";
import { LightScript } from "@/components/light/LightScript";
import { LightProvider } from "@/components/light/LightProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { motionScript } from "@/lib/motion/prefs";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

/*
 * Two families. Bricolage Grotesque for display and labels, pinned to static
 * instances (display cut opsz 96, wdth 88, wght 300; a UI cut at 400). Rasa
 * for reading: Rosetta's text face for Gujarati and Latin, subset to Latin and
 * the rupee sign. Weight selects the Bricolage cut.
 */
const bricolage = localFont({
  src: [
    { path: "../assets/fonts/bricolage-display.woff2", weight: "300", style: "normal" },
    { path: "../assets/fonts/bricolage-ui.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-bricolage",
  display: "swap",
  adjustFontFallback: "Arial",
});

/* The italic (pull quotes, placeholder subjects) is declared in globals.css and
   fetched only when italic text renders, keeping it off the first-paint chain. */
const rasa = localFont({
  src: [{ path: "../assets/fonts/rasa-text.woff2", weight: "400", style: "normal" }],
  variable: "--font-rasa",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${cafe.meta.name}, a loft house in Chandkheda, Ahmedabad`,
    template: `%s | ${cafe.meta.name}`,
  },
  description: `A 10,000 sq ft design-led cafe in Chandkheda, North Ahmedabad, written about by Architectural Digest India, Condé Nast Traveller India and ELLE Decor India. Eat, shoot, host or bowl here. Open 11 AM to 3 AM.`,
  openGraph: {
    siteName: cafe.meta.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#3a2e29",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${rasa.variable}`} suppressHydrationWarning>
      <head>
        <LightScript />
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <LightProvider>
          <MotionProvider>
            <SiteHeader name={cafe.meta.name} />
            <main id="main">{children}</main>
            <SiteFooter />
          </MotionProvider>
        </LightProvider>
        <JsonLd />
      </body>
    </html>
  );
}
