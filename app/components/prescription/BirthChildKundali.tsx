"use client";

import { useState } from "react";
import { CITIES } from "@/lib/calculators";
import { RemedyPicker } from "./RemedyPicker";

type Child = { name: string; dob: string; tob: string; place: string; gender: string };

const fmtDMY = (ymd: string) => { if (!ymd) return ""; const [y, m, d] = ymd.split("-"); return d ? `${d}/${m}/${y}` : ymd; };

export function BirthChildKundali({ onBack }: { onBack: () => void }) {
  const [c, setC] = useState<Child>({ name: "", dob: "", tob: "", place: "Lucknow", gender: "पुरुष" });
  const [chart, setChart] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [remedies, setRemedies] = useState<string[]>([]);

  const generate = async () => {
    setError("");
    if (!c.name.trim() || !c.dob || !c.tob) { setError("कृपया बच्चे का नाम, जन्म तिथि व समय भरें।"); return; }
    setBusy(true);
    try {
      const city = CITIES.find((x) => x.name.toLowerCase() === c.place.toLowerCase());
      const r = await fetch("/api/kundli", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dob: c.dob, tob: c.tob, place: c.place, lat: city?.lat, lon: city?.lon, tzone: city?.tzone }) });
      const j = await r.json();
      if (j.ok) setChart(j.chart);
      else setError(j.message || "कुंडली नहीं बन सकी।");
    } catch { setError("नेटवर्क त्रुटि — दोबारा प्रयास करें।"); }
    finally { setBusy(false); }
  };

  const inp = "w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#8a2020] focus:ring-2 focus:ring-[#8a2020]/15";
  const lbl = "mb-1 block text-xs font-semibold text-ink/60";

  return (
    <div className="mx-auto w-full max-w-[900px] px-3 py-5">
      <style>{`@media print { .rx-noprint{display:none!important} }`}</style>
      <datalist id="child-cities">{CITIES.map((x) => <option key={x.name} value={x.name} />)}</datalist>

      <div className="rx-noprint mb-4 flex items-center justify-between gap-3">
        <button onClick={onBack} className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink/70">← वापस</button>
        <h1 className="font-serif text-2xl font-bold text-[#a01414]">बाल जन्म कुंडली</h1>
        {chart && <button onClick={() => window.print()} className="rounded-lg bg-[#6d1414] px-4 py-2 text-sm font-bold text-white">🖨️ प्रिंट / PDF</button>}
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
        <button onClick={generate} disabled={busy} className="mt-4 w-full rounded-xl bg-gold-gradient py-3 text-sm font-bold text-night shadow-gold-btn disabled:opacity-60 sm:w-auto sm:px-8">
          {busy ? "बन रही है…" : "बाल जन्म कुंडली बनाएं"}
        </button>
      </div>

      {/* result */}
      {chart && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-ink/12 bg-white p-4">
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <p><b>नाम:</b> {c.name}</p>
              <p><b>लिंग:</b> {c.gender}</p>
              <p><b>जन्म तिथि:</b> {fmtDMY(c.dob)}</p>
              <p><b>समय:</b> {c.tob}</p>
              <p className="col-span-2 sm:col-span-4"><b>स्थान:</b> {c.place}</p>
            </div>
            <p className="mb-2 mt-4 text-center font-serif text-lg font-bold text-[#a01414]">जन्म कुंडली</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chart} alt="बाल जन्म कुंडली" className="mx-auto w-full max-w-[340px]" />
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
