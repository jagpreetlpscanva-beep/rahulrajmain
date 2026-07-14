"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CALCULATORS, CITIES, ZODIAC_SIGNS, type CalcDef } from "@/lib/calculators";
import { IconImage } from "../ui/IconImage";
import { BRAND_LOGO_SRC } from "../ui/Logo";

/** Calculator titles in Hindi (used in the PDF + result heading). */
const HINDI_TITLES: Record<string, string> = {
  kundli: "कुंडली / जन्म विवरण",
  planets: "ग्रह स्थिति",
  ascendant: "लग्न रिपोर्ट",
  matching: "कुंडली मिलान",
  horoscope: "दैनिक राशिफल",
  numerology: "अंक ज्योतिष",
  manglik: "मांगलिक दोष",
  kalsarp: "काल सर्प दोष",
  sadhesati: "साढ़े साती स्थिति",
  panchang: "पंचांग",
  gemstone: "रत्न सुझाव",
  rudraksha: "रुद्राक्ष सुझाव",
};

/** Common astrologyapi field keys → Hindi labels (lowercased, underscores kept). */
const HINDI_LABELS: Record<string, string> = {
  name: "नाम", day: "दिन", month: "माह", year: "वर्ष", hour: "घंटा", min: "मिनट", gender: "लिंग",
  date: "तिथि", place: "स्थान", latitude: "अक्षांश", longitude: "देशांतर", timezone: "समय क्षेत्र",
  sign: "राशि", sign_lord: "राशि स्वामी", signlord: "राशि स्वामी", rashi: "राशि",
  ascendant: "लग्न", ascendant_lord: "लग्न स्वामी",
  nakshatra: "नक्षत्र", naksahtra: "नक्षत्र", nakshatra_lord: "नक्षत्र स्वामी", naksahtralord: "नक्षत्र स्वामी",
  nakshatra_pad: "नक्षत्र चरण", nakshatrapad: "नक्षत्र चरण", charan: "चरण",
  planet: "ग्रह", planet_name: "ग्रह", planet_small: "ग्रह",
  full_degree: "पूर्ण अंश", fulldegree: "पूर्ण अंश", norm_degree: "अंश", normdegree: "अंश",
  speed: "गति", isretro: "वक्री", is_retro: "वक्री", house: "भाव", deity: "देवता",
  tithi: "तिथि", yog: "योग", yoga: "योग", karan: "करण", karana: "करण", varna: "वर्ण",
  vashya: "वश्य", tara: "तारा", yoni: "योनि", gan: "गण", gana: "गण", nadi: "नाड़ी",
  bhakoot: "भकूट", maitri: "ग्रह मैत्री", graha_maitri: "ग्रह मैत्री",
  total_points: "कुल अंक", received_points: "प्राप्त अंक", ashtakoot_points: "अष्टकूट अंक",
  description: "विवरण", report: "रिपोर्ट", prediction: "भविष्यवाणी",
  manglik: "मांगलिक", is_present: "उपस्थित", manglik_report: "मांगलिक रिपोर्ट",
  gem: "रत्न", gem_hindi: "रत्न (हिन्दी)", gem_english: "रत्न (अंग्रेज़ी)", gemstone: "रत्न",
  weight_caret: "वजन (कैरेट)", wear_finger: "अंगुली", wear_metal: "धातु", wear_day: "दिन",
  destiny_number: "भाग्यांक", radical_number: "मूलांक", name_number: "नामांक",
  sunrise: "सूर्योदय", sunset: "सूर्यास्त", ayanamsha: "अयनांश",
};

