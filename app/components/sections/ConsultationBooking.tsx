"use client";

import { useEffect, useMemo, useState } from "react";
import { useCollection, DEFAULT_HERO_SLIDES, type HeroSlide, type Slot, type Consultation } from "@/lib/adminStore";
import { ZodiacWheel } from "../ui/ZodiacWheel";

const BOOK_HREF = "/book/consultation/quick";

const STATS = [
  { value: "4.9/5", label: "Rating", icon: <StarSvg /> },
  { value: "40,000+", label: "Consultations", icon: <UsersSvg /> },
  { value: "15+", label: "Years Experience", icon: <ShieldSvg /> },
];

const TRUST = [
  { icon: <ShieldSvg />, title: "100% Confidential", body: "Your privacy is our highest priority." },
  { icon: <UsersSvg />, title: "40,000+ Consultations", body: "Trusted by thousands across the world." },
  { icon: <TrophySvg />, title: "15+ Years Experience", body: "Authentic Vedic guidance with proven expertise." },
  { icon: <HeadsetSvg />, title: "Multiple Modes", body: "Chat • Call • Video Call. Choose your comfort." },
];

const FALLBACK_TOPICS = [
  "Complete Life Reading",
  "Career & Business Consultation",
  "Marriage & Relationship Consultation",
  "Health & Wellness Consultation",
  "Wealth & Finance Consultation",
];

function fmtDate(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return d;
  }
}

