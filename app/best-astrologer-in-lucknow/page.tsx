import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { BRAND_LOGO_SRC } from "../components/ui/Logo";
import { WhatsAppIcon } from "../components/icons";

const SITE = "https://astrorahulraj.in";
const PHONE = "+91 94153 12590";
const PHONE_TEL = "+919415312590";
const WHATSAPP = "https://wa.me/919415312590";
const ADDRESS = "Rahul Raj Astro, Chungi - Parag Rd, Sector E, Sector C1, LDA Colony, Lucknow, Uttar Pradesh 226012";
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

export const metadata: Metadata = {
  title: "Best Astrologer in Lucknow | Dr. Rahul Raj — Vedic Astrologer",
  description:
    "Consult Dr. Rahul Raj, the best Vedic astrologer in Lucknow — expert Kundli analysis, marriage, career & dosha remedies. Book online or visit LDA Colony. Call +91 94153 12590.",
  alternates: { canonical: "/best-astrologer-in-lucknow" },
  openGraph: {
    title: "Best Astrologer in Lucknow — Dr. Rahul Raj (Vedic Astrologer)",
    description:
      "Trusted Vedic astrologer & Kundli expert in Lucknow. In-person (LDA Colony) and online consultations for marriage, career, health and dosha remedies.",
    url: `${SITE}/best-astrologer-in-lucknow`,
    type: "website",
  },
};

const SERVICES = [
  { t: "Kundli / Birth Chart Analysis", d: "Complete Janam Kundli reading with predictions and remedies." },
  { t: "Marriage & Matchmaking", d: "Kundli Milan, marriage timing and compatibility guidance." },
  { t: "Career & Business", d: "Right direction, favourable periods and job/business decisions." },
  { t: "Dosha Nivaran", d: "Manglik, Kaal Sarp and Sade Sati checks with proven remedies." },
  { t: "Numerology & Name Correction", d: "Lucky numbers, baby names and business name analysis." },
  { t: "Vastu Consultation", d: "Home and shop Vastu for peace, health and prosperity." },
];

const LOCALITIES = ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar", "Alambagh", "LDA Colony", "Chowk", "Rajajipuram"];

const FAQS = [
  {
    q: "Who is the best astrologer in Lucknow?",
    a: "Dr. Rahul Raj is a trusted Vedic astrologer in Lucknow with a 4.9/5 client rating, known for accurate Kundli analysis and practical remedies for marriage, career, health and dosha problems. Consultations are available in person at LDA Colony, Lucknow, or online.",
  },
  {
    q: "Where is Dr. Rahul Raj's astrology office located in Lucknow?",
    a: `The office is at ${ADDRESS}. It is easily reachable from Gomti Nagar, Hazratganj, Aliganj and Alambagh.`,
  },
  {
    q: "What are the consultation timings?",
    a: "Monday to Saturday, 10 AM – 2 PM and 6 PM – 8 PM. You can also book an online consultation at a convenient time.",
  },
  {
    q: "Can I get an online astrology consultation in Lucknow?",
    a: "Yes. You can book a phone or video consultation and share your birth details online — the guidance and remedies are exactly the same as an in-person sitting.",
  },
  {
    q: "How do I book an appointment?",
    a: "Call or WhatsApp +91 94153 12590, or use the 'Book Consultation' button on this page to pick a slot and confirm in a minute.",
  },
];

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dr. Rahul Raj",
  jobTitle: "Vedic Astrologer",
  url: `${SITE}/about`,
  worksFor: { "@id": `${SITE}/#business` },
  knowsAbout: ["Vedic Astrology", "Kundli", "Numerology", "Vastu", "Matchmaking"],
  areaServed: { "@type": "City", name: "Lucknow" },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function Spark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
      <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill="currentColor" />
    </svg>
  );
}

