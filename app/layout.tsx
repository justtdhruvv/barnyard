import type { Metadata, Viewport } from "next";
import { Hedvig_Letters_Serif, Ysabeau_Office } from "next/font/google";
import { LightProvider } from "@/components/light/LightProvider";
import { LightScript } from "@/components/light/LightScript";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { cafe } from "@/lib/cafe";
import "./globals.css";

const ysabeau = Ysabeau_Office({ subsets: ["latin"], variable: "--font-ysabeau", display: "swap" });
const hedvig = Hedvig_Letters_Serif({ subsets: ["latin"], variable: "--font-hedvig", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${cafe.meta.name}, Chandkheda, Ahmedabad`, template: `%s | ${cafe.meta.name}` },
  description: `The house, drawn in one line: a ${cafe.meta.sizeSqFt.toLocaleString("en-IN")} sq ft loft house in ${cafe.meta.address.area}, Ahmedabad. Slow down and stay a little longer.`,
};

export const viewport: Viewport = { themeColor: "#e9e8e4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ysabeau.variable} ${hedvig.variable}`} data-regime="day" suppressHydrationWarning>
      <head><LightScript /></head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <LightProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </LightProvider>
      </body>
    </html>
  );
}
