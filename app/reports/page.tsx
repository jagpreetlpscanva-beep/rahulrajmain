import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ReportsGrid } from "../components/sections/ReportsGrid";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { BRAND_LOGO_SRC } from "../components/ui/Logo";

export const metadata: Metadata = {
  title: "Astrology Reports — Rahul Raj, Vedic Astrologer",
  description:
    "Personalized Vedic astrology reports for career, marriage, health, wealth and your year ahead — hand-prepared from your birth chart.",
};

export default function ReportsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FCF8F2]">
        {/* ---------------- hero ---------------- */}
        <section className="relative overflow-hidden pt-24 lg:pt-28">
          {/* soft gold glow behind the brand mark */}
          <div className="pointer-events-none absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />

          <div className="container-px relative pb-8 text-center lg:pb-10">
            {/* brand logo, centered above the heading */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND_LOGO_SRC}
              alt="Rahul Raj Astro"
              className="mx-auto h-20 w-20 select-none rounded-full object-cover shadow-[0_8px_30px_-8px_rgba(120,80,20,0.4)] ring-1 ring-gold-500/30 sm:h-24 sm:w-24"
            />

            <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-600">
              <Spark /> Our Exclusive Reports <Spark />
            </span>

            <h1 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-4xl lg:text-5xl">
              Guidance for <span className="text-gold-600">Every Chapter</span> of Your Life
            </h1>

            <p className="mt-4 text-base font-medium text-ink/70 sm:text-lg">
              Detailed. Accurate. Personalized.
            </p>

            <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-gold-500/70">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/60" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
              Select a report below and get clear answers to your questions —
              based on your unique birth chart.
            </p>
          </div>
        </section>

        {/* tabs + cards + trust */}
        <ReportsGrid />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
      <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill="currentColor" />
    </svg>
  );
}
