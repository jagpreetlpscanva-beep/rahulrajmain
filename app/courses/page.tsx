import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { CoursesGrid } from "../components/sections/CoursesGrid";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { Mandala } from "../components/ui/Mandala";

export const metadata: Metadata = {
  title: "Courses & Recorded Sessions — Rahul Raj, Vedic Astrologer",
  description:
    "Self-paced video courses and recorded masterclasses in Vedic astrology, numerology, vastu, palmistry and spiritual practice.",
};

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative flex flex-col overflow-hidden bg-sunset-orange pt-36 text-cream lg:pt-44">
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_240px_60px_rgba(80,40,12,0.4)]" />
          <Mandala className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 text-cream/[0.07]" />
          <Mandala className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 text-cream/[0.06]" />

          <div className="container-px relative pb-10 text-center lg:pb-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/35 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cream backdrop-blur-sm">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-gold-200" aria-hidden="true">
                <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill="currentColor" />
              </svg>
              Learn with Rahul Raj
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-gold-200" aria-hidden="true">
                <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill="currentColor" />
              </svg>
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Courses &amp; <span className="text-gold-200">Recorded Sessions</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
              Self-paced video courses and recorded masterclasses — learn the sacred sciences at
              your own pace, anytime.
            </p>
          </div>

          <div className="relative">
            <svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="block h-[56px] w-full sm:h-[88px]" aria-hidden="true">
              <path d="M0 110 C 380 18, 1060 18, 1440 110 L1440 110 L0 110 Z" fill="#FAF4E8" />
            </svg>
          </div>
        </section>

        <CoursesGrid />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
