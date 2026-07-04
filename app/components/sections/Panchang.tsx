"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ZodiacWheel } from "../ui/ZodiacWheel";
import { Mandala } from "../ui/Mandala";
import { KundaliGenerator } from "./KundaliGenerator";
import { CITIES } from "@/lib/calculators";

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

type Panch = {
  tithi: string; nakshatra: string; yoga: string; karana: string;
  sunrise: string; sunset: string; moonrise: string; moonset: string;
  rahukaal: string; gulika: string; yamghanta: string; abhijit: string;
};
const DASH = "—";
const FALLBACK: Panch = {
  tithi: DASH, nakshatra: DASH, yoga: DASH, karana: DASH,
  sunrise: DASH, sunset: DASH, moonrise: DASH, moonset: DASH,
  rahukaal: DASH, gulika: DASH, yamghanta: DASH, abhijit: DASH,
};

/** First primitive value found along the given object paths. */
function pick(obj: unknown, paths: string[]): string | null {
  for (const path of paths) {
    const v = path.split(".").reduce<unknown>((a, k) => (a && typeof a === "object" ? (a as Record<string, unknown>)[k] : undefined), obj);
    if ((typeof v === "string" && v.trim()) || typeof v === "number") return String(v);
  }
  return null;
}

/** A time value that may be a string or a { start, end } object. */
function range(obj: unknown, key: string): string | null {
  const v = (obj as Record<string, unknown> | undefined)?.[key];
  if (typeof v === "string" && v.trim()) return v;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const s = o.start ?? o.start_time ?? o.starttime;
    const e = o.end ?? o.end_time ?? o.endtime;
    if (s && e) return `${s} - ${e}`;
  }
  return null;
}

function parsePanchang(d: unknown): Panch {
  return {
    tithi: pick(d, ["tithi.details.tithi_name", "tithi.name", "tithi_name", "tithi"]) ?? DASH,
    nakshatra: pick(d, ["nakshatra.details.nak_name", "nakshatra.name", "nakshatra_name", "nakshatra"]) ?? DASH,
    yoga: pick(d, ["yog.details.yog_name", "yog.name", "yog_name", "yoga"]) ?? DASH,
    karana: pick(d, ["karan.details.karan_name", "karan.name", "karan_name", "karana"]) ?? DASH,
    sunrise: pick(d, ["sunrise", "vedic_sunrise"]) ?? DASH,
    sunset: pick(d, ["sunset", "vedic_sunset"]) ?? DASH,
    moonrise: pick(d, ["moonrise"]) ?? DASH,
    moonset: pick(d, ["moonset"]) ?? DASH,
    rahukaal: range(d, "rahukaal") ?? pick(d, ["rahukaal"]) ?? DASH,
    gulika: range(d, "gulika") ?? pick(d, ["gulika"]) ?? DASH,
    yamghanta: range(d, "yamghanta") ?? pick(d, ["yamghanta", "yamakanta"]) ?? DASH,
    abhijit: range(d, "abhijit_muhurta") ?? range(d, "abhijit") ?? pick(d, ["abhijit"]) ?? DASH,
  };
}

const TRUST: { icon: GlyphName; title: string; sub: string }[] = [
  { icon: "shield", title: "100% Accurate", sub: "Vedic calculations you can trust" },
  { icon: "check", title: "Personalized Report", sub: "Detailed Kundli just for you" },
  { icon: "lock", title: "Secure & Private", sub: "Your information is fully protected" },
  { icon: "person", title: "Expert Guidance", sub: "Insights by Dr. Rahul Raj, Vedic Astrologer" },
];

