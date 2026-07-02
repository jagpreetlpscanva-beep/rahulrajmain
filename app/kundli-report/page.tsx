import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { ReportGenerator } from "../components/sections/ReportGenerator";
import { BRAND_LOGO_SRC } from "../components/ui/Logo";

export const metadata: Metadata = {
  title: "Free Kundli Report (Hindi) — Dr. Rahul Raj",
  description:
    "Generate a personalised Vedic Kundli report in Hindi instantly — grah/rashi details, lagna nature and personality. Download or print your branded report.",
  alternates: { canonical: "/kundli-report" },
};

export default function KundliReportPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FCF8F2]">
        <section className="relative overflow-hidden pt-24 lg:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl print:hidden" />
          <div className="container-px relative pb-8 text-center lg:pb-10 print:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_LOGO_SRC} alt="Dr. Rahul Raj Astro" className="mx-auto h-20 w-20 rounded-full object-cover shadow-lg ring-1 ring-gold-500/30 sm:h-24 sm:w-24" />
            <h1 className="mx-auto mt-5 max-w-2xl font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
              मुफ़्त <span className="text-gold-600">कुंडली रिपोर्ट</span> (हिंदी)
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
              अपनी जन्म जानकारी भरें और तुरंत अपनी वैदिक कुंडली रिपोर्ट पाएँ — डाउनलोड या प्रिंट करें।
            </p>
          </div>
        </section>

        <section className="container-px mb-20 lg:mb-24">
          <ReportGenerator />
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
