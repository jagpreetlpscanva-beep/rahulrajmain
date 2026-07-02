"use client";

import { useEffect, useState } from "react";
import { IconImage } from "../ui/IconImage";
import { ZodiacWheel } from "../ui/ZodiacWheel";

type Sign = { name: string; sanskrit: string; symbol: string; today: string };

const SIGNS: Sign[] = [
  { name: "Aries", sanskrit: "Mesha", symbol: "♈", today: "A bold start favours you — act on that idea you've been holding back." },
  { name: "Taurus", sanskrit: "Vrishabha", symbol: "♉", today: "Steady effort pays off today. Focus on what truly matters to you." },
  { name: "Gemini", sanskrit: "Mithuna", symbol: "♊", today: "A meaningful conversation could open a new door. Stay curious." },
  { name: "Cancer", sanskrit: "Karka", symbol: "♋", today: "Trust your intuition — home and family bring comfort and clarity." },
  { name: "Leo", sanskrit: "Simha", symbol: "♌", today: "Your confidence shines. A good day to lead and be seen." },
  { name: "Virgo", sanskrit: "Kanya", symbol: "♍", today: "Small details matter now. Organise, plan, and progress will follow." },
  { name: "Libra", sanskrit: "Tula", symbol: "♎", today: "Balance is your strength today. Seek harmony in decisions." },
  { name: "Scorpio", sanskrit: "Vrishchika", symbol: "♏", today: "Deep focus brings results. Trust your instincts on a key matter." },
  { name: "Sagittarius", sanskrit: "Dhanu", symbol: "♐", today: "Optimism guides you. An opportunity to learn or travel appears." },
  { name: "Capricorn", sanskrit: "Makara", symbol: "♑", today: "Discipline meets reward. Your hard work is quietly noticed." },
  { name: "Aquarius", sanskrit: "Kumbha", symbol: "♒", today: "A fresh perspective helps. Connect with like-minded people." },
  { name: "Pisces", sanskrit: "Meena", symbol: "♓", today: "Creativity and compassion flow. Listen to your inner voice." },
];

type IconProps = { className?: string };
const SparkIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" /></svg>
);
const GemIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l3 6-9 12L3 9l3-6Z" /><path d="M3 9h18M9 3l3 6 3-6M12 9v12" /></svg>
);
const OrbitIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="10" ry="4.5" /></svg>
);
const ShieldIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>
);
const UserIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></svg>
);
const ChartIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
);
const BoltIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
);

const FEATURES = [
  { Icon: SparkIcon, t: "Accurate Predictions", s: "Precise insights you can trust" },
  { Icon: GemIcon, t: "Personalized Guidance", s: "Tailored just for your journey" },
  { Icon: OrbitIcon, t: "Powered by Vedic Astrology", s: "Ancient wisdom, modern clarity" },
];

const TRUST = [
  { Icon: ShieldIcon, t: "100% Secure", s: "Your data is safe" },
  { Icon: UserIcon, t: "Expert Astrologers", s: "Years of experience" },
  { Icon: ChartIcon, t: "Detailed Analysis", s: "In-depth predictions" },
  { Icon: BoltIcon, t: "Instant Results", s: "Quick & reliable" },
];

