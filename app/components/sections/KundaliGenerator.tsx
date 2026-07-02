"use client";

import { useState, type FormEvent } from "react";
import { CITIES } from "@/lib/calculators";

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
  const [errMsg, setErrMsg] = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

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

      // Fetch the visual Lagna (D1) chart image
      try {
        const cr = await fetch("/api/astrology", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: "horo_chart_image/D1",
            payload: {
              day: d, month: m, year: y, hour: hh || 0, min: mm || 0,
              lat: c.lat, lon: c.lon, tzone: c.tzone, chart_style: "north",
            },
          }),
        });
        const cjson = await cr.json();
        const url = cjson?.data?.chart_url || cjson?.data?.image_url || null;
        if (url) setChartUrl(url);
      } catch {
        /* chart is optional; ignore failure */
      }

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
          <p className="font-serif text-lg font-bold text-ink">Namaste, {form.name.split(" ")[0]} 🙏</p>
          <p className="mt-0.5 text-xs text-ink/55">Your Vedic birth details ({form.city}):</p>
          {chartUrl && (
            <div className="mt-3 flex justify-center rounded-2xl border border-gold-500/20 bg-white p-3">
              <img src={chartUrl} alt="Lagna Chart" className="h-56 w-56 object-contain" />
            </div>
          )}
          <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto rounded-2xl border border-gold-500/20 bg-gold-50/40 p-4">
            {rows.length ? rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 border-b border-gold-500/10 py-1.5 last:border-0">
                <span className="text-xs font-semibold text-ink/60">{r.label}</span>
                <span className="text-right text-sm font-bold text-ink">{r.value}</span>
              </div>
            )) : (
              <p className="text-sm text-ink/60">Details received. For your full kundli reading, book a consultation.</p>
            )}
          </div>
          <a href="/bookconsultation" className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn">
            Get Full Kundli Reading →
          </a>
          <button type="button" onClick={() => setState("idle")} className="mt-2 text-xs font-medium text-gold-700 underline">
            Generate another
          </button>
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