function hindiLabel(key: string): string {
  const norm = key.toLowerCase();
  if (HINDI_LABELS[norm]) return HINDI_LABELS[norm];
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type BirthState = { name: string; date: string; time: string; cityIdx: number };
const emptyBirth = (): BirthState => ({ name: "", date: "", time: "12:00", cityIdx: 0 });

function birthPayload(b: BirthState, prefix = "") {
  const [y, m, d] = (b.date || "").split("-").map(Number);
  const [hh, mm] = (b.time || "12:00").split(":").map(Number);
  const c = CITIES[b.cityIdx] ?? CITIES[0];
  return {
    [`${prefix}day`]: d || 1,
    [`${prefix}month`]: m || 1,
    [`${prefix}year`]: y || 2000,
    [`${prefix}hour`]: hh || 0,
    [`${prefix}min`]: mm || 0,
    [`${prefix}lat`]: c.lat,
    [`${prefix}lon`]: c.lon,
    [`${prefix}tzone`]: c.tzone,
  };
}

const inputCls =
  "w-full rounded-xl border border-gold-500/25 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/15";

export function Calculators() {
  const [active, setActive] = useState<CalcDef | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c)}
            className="group flex items-start gap-4 rounded-2xl border border-gold-500/15 bg-white p-5 text-left shadow-[0_14px_40px_-26px_rgba(120,80,20,0.45)] transition-transform hover:-translate-y-1.5"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-50 text-2xl ring-1 ring-gold-500/20">
              <IconImage src={`/calculators/${c.id}.png`} alt={c.title} className="h-7 w-7">{c.icon}</IconImage>
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-base font-bold text-ink">{c.title}</span>
              <span className="mt-1 block text-xs leading-relaxed text-ink/55">{c.desc}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold-600">
                Open calculator
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {active && <CalcModal def={active} onClose={() => setActive(null)} />}
    </>
  );
}

