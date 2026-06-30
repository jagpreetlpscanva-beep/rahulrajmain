import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { readCollection } from "@/lib/contentRepo";
import { COLLECTIONS, type CollectionKey } from "@/lib/cms";
import { CollectionsProvider } from "@/lib/collectionsContext";
import { GoogleTranslate } from "./components/ui/GoogleTranslate";
import { BackgroundMusic } from "./components/ui/BackgroundMusic";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = "https://rahulrajastrologer.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rahul Raj — Vedic Astrologer | Find Clarity. Create a Better Life.",
    template: "%s | Rahul Raj — Vedic Astrologer",
  },
  description:
    "Personalized Vedic guidance for your relationships, career, business, finances and overall well-being. 20+ years of experience, 5000+ consultations, 4.9/5 client rating.",
  keywords: [
    "Vedic astrologer",
    "astrology consultation",
    "Kundli",
    "Janam Kundli",
    "marriage astrology",
    "career astrology",
    "numerology",
    "horoscope",
    "Rahul Raj astrologer",
  ],
  authors: [{ name: "Rahul Raj" }],
  creator: "Rahul Raj",
  alternates: { canonical: "/" },
  icons: {
    icon: "/brand/icon.png",
    shortcut: "/brand/icon.png",
    apple: "/brand/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Rahul Raj — Vedic Astrologer",
    title: "Rahul Raj — Vedic Astrologer | Find Clarity. Create a Better Life.",
    description:
      "Personalized Vedic guidance for relationships, career, business, finances and well-being.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Raj — Vedic Astrologer",
    description:
      "Personalized Vedic guidance for relationships, career, business, finances and well-being.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0f06",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Rahul Raj — Vedic Astrologer",
  description:
    "Personalized Vedic guidance for relationships, career, business, finances and overall well-being.",
  url: SITE_URL,
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "5000",
    bestRating: "5",
  },
  areaServed: "IN",
  knowsAbout: [
    "Vedic Astrology",
    "Numerology",
    "Marriage Compatibility",
    "Career Guidance",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Preload all collections server-side so client components (and their images)
  // render on first paint without a client-side fetch.
  let initialCollections: Record<string, unknown[]> = {};
  try {
    const keys = Object.keys(COLLECTIONS) as CollectionKey[];
    const results = await Promise.all(keys.map((k) => readCollection(k)));
    initialCollections = Object.fromEntries(keys.map((k, i) => [k, results[i]]));
  } catch {
    /* fall back to client fetch + defaults */
  }

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        {/* runs before paint: localStorage is the source of truth for language.
            Clear any stray googtrans cookies, then set the single correct one
            (or none for English) and flag the splash while translating. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var l=localStorage.getItem('siteLang')||'hi';var h=location.hostname;var ex='expires=Thu, 01 Jan 1970 00:00:00 UTC';document.cookie='googtrans=;'+ex+';path=/';document.cookie='googtrans=;'+ex+';path=/;domain='+h;document.cookie='googtrans=;'+ex+';path=/;domain=.'+h;if(l&&l!=='en'){document.cookie='googtrans=/en/'+l+';path=/';document.documentElement.classList.add('gt-translating')}}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CollectionsProvider value={initialCollections}>{children}</CollectionsProvider>
        <GoogleTranslate />
        <BackgroundMusic />
      </body>
    </html>
  );
}