export function Panchang() {
  const [today, setToday] = useState<Date | null>(null);
  const [city, setCity] = useState("Lucknow");
  const [panch, setPanch] = useState<Panch>(FALLBACK);
  const [status, setStatus] = useState<"idle" | "loading" | "live" | "unavailable">("idle");
  useEffect(() => setToday(new Date()), []);

  // Fetch real panchang for the selected city + today (cached per city/day so we
  // don't spend an API credit on every page view).
  useEffect(() => {
    const c = CITIES.find((x) => x.name === city);
    if (!c) return;
    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);
    const cacheKey = `panchang:v2:${city}:${dateKey}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setPanch(JSON.parse(cached));
        setStatus("live");
        return;
      }
    } catch {
      /* ignore */
    }
    let alive = true;
    setStatus("loading");
    fetch("/api/astrology", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: "advanced_panchang",
        payload: {
          day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear(),
          hour: 6, min: 0, lat: c.lat, lon: c.lon, tzone: c.tzone,
        },
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (!alive) return;
        const p = parsePanchang(json.data);
        setPanch(p);
        setStatus("live");
        try { sessionStorage.setItem(cacheKey, JSON.stringify(p)); } catch { /* ignore */ }
      })
      .catch(() => { if (alive) setStatus("unavailable"); });
    return () => { alive = false; };
  }, [city]);

  const rise = [
    { label: "Sunrise", value: panch.sunrise, icon: "sunrise" as GlyphName },
    { label: "Sunset", value: panch.sunset, icon: "sunset" as GlyphName },
    { label: "Moonrise", value: panch.moonrise, icon: "moon" as GlyphName },
    { label: "Moonset", value: panch.moonset, icon: "moon" as GlyphName },
  ];
  const timings = [
    { t: "Abhijeet Muhurat", v: panch.abhijit, cls: "bg-sky-50 text-sky-900" },
    { t: "Gulika Kaal", v: panch.gulika, cls: "bg-amber-50 text-amber-900" },
    { t: "Rahu Kaal", v: panch.rahukaal, cls: "bg-rose-50 text-rose-900" },
    { t: "Yamaghanta Kaal", v: panch.yamghanta, cls: "bg-indigo-50 text-indigo-900" },
  ];

  return (
    <section className="paper-bg relative overflow-hidden py-10 lg:py-14">
      {/* faint zodiac watermarks on the edges */}
      <ZodiacWheel className="pointer-events-none absolute -left-44 top-10 h-[34rem] w-[34rem] text-gold-500/[0.05]" />
      <ZodiacWheel className="pointer-events-none absolute -right-44 bottom-0 h-[34rem] w-[34rem] text-gold-500/[0.05]" />

      <div className="container-px relative">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
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
              <div className="relative shrink-0">
                <input
                  list="panchang-cities"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Search city…"
                  className="w-40 rounded-lg border border-espresso/15 bg-white px-3 py-2 text-sm font-medium text-espresso outline-none focus:border-gold-600"
                />
                <datalist id="panchang-cities">
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* sunrise / sunset / moonrise / moonset */}
            <div className="grid grid-cols-2 gap-px bg-gold-500/10 sm:grid-cols-4">
              {rise.map((it) => (
                <div key={it.label} className="flex flex-col items-center gap-1 bg-white p-4 text-center">
                  <span className="text-gold-600"><Glyph name={it.icon} className="h-6 w-6" /></span>
                  <p className="text-xs font-bold text-ink">{it.label}</p>
                  <p className="text-xs text-ink/60">{it.value}</p>
                </div>
              ))}
            </div>

            {/* auspicious / inauspicious */}
            <div className="px-5 pt-5">
              <p className="text-sm font-bold text-ink">Auspicious / Inauspicious Time</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {timings.map((b) => (
                  <div key={b.t} className={`rounded-xl p-3.5 ${b.cls}`}>
                    <p className="text-sm font-bold">{b.t}</p>
                    <p className="mt-1 text-xs opacity-80">{b.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* panchang details */}
            <div className="px-5 py-5">
              <p className="text-sm font-bold text-ink">Panchang</p>
              <div className="mt-3 rounded-2xl border border-gold-500/20 p-4">
                <p className="text-xs text-ink/50">Tithi</p>
                <p className="font-serif text-lg font-bold text-ink">{panch.tithi}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gold-500/10 pt-3 text-center">
                  {[["Nakshatra", panch.nakshatra], ["Yog", panch.yoga], ["Karan", panch.karana]].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-[0.6rem] uppercase tracking-wide text-ink/50">{l}</p>
                      <p className="mt-0.5 text-sm font-bold text-ink">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* note */}
            <div className="flex items-start gap-2 border-t border-gold-500/15 px-5 py-3 text-xs leading-relaxed text-ink/45">
              <Glyph name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" />
              <span>
                {status === "loading"
                  ? `Loading today's panchang for ${city}…`
                  : status === "live"
                  ? `Live Vedic panchang for ${city}.`
                  : `Panchang for ${city} will show here once the astrology API is connected.`}
              </span>
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
