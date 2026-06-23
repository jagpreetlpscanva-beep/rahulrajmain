"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ZodiacWheel } from "../ui/ZodiacWheel";
import { Mandala } from "../ui/Mandala";
import { KundaliGenerator } from "./KundaliGenerator";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type GlyphName =
  | "sun" | "moon" | "yoga" | "lotus" | "sunrise" | "sunset" | "clock"
  | "shield" | "check" | "lock" | "person" | "info";

function Glyph({ name, className = "" }: { name: GlyphName; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const inner: Record<GlyphName, ReactNode> = {
    sun: (<><circle cx="12" cy="12" r="4" {...p} /><path {...p} d="M12 2v2M12 20v2M4.9 4.9l1.3 1.3M17.8 17.8l1.3 1.3M2 12h2M20 12h2M4.9 19.1l1.3-1.3M17.8 6.2l1.3-1.3" /></>),
    moon: (<path {...p} d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" />),
    yoga: (<><circle cx="12" cy="5.5" r="2" {...p} /><path {...p} d="M12 8c-2.4 0-4 2-4 4.4 0 1 .5 1.9 1.4 2.4M12 8c2.4 0 4 2 4 4.4 0 1-.5 1.9-1.4 2.4" /><path {...p} d="M6 17c2 1.4 4 1.9 6 1.9s4-.5 6-1.9" /></>),
    lotus: (<><path {...p} d="M12 4.5c1.4 1.9 1.4 4.6 0 6.5-1.4-1.9-1.4-4.6 0-6.5Z" /><path {...p} d="M12 11c1.9-1.9 4.7-2.4 6.6-1.4-.9 2.4-3.7 3.3-6.6 1.4Z" /><path {...p} d="M12 11c-1.9-1.9-4.7-2.4-6.6-1.4.9 2.4 3.7 3.3 6.6 1.4Z" /><path {...p} d="M5 11c2 2.8 4.6 3.8 7 3.8s5-1 7-3.8" /></>),
    sunrise: (<><path {...p} d="M3 18h18M8 18a4 4 0 0 1 8 0" /><path {...p} d="M12 3v2.5M5.5 8l1.3 1.3M18.5 8l-1.3 1.3M2 13.5h2M20 13.5h2" /></>),
    sunset: (<><path {...p} d="M3 18h18M8 18a4 4 0 0 1 8 0" /><path {...p} d="M12 8.5V6M5.5 11l1.3-1.3M18.5 11l-1.3-1.3M9 4l3 3 3-3" /></>),
    clock: (<><circle cx="12" cy="12" r="8" {...p} /><path {...p} d="M12 8v4l3 1.8" /></>),
    shield: (<path {...p} d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />),
    check: (<><circle cx="12" cy="12" r="9" {...p} /><path {...p} d="M8 12.5l2.5 2.5L16 9.5" /></>),
    lock: (<><rect x="5" y="11" width="14" height="9" rx="2" {...p} /><path {...p} d="M8 11V8a4 4 0 0 1 8 0v3" /></>),
    person: (<><circle cx="12" cy="8" r="3.5" {...p} /><path {...p} d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>),
    info: (<><circle cx="12" cy="12" r="9" {...p} /><path {...p} d="M12 11v5M12 8h.01" /></>),
  };
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{inner[name]}</svg>;
}

const BASE: { label: string; key: "tithi" | "nakshatra" | "yoga" | "karana"; icon: GlyphName }[] = [
  { label: "Tithi", key: "tithi", icon: "sun" },
  { label: "Nakshatra", key: "nakshatra", icon: "moon" },
  { label: "Yoga", key: "yoga", icon: "yoga" },
  { label: "Karana", key: "karana", icon: "lotus" },
];
const BASE_VALUES = { tithi: "Shukla Paksha, Dwitiya", nakshatra: "Punarvasu", yoga: "Vishkambha", karana: "Balava" };

const CITIES: Record<string, { sunrise: string; sunset: string; rahu: string; abhijit: string }> = {
  Delhi: { sunrise: "05:24 AM", sunset: "07:20 PM", rahu: "07:08 AM – 08:50 AM", abhijit: "11:58 AM – 12:52 PM" },
  Mumbai: { sunrise: "06:02 AM", sunset: "07:18 PM", rahu: "07:38 AM – 09:14 AM", abhijit: "12:25 PM – 01:18 PM" },
  Bengaluru: { sunrise: "05:54 AM", sunset: "06:48 PM", rahu: "07:28 AM – 09:02 AM", abhijit: "12:08 PM – 12:58 PM" },
  Kolkata: { sunrise: "04:54 AM", sunset: "06:22 PM", rahu: "06:34 AM – 08:12 AM", abhijit: "11:32 AM – 12:24 PM" },
  Chennai: { sunrise: "05:42 AM", sunset: "06:38 PM", rahu: "07:18 AM – 08:52 AM", abhijit: "12:04 PM – 12:54 PM" },
  Pune: { sunrise: "06:00 AM", sunset: "07:14 PM", rahu: "07:36 AM – 09:11 AM", abhijit: "12:22 PM – 01:15 PM" },
  Ujjain: { sunrise: "05:48 AM", sunset: "07:22 PM", rahu: "07:24 AM – 09:00 AM", abhijit: "12:10 PM – 01:03 PM" },
  Varanasi: { sunrise: "05:08 AM", sunset: "06:52 PM", rahu: "06:50 AM – 08:28 AM", abhijit: "11:44 AM – 12:36 PM" },
};

const TRUST: { icon: GlyphName; title: string; sub: string }[] = [
  { icon: "shield", title: "100% Accurate", sub: "Vedic calculations you can trust" },
  { icon: "check", title: "Personalized Report", sub: "Detailed Kundli just for you" },
  { icon: "lock", title: "Secure & Private", sub: "Your information is fully protected" },
  { icon: "person", title: "Expert Guidance", sub: "Insights by Rahul Raj, Vedic Astrologer" },
];

export function Panchang() {
  const [today, setToday] = useState<Date | null>(null);
  const [city, setCity] = useState("Delhi");
  useEffect(() => setToday(new Date()), []);

  const loc = CITIES[city];
  const items: { label: string; value: string; icon: GlyphName }[] = [
    ...BASE.map((b) => ({ label: b.label, value: BASE_VALUES[b.key], icon: b.icon })),
    { label: "Sunrise", value: loc.sunrise, icon: "sunrise" },
    { label: "Sunset", value: loc.sunset, icon: "sunset" },
    { label: "Rahu Kaal", value: loc.rahu, icon: "clock" },
    { label: "Abhijit Muhurat", value: loc.abhijit, icon: "clock" },
  ];

  return (
    <section className="paper-bg relative overflow-hidden py-16 lg:py-20">
      {/* faint zodiac watermarks on the edges */}
      <ZodiacWheel className="pointer-events-none absolute -left-44 top-10 h-[34rem] w-[34rem] text-gold-500/[0.05]" />
      <ZodiacWheel className="pointer-events-none absolute -right-44 bottom-0 h-[34rem] w-[34rem] text-gold-500/[0.05]" />

      <div className="container-px relative">
        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ---- left: panchang ---- */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-gold-500/30 bg-white shadow-card">
            {/* gold header */}
            <div className="relative flex items-start justify-between gap-4 overflow-hidden bg-luxe-gold px-6 py-5">
              <Mandala className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-white/25" />
              <div className="relative">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#7a5212]">
                  Today&rsquo;s Panchang
                </p>
                <p className="mt-1 font-serif text-2xl font-bold text-espresso">
                  {today ? `${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}` : "—"}
                </p>
                <p className="text-sm text-espresso/70">{today ? WEEKDAYS[today.getDay()] : ""}</p>
              </div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="relative shrink-0 rounded-lg border border-espresso/15 bg-white px-3 py-2 text-sm font-medium text-espresso outline-none focus:border-gold-600"
              >
                {Object.keys(CITIES).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* items */}
            <div className="grid flex-1 grid-cols-2 gap-px bg-gold-500/12">
              {items.map((it) => (
                <div key={it.label} className="flex items-center gap-3 bg-white p-4 sm:p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600">
                    <Glyph name={it.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-gold-600">{it.label}</p>
                    <p className="mt-0.5 font-serif text-[0.95rem] font-bold leading-snug text-ink">{it.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* note */}
            <div className="flex items-start gap-2 border-t border-gold-500/15 px-5 py-3 text-xs leading-relaxed text-ink/45">
              <Glyph name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" />
              <span>Sunrise, sunset &amp; timings shown for {city}. Connect a panchang API for daily-accurate values.</span>
            </div>
          </div>

          {/* ---- right: kundali generator ---- */}
          <KundaliGenerator />
        </div>

        {/* ---- trust badges ---- */}
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gold-500/25 bg-gold-500/15 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((b) => (
            <div key={b.title} className="flex items-center gap-3 bg-[#fdf8ee] p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600">
                <Glyph name={b.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-sm font-bold text-ink">{b.title}</p>
                <p className="text-xs leading-snug text-ink/55">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
