import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// A distinct, slightly technical display face for headings — keeps body
// copy on Geist Sans (very readable at small sizes) while giving titles
// more character.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Vercel sets this automatically on every deploy, so the OG image resolves to
// a real absolute URL in production with zero manual config. Falls back to
// localhost for local dev.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${SITE_NAME}`,
  description: SITE_TAGLINE,
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