export function HoroscopeHero() {
  const [idx, setIdx] = useState(5); // Virgo
  const sign = SIGNS[idx];
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  // live daily prediction per sign (cached for the day so we don't re-spend credits)
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const dailyText = predictions[sign.name] ?? sign.today;

  useEffect(() => {
    if (predictions[sign.name]) return;
    const dateKey = new Date().toISOString().slice(0, 10);
    const cacheKey = `horo:${sign.name}:${dateKey}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) { setPredictions((p) => ({ ...p, [sign.name]: cached })); return; }
    } catch { /* ignore */ }
    let alive = true;
    fetch("/api/astrology", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: `sun_sign_prediction/daily/${sign.name.toLowerCase()}`, payload: {} }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        const text = json?.data?.prediction?.personal_life || json?.data?.prediction?.total_score
          ? [json?.data?.prediction?.personal_life, json?.data?.prediction?.profession_life, json?.data?.prediction?.health]
              .filter(Boolean).join(" ")
          : json?.data?.prediction || json?.data?.bot_response;
        const clean = typeof text === "string" && text.trim() ? text.trim() : null;
        if (alive && clean) {
          setPredictions((p) => ({ ...p, [sign.name]: clean }));
          try { sessionStorage.setItem(cacheKey, clean); } catch { /* ignore */ }
        }
      })
      .catch(() => { /* keep the static fallback line */ });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <section className="relative overflow-hidden pt-24 lg:pt-28">
      {/* faint background decorations */}
      <ZodiacWheel className="pointer-events-none absolute -left-32 top-24 hidden h-[32rem] w-[32rem] animate-spin-slower text-gold-500/10 lg:block" />
      <div className="pointer-events-none absolute right-[-6%] top-10 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />

      <div className="container-px relative grid items-center gap-10 pb-10 lg:grid-cols-2">
        {/* ---------------- left ---------------- */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-gold-700 shadow-sm">
            <SparkIcon className="h-3.5 w-3.5 text-gold-500" /> Trusted by Thousands
          </span>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
            Your Stars, Your Story <br /> <span className="text-gold-600">Your Horoscope</span>
          </h1>
          <div className="mt-4 flex items-center gap-3 text-gold-500/70">
            <span className="h-px w-16 bg-gradient-to-r from-gold-500/60 to-transparent" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
          </div>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/65">
            Accurate predictions crafted by expert astrologers, just for you.
          </p>

          <ul className="mt-7 space-y-4">
            {FEATURES.map((f) => (
              <li key={f.t} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-50 text-gold-600 shadow-[0_0_18px_rgba(212,160,60,0.35)] ring-1 ring-gold-500/25">
                  <f.Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{f.t}</span>
                  <span className="block text-xs text-ink/55">{f.s}</span>
                </span>
              </li>
            ))}
          </ul>

          <a
            href="/bookconsultation"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#F4D58A] via-[#D4A03C] to-[#A9741E] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#3a2408] shadow-[0_10px_30px_-6px_rgba(196,144,46,0.75)] ring-1 ring-gold-300/60 transition-transform hover:-translate-y-0.5"
          >
            <SparkIcon className="h-4 w-4" /> Get Your Horoscope Now
            <span className="text-lg leading-none">›</span>
          </a>
        </div>

        {/* ---------------- right: sign card ---------------- */}
        <div className="rounded-[2rem] border border-gold-500/15 bg-white/85 p-6 shadow-[0_30px_70px_-35px_rgba(120,80,20,0.5)] backdrop-blur-sm lg:p-8">
          {/* glowing selected sign */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-gold-400/40 blur-2xl" />
              <span className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-[#F7E1A8] via-[#E9BE63] to-[#C9912F] shadow-[0_0_45px_rgba(212,160,60,0.65)] ring-2 ring-white/70">
                <IconImage src={`/zodiac/${sign.name.toLowerCase()}.png`} alt={sign.name} className="h-16 w-16">
                  <span className="text-5xl text-night">{sign.symbol}</span>
                </IconImage>
              </span>
            </div>
            <h2 className="mt-4 font-serif text-3xl font-bold text-ink">{sign.name}</h2>
            <p className="text-sm text-gold-700">({sign.sanskrit})</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/65">{dailyText}</p>
          </div>

          {/* today / reading */}
          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-gold-500/20 text-center">
            <div className="flex items-center justify-center gap-2 border-r border-gold-500/15 px-3 py-3">
              <span className="text-gold-500">📅</span>
              <span>
                <span className="block text-[0.6rem] uppercase tracking-wider text-gold-600">Today</span>
                <span className="block text-sm font-bold text-ink">{today}</span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 py-3">
              <span className="text-gold-500">📖</span>
              <span>
                <span className="block text-[0.6rem] uppercase tracking-wider text-gold-600">Reading</span>
                <span className="block text-sm font-bold text-ink">Daily · Vedic</span>
              </span>
            </div>
          </div>

          {/* change sign */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
            <span className="h-px w-6 bg-gold-500/40" /> Change Your Sign <span className="h-px w-6 bg-gold-500/40" />
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {SIGNS.map((s, i) => {
              const on = i === idx;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition-all ${
                    on
                      ? "border-gold-500 bg-gold-50 shadow-[0_0_18px_rgba(212,160,60,0.4)]"
                      : "border-gold-500/15 bg-white hover:border-gold-500/45 hover:bg-gold-50/40"
                  }`}
                >
                  <IconImage src={`/zodiac/${s.name.toLowerCase()}.png`} alt={s.name} className="h-7 w-7">
                    <span className="text-xl text-gold-600">{s.symbol}</span>
                  </IconImage>
                  <span className={`text-[0.6rem] font-semibold leading-none ${on ? "text-gold-700" : "text-ink/55"}`}>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- trust strip ---------------- */}
      <div className="container-px relative pb-2">
        <div className="grid grid-cols-2 gap-5 rounded-3xl border border-gold-500/15 bg-white/80 p-6 shadow-[0_18px_50px_-30px_rgba(120,80,20,0.4)] sm:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.t} className="flex items-center justify-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-50 text-gold-600 shadow-[0_0_16px_rgba(212,160,60,0.3)] ring-1 ring-gold-500/25">
                <t.Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{t.t}</span>
                <span className="block text-xs text-ink/55">{t.s}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
