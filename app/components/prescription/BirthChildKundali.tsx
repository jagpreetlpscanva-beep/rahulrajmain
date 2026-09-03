"use client";

import { useState } from "react";
import { CITIES } from "@/lib/calculators";
import { RemedyPicker } from "./RemedyPicker";
import { generateReportPdf, svgToPng, downloadBlob, shareOrDownloadPdf, type ReportBlock } from "@/lib/prescriptionPad/reportPdf";

type Child = { name: string; dob: string; tob: string; place: string; gender: string };
type Planet = { name: string; rashi: string; house: number; degree: string; nakshatra: string; pada: number };
type Data = {
  meta: { dob: string; tob: string; place: string; lat: number; lon: number; tzone: number; ayanamsa: string };
  panchang: { tithi: string; vaar: string; paksha: string; nakshatra: string; pada: number; nakshatra_lord: string; yoga: string; karana: string; sunrise: string; sunset: string };
  moon: { rashi: string; degree: string; nakshatra: string; pada: number };
  sun: { rashi: string; degree: string };
  lagna: { rashi: string; degree: string };
  planets: Planet[];
  houses: { house: number; rashi: string }[];
  dasha: { mahadasha: string; antardasha: string };
  dosha: string; yog: string;
  chart: string; navamsa: string;
};

const fmtDMY = (ymd: string) => { if (!ymd) return ""; const [y, m, d] = ymd.split("-"); return d ? `${d}/${m}/${y}` : ymd; };
const ASTRO = "डॉ० राहुल राज — ज्योतिष परामर्श";
const FOOTER = "astrorahulraj.in · +91 94153 12590";

