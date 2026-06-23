import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ConsultationGrid } from "../components/sections/ConsultationGrid";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { Mandala } from "../components/ui/Mandala";
import { ZodiacWheel } from "../components/ui/ZodiacWheel";
import { OmIcon } from "../components/icons";

export const metadata: Metadata = {
  title: "Book a Consultation — Rahul Raj, Vedic Astrologer",
  description:
    "Talk to Rahul Raj and get clear, trusted answers to your biggest life questions — career, marriage, health, wealth and more. 100% private, one-on-one.",
};

const WHY = [
  {
    title: "Detailed Guidance",
    body: "Backed by years of experience and trusted Vedic methods, you'll understand your current situation and the right path forward.",
  },
  {
    title: "Compassionate Support · Complete Privacy",
    body: "We listen without judgment, understand your struggles, and keep your details 100% confidential — so you can speak openly.",
  },
  {
    title: "Personalized Solutions for Your Life",
    body: "Every reading and remedy is tailored to your unique birth chart, with practical steps you can act on right away.",
  },
];

export default function ConsultationPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- hero (large image placeholder background) ---------- */}
        <section className="relative flex min-h-[82vh] items-center overflow-hidden bg-sunset-orange pt-32 text-cream lg:pt-36">
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_280px_80px_rgba(70,34,10,0.5)]" />
          <div className="pointer-events-none absolute right-[-6%] top-1/2 hidden h-[44rem] w-[44rem] -translate-y-1/2 animate-glow-breathe bg-amber-radial opacity-50 blur-2xl lg:block" />
          {/* big hero image placeholder — swap this block for a photo later */}
          <ZodiacWheel className="pointer-events-none absolute right-[-8%] top-1/2 hidden h-[42rem] w-[42rem] -translate-y-1/2 animate-spin-slower text-cream/10 lg:block" />

          <div className="container-px relative pb-16">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
                Thousands Found Clarity.
                <br />
                When Will You?
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/90 sm:text-xl">
                Talk to Rahul Raj and get clear answers to your biggest life questions.
              </p>
              <span className="mt-6 inline-block rounded-lg border border-cream/30 bg-white/10 px-5 py-2.5 text-sm font-semibold tracking-wide text-cream backdrop-blur-sm">
                5,000+ Happy Clients · Trusted Across India
              </span>
              <div className="mt-8">
                <a
                  href="#consult-types"
                  className="inline-flex items-center gap-2 rounded-lg bg-luxe-gold px-8 py-4 font-serif text-lg font-bold text-espresso shadow-luxe-btn transition-transform hover:-translate-y-0.5"
                >
                  Book Your Consultation Today →
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="block h-[44px] w-full sm:h-[72px]" aria-hidden="true">
              <path d="M0 110 C 380 18, 1060 18, 1440 110 L1440 110 L0 110 Z" fill="#FAF4E8" />
            </svg>
          </div>
        </section>

        {/* ---------- every question has an answer ---------- */}
        <section className="paper-bg py-16 lg:py-20">
          <div className="container-px grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                <span className="text-ink">Every Question Has An Answer </span>
                <span className="text-gold-600">— Let&rsquo;s Find Yours</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
                Our consultations, personally guided by{" "}
                <strong className="font-semibold text-ink">Rahul Raj</strong>, give you solutions,
                remedies and direction you can trust.
              </p>
            </div>
            {/* large illustration placeholder */}
            <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#F2E3C4] to-[#E6D2A6]">
              <Mandala className="pointer-events-none absolute inset-0 m-auto h-[120%] w-[120%] text-gold-600/15" />
              <div className="relative flex items-center gap-4 text-gold-700 sm:gap-8">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-gold-600/30 bg-white/50">?</span>
                <span className="text-2xl">→</span>
                <span className="grid h-20 w-20 place-items-center rounded-2xl border border-gold-600/30 bg-white/50">
                  <OmIcon className="h-9 w-9" />
                </span>
                <span className="text-2xl">→</span>
                <span className="grid h-16 w-16 place-items-center rounded-full border border-gold-600/30 bg-white/50">✦</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- why choose ---------- */}
        <section className="bg-[#FBF1D9] py-16 lg:py-20">
          <div className="container-px grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* large astrologer photo placeholder */}
            <div className="relative grid aspect-[4/5] max-w-md place-items-center self-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#F2E3C4] to-[#E6D2A6] lg:order-1">
              <ZodiacWheel className="pointer-events-none absolute inset-0 m-auto h-[115%] w-[115%] text-gold-600/15" />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <span className="grid h-24 w-24 place-items-center rounded-full border border-gold-600/30 bg-white/50 text-gold-700">
                  <OmIcon className="h-12 w-12" />
                </span>
                <span className="font-serif text-2xl font-bold text-ink">Rahul Raj</span>
                <span className="text-xs uppercase tracking-[0.25em] text-gold-700">Vedic Astrologer</span>
              </div>
            </div>

            <div className="lg:order-2">
              <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                <span className="text-ink">Why Choose Our </span>
                <span className="text-gold-600">Expert Guidance?</span>
              </h2>
              <ul className="mt-7 space-y-4">
                {WHY.map((w) => (
                  <li key={w.title} className="rounded-xl border border-gold-500/25 bg-white/70 p-5">
                    <div className="flex items-center gap-2.5">
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true">
                        <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="currentColor" />
                      </svg>
                      <h3 className="font-serif text-lg font-bold text-ink">{w.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">{w.body}</p>
                  </li>
                ))}
              </ul>
              <a
                href="#consult-types"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
              >
                Schedule a Call →
              </a>
            </div>
          </div>
        </section>

        {/* ---------- consultation types ---------- */}
        <ConsultationGrid />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
