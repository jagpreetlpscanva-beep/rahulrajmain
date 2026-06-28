import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { Calculators } from "../components/sections/Calculators";
import { BRAND_LOGO_SRC } from "../components/ui/Logo";

export const metadata: Metadata = {
  title: "Free Vedic Calculators — Rahul Raj Astro",
  description:
    "Free Vedic astrology calculators — Kundli, Kundli matching, numerology, Manglik & Kaal Sarp dosha, gemstone & rudraksha suggestions, daily horoscope and more.",
};

const TRUST = [
  { t: "Instant Results", s: "Calculated in seconds" },
  { t: "100% Free", s: "No sign-up required" },
  { t: "Vedic & Accurate", s: "Authentic Jyotish methods" },
  { t: "Private", s: "We don't store your details" },
];

export default function FreeCalculatorsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FCF8F2]">
        {/* hero */}
        <section className="relative overflow-hidden pt-24 lg:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="container-px relative pb-8 text-center lg:pb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_LOGO_SRC} alt="Rahul Raj Astro" className="mx-auto h-20 w-20 select-none rounded-full object-cover shadow-[0_8px_30px_-8px_rgba(120,80,20,0.4)] ring-1 ring-gold-500/30 sm:h-24 sm:w-24" />
            <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-600">
              ✦ Free Tools ✦
            </span>
            <h1 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-4xl lg:text-5xl">
              Free Vedic <span className="text-gold-600">Calculators</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
              Instant, authentic Jyotish calculations — Kundli, matching, dosha checks, numerology and more. Pick a calculator below to begin.
            </p>
          </div>
        </section>

        {/* calculators grid + modals */}
        <section className="container-px">
          <Calculators />
        </section>

        {/* trust strip */}
        <section className="container-px mb-20 mt-12 lg:mb-24">
          <div className="grid gap-6 rounded-3xl border border-gold-500/15 bg-white/70 p-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.t} className="flex flex-col items-center gap-2 text-center">
                <span className="h-2 w-2 rounded-full bg-gold-500" />
                <p className="text-sm font-bold text-ink">{t.t}</p>
                <p className="text-xs text-ink/55">{t.s}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