export function BirthChildKundali({ onBack }: { onBack: () => void }) {
  const [c, setC] = useState<Child>({ name: "", dob: "", tob: "", place: "Lucknow", gender: "पुरुष" });
  const [data, setData] = useState<Data | null>(null);
  const [busy, setBusy] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<"pdf" | "share" | null>(null);
  const [error, setError] = useState("");
  const [remedies, setRemedies] = useState<string[]>([]);

  const generate = async () => {
    setError("");
    if (!c.name.trim() || !c.dob || !c.tob) { setError("कृपया बच्चे का नाम, जन्म तिथि व समय भरें।"); return; }
    if (!c.place.trim()) { setError("कृपया जन्म स्थान भरें।"); return; }
    setBusy(true);
    try {
      const city = CITIES.find((x) => x.name.toLowerCase() === c.place.toLowerCase());
      const r = await fetch("/api/birth-kundali", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dob: c.dob, tob: c.tob, place: c.place, lat: city?.lat, lon: city?.lon, tzone: city?.tzone }) });
      const j = await r.json();
      if (j.ok) setData(j); else setError(j.message || "कुंडली नहीं बन सकी।");
    } catch { setError("नेटवर्क त्रुटि — दोबारा प्रयास करें।"); }
    finally { setBusy(false); }
  };

  const fileName = () => `बाल जन्म कुंडली - ${(c.name || "शिशु").replace(/[\\/:*?"<>|]/g, "")}.pdf`;

  const buildBlocks = async (): Promise<ReportBlock[]> => {
    if (!data) return [];
    const d1 = await svgToPng(data.chart);
    const d9 = await svgToPng(data.navamsa);
    const blocks: ReportBlock[] = [
      { type: "heading", text: "जन्म विवरण" },
      { type: "kv", rows: [
        ["नाम", c.name], ["लिंग", c.gender],
        ["जन्म तिथि", fmtDMY(c.dob)], ["जन्म समय", c.tob],
        ["जन्म स्थान", c.place], ["अयनांश", data.meta.ayanamsa],
        ["अक्षांश", String(data.meta.lat)], ["देशांतर", String(data.meta.lon)],
        ["समय क्षेत्र", `+${data.meta.tzone}`],
      ] },
      { type: "heading", text: "पंचांग" },
      { type: "kv", rows: [
        ["तिथि", data.panchang.tithi], ["वार", data.panchang.vaar],
        ["पक्ष", data.panchang.paksha], ["योग", data.panchang.yoga],
        ["करण", data.panchang.karana], ["सूर्योदय", data.panchang.sunrise],
        ["सूर्यास्त", data.panchang.sunset],
      ] },
      { type: "heading", text: "राशि व नक्षत्र" },
      { type: "kv", rows: [
        ["जन्म नक्षत्र", `${data.panchang.nakshatra} (पाद ${data.panchang.pada})`],
        ["नक्षत्र स्वामी", data.panchang.nakshatra_lord],
        ["चंद्र राशि", `${data.moon.rashi} (${data.moon.degree})`],
        ["सूर्य राशि", `${data.sun.rashi} (${data.sun.degree})`],
        ["लग्न", `${data.lagna.rashi} (${data.lagna.degree})`],
        ["दोष", data.dosha], ["योग", data.yog],
      ] },
      { type: "two-images", a: { png: d1, caption: "जन्म कुंडली (D1)" }, b: { png: d9, caption: "नवांश कुंडली (D9)" }, widthMm: 88 },
      { type: "heading", text: "ग्रह स्थिति" },
      { type: "table", cols: ["ग्रह", "राशि", "भाव", "अंश", "नक्षत्र", "पाद"], widths: [26, 30, 16, 22, 46, 42],
        rows: data.planets.map((p) => [p.name, p.rashi, String(p.house), p.degree, p.nakshatra, String(p.pada)]) },
      { type: "heading", text: "भाव (Houses)" },
      { type: "table", cols: ["भाव", "राशि", "भाव", "राशि"], widths: [24, 66, 24, 68],
        rows: Array.from({ length: 6 }, (_, i) => [String(i + 1), data.houses[i].rashi, String(i + 7), data.houses[i + 6].rashi]) },
      { type: "heading", text: "विम्शोत्तरी दशा" },
      { type: "kv", rows: [["महादशा", data.dasha.mahadasha], ["अन्तर्दशा", data.dasha.antardasha]] },
    ];
    if (remedies.length) blocks.push({ type: "heading", text: "उपाय" }, { type: "list", items: remedies });
    blocks.push({ type: "note", text: "यह गणना लाहिरी अयनांश पर आधारित है — केवल मार्गदर्शन हेतु।" });
    return blocks;
  };

  const makePdf = async (mode: "pdf" | "share") => {
    if (!data || pdfBusy) return;
    setPdfBusy(mode);
    try {
      const blob = await generateReportPdf({ brandTitle: ASTRO, brandSub: "बाल जन्म कुंडली रिपोर्ट", title: "बाल जन्म कुंडली", footer: FOOTER, blocks: await buildBlocks() });
      if (mode === "pdf") downloadBlob(blob, fileName());
      else { const r = await shareOrDownloadPdf(blob, fileName()); if (r === "downloaded") alert("शेयर इस डिवाइस पर समर्थित नहीं — PDF डाउनलोड कर दी गई।"); }
    } catch (e) { alert("PDF नहीं बन सकी: " + (e instanceof Error ? e.message : String(e))); }
    finally { setPdfBusy(null); }
  };

  const inp = "w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#8a2020] focus:ring-2 focus:ring-[#8a2020]/15";
  const lbl = "mb-1 block text-xs font-semibold text-ink/60";
  const KV = ({ k, v }: { k: string; v: string }) => (<p className="text-sm"><b className="text-[#a01414]">{k}:</b> {v}</p>);

  return (
    <div className="mx-auto w-full max-w-[1000px] px-3 py-5">
      <style>{`@media print{.rx-noprint{display:none!important}}`}</style>
      <datalist id="child-cities">{CITIES.map((x) => <option key={x.name} value={x.name} />)}</datalist>

      <div className="rx-noprint mb-4 flex flex-wrap items-center justify-between gap-2">
        <button onClick={onBack} className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink/70">← वापस</button>
        <h1 className="font-serif text-2xl font-bold text-[#a01414]">बाल जन्म कुंडली</h1>
        {data && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => makePdf("pdf")} disabled={pdfBusy !== null} className="rounded-lg bg-[#6d1414] px-3 py-2 text-sm font-bold text-white disabled:opacity-60">{pdfBusy === "pdf" ? "बन रही…" : "📄 PDF डाउनलोड करें"}</button>
            <button onClick={() => window.print()} className="rounded-lg bg-[#3a3a3a] px-3 py-2 text-sm font-bold text-white">🖨️ प्रिंट करें</button>
            <button onClick={() => makePdf("share")} disabled={pdfBusy !== null} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60">{pdfBusy === "share" ? "…" : "🔗 शेयर करें"}</button>
          </div>
        )}
      </div>

      {/* form */}
      <div className="rx-noprint rounded-2xl border border-ink/12 bg-white p-4 shadow-sm">
        <p className="mb-3 font-serif text-lg font-bold text-[#a01414]">बच्चे का जन्म विवरण</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className={lbl}>बच्चे का नाम</label><input className={inp} value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
          <div><label className={lbl}>जन्म तिथि</label><input type="date" className={inp} value={c.dob} onChange={(e) => setC({ ...c, dob: e.target.value })} /></div>
          <div><label className={lbl}>जन्म समय</label><input type="time" className={inp} value={c.tob} onChange={(e) => setC({ ...c, tob: e.target.value })} /></div>
          <div><label className={lbl}>जन्म स्थान</label><input list="child-cities" className={inp} value={c.place} onChange={(e) => setC({ ...c, place: e.target.value })} /></div>
          <div><label className={lbl}>लिंग</label><select className={inp} value={c.gender} onChange={(e) => setC({ ...c, gender: e.target.value })}><option>पुरुष</option><option>स्त्री</option><option>अन्य</option></select></div>
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
        <button onClick={generate} disabled={busy} className="mt-4 w-full rounded-xl bg-gold-gradient py-3 text-sm font-bold text-night shadow-gold-btn disabled:opacity-60 sm:w-auto sm:px-8">{busy ? "बन रही है…" : "बाल जन्म कुंडली बनाएं"}</button>
      </div>

      {/* result */}
      {data && (
        <div id="bck-report" className="mt-6 space-y-5">
          <div className="rounded-2xl border border-ink/12 bg-white p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
              <KV k="नाम" v={c.name} /><KV k="लिंग" v={c.gender} /><KV k="जन्म तिथि" v={fmtDMY(c.dob)} />
              <KV k="समय" v={c.tob} /><KV k="स्थान" v={c.place} /><KV k="अयनांश" v={data.meta.ayanamsa} />
              <KV k="अक्षांश" v={String(data.meta.lat)} /><KV k="देशांतर" v={String(data.meta.lon)} /><KV k="समय क्षेत्र" v={`+${data.meta.tzone}`} />
            </div>
          </div>

          <div className="rounded-2xl border border-ink/12 bg-white p-4">
            <p className="mb-2 font-serif text-lg font-bold text-[#a01414]">पंचांग व नक्षत्र</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
              <KV k="तिथि" v={data.panchang.tithi} /><KV k="वार" v={data.panchang.vaar} /><KV k="पक्ष" v={data.panchang.paksha} />
              <KV k="जन्म नक्षत्र" v={`${data.panchang.nakshatra} (पाद ${data.panchang.pada})`} /><KV k="नक्षत्र स्वामी" v={data.panchang.nakshatra_lord} /><KV k="योग" v={data.panchang.yoga} />
              <KV k="करण" v={data.panchang.karana} /><KV k="चंद्र राशि" v={`${data.moon.rashi} (${data.moon.degree})`} /><KV k="सूर्य राशि" v={`${data.sun.rashi} (${data.sun.degree})`} />
              <KV k="लग्न" v={`${data.lagna.rashi} (${data.lagna.degree})`} /><KV k="सूर्योदय" v={data.panchang.sunrise} /><KV k="सूर्यास्त" v={data.panchang.sunset} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-[#a01414]/40 bg-white p-3 text-center">
              <p className="mb-2 font-serif text-base font-bold text-[#a01414]">जन्म कुंडली (D1)</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.chart} alt="जन्म कुंडली" className="mx-auto w-full max-w-[320px]" />
            </div>
            <div className="rounded-2xl border-2 border-[#1f4e79]/40 bg-white p-3 text-center">
              <p className="mb-2 font-serif text-base font-bold text-[#1f4e79]">नवांश कुंडली (D9)</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.navamsa} alt="नवांश कुंडली" className="mx-auto w-full max-w-[320px]" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-ink/12 bg-white p-4">
            <p className="mb-2 font-serif text-lg font-bold text-[#a01414]">ग्रह स्थिति</p>
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-[#f2e4d6] text-left">{["ग्रह", "राशि", "भाव", "अंश", "नक्षत्र", "पाद"].map((h) => <th key={h} className="border border-ink/15 px-2 py-1.5">{h}</th>)}</tr></thead>
              <tbody>{data.planets.map((p) => (<tr key={p.name}><td className="border border-ink/15 px-2 py-1.5 font-semibold">{p.name}</td><td className="border border-ink/15 px-2 py-1.5">{p.rashi}</td><td className="border border-ink/15 px-2 py-1.5">{p.house}</td><td className="border border-ink/15 px-2 py-1.5 font-mono">{p.degree}</td><td className="border border-ink/15 px-2 py-1.5">{p.nakshatra}</td><td className="border border-ink/15 px-2 py-1.5">{p.pada}</td></tr>))}</tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-ink/12 bg-white p-4">
            <p className="mb-2 font-serif text-lg font-bold text-[#a01414]">भाव व दशा</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
              {data.houses.map((h) => <KV key={h.house} k={`भाव ${h.house}`} v={h.rashi} />)}
            </div>
            <div className="mt-3 border-t border-ink/10 pt-2"><KV k="महादशा" v={data.dasha.mahadasha} /><KV k="अन्तर्दशा" v={data.dasha.antardasha} /></div>
          </div>

          <div className="rounded-2xl border border-ink/12 bg-white p-4">
            <RemedyPicker value={remedies} onChange={setRemedies} />
          </div>
        </div>
      )}
    </div>
  );
}