function CalcModal({ def, onClose }: { def: CalcDef; onClose: () => void }) {
  const [b1, setB1] = useState<BirthState>(emptyBirth);
  const [b2, setB2] = useState<BirthState>(emptyBirth);
  const [sign, setSign] = useState<string>(ZODIAC_SIGNS[0]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<unknown>(null);
  const [errMsg, setErrMsg] = useState("");

  // Body-level node the printable doc portals into (see layout.tsx #print-portal
  // + globals.css @media print) so window.print() only ever measures 1 doc.
  const [printPortal, setPrintPortal] = useState<HTMLElement | null>(null);
  useEffect(() => setPrintPortal(document.getElementById("print-portal")), []);

  // Human-readable birth/context line for the PDF header.
  const subtitle = (() => {
    const cityName = (CITIES[b1.cityIdx] ?? CITIES[0]).name;
    if (def.input === "sign") return `राशि: ${sign[0].toUpperCase() + sign.slice(1)}`;
    if (def.input === "match") {
      const g = (b: BirthState) => [b.date, b.time].filter(Boolean).join(" ");
      return `वर वधू मिलान · ${g(b1)} — ${g(b2)}`;
    }
    if (def.input === "numero") return `${b1.name || ""} · जन्म: ${b1.date || "—"}`.trim();
    const parts = [b1.name, b1.date && `जन्म: ${b1.date}`, b1.time, cityName].filter(Boolean);
    return parts.join(" · ");
  })();

  const run = async () => {
    let endpoint = def.endpoint;
    let payload: Record<string, unknown> = {};

    if (def.input === "sign") {
      endpoint = `${def.endpoint}/${sign}`;
    } else if (def.input === "match") {
      payload = { ...birthPayload(b1, "m_"), ...birthPayload(b2, "f_") };
    } else if (def.input === "numero") {
      const [y, m, d] = (b1.date || "").split("-").map(Number);
      payload = { name: b1.name, day: d || 1, month: m || 1, year: y || 2000 };
    } else {
      payload = birthPayload(b1);
      if (b1.name) payload.name = b1.name;
    }

    setState("loading");
    setResult(null);
    setErrMsg("");
    try {
      const r = await fetch("/api/astrology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, payload, lang: "hi" }),
      });
      const json = await r.json();
      if (!r.ok) {
        setErrMsg(json?.message || (json?.error === "not_configured"
          ? "These calculators are being set up. Please check back soon."
          : "Something went wrong. Please try again."));
        setState("error");
        return;
      }
      setResult(json.data);
      setState("done");
    } catch {
      setErrMsg("Could not connect. Please try again.");
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="my-8 w-full max-w-lg rounded-3xl border border-gold-500/20 bg-[#FCF8F2] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-50 text-2xl ring-1 ring-gold-500/20">
              <IconImage src={`/calculators/${def.id}.png`} alt={def.title} className="h-6 w-6">{def.icon}</IconImage>
            </span>
            <h3 className="font-serif text-xl font-bold text-ink">{def.title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-ink/50 hover:bg-ink/5">✕</button>
        </div>

        <div className="mt-5 space-y-4">
          {def.input === "sign" ? (
            <Field label="Your zodiac sign">
              <select className={inputCls} value={sign} onChange={(e) => setSign(e.target.value)}>
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </Field>
          ) : def.input === "match" ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-gold-600">Boy&rsquo;s details</p>
              <BirthFields value={b1} onChange={setB1} showName={false} />
              <p className="pt-1 text-xs font-bold uppercase tracking-wider text-gold-600">Girl&rsquo;s details</p>
              <BirthFields value={b2} onChange={setB2} showName={false} />
            </>
          ) : def.input === "numero" ? (
            <>
              <Field label="Full name" required>
                <input className={inputCls} value={b1.name} onChange={(e) => setB1({ ...b1, name: e.target.value })} placeholder="Your full name" />
              </Field>
              <Field label="Date of birth" required>
                <input type="date" className={inputCls} value={b1.date} onChange={(e) => setB1({ ...b1, date: e.target.value })} />
              </Field>
            </>
          ) : (
            <BirthFields value={b1} onChange={setB1} showName />
          )}

          <button
            type="button"
            onClick={run}
            disabled={state === "loading"}
            className="w-full rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {state === "loading" ? "Calculating…" : "Calculate"}
          </button>

          {state === "error" && (
            <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-700">{errMsg}</p>
          )}

          {state === "done" && (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="font-serif text-sm font-bold text-gold-700">{HINDI_TITLES[def.id] || def.title}</p>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg bg-gold-gradient px-4 py-2 text-xs font-bold uppercase tracking-wider text-night shadow-gold-btn"
                >
                  ⬇ PDF डाउनलोड करें
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto rounded-2xl border border-gold-500/15 bg-white p-4">
                <JsonView value={result} />
              </div>

              {/* Branded, single-page printable doc (portaled to <body>). */}
              {printPortal &&
                createPortal(
                  <div className="hidden print:block">
                    <div className="relative mx-auto flex min-h-[277mm] w-[210mm] flex-col overflow-hidden bg-[#fffdf7] p-[14mm]">
                      <div className="pointer-events-none absolute inset-[6mm] border-2 border-gold-500/40" />
                      <div className="pointer-events-none absolute inset-[8mm] border border-gold-500/25" />

                      {/* header ribbon */}
                      <div className="relative flex items-center gap-4 rounded-2xl bg-luxe-gold px-6 py-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={BRAND_LOGO_SRC} alt="Dr. Rahul Raj Astro" className="h-16 w-16 rounded-full object-cover ring-2 ring-white/70" />
                        <div>
                          <p className="font-serif text-2xl font-bold text-espresso">Dr. Rahul Raj</p>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a5212]">Vedic Astrologer</p>
                          <p className="mt-0.5 text-xs text-[#7a5212]">astrorahulraj.in · +91 94153 12590</p>
                        </div>
                      </div>

                      {/* title */}
                      <div className="relative mt-8 text-center">
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.35em] text-gold-600">वैदिक ज्योतिष रिपोर्ट</p>
                        <h1 className="mt-2 font-serif text-3xl font-bold text-ink">{HINDI_TITLES[def.id] || def.title}</h1>
                        {subtitle && <p className="mt-2 text-sm text-ink/60">{subtitle}</p>}
                        <div className="mx-auto mt-4 h-px w-40 bg-gold-500/40" />
                      </div>

                      {/* body */}
                      <div className="relative mt-8 text-[13px]">
                        <JsonView value={result} print />
                      </div>

                      <div className="relative flex-1" />

                      {/* footer */}
                      <div className="relative mt-8 border-t border-gold-500/20 pt-4 text-center">
                        <p className="text-xs text-ink/50">
                          {new Date().toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })} को तैयार किया गया
                        </p>
                        <p className="mt-1 font-serif text-sm font-bold text-gold-700">© Dr. Rahul Raj Astro · astrorahulraj.in</p>
                        <p className="mt-2 text-[11px] text-ink/45">विस्तृत परामर्श हेतु: astrorahulraj.in/bookconsultation</p>
                      </div>
                    </div>
                  </div>,
                  printPortal
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BirthFields({ value, onChange, showName }: { value: BirthState; onChange: (v: BirthState) => void; showName: boolean }) {
  return (
    <div className="space-y-3">
      {showName && (
        <Field label="Name (optional)">
          <input className={inputCls} value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="Your name" />
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date of birth" required>
          <input type="date" className={inputCls} value={value.date} onChange={(e) => onChange({ ...value, date: e.target.value })} />
        </Field>
        <Field label="Time of birth" required>
          <input type="time" className={inputCls} value={value.time} onChange={(e) => onChange({ ...value, time: e.target.value })} />
        </Field>
      </div>
      <Field label="Place of birth">
        <select className={inputCls} value={value.cityIdx} onChange={(e) => onChange({ ...value, cityIdx: Number(e.target.value) })}>
          {CITIES.map((c, i) => (
            <option key={c.name} value={i}>{c.name}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink/70">{label} {required && <span className="text-gold-600">*</span>}</span>
      {children}
    </label>
  );
}

/** Generic, recursive renderer for whatever JSON the API returns. Labels are
 *  shown in Hindi (see hindiLabel). `print` tweaks spacing for the PDF doc. */
function JsonView({ value, depth = 0, print = false }: { value: unknown; depth?: number; print?: boolean }) {
  if (value === null || value === undefined || value === "") return <span className="text-ink/40">—</span>;

  if (Array.isArray(value)) {
    return (
      <div className={print ? "space-y-2" : "space-y-2"}>
        {value.map((v, i) => (
          <div key={i} className={print ? "rounded-lg border border-gold-500/15 bg-gold-50/40 p-2.5" : "rounded-lg bg-gold-50/40 p-2"}>
            <JsonView value={v} depth={depth + 1} print={print} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className={depth === 0 ? "space-y-1.5" : "space-y-1"}>
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => {
          const label = hindiLabel(k);
          const isPrimitive = v === null || typeof v !== "object";
          // long text (reports/descriptions) reads better as a paragraph than a row
          const isLongText = typeof v === "string" && v.length > 60;
          if (isLongText) {
            return (
              <div key={k} className="py-1.5">
                <p className="text-xs font-semibold text-gold-700">{label}</p>
                <p className={`mt-0.5 leading-relaxed text-ink/80 ${print ? "text-[12px]" : "text-sm"}`}>{String(v)}</p>
              </div>
            );
          }
          return (
            <div key={k} className={isPrimitive ? "flex justify-between gap-3 border-b border-gold-500/10 py-1.5" : "py-1.5"}>
              <span className={`font-semibold text-ink/60 ${print ? "text-[12px]" : "text-xs"}`}>{label}</span>
              {isPrimitive ? (
                <span className={`text-right font-medium text-ink ${print ? "text-[12px]" : "text-sm"}`}>{String(v)}</span>
              ) : (
                <div className="mt-1"><JsonView value={v} depth={depth + 1} print={print} /></div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="text-sm text-ink">{String(value)}</span>;
}
