"use client";

import { useState, type FormEvent } from "react";
import { CITIES } from "@/lib/calculators";
import { BRAND_LOGO_SRC } from "../ui/Logo";

type Data = {
  astro?: Record<string, unknown> | null;
  ascendant?: { ascendant?: string; report?: string[] } | null;
  characteristics?: string[] | { characteristics?: string[] } | null;
};

function primitives(o: unknown): { k: string; v: string }[] {
  if (!o || typeof o !== "object") return [];
  return Object.entries(o as Record<string, unknown>)
    .filter(([, v]) => typeof v === "string" || typeof v === "number")
    .map(([k, v]) => ({ k: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), v: String(v) }));
}

export function ReportGenerator() {
  const [form, setForm] = useState({ name: "", dob: "", tob: "12:00", city: "Lucknow" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [data, setData] = useState<Data | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const [pdfBusy, setPdfBusy] = useState(false);

  const downloadPdf = async () => {
    const c = CITIES.find((x) => x.name === form.city) ?? CITIES[0];
    const [y, m, d] = form.dob.split("-").map(Number);
    const [hh, mm] = (form.tob || "12:00").split(":").map(Number);
    setPdfBusy(true);
    try {
      const r = await fetch("/api/astrology-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, place: form.city, day: d, month: m, year: y, hour: hh || 0, min: mm || 0, lat: c.lat, lon: c.lon, tzone: c.tzone }),
      });
      const j = await r.json();
      if (j.pdf_url) window.open(j.pdf_url, "_blank");
      else alert("Official PDF service abhi set nahi hui (astrologyapi PDF endpoint chahiye). Filhaal neeche 'Print (PDF)' se report download kar lein.");
    } catch {
      alert("PDF nahi ban payi — dobara try karein.");
    } finally {
      setPdfBusy(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dob) return;
    const c = CITIES.find((x) => x.name === form.city) ?? CITIES[0];
    const [y, m, d] = form.dob.split("-").map(Number);
    const [hh, mm] = (form.tob || "12:00").split(":").map(Number);
    setState("loading");
    setErrMsg("");
    try {
      const r = await fetch("/api/astrology-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: d, month: m, year: y, hour: hh || 0, min: mm || 0, lat: c.lat, lon: c.lon, tzone: c.tzone, lang: "hi" }),
      });
      const json = await r.json();
      if (!r.ok) {
        setErrMsg(json?.message || "रिपोर्ट अभी तैयार नहीं हो पाई। कृपया दोबारा प्रयास करें।");
        setState("error");
        return;
      }
      setData(json.data as Data);
      setState("done");
    } catch {
      setErrMsg("कनेक्ट नहीं हो पाया। कृपया दोबारा प्रयास करें।");
      setState("error");
    }
  };

  const inputCls = "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60";

  const chars = Array.isArray(data?.characteristics)
    ? (data?.characteristics as string[])
    : (data?.characteristics as { characteristics?: string[] })?.characteristics ?? [];
  const ascReport = data?.ascendant?.report ?? [];

  if (state === "done" && data) {
    return (
      <div className="mx-auto max-w-3xl">
        {/* actions (hidden when printing) */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button type="button" onClick={() => setState("idle")} className="text-sm text-ink/55 hover:text-gold-700">← नई रिपोर्ट</button>
          <button type="button" onClick={downloadPdf} disabled={pdfBusy} className="rounded-xl bg-gold-gradient px-5 py-3 text-sm font-bold text-night shadow-gold-btn disabled:opacity-60">
            {pdfBusy ? "बन रही है…" : "⬇ Official PDF (Hindi)"}
          </button>
          <button type="button" onClick={() => window.print()} className="rounded-xl border border-gold-500/40 bg-white px-5 py-3 text-sm font-bold text-gold-700">
            प्रिंट (PDF)
          </button>
        </div>

        {/* report document */}
        <div id="report-doc" className="rounded-3xl border border-gold-500/20 bg-white p-8 shadow-card print:border-0 print:shadow-none">
          {/* branded header */}
          <div className="flex items-center gap-4 border-b border-gold-500/20 pb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_LOGO_SRC} alt="Dr. Rahul Raj Astro" className="h-16 w-16 rounded-full object-cover ring-1 ring-gold-500/30" />
            <div>
              <p className="font-serif text-2xl font-bold text-ink">Dr. Rahul Raj — Vedic Astrologer</p>
              <p className="text-sm text-gold-700">वैदिक ज्योतिष रिपोर्ट · astrorahulraj.in · +91 94153 12590</p>
            </div>
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold text-ink">{form.name} — वैदिक कुंडली रिपोर्ट</h1>
          <p className="mt-1 text-sm text-ink/60">जन्म: {form.dob} · {form.tob} · {form.city}</p>

          {/* birth details grid */}
          {primitives(data.astro).length > 0 && (
            <section className="mt-6">
              <h2 className="font-serif text-xl font-bold text-gold-700">ग्रह व राशि विवरण</h2>
              <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {primitives(data.astro).map((r) => (
                  <div key={r.k} className="flex justify-between gap-3 border-b border-gold-500/10 py-1.5">
                    <span className="text-xs font-semibold text-ink/55">{r.k}</span>
                    <span className="text-sm font-bold text-ink">{r.v}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ascendant nature */}
          {ascReport.length > 0 && (
            <section className="mt-7">
              <h2 className="font-serif text-xl font-bold text-gold-700">लग्न स्वभाव {data.ascendant?.ascendant ? `(${data.ascendant.ascendant})` : ""}</h2>
              <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-ink/80">
                {ascReport.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </section>
          )}

          {/* personality */}
          {chars.length > 0 && (
            <section className="mt-7">
              <h2 className="font-serif text-xl font-bold text-gold-700">व्यक्तित्व विशेषताएँ</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink/80">
                {chars.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </section>
          )}

          <div className="mt-8 rounded-2xl border border-gold-500/20 bg-gold-50/60 p-5 text-center print:hidden">
            <p className="text-sm text-ink/70">विस्तृत रीडिंग और उपाय के लिए Dr. Rahul Raj से परामर्श बुक करें।</p>
            <a href="/bookconsultation" className="mt-3 inline-block rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-night shadow-gold-btn">परामर्श बुक करें →</a>
          </div>
          <p className="mt-6 border-t border-gold-500/15 pt-4 text-center text-xs text-ink/45">© Dr. Rahul Raj Astro · astrorahulraj.in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-gold-500/20 bg-white p-6 shadow-card sm:p-8">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={labelCls}>पूरा नाम / Full Name</label>
          <input className={inputCls} placeholder="आपका नाम" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>जन्म तिथि</label>
            <input type="date" className={inputCls} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>जन्म समय</label>
            <input type="time" className={inputCls} value={form.tob} onChange={(e) => set("tob", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>जन्म स्थान</label>
          <input list="report-cities" className={inputCls} placeholder="शहर खोजें…" value={form.city} onChange={(e) => set("city", e.target.value)} />
          <datalist id="report-cities">
            {CITIES.map((c) => <option key={c.name} value={c.name} />)}
          </datalist>
        </div>
        {state === "error" && <p className="text-sm font-medium text-rose-600">{errMsg}</p>}
        <button type="submit" disabled={state === "loading"} className="w-full rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn disabled:opacity-60">
          {state === "loading" ? "रिपोर्ट बन रही है…" : "रिपोर्ट जनरेट करें"}
        </button>
      </form>
    </div>
  );
}