export function ConsultationBooking() {
  const { items: heroSlides } = useCollection<HeroSlide>("hero", DEFAULT_HERO_SLIDES);
  const astro =
    heroSlides.find((s) => s.visual === "astrologer" && s.image)?.image ||
    heroSlides.find((s) => s.image)?.image ||
    "/hero-astrologer.png";

  const [slots, setSlots] = useState<Slot[]>([]);
  const [topics, setTopics] = useState<string[]>(FALLBACK_TOPICS);

  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetch("/api/content/slots", { cache: "no-store" })
      .then((r) => r.json())
      .then((s: Slot[]) => setSlots(Array.isArray(s) ? s.filter((x) => !x.booked) : []))
      .catch(() => {});
    fetch("/api/content/consultations", { cache: "no-store" })
      .then((r) => r.json())
      .then((c: Consultation[]) => {
        if (Array.isArray(c) && c.length) setTopics(c.map((x) => x.title).filter(Boolean));
      })
      .catch(() => {});
  }, []);

  const dates = useMemo(() => Array.from(new Set(slots.map((s) => s.date))).sort(), [slots]);
  const times = useMemo(() => slots.filter((s) => s.date === date).map((s) => s.time), [slots, date]);

  const bookHref = `${BOOK_HREF}?topic=${encodeURIComponent(topic)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`;

  return (
    <section className="relative overflow-hidden bg-[#faf4e8] py-10 lg:py-14">
      <div className="amber-radial pointer-events-none absolute inset-0 opacity-30" />
      <div className="container-px relative">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
          {/* ---------- left: pitch + photo ---------- */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-700">
              <StarSvg className="h-3.5 w-3.5" /> Personal Consultation
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
              Speak Directly With Rahul Raj
            </h2>
            <p className="mt-3 max-w-md text-ink/65">
              Get clear answers and right guidance for a better tomorrow.
            </p>

            {/* stats */}
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className="text-gold-600">{s.icon}</span>
                  <div>
                    <p className="font-serif text-lg font-bold leading-none text-ink">{s.value}</p>
                    <p className="mt-0.5 text-[0.7rem] uppercase tracking-wide text-ink/55">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* photo */}
            <div className="relative mt-7 aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-[#F4E7CB] to-[#ECDab1]">
              <ZodiacWheel className="absolute inset-0 m-auto h-[115%] w-[115%] text-gold-600/15" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={astro}
                src={astro}
                alt="Astro Rahul Raj"
                className="absolute bottom-0 left-1/2 h-[98%] -translate-x-1/2 object-contain"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-card backdrop-blur-sm">
                <div className="flex -space-x-2">
                  {["#C08A2E", "#7A5212", "#D4A24C", "#9C6B1E"].map((c) => (
                    <span key={c} className="h-7 w-7 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">Trusted by thousands</p>
                  <p className="text-xs text-ink/55">Real people. Real stories. Real guidance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- right: 4-step form ---------- */}
          <div className="rounded-3xl border border-gold-500/25 bg-white p-6 shadow-card sm:p-8">
            <h3 className="text-center font-serif text-2xl font-bold text-ink">Book Your Personal Consultation</h3>
            <p className="mt-1 text-center text-sm text-ink/55">Simple 4-step booking process</p>

            <div className="mt-6 space-y-5">
              {/* 1 topic */}
              <Step n={1} label="Select Consultation Topic">
                <div className="relative">
                  <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectCls}>
                    <option value="">Choose a topic</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-1.5 text-xs text-ink/45">Career, Marriage, Business, Health, Finance, etc.</p>
              </Step>

              {/* 2 date */}
              <Step n={2} label="Select Date">
                {dates.length > 0 ? (
                  <select value={date} onChange={(e) => { setDate(e.target.value); setTime(""); }} className={selectCls}>
                    <option value="">Choose a date</option>
                    {dates.map((d) => (
                      <option key={d} value={d}>{fmtDate(d)}</option>
                    ))}
                  </select>
                ) : (
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={selectCls} />
                )}
              </Step>

              {/* 3 time */}
              <Step n={3} label="Select Time">
                <select value={time} onChange={(e) => setTime(e.target.value)} className={selectCls} disabled={!date && dates.length > 0}>
                  <option value="">Choose a time</option>
                  {(times.length ? times : ["10:30 AM", "12:30 PM", "04:00 PM", "06:00 PM"]).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Step>

              {/* 4 fee */}
              <Step n={4} label="Consultation Fee">
                <div className="flex items-center gap-3 rounded-xl border border-gold-500/25 bg-gold-50/60 px-4 py-3">
                  <span className="text-lg text-ink/40 line-through">₹999</span>
                  <span className="font-serif text-3xl font-bold text-gold-700">₹499</span>
                  <span className="ml-auto rounded-lg bg-emerald-100 px-3 py-1.5 text-center text-xs font-bold leading-tight text-emerald-700">
                    50% OFF<br /><span className="font-medium">Limited Time Offer</span>
                  </span>
                </div>
              </Step>
            </div>

            <a
              href={bookHref}
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-6 py-4 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
            >
              <CalendarSvg className="h-5 w-5" /> Book Consultation Now ₹499
            </a>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-ink/55">
              <span className="inline-flex items-center gap-1.5"><LockSvg className="h-3.5 w-3.5" /> Secure Payment</span>
              <span className="text-ink/25">|</span>
              <span className="inline-flex items-center gap-1.5"><ShieldSvg className="h-3.5 w-3.5" /> 100% Confidential</span>
            </div>
          </div>
        </div>

        {/* ---------- trust badges ---------- */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-5 rounded-2xl border border-gold-500/15 bg-white/70 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-600">
                {t.icon}
              </span>
              <div>
                <p className="text-sm font-bold leading-tight text-ink">{t.title}</p>
                <p className="mt-0.5 text-xs text-ink/55">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const selectCls =
  "w-full appearance-none rounded-xl border border-ink/15 bg-[#fbf7ee] px-4 py-3 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

function Step({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-night">{n}</span>
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-sm font-semibold text-ink">{label}</p>
        {children}
      </div>
    </div>
  );
}

/* ---------------- inline icons ---------------- */
function StarSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" />
    </svg>
  );
}
function UsersSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function ShieldSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function TrophySvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 22v-3.5M14 22v-3.5M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
function HeadsetSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1Zm0 2v1a4 4 0 0 1-4 4h-4" />
    </svg>
  );
}
function LockSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function CalendarSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
