import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ReviewsSection } from "../components/sections/ReviewsSection";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { AstroPhoto } from "../components/ui/AstroPhoto";
import { ZodiacWheel } from "../components/ui/ZodiacWheel";
import { HeroDecor } from "../components/ui/HeroDecor";

export const metadata: Metadata = {
  title: "About — Rahul Raj Astro, Vedic Astrologer",
  description:
    "Learn about Rahul Raj Astro — 15+ years of authentic Vedic astrology guidance, 40,000+ consultations, and a mission to bring clarity to your life.",
};

type IconProps = { className?: string };
const Spark = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true"><path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill="currentColor" /></svg>
);
const PlayIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
);
const BookIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4.5h9A2.5 2.5 0 0 1 16.5 7v12.5H7.5A2.5 2.5 0 0 1 5 17V4.5Z" /><path d="M16.5 7H19v12.5h-2.5M8.5 8.5h4.5M8.5 11.5h4.5" /></svg>
);
const TargetIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.2" /><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" /></svg>
);
const LotusIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 13c0-4.5 2-7.5 4.5-9.5C17 7 16 11 12 13Zm0 0c0-4.5-2-7.5-4.5-9.5C7 7 8 11 12 13Zm0 0c2.8-1.6 5-1.4 7-.2-1.2 2.6-3.6 4-7 4.2Zm0 0c-2.8-1.6-5-1.4-7-.2 1.2 2.6 3.6 4 7 4.2Zm0 0v6.5M6 19.5h12" /></svg>
);

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "40,000+", label: "Consultations" },
  { value: "100,000+", label: "People Helped" },
  { value: "4.9/5", label: "Client Rating" },
];

const VALUES = [
  { Icon: BookIcon, title: "Authentic Vedic Knowledge", body: "Rooted in classical scriptures and time-tested wisdom — never guesswork." },
  { Icon: TargetIcon, title: "Transparency & Confidentiality", body: "Your story is heard with true compassion and kept 100% private." },
  { Icon: LotusIcon, title: "Practical & Personalized Guidance", body: "Insights that are easy to understand and simple to apply in your real life." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FCF8F2]">
        {/* ---------------- hero ---------------- */}
        <section className="relative overflow-hidden pt-24 lg:pt-28">
          <ZodiacWheel className="pointer-events-none absolute right-[-6%] top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 animate-spin-slower text-gold-500/10 lg:block" />
          <div className="container-px relative grid items-center gap-8 pb-10 lg:grid-cols-2 lg:gap-6 lg:pb-12">
            <div>
              <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-600">
                <Spark className="h-3 w-3" /> About Rahul Raj Astro
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.08] text-ink sm:text-5xl">
                Guiding Lives With <br /> <span className="text-gold-600">Vedic Wisdom</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/65 sm:text-base">
                For over 15 years, Rahul Raj Astro has helped people across the world find clarity,
                direction and peace through authentic Vedic astrology — one honest, personal
                conversation at a time.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl font-bold text-gold-600">{s.value}</p>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-ink/55">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="/book/consultation/quick" className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5">
                  Book Consultation →
                </a>
                <a href="#story" className="inline-flex items-center gap-3 text-sm font-semibold text-ink/70 transition-colors hover:text-gold-600">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/40 text-gold-600">
                    <PlayIcon className="ml-0.5 h-4 w-4" />
                  </span>
                  <span className="text-left">
                    <span className="block text-[0.65rem] uppercase tracking-wider text-gold-600">Watch Video</span>
                    Know More About Me
                  </span>
                </a>
              </div>
            </div>

            {/* portrait + wheel */}
            <div className="relative mx-auto aspect-square w-full max-w-md lg:ml-auto">
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-ray-glow opacity-70" />
              <ZodiacWheel className="absolute inset-0 h-full w-full animate-spin-slower text-gold-500/30" />
              <AstroPhoto className="absolute bottom-0 left-1/2 h-[97%] -translate-x-1/2 object-contain drop-shadow-[0_30px_40px_rgba(40,20,5,0.25)]" />
            </div>
          </div>
        </section>

        {/* ---------------- my story ---------------- */}
        <section id="story" className="relative overflow-hidden bg-gradient-to-b from-[#FBF3E3] to-[#FCF8F2] py-12 lg:py-16">
          <HeroDecor id="pooja-left" className="bottom-0 left-0 hidden w-36 opacity-90 lg:block xl:w-44" />
          <HeroDecor id="courses-right" className="bottom-0 right-0 hidden w-28 opacity-90 lg:block xl:w-36" />
          <div className="container-px relative mx-auto max-w-3xl text-center">
            <h2 className="inline-flex items-center gap-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
              <Spark className="h-3 w-3 text-gold-500" /> My Story <Spark className="h-3 w-3 text-gold-500" />
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink/65 sm:text-base">
              From a young age, Rahul Raj was drawn to the timeless science of Jyotish. What began as
              curiosity grew into a lifelong devotion — studying classical texts, learning from
              respected gurus, and serving thousands of families. Today, his mission is simple: to make
              authentic Vedic guidance accessible, honest and genuinely useful for everyday life.
            </p>
          </div>
        </section>

        {/* ---------------- what I stand for ---------------- */}
        <section className="py-12 lg:py-16">
          <div className="container-px">
            <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">What I Stand For</h2>
            <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-gold-500/70">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>

            <div className="mx-auto mt-9 grid max-w-5xl gap-6 sm:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-3xl border border-gold-500/15 bg-white p-7 text-center shadow-[0_14px_40px_-26px_rgba(120,80,20,0.45)] transition-transform hover:-translate-y-1.5">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-50 text-gold-600 ring-1 ring-gold-500/20">
                    <v.Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{v.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a href="/book/consultation/quick" className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-8 py-4 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5">
                Book a Consultation →
              </a>
            </div>
          </div>
        </section>

        <ReviewsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
