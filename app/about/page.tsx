import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ReviewsSection } from "../components/sections/ReviewsSection";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { AstroPhoto } from "../components/ui/AstroPhoto";
import { ZodiacWheel } from "../components/ui/ZodiacWheel";
import { Mandala } from "../components/ui/Mandala";
import { LotusDivider, Diamond } from "../components/ui/Dividers";

export const metadata: Metadata = {
  title: "About — Astro Rahul Raj, Vedic Astrologer",
  description:
    "Learn about Astro Rahul Raj — 15+ years of authentic Vedic astrology guidance, 40,000+ consultations, and a mission to bring clarity to your life.",
};

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "40,000+", label: "Consultations" },
  { value: "100,000+", label: "People Helped" },
  { value: "4.9/5", label: "Client Rating" },
];

const VALUES = [
  { title: "Authentic Vedic Knowledge", body: "Rooted in classical scriptures and time-tested methods — never guesswork." },
  { title: "Compassion & Confidentiality", body: "Your story is heard without judgment and kept 100% private." },
  { title: "Practical, Personalized Guidance", body: "Every reading and remedy is tailored to your unique birth chart." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* hero */}
        <section className="relative overflow-hidden bg-sunset-orange pt-32 text-cream lg:pt-40">
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_280px_80px_rgba(70,34,10,0.5)]" />
          <ZodiacWheel className="pointer-events-none absolute right-[-8%] top-1/2 hidden h-[40rem] w-[40rem] -translate-y-1/2 animate-spin-slower text-cream/10 lg:block" />
          <div className="container-px relative grid items-center gap-10 pb-16 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-luxe-gold/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-luxe-gold">
                <Diamond className="h-2.5 w-2.5" /> About Astro Rahul Raj
              </span>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl">
                Guiding Lives With <span className="text-luxe-gold">Vedic Wisdom</span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/85 sm:text-lg">
                For over 15 years, Astro Rahul Raj has helped people across the world find clarity, direction and
                peace through authentic Vedic astrology — one honest, personal conversation at a time.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl font-bold text-white">{s.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-cream/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-md lg:ml-auto">
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-ray-glow opacity-80" />
              <ZodiacWheel className="absolute inset-0 h-full w-full animate-spin-slower text-[#F7EAD0]/80" />
              <AstroPhoto className="absolute bottom-0 left-1/2 h-[96%] -translate-x-1/2 object-contain drop-shadow-[0_30px_40px_rgba(40,20,5,0.45)]" />
            </div>
          </div>
        </section>

        {/* story */}
        <section className="relative overflow-hidden bg-[#faf4e8] py-16 lg:py-24">
          <Mandala className="pointer-events-none absolute -right-24 top-10 h-72 w-72 text-gold-600/[0.07]" />
          <div className="container-px relative mx-auto max-w-3xl text-center">
            <h2 className="inline-flex items-center gap-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
              <Diamond className="h-3 w-3 text-gold-500" /> My Story <Diamond className="h-3 w-3 text-gold-500" />
            </h2>
            <LotusDivider className="mx-auto mt-4" />
            <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">
              From a young age, Rahul Raj was drawn to the timeless science of Jyotish. What began as curiosity grew
              into a lifelong devotion — studying classical texts, learning from respected gurus, and serving thousands
              of families. Today, his mission is simple: to make authentic Vedic guidance accessible, honest and
              genuinely useful for everyday life.
            </p>
          </div>
        </section>

        {/* values */}
        <section className="bg-white py-16 lg:py-20">
          <div className="container-px">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">What I Stand For</h2>
              <LotusDivider className="mx-auto mt-4" />
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-2xl border-2 border-gold-500/25 bg-[#faf4e8] p-6 text-center shadow-card">
                  <h3 className="font-serif text-lg font-bold text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{v.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href="/consultation" className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-8 py-4 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5">
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
