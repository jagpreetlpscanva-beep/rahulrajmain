"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { CITIES } from "@/lib/calculators";
import { BRAND_LOGO_SRC } from "../ui/Logo";

const PersonIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </svg>
);
const SunburstIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2l1.6 4.2L18 4.6l-1.6 4.4L21 11l-4.2 1.6L18 17l-4.4-1.6L11 21l-1.6-4.2L4.6 18l1.6-4.4L2 11l4.2-1.6L4.6 4.6 9 6.2 11 2Z" opacity="0.25" />
    <circle cx="12" cy="11.5" r="3" />
  </svg>
);

function pick(o: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = o?.[k];
    if ((typeof v === "string" && v.trim()) || typeof v === "number") return String(v);
  }
  return null;
}

export function KundaliGenerator() {
  const [form, setForm] = useState({ name: "", dob: "", tob: "12:00", city: "Lucknow" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [chartUrl, setChartUrl] = useState<string | null>(null);
  const [navamsaUrl, setNavamsaUrl] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Body-level node the printable doc gets portal-ed into (see layout.tsx +
  // globals.css @media print) so window.print() only ever measures 1 page.
  const [printPortal, setPrintPortal] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPrintPortal(document.getElementById("print-portal"));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dob) return;
    const c = CITIES.find((x) => x.name === form.city) ?? CITIES[0];
    const [y, m, d] = form.dob.split("-").map(Number);
    const [hh, mm] = (form.tob || "12:00").split(":").map(Number);
    setState("loading");
    setErrMsg("");
    try {
      const r = await fetch("/api/astrology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: "astro_details",
          payload: { day: d, month: m, year: y, hour: hh || 0, min: mm || 0, lat: c.lat, lon: c.lon, tzone: c.tzone },
        }),
      });
      const json = await r.json();
      if (!r.ok) {
        setErrMsg(json?.message || (json?.error === "not_configured"
          ? "Kundli service is being set up — please check back soon."
          : "Could not generate your kundli. Please try again."));
        setState("error");
        return;
      }
      setResult(json.data as Record<string, unknown>);

      // Fetch the visual Lagna (D1) + Navamsa (D9) chart images
      const chartPayload = { day: d, month: m, year: y, hour: hh || 0, min: mm || 0, lat: c.lat, lon: c.lon, tzone: c.tzone, chart_style: "north" };
      const getChart = async (div: "D1" | "D9") => {
        try {
          const cr = await fetch("/api/astrology", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: `horo_chart_image/${div}`, payload: chartPayload }),
          });
          const cjson = await cr.json();
          return cjson?.data?.chart_url || cjson?.data?.image_url || cjson?.data?.svg || null;
        } catch {
          return null;
        }
      };
      const [d1, d9] = await Promise.all([getChart("D1"), getChart("D9")]);
      if (d1) setChartUrl(d1);
      if (d9) setNavamsaUrl(d9);

      setState("done");
    } catch {
      setErrMsg("Could not connect. Please try again.");
      setState("error");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-ink/15 bg-[#fbf7ee] px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60";

  const d = result || {};
  const rows: { label: string; value: string | null }[] = [
    { label: "Ascendant (Lagna)", value: pick(d, ["ascendant"]) },
    { label: "Moon Sign (Rashi)", value: pick(d, ["sign", "Rasi", "moon_sign"]) },
    { label: "Nakshatra", value: pick(d, ["Naksahtra", "nakshatra", "Nakshatra"]) },
    { label: "Nakshatra Lord", value: pick(d, ["NaksahtraLord", "nakshatra_lord"]) },
    { label: "Sign Lord", value: pick(d, ["SignLord", "sign_lord"]) },
    { label: "Charan / Pada", value: pick(d, ["Charan", "charan"]) },
    { label: "Tithi", value: pick(d, ["Tithi", "tithi"]) },
    { label: "Yoga", value: pick(d, ["Yog", "yog", "yoga"]) },
    { label: "Karana", value: pick(d, ["Karan", "karan", "karana"]) },
  ].filter((r) => r.value);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-gold-500/30 bg-white p-6 shadow-card lg:p-8">
      <span className="inline-flex items-center gap-2 self-start rounded-full border border-gold-500/30 bg-gold-50 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold-700">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" /></svg>
        Free Janam Kundli
      </span>
      <h3 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
        Generate Your <span className="text-gold-600">Birth Chart</span>
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        Enter your birth details and get your Vedic Kundli details instantly.
      </p>

      {state === "done" ? (
        <div className="mt-6 flex flex-1 flex-col">
          {/* actions */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={() => { setState("idle"); setChartUrl(null); setNavamsaUrl(null); }} className="text-xs font-medium text-gold-700 underline">← Generate another</button>
            <button type="button" onClick={() => window.print()} className="rounded-lg bg-gold-gradient px-4 py-2 text-xs font-bold uppercase tracking-wider text-night shadow-gold-btn">
              ⬇ Download Kundli (PDF)
            </button>
          </div>

          {/* on-screen preview (compact card — the real print layout is portal-ed below) */}
          <div className="rounded-2xl border border-gold-500/20 bg-white p-5">
            <div className="flex items-center gap-3 border-b border-gold-500/20 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BRAND_LOGO_SRC} alt="Dr. Rahul Raj Astro" className="h-12 w-12 rounded-full object-cover ring-1 ring-gold-500/30" />
              <div>
                <p className="font-serif text-lg font-bold text-ink">Dr. Rahul Raj — Vedic Astrologer</p>
                <p className="text-xs text-gold-700">astrorahulraj.in · +91 94153 12590</p>
              </div>
            </div>
            <p className="mt-3 font-serif text-lg font-bold text-ink">{form.name} — जन्म कुंडली</p>
            <p className="text-xs text-ink/55">जन्म: {form.dob} · {form.tob} · {form.city}</p>
            {(chartUrl || navamsaUrl) && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {chartUrl && (
                  <div className="rounded-xl border border-gold-500/15 p-2 text-center">
                    <p className="mb-1 text-xs font-bold text-ink/70">Lagna Chart (D1)</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={chartUrl} alt="Lagna Chart" className="mx-auto w-full max-w-[16rem] object-contain" />
                  </div>
                )}
                {navamsaUrl && (
                  <div className="rounded-xl border border-gold-500/15 p-2 text-center">
                    <p className="mb-1 text-xs font-bold text-ink/70">Navamsa Chart (D9)</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={navamsaUrl} alt="Navamsa Chart" className="mx-auto w-full max-w-[16rem] object-contain" />
                  </div>
                )}
              </div>
            )}
            {rows.length > 0 && (
              <div className="mt-4 grid gap-1.5 rounded-xl border border-gold-500/15 bg-gold-50/40 p-4 sm:grid-cols-2">
                {rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3 border-b border-gold-500/10 py-1.5">
                    <span className="text-xs font-semibold text-ink/60">{r.label}</span>
                    <span className="text-right text-sm font-bold text-ink">{r.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <a href="/bookconsultation" className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn">
            Get Full Kundli Reading →
          </a>

          {/* ---- printable doc: portal-ed to <body> so it's the ONLY thing
               measured on print (fixes the multi-blank-page bug) and can have
               its own full-bleed, single-page premium design. ---- */}
          {printPortal &&
            createPortal(
              <div id="kundli-print-doc" className="hidden print:block">
                <div className="relative mx-auto flex min-h-[277mm] w-[210mm] flex-col overflow-hidden bg-[#fffdf7] p-[14mm]">
                  {/* outer ornamental border */}
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

                  {/* title block */}
                  <div className="relative mt-8 text-center">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.35em] text-gold-600">जन्म कुंडली · Birth Chart</p>
                    <h1 className="mt-2 font-serif text-4xl font-bold text-ink">{form.name}</h1>
                    <p className="mt-2 text-sm text-ink/60">
                      जन्म: {form.dob} · {form.tob} · {form.city}
                    </p>
                    <div className="mx-auto mt-4 h-px w-40 bg-gold-500/40" />
                  </div>

                  {/* charts */}
                  {(chartUrl || navamsaUrl) && (
                    <div className="relative mt-8 grid grid-cols-2 gap-8">
                      {chartUrl && (
                        <div className="rounded-2xl border border-gold-500/25 bg-white p-4 text-center shadow-sm">
                          <p className="mb-3 font-serif text-sm font-bold text-gold-700">Lagna Chart (D1)</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={chartUrl} alt="Lagna Chart" className="mx-auto w-full max-w-[80mm] object-contain" />
                        </div>
                      )}
                      {navamsaUrl && (
                        <div className="rounded-2xl border border-gold-500/25 bg-white p-4 text-center shadow-sm">
                          <p className="mb-3 font-serif text-sm font-bold text-gold-700">Navamsa Chart (D9)</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={navamsaUrl} alt="Navamsa Chart" className="mx-auto w-full max-w-[80mm] object-contain" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* details table */}
                  {rows.length > 0 && (
                    <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold-500/25">
                      {rows.map((r, i) => (
                        <div
                          key={r.label}
                          className={`flex items-center justify-between px-5 py-3 ${i % 2 === 0 ? "bg-gold-50/50" : "bg-white"}`}
                        >
                          <span className="text-sm font-semibold text-ink/60">{r.label}</span>
                          <span className="font-serif text-base font-bold text-ink">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* spacer pushes footer down so short reports still fill the page */}
                  <div className="relative flex-1" />

                  {/* footer */}
                  <div className="relative mt-8 border-t border-gold-500/20 pt-4 text-center">
                    <p className="text-xs text-ink/50">
                      Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="mt-1 font-serif text-sm font-bold text-gold-700">© Dr. Rahul Raj Astro · astrorahulraj.in</p>
                  </div>
                </div>
              </div>,
              printPortal
            )}
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-1 flex-col gap-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <div className="relative">
              <input className={`${inputCls} pr-10`} placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              <PersonIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-500/60" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date of Birth</label>
              <input type="date" className={inputCls} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Time of Birth</label>
              <input type="time" className={inputCls} value={form.tob} onChange={(e) => set("tob", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Place of Birth</label>
            <input list="kundli-cities" className={inputCls} placeholder="Search your city…" value={form.city} onChange={(e) => set("city", e.target.value)} />
            <datalist id="kundli-cities">
              {CITIES.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </div>

          {state === "error" && <p className="text-sm font-medium text-rose-600">{errMsg}</p>}

          <button
            type="submit"
            disabled={state === "loading"}
            className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            <SunburstIcon className="h-5 w-5" />
            {state === "loading" ? "Generating…" : "Generate Kundli"}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink/50">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-500/70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>
            Your information is 100% safe and private
          </p>
        </form>
      )}
    </div>
  );
}
