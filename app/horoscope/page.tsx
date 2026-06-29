import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { HoroscopeHero } from "../components/sections/HoroscopeHero";
import { IconImage } from "../components/ui/IconImage";

export const metadata: Metadata = {
  title: "Horoscope — Rahul Raj Astro, Vedic Astrologer",
  description:
    "Daily, weekly, monthly and yearly horoscope predictions crafted by expert Vedic astrologers. Personalized guidance based on your birth chart.",
};

type IconProps = { className?: string };
const SunIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" /></svg>
);
const CalIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5.5" width="16" height="15" rx="2" /><path d="M4 9.5h16M8 3.5v4M16 3.5v4" /></svg>
);
const MoonIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" /></svg>
);
const StarIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3Z" /></svg>
);
const HeartIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.3-9.2-8.4C1.3 8.7 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.2 0 4.7 3.2 3.2 6.1C19 15.7 12 20 12 20Z" /></svg>
);

const EXPLORE = [
  { id: "daily", Icon: SunIcon, t: "Daily Horoscope", s: "Know what today has in store for you" },
  { id: "weekly", Icon: CalIcon, t: "Weekly Horoscope", s: "Plan your week with cosmic guidance" },
  { id: "monthly", Icon: MoonIcon, t: "Monthly Horoscope", s: "Discover key opportunities ahead" },
  { id: "yearly", Icon: StarIcon, t: "Yearly Horoscope", s: "Get an overview of your year" },
  { id: "love", Icon: HeartIcon, t: "Love Horoscope", s: "Understand love, relationships & more" },
];

const PERSONALIZED = [
  { t: "100% Personalized", s: "Based on your date, time & place of birth." },
  { t: "In-Depth Analysis", s: "Covers career, love, health, wealth & more." },
  { t: "Remedies & Guidance", s: "Effective remedies to reduce planetary doshas." },
  { t: "Expert Astrologers", s: "Curated & verified by experienced astrologers." },
];

const DISCOVER = [
  { t: "Planetary Positions", s: "Understand the impact of planets on your life." },
  { t: "Key Transits", s: "Know how current transits may affect you." },
  { t: "Life Insights", s: "Gain clarity on important life decisions." },
  { t: "Remedies", s: "Simple solutions for a better, peaceful life." },
];

export default function HoroscopePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FCF8F2]">
        <HoroscopeHero />

        {/* ---------------- explore ---------------- */}
        <section className="py-12 lg:py-16">
          <div className="container-px">
            <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">
              Explore <span className="text-gold-600">Horoscope Predictions</span>
            </h2>
            <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-gold-500/70">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {EXPLORE.map((c) => (
                <a key={c.t} href="#" className="group flex flex-col rounded-2xl border border-gold-500/15 bg-white p-5 shadow-[0_14px_40px_-26px_rgba(120,80,20,0.45)] transition-transform hover:-translate-y-1.5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-50 text-gold-600 ring-1 ring-gold-500/20">
                    <IconImage src={`/horoscope/${c.id}.png`} alt={c.t} className="h-6 w-6">
                      <c.Icon className="h-6 w-6" />
                    </IconImage>
                  </span>
                  <h3 className="mt-4 font-serif text-base font-bold leading-snug text-ink">{c.t}</h3>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-ink/55">{c.s}</p>
                  <span className="mt-4 grid h-8 w-8 place-items-center rounded-full bg-gold-gradient text-night transition-transform group-hover:translate-x-1">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- personalized banner ---------------- */}
        <section className="container-px">
          <div className="grid items-center gap-8 rounded-3xl border border-gold-500/15 bg-white/70 p-6 lg:grid-cols-2 lg:p-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b1033] via-[#2a1747] to-[#0e0822] p-8 text-center">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/20 blur-2xl" />
              <p className="relative font-serif text-2xl font-bold text-gold-300">Personalized. Powerful. Precise.</p>
              <p className="relative mt-3 text-sm leading-relaxed text-cream/75">
                Go beyond generic predictions. Get a horoscope based on your unique birth chart.
              </p>
              <a href="/book/consultation/quick" className="relative mt-6 inline-block rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-night shadow-gold-btn transition-transform hover:-translate-y-0.5">
                Get Your Personalized Horoscope →
              </a>
            </div>
            <ul className="space-y-5">
              {PERSONALIZED.map((p) => (
                <li key={p.t} className="flex gap-4">
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-50 text-xs font-bold text-gold-600 ring-1 ring-gold-500/20">◆</span>
                  <div>
                    <p className="font-bold text-ink">{p.t}</p>
                    <p className="mt-0.5 text-sm text-ink/60">{p.s}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- discover + trusted ---------------- */}
        <section className="py-12 lg:py-16">
          <div className="container-px grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">What You&rsquo;ll Discover</h2>
              <ul className="mt-6 space-y-5">
                {DISCOVER.map((d) => (
                  <li key={d.t} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-50 text-gold-600 ring-1 ring-gold-500/20">✦</span>
                    <div>
                      <p className="font-bold text-ink">{d.t}</p>
                      <p className="mt-0.5 text-sm text-ink/60">{d.s}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Trusted by Thousands</h2>
              <div className="mt-6 rounded-3xl border border-gold-500/15 bg-white p-7 shadow-[0_14px_40px_-26px_rgba(120,80,20,0.45)]">
                <div className="flex items-center gap-5">
                  <div className="text-center">
                    <p className="font-serif text-4xl font-bold text-gold-600">4.9<span className="text-xl text-ink/40">/5</span></p>
                    <p className="mt-1 text-gold-500">★★★★★</p>
                    <p className="mt-1 text-[0.7rem] text-ink/50">From 25,000+ happy users</p>
                  </div>
                  <p className="flex-1 border-l border-gold-500/15 pl-5 text-sm italic leading-relaxed text-ink/65">
                    “The horoscope was so accurate and the remedies really helped me make the right
                    decisions.” <span className="mt-2 block not-italic font-semibold text-ink">— Neha Sharma</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-3xl border border-gold-500/15 bg-gradient-to-r from-gold-50 to-[#FBF1D9] p-6">
                <p className="font-serif text-lg font-bold text-ink">Your Horoscope, Anytime, Anywhere</p>
                <p className="mt-1 text-sm text-ink/60">Access your daily, weekly &amp; monthly horoscopes on the go.</p>
                <a href="/book/consultation/quick" className="mt-4 inline-block rounded-xl bg-gold-gradient px-5 py-2.5 text-sm font-bold text-night shadow-gold-btn transition-transform hover:-translate-y-0.5">
                  Get Started →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
