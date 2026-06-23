import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { PoojaGrid } from "../components/sections/PoojaGrid";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { Mandala } from "../components/ui/Mandala";
import { OmIcon } from "../components/icons";

export const metadata: Metadata = {
  title: "Online Puja Services — Rahul Raj, Vedic Astrologer",
  description:
    "Book authentic online pujas performed on your behalf by certified pandits — Grah Shanti, Dosh Nivaran, Vrat, festival and personalized pujas with sankalp in your name.",
};

// hero image-arc placeholders (replace `src` with real photos later)
const HERO_TILES: { accent: [string, string]; offset: string }[] = [
  { accent: ["#8E2D22", "#4E140F"], offset: "mt-0" },
  { accent: ["#B5651D", "#6E3A10"], offset: "mt-10" },
  { accent: ["#9A3324", "#5A1B12"], offset: "mt-20" },
  { accent: ["#B5651D", "#6E3A10"], offset: "mt-10" },
  { accent: ["#8E2D22", "#4E140F"], offset: "mt-0" },
];

const POINTS = [
  <>
    Your <strong className="font-semibold text-ink">Name, Gotra</strong> and{" "}
    <strong className="font-semibold text-ink">Sankalp</strong> are enough to connect you
    spiritually to the puja.
  </>,
  <>
    Every mantra and ritual is performed with{" "}
    <strong className="font-semibold text-ink">your intention at the center</strong> by certified
    pandits.
  </>,
  <>
    The <strong className="font-semibold text-ink">blessings and energy</strong> of the puja reach
    you, no matter where you are.
  </>,
];

export default function OnlinePoojaPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- hero ---------- */}
        <section className="relative overflow-hidden bg-sunset-orange pt-32 text-cream lg:pt-40">
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_240px_60px_rgba(80,40,12,0.4)]" />
          <Mandala className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 text-cream/[0.07]" />
          <Mandala className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 text-cream/[0.06]" />

          <div className="container-px relative text-center">
            <h1 className="mx-auto max-w-4xl font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Online Puja Services <span className="font-light text-cream/50">|</span> Book Online
              Puja Anytime, Anywhere
            </h1>
            <p className="mt-6 font-serif text-lg text-gold-100 sm:text-xl">॥ ॐ गं गणपतये नमः ॥</p>

            <a
              href="#poojas"
              className="mt-8 inline-block rounded-lg bg-luxe-gold px-9 py-3.5 font-serif text-lg font-bold text-espresso shadow-luxe-btn transition-transform hover:-translate-y-0.5"
            >
              Participate Now
            </a>
            <p className="mt-5 text-sm font-semibold tracking-wide text-cream/85">
              Trusted by 5,000+ Devotees &nbsp;|&nbsp; 100% Authentic Rituals
            </p>

            {/* image arc — large placeholders (drop in real photos later) */}
            <div className="mt-12 flex items-start justify-center gap-3 pb-2 sm:gap-5">
              {HERO_TILES.map((tile, i) => (
                <div
                  key={i}
                  className={`${tile.offset} grid aspect-[3/4] w-[19%] max-w-[14rem] place-items-center overflow-hidden rounded-2xl border border-white/15 shadow-xl`}
                  style={{ background: `linear-gradient(150deg, ${tile.accent[0]}, ${tile.accent[1]})` }}
                >
                  <OmIcon className="h-12 w-12 text-cream/70 sm:h-16 sm:w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* curved divider */}
          <div className="relative">
            <svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="block h-[44px] w-full sm:h-[72px]" aria-hidden="true">
              <path d="M0 110 C 380 18, 1060 18, 1440 110 L1440 110 L0 110 Z" fill="#FAF4E8" />
            </svg>
          </div>
        </section>

        {/* ---------- "will a puja still work" explainer ---------- */}
        <section className="paper-bg py-16 lg:py-20">
          <div className="container-px grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* portrait placeholder */}
            <div className="relative grid aspect-[5/4] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#F2E3C4] to-[#E6D2A6]">
              <Mandala className="pointer-events-none absolute inset-0 m-auto h-[120%] w-[120%] text-gold-600/15" />
              <div className="relative flex flex-col items-center gap-2 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full border border-gold-600/30 bg-white/50 text-gold-700">
                  <OmIcon className="h-10 w-10" />
                </span>
                <span className="font-serif text-xl font-bold text-ink">Rahul Raj</span>
                <span className="text-xs uppercase tracking-[0.25em] text-gold-700">Certified Pandits</span>
              </div>
            </div>

            {/* copy */}
            <div>
              <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
                <span className="text-gold-600">Will A Puja Still Work</span>
                <br />
                <span className="text-ink">If You&rsquo;re Not Physically There?</span>
              </h2>
              <p className="mt-4 text-lg font-semibold text-ink">Yes — it works, and it&rsquo;s powerful.</p>
              <ul className="mt-6 space-y-4">
                {POINTS.map((point, i) => (
                  <li key={i} className="flex gap-3 text-base leading-relaxed text-ink/75">
                    <svg viewBox="0 0 16 16" className="mt-1.5 h-3 w-3 shrink-0 text-gold-600" aria-hidden="true">
                      <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="currentColor" />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- categorized puja cards ---------- */}
        <PoojaGrid />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
