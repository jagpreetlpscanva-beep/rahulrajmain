"use client";

import { useState } from "react";
import { IconImage } from "../ui/IconImage";

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

const FEATURES = [
  { icon: "✶", t: "Accurate Predictions" },
  { icon: "❖", t: "Personalized Guidance" },
  { icon: "☉", t: "Powered by Vedic Astrology" },
];

export function HoroscopeHero() {
  const [idx, setIdx] = useState(5); // Virgo
  const sign = SIGNS[idx];
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="relative overflow-hidden pt-24 lg:pt-28">
      <div className="pointer-events-none absolute right-[-6%] top-10 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="container-px relative grid items-center gap-10 pb-12 lg:grid-cols-2">
        {/* left copy */}
        <div>
          <h1 className="font-serif text-4xl font-bold leading-[1.08] text-ink sm:text-5xl">
            Your Stars, Your Story <br /> <span className="text-gold-600">Your Horoscope</span>
          </h1>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-gold-500/70 to-transparent" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/65 sm:text-base">
            Accurate predictions crafted by expert astrologers, just for you.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
            {FEATURES.map((f) => (
              <div key={f.t} className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-50 text-gold-600 ring-1 ring-gold-500/20">{f.icon}</span>
                <span className="text-xs font-semibold text-ink/70">{f.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* right: sign selector */}
        <div className="rounded-3xl border border-gold-500/15 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(120,80,20,0.4)] lg:p-8">
          {/* selected sign */}
          <div className="flex flex-col items-center text-center">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-gold-gradient text-5xl text-night shadow-gold-btn">
              <IconImage src={`/zodiac/${sign.name.toLowerCase()}.png`} alt={sign.name} className="h-14 w-14">
                {sign.symbol}
              </IconImage>
            </span>
            <h2 className="mt-3 font-serif text-2xl font-bold text-ink">{sign.name}</h2>
            <p className="text-sm text-ink/55">({sign.sanskrit})</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/65">{sign.today}</p>
          </div>

          {/* date / context */}
          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-gold-500/20 text-center">
            <div className="border-r border-gold-500/15 px-3 py-3">
              <p className="text-[0.6rem] uppercase tracking-wider text-gold-600">Today</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{today}</p>
            </div>
            <div className="px-3 py-3">
              <p className="text-[0.6rem] uppercase tracking-wider text-gold-600">Reading</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">Daily · Vedic</p>
            </div>
          </div>

          {/* 12 sign picker */}
          <p className="mt-5 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-ink/45">Change your sign</p>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {SIGNS.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setIdx(i)}
                title={`${s.name} (${s.sanskrit})`}
                className={`grid aspect-square place-items-center rounded-xl text-lg transition-colors ${
                  i === idx
                    ? "bg-gold-gradient text-night shadow-gold-btn"
                    : "border border-gold-500/20 text-ink/55 hover:border-gold-500/50 hover:text-gold-600"
                }`}
              >
                <IconImage src={`/zodiac/${s.name.toLowerCase()}.png`} alt={s.name} className="h-6 w-6">
                  {s.symbol}
                </IconImage>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
