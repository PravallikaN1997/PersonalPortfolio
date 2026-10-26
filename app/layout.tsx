import type { Metadata } from "next";
import { Geist, Spline_Sans_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
import "./site.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const mono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

// Mackinac Pro (display). Needs a web licence before public launch.
const display = localFont({
  variable: "--font-mackinac",
  display: "swap",
  src: [
    { path: "./fonts/Mackinac-Book.woff", weight: "400", style: "normal" },
    { path: "./fonts/Mackinac-BookItalic.woff", weight: "400", style: "italic" },
    { path: "./fonts/Mackinac-Medium.woff", weight: "500", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pravallikaspace.vercel.app"),
  title: { default: "Pravallika — Product Designer", template: "%s — Pravallika" },
  openGraph: { type: "website", siteName: "Pravallika", title: "Pravallika — Product Designer" },
  twitter: { card: "summary_large_image" },
  description: "I design how people and complex systems work together. I work across product workflows and AI interactions, exploring how systems behave, how people navigate them, and what makes them easier to understand and trust.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