export default function LucknowPage() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Navbar />
      <main className="bg-[#FCF8F2]">
        {/* ---------------- hero ---------------- */}
        <section className="relative overflow-hidden pt-24 lg:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="container-px relative pb-8 text-center lg:pb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_LOGO_SRC} alt="Dr. Rahul Raj — Vedic Astrologer, Lucknow" className="mx-auto h-20 w-20 select-none rounded-full object-cover shadow-[0_8px_30px_-8px_rgba(120,80,20,0.4)] ring-1 ring-gold-500/30 sm:h-24 sm:w-24" />
            <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-600">
              <Spark /> Vedic Astrologer in Lucknow <Spark />
            </span>
            <h1 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-4xl lg:text-5xl">
              Best Astrologer in Lucknow — <span className="text-gold-600">Dr. Rahul Raj</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/65 sm:text-base">
              Trusted Vedic astrologer and Kundli expert in Lucknow. Get clear, practical guidance for
              marriage, career, health, finances and dosha problems — in person at LDA Colony or online,
              anywhere in Lucknow.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a href="/bookconsultation" className="rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn">
                Book Consultation
              </a>
              <a href={`tel:${PHONE_TEL}`} className="rounded-xl border border-gold-500/40 bg-white px-6 py-3.5 text-sm font-bold text-gold-700">
                Call {PHONE}
              </a>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-white px-6 py-3.5 text-sm font-bold text-emerald-700">
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ---------------- intro ---------------- */}
        <section className="container-px py-8 lg:py-12">
          <div className="mx-auto max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink/75">
            <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
              Trusted Vedic Astrologer &amp; Kundli Expert in Lucknow
            </h2>
            <p>
              If you are searching for the <strong>best astrologer in Lucknow</strong> or a
              <strong> Vedic astrologer near you</strong>, Dr. Rahul Raj offers authentic Jyotish guidance
              rooted in classical scriptures — never guesswork. With thousands of consultations and a 4.9/5
              client rating, he helps people across Lucknow find clarity and direction at life&rsquo;s most
              important moments.
            </p>
            <p>
              Whether you need a detailed <strong>Janam Kundli analysis</strong>, marriage matching, career
              guidance, or remedies for Manglik, Kaal Sarp or Sade Sati dosha, every reading is personalised
              to your birth chart and explained in simple language you can actually act on.
            </p>
          </div>
        </section>

        {/* ---------------- services ---------------- */}
        <section className="container-px py-8 lg:py-12">
          <h2 className="text-center font-serif text-2xl font-bold text-ink sm:text-3xl">
            Astrology Services in Lucknow
          </h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.t} className="rounded-2xl border border-gold-500/15 bg-white p-6 shadow-[0_14px_40px_-26px_rgba(120,80,20,0.45)]">
                <h3 className="font-serif text-lg font-bold text-ink">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- why choose ---------------- */}
        <section className="container-px py-8 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
              Why Dr. Rahul Raj Is the Best Astrologer Near You in Lucknow
            </h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-ink/75">
              <li>✦ <strong>Authentic Vedic methods</strong> — classical Jyotish, not generic predictions.</li>
              <li>✦ <strong>Practical remedies</strong> — simple upayas that fit your everyday life.</li>
              <li>✦ <strong>In-person &amp; online</strong> — visit LDA Colony or consult from anywhere in Lucknow.</li>
              <li>✦ <strong>100% confidential</strong> — your details and questions stay private.</li>
              <li>✦ <strong>Serving all of Lucknow</strong> — {LOCALITIES.join(", ")} and nearby areas.</li>
            </ul>
          </div>
        </section>

        {/* ---------------- visit / NAP + map ---------------- */}
        <section className="container-px py-8 lg:py-12">
          <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-gold-500/15 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(120,80,20,0.4)] lg:grid-cols-2 lg:p-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Visit Us in Lucknow</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gold-600">Address</dt>
                  <dd className="mt-1 text-ink/75">{ADDRESS}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gold-600">Phone</dt>
                  <dd className="mt-1"><a href={`tel:${PHONE_TEL}`} className="font-semibold text-gold-700">{PHONE}</a></dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gold-600">Timings</dt>
                  <dd className="mt-1 text-ink/75">Mon – Sat · 10 AM – 2 PM &amp; 6 PM – 8 PM</dd>
                </div>
              </dl>
              <a href={MAP_LINK} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-night shadow-gold-btn">
                Get Directions →
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gold-500/20">
              <iframe
                title="Dr. Rahul Raj — Astrologer in Lucknow, map"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full lg:h-full"
              />
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="container-px mb-16 py-8 lg:mb-24 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl border border-gold-500/15 bg-white p-5">
                  <h3 className="font-serif text-base font-bold text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
