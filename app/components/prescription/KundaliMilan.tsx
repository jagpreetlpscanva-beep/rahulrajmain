"use client";

import { useState } from "react";
import { CITIES } from "@/lib/calculators";
import { RemedyPicker } from "./RemedyPicker";
import { generateReportPdf, svgToPng, downloadBlob, shareOrDownloadPdf, type ReportBlock } from "@/lib/prescriptionPad/reportPdf";

const ASTRO = "डॉ० राहुल राज — ज्योतिष परामर्श";
const FOOTER = "astrorahulraj.in · +91 94153 12590";
const fmtDMY = (ymd: string) => { if (!ymd) return ""; const [y, m, d] = ymd.split("-"); return d ? `${d}/${m}/${y}` : ymd; };

type Person = { name: string; dob: string; tob: string; place: string; gender: string };
type Koot = { key: string; name: string; max: number; obtained: number; area: string };
type Result = {
  boy: { chart: string }; girl: { chart: string };
  milan: { koots: Koot[]; total: number; verdict: string };
};

const blank = (gender: string): Person => ({ name: "", dob: "", tob: "", place: "Lucknow", gender });

export function KundaliMilan({ onBack }: { onBack: () => void }) {
  const [boy, setBoy] = useState<Person>(blank("पुरुष"));
  const [girl, setGirl] = useState<Person>(blank("स्त्री"));
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<"pdf" | "share" | null>(null);
  const [error, setError] = useState("");
  const [remedies, setRemedies] = useState<string[]>([]);

  const cityOf = (name: string) => CITIES.find((c) => c.name.toLowerCase() === name.toLowerCase());

  const generate = async () => {
    setError("");
    if (!boy.name.trim() || !boy.dob || !boy.tob || !girl.name.trim() || !girl.dob || !girl.tob) {
      setError("कृपया लड़के और लड़की — दोनों का नाम, जन्म तिथि व समय भरें।");
      return;
    }
    if (!boy.place.trim() || !girl.place.trim()) {
      setError("कृपया लड़के और लड़की — दोनों का जन्म स्थान भरें।");
      return;
    }
    setBusy(true);
    try {
      const mk = (p: Person) => { const c = cityOf(p.place); return { dob: p.dob, tob: p.tob, place: p.place, lat: c?.lat, lon: c?.lon, tzone: c?.tzone }; };
      const r = await fetch("/api/guna-milan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ boy: mk(boy), girl: mk(girl) }) });
      const j = await r.json();
      if (j.ok) setResult(j);
      else setError(j.message || "गणना नहीं हो सकी।");
    } catch { setError("नेटवर्क त्रुटि — दोबारा प्रयास करें।"); }
    finally { setBusy(false); }
  };

  const fileName = () => `कुंडली मिलान - ${(boy.name || "लड़का").replace(/[\\/:*?"<>|]/g, "")} व ${(girl.name || "लड़की").replace(/[\\/:*?"<>|]/g, "")}.pdf`;

  const makePdf = async (mode: "pdf" | "share") => {
    if (!result || pdfBusy) return;
    setPdfBusy(mode);
    try {
      const boyPng = await svgToPng(result.boy.chart);
      const girlPng = await svgToPng(result.girl.chart);
      const blocks: ReportBlock[] = [
        { type: "heading", text: "जन्म विवरण" },
        { type: "kv", cols: 2, rows: [
          ["लड़का — नाम", boy.name], ["लड़की — नाम", girl.name],
          ["जन्म तिथि", fmtDMY(boy.dob)], ["जन्म तिथि", fmtDMY(girl.dob)],
          ["जन्म समय", boy.tob], ["जन्म समय", girl.tob],
          ["जन्म स्थान", boy.place], ["जन्म स्थान", girl.place],
        ] },
        { type: "two-images", a: { png: boyPng, caption: `लड़के की कुंडली — ${boy.name}` }, b: { png: girlPng, caption: `लड़की की कुंडली — ${girl.name}` }, widthMm: 88 },
        { type: "heading", text: "गुण मिलान" },
        { type: "kv", cols: 2, rows: [["कुल गुण", `${result.milan.total} / 36`], ["परिणाम", result.milan.verdict]] },
        { type: "table", cols: ["कूट", "अधिकतम अंक", "प्राप्त अंक", "जीवन क्षेत्र"], widths: [30, 30, 30, 92],
          rows: [...result.milan.koots.map((k) => [k.name, String(k.max), String(k.obtained), k.area]),
                 ["कुल गुण", "36", String(result.milan.total), result.milan.verdict]] },
      ];
      if (remedies.length) blocks.push({ type: "heading", text: "उपाय" }, { type: "list", items: remedies });
      blocks.push({ type: "note", text: "यह पारंपरिक अष्टकूट गुण मिलान है — केवल मार्गदर्शन हेतु; अंतिम निर्णय ज्योतिषी के विवेक पर।" });
      const blob = await generateReportPdf({ brandTitle: ASTRO, brandSub: "कुंडली मिलान रिपोर्ट", title: "कुंडली मिलान", footer: FOOTER, blocks });
      if (mode === "pdf") downloadBlob(blob, fileName());
      else { const r = await shareOrDownloadPdf(blob, fileName()); if (r === "downloaded") alert("शेयर इस डिवाइस पर समर्थित नहीं — PDF डाउनलोड कर दी गई।"); }
    } catch (e) { alert("PDF नहीं बन सकी: " + (e instanceof Error ? e.message : String(e))); }
    finally { setPdfBusy(null); }
  };

  const inp = "w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#8a2020] focus:ring-2 focus:ring-[#8a2020]/15";
  const lbl = "mb-1 block text-xs font-semibold text-ink/60";

  const PersonForm = ({ p, set, title, color }: { p: Person; set: (u: Partial<Person>) => void; title: string; color: string }) => (
    <div className="rounded-2xl border border-ink/12 bg-white p-4 shadow-sm">
      <p className="mb-3 font-serif text-lg font-bold" style={{ color }}>{title}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className={lbl}>नाम</label><input className={inp} value={p.name} onChange={(e) => set({ name: e.target.value })} /></div>
        <div><label className={lbl}>जन्म तिथि</label><input type="date" className={inp} value={p.dob} onChange={(e) => set({ dob: e.target.value })} /></div>
        <div><label className={lbl}>जन्म समय</label><input type="time" className={inp} value={p.tob} onChange={(e) => set({ tob: e.target.value })} /></div>
        <div><label className={lbl}>जन्म स्थान</label><input list="milan-cities" className={inp} value={p.place} onChange={(e) => set({ place: e.target.value })} /></div>
        <div><label className={lbl}>लिंग</label><select className={inp} value={p.gender} onChange={(e) => set({ gender: e.target.value })}><option>पुरुष</option><option>स्त्री</option><option>अन्य</option></select></div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1120px] px-3 py-5">
      <style>{`@media print { .rx-noprint{display:none!important} }`}</style>
      <datalist id="milan-cities">{CITIES.map((c) => <option key={c.name} value={c.name} />)}</datalist>

      <div className="rx-noprint mb-4 flex items-center justify-between gap-3">
        <button onClick={onBack} className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink/70">← वापस</button>
        <h1 className="font-serif text-2xl font-bold text-[#a01414]">कुंडली मिलान</h1>
        {result && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => makePdf("pdf")} disabled={pdfBusy !== null} className="rounded-lg bg-[#6d1414] px-3 py-2 text-sm font-bold text-white disabled:opacity-60">{pdfBusy === "pdf" ? "बन रही…" : "📄 PDF डाउनलोड करें"}</button>
            <button onClick={() => window.print()} className="rounded-lg bg-[#3a3a3a] px-3 py-2 text-sm font-bold text-white">🖨️ प्रिंट करें</button>
            <button onClick={() => makePdf("share")} disabled={pdfBusy !== null} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60">{pdfBusy === "share" ? "…" : "🔗 शेयर करें"}</button>
          </div>
        )}
      </div>

      {/* form */}
      {!result && (
        <div className="rx-noprint">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PersonForm p={boy} set={(u) => setBoy((s) => ({ ...s, ...u }))} title="लड़के का विवरण" color="#1f4e79" />
            <PersonForm p={girl} set={(u) => setGirl((s) => ({ ...s, ...u }))} title="लड़की का विवरण" color="#a01414" />
          </div>
          {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
          <button onClick={generate} disabled={busy} className="mt-4 w-full rounded-xl bg-gold-gradient py-3 text-sm font-bold text-night shadow-gold-btn disabled:opacity-60 sm:w-auto sm:px-8">
            {busy ? "गणना हो रही है…" : "कुंडली मिलान करें"}
          </button>
        </div>
      )}

      {/* result */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,0.9fr,1.3fr]">
            {/* charts */}
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-[#1f4e79]/40 bg-white p-3">
                <p className="mb-1 text-center font-serif text-base font-bold text-[#1f4e79]">लड़के की जन्म कुंडली</p>
                <p className="mb-2 text-center text-xs text-ink/55">{boy.name}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.boy.chart} alt="लड़के की कुंडली" className="mx-auto w-full max-w-[300px]" />
              </div>
              <div className="rounded-2xl border-2 border-[#a01414]/40 bg-white p-3">
                <p className="mb-1 text-center font-serif text-base font-bold text-[#a01414]">लड़की की जन्म कुंडली</p>
                <p className="mb-2 text-center text-xs text-ink/55">{girl.name}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.girl.chart} alt="लड़की की कुंडली" className="mx-auto w-full max-w-[300px]" />
              </div>
            </div>

            {/* score */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gold-500/40 bg-[#fffaf0] p-5 text-center">
              <p className="font-serif text-lg font-bold text-ink/70">गुण मिलान</p>
              <p className="my-2 font-serif text-6xl font-extrabold text-[#a01414]">{result.milan.total}<span className="text-2xl text-ink/50"> / 36</span></p>
              <p className="rounded-full bg-[#a01414]/10 px-4 py-1.5 text-sm font-bold text-[#a01414]">{result.milan.verdict}</p>
              <p className="mt-3 text-[11px] leading-relaxed text-ink/45">यह पारंपरिक अष्टकूट गुण मिलान है — केवल मार्गदर्शन हेतु; अंतिम निर्णय ज्योतिषी के विवेक पर निर्भर करता है।</p>
            </div>

            {/* table */}
            <div className="overflow-x-auto rounded-2xl border border-ink/12 bg-white p-3">
              <p className="mb-2 font-serif text-lg font-bold text-[#a01414]">गुण मिलान — विस्तृत</p>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f2e4d6] text-left">
                    <th className="border border-ink/15 px-2 py-1.5">कूट</th>
                    <th className="border border-ink/15 px-2 py-1.5 text-center">अधिकतम अंक</th>
                    <th className="border border-ink/15 px-2 py-1.5 text-center">प्राप्त अंक</th>
                    <th className="border border-ink/15 px-2 py-1.5">जीवन क्षेत्र</th>
                  </tr>
                </thead>
                <tbody>
                  {result.milan.koots.map((k) => (
                    <tr key={k.key}>
                      <td className="border border-ink/15 px-2 py-1.5 font-semibold">{k.name}</td>
                      <td className="border border-ink/15 px-2 py-1.5 text-center">{k.max}</td>
                      <td className={`border border-ink/15 px-2 py-1.5 text-center font-bold ${k.obtained === 0 ? "text-rose-600" : "text-emerald-700"}`}>{k.obtained}</td>
                      <td className="border border-ink/15 px-2 py-1.5 text-ink/70">{k.area}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#fff4e0] font-bold">
                    <td className="border border-ink/15 px-2 py-1.5">कुल गुण</td>
                    <td className="border border-ink/15 px-2 py-1.5 text-center">36</td>
                    <td className="border border-ink/15 px-2 py-1.5 text-center text-[#a01414]">{result.milan.total}</td>
                    <td className="border border-ink/15 px-2 py-1.5">{result.milan.verdict}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* remedies */}
          <div className="rounded-2xl border border-ink/12 bg-white p-4">
            <RemedyPicker value={remedies} onChange={setRemedies} />
          </div>
        </div>
      )}
    </div>
  );
}
