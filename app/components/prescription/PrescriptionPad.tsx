"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CITIES } from "@/lib/calculators";
import { PLANETS } from "@/lib/cms";

/* ---------------- types ---------------- */
type Rem = { id: string; planet: string; title: string };
type Gem = { planet: string; stone: string; weight: string; metal: string; finger: string; day: string; mantra: string };
type Row = { planet: string; remedies: string[]; notes: string };
type KPlanet = { name: string; abbr: string; lon: number; rashi: number; house: number; sign: string; nakshatra: string; nakshatra_lord?: string };
type Dasha = { mahadasha: string; antardasha: string };
type Consultation = {
  id: string; patientName: string; mobile: string; gender: string; dob: string; tob: string; place: string;
  astrologer: string; mahadasha: string; antardasha: string; pratyantar: string; dosha: string; yog: string;
  kundali: unknown; rows: Row[]; gemstones: Gem[]; notes: string; createdAt: string;
};

const emptyRow = (): Row => ({ planet: "", remedies: [], notes: "" });
const blankGem = (planet = ""): Gem => ({ planet, stone: "", weight: "", metal: "", finger: "", day: "", mantra: "" });

/** sidereal longitude -> "12°34'" within its sign */
function fmtDeg(lon: number): string {
  const d = ((lon % 30) + 30) % 30;
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
}

/* ---------------- letterhead (screen + print) ---------------- */
function Letterhead() {
  return (
    <div className="flex items-start justify-between gap-4 rounded-t-md bg-gradient-to-r from-[#6d1414] via-[#8a2020] to-[#e2662a] px-5 py-3 text-white">
      <div>
        <p className="font-serif text-2xl font-extrabold leading-tight">🕉 डॉ० राहुल राज <span className="text-amber-200">‘ज्योतिष गुरु’</span> 🕉</p>
        <p className="text-sm font-semibold">पी.एच.डी., गोल्ड मेडलिस्ट</p>
        <p className="mt-1 text-xs">ज्योतिष पारिजात · ज्योतिष रत्नश्री · ज्योतिष भास्कर</p>
        <p className="text-xs">शिष्य — पं० के.ए. दूबे पद्मेश</p>
      </div>
      <div className="text-right text-[11px] leading-snug">
        <p className="text-sm font-bold text-amber-200">For Appointment Call</p>
        <p className="text-lg font-extrabold">📞 9415312590</p>
        <p className="mt-1 opacity-90"><b>कार्यालय/निवास:</b> डी-10, श्रवण अपार्टमेंट के सामने, सेक्टर-ई, लखनऊ</p>
        <p className="opacity-90"><b>शाखा:</b> ‘ज्योतिष योग’ सी-100, सेक्टर-डी, एल.डी.ए. कालोनी, कानपुर रोड, लखनऊ</p>
      </div>
    </div>
  );
}
function Footer() {
  return (
    <div className="mt-4 rounded-b-md bg-gradient-to-r from-[#e2662a] via-[#8a2020] to-[#6d1414] px-5 py-3 text-center text-white">
      <p className="text-sm font-bold text-amber-200">: सम्पर्क समय : <span className="text-white/90">(Only For Appointment)</span></p>
      <p className="text-xs">11.00 A.M. से 1.00 P.M. · 06.00 P.M. से 8.00 P.M. · रविवार सायं अवकाश</p>
      <p className="mt-1 text-[11px]">कुण्डली निर्माण, वास्तु दोष निवारण एवं सिद्ध रत्न, रुद्राक्ष एवं यन्त्रों के प्राप्ति की सुविधा।</p>
      <p className="mt-0.5 text-[11px] font-semibold text-amber-200">कृपया टोने-टोटके, वशीकरण इत्यादि के लिए सम्पर्क न करें।</p>
    </div>
  );
}

/* ---------------- main ---------------- */
export function PrescriptionPad() {
  const [remedies, setRemedies] = useState<Rem[]>([]);
  const [gemDefaults, setGemDefaults] = useState<Gem[]>([]);

  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("Lucknow");

  const [mahadasha, setMahadasha] = useState("");
  const [antardasha, setAntardasha] = useState("");
  const [pratyantar, setPratyantar] = useState("");
  const [dosha, setDosha] = useState("");
  const [yog, setYog] = useState("");

  const [chart, setChart] = useState<string | null>(null);
  const [kundali, setKundali] = useState<unknown>(null);
  const [kundaliState, setKundaliState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [zoom, setZoom] = useState(false);

  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [gems, setGems] = useState<Gem[]>([blankGem()]);
  const [notes, setNotes] = useState("");

  const [now] = useState(() => new Date());
  const astrologer = "Dr. Rahul Raj";

  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [today, setToday] = useState<Consultation[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState<Consultation[] | null>(null);

  const [portal, setPortal] = useState<HTMLElement | null>(null);
  useEffect(() => setPortal(document.getElementById("print-portal")), []);

  const fetchToday = useCallback(() => {
    fetch("/api/prescriptions?today=1").then((r) => r.json()).then((j) => setToday(j.consultations || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/content/planetRemedies").then((r) => r.json()).then((d) => Array.isArray(d) && setRemedies(d)).catch(() => {});
    fetch("/api/content/gemstones").then((r) => r.json()).then((d) => Array.isArray(d) && setGemDefaults(d)).catch(() => {});
    fetchToday();
  }, [fetchToday]);

  // auto-generate Kundali + auto-fill dasha once birth date + time are present
  useEffect(() => {
    if (!dob || !tob) return;
    const c = CITIES.find((x) => x.name.toLowerCase() === place.toLowerCase());
    setKundaliState("loading");
    const t = setTimeout(() => {
      fetch("/api/kundli", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dob, tob, place, lat: c?.lat, lon: c?.lon, tzone: c?.tzone }) })
        .then((r) => r.json())
        .then((j) => {
          if (j.ok) {
            setChart(j.chart); setKundali(j.kundali); setKundaliState("done");
            const dasha = (j.kundali as { dasha?: Dasha })?.dasha;
            if (dasha) { setMahadasha(dasha.mahadasha); setAntardasha(dasha.antardasha); }
          } else setKundaliState("error");
        })
        .catch(() => setKundaliState("error"));
    }, 350);
    return () => clearTimeout(t);
  }, [dob, tob, place]);

  const remediesFor = useCallback((planet: string) => remedies.filter((r) => r.planet === planet), [remedies]);
  const kPlanets = useMemo<KPlanet[]>(() => ((kundali as { planets?: KPlanet[] } | null)?.planets ?? []), [kundali]);

  const setRow = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const toggleRemedy = (i: number, remedy: string) =>
    setRows((rs) => rs.map((r, idx) => idx === i ? { ...r, remedies: r.remedies.includes(remedy) ? r.remedies.filter((x) => x !== remedy) : [...r.remedies, remedy] } : r));

  const setGemAt = (i: number, patch: Partial<Gem>) => setGems((gs) => gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  const loadGemInto = (i: number, planet: string) => {
    const d = gemDefaults.find((x) => x.planet === planet);
    setGems((gs) => gs.map((g, idx) => idx === i ? (d ? { planet, stone: d.stone, weight: d.weight, metal: d.metal, finger: d.finger, day: d.day, mantra: d.mantra } : blankGem(planet)) : g));
  };

  const resetAll = () => {
    setPatientName(""); setMobile(""); setGender(""); setDob(""); setTob(""); setPlace("Lucknow");
    setMahadasha(""); setAntardasha(""); setPratyantar(""); setDosha(""); setYog("");
    setChart(null); setKundali(null); setKundaliState("idle");
    setRows([emptyRow()]); setGems([blankGem()]); setNotes(""); setSavedId(null);
  };

  const load = (c: Consultation) => {
    setPatientName(c.patientName); setMobile(c.mobile); setGender(c.gender); setDob(c.dob); setTob(c.tob); setPlace(c.place || "Lucknow");
    setMahadasha(c.mahadasha); setAntardasha(c.antardasha); setPratyantar(c.pratyantar); setDosha(c.dosha); setYog(c.yog);
    setKundali(c.kundali); setRows(c.rows?.length ? c.rows : [emptyRow()]); setGems(c.gemstones?.length ? c.gemstones : [blankGem()]); setNotes(c.notes);
    setSavedId(null); setChart(null); setKundaliState("idle"); setResults(null);
  };

  const save = async () => {
    if (!patientName.trim() || !mobile.trim()) { alert("Patient name aur mobile zaroori hai."); return; }
    setSaving(true);
    try {
      const r = await fetch("/api/prescriptions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName, mobile, gender, dob, tob, place, astrologer, mahadasha, antardasha, pratyantar, dosha, yog, kundali, rows, gemstones: gems.filter((g) => g.stone), notes }),
      });
      const j = await r.json();
      if (j.ok) { setSavedId(j.id); fetchToday(); }
      else alert(j.error || "Save nahi hua.");
    } catch { alert("Save nahi hua — dobara try karein."); }
    finally { setSaving(false); }
  };

  const search = async () => {
    if (!searchQ.trim()) return;
    const r = await fetch(`/api/prescriptions?q=${encodeURIComponent(searchQ)}`);
    const j = await r.json();
    setResults(Array.isArray(j.consultations) ? j.consultations : []);
  };

  const inp = "w-full rounded border border-ink/20 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[#8a2020]";
  const lbl = "mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-ink/55";
  const HistRow = (c: Consultation) => (
    <li key={c.id} className="flex items-center justify-between gap-2 py-1.5 text-xs">
      <span className="min-w-0"><b className="block truncate">{c.patientName}</b><span className="text-ink/50">{c.mobile} · {new Date(c.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span></span>
      <button onClick={() => load(c)} className="shrink-0 rounded bg-[#8a2020] px-2 py-1 font-semibold text-white">Open</button>
    </li>
  );

  return (
    <div className="min-h-screen bg-[#f3ece0] px-3 py-6 print:bg-white">
      <style>{`@media print { .rx-noprint { display:none !important; } }`}</style>

      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 lg:flex-row">
        {/* ---- LEFT: today's consultations + search ---- */}
        <aside className="rx-noprint w-full shrink-0 space-y-4 lg:w-64">
          <div className="rounded border border-ink/15 bg-white p-3">
            <p className="mb-2 text-sm font-bold">🔎 Search (naam ya mobile)</p>
            <div className="flex gap-2">
              <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="naam / mobile…" className="w-full rounded border border-ink/20 px-2 py-1.5 text-sm" />
              <button onClick={search} className="rounded bg-[#8a2020] px-3 text-sm font-semibold text-white">Go</button>
            </div>
            {results && (
              <ul className="mt-2 max-h-56 divide-y divide-ink/10 overflow-y-auto">
                {results.length === 0 ? <li className="py-2 text-xs text-ink/50">Kuch nahi mila.</li> : results.map(HistRow)}
              </ul>
            )}
          </div>
          <div className="rounded border border-ink/15 bg-white p-3">
            <p className="mb-2 text-sm font-bold">📅 Aaj ki Consultations ({today.length})</p>
            {today.length === 0 ? <p className="text-xs text-ink/50">Aaj koi consultation nahi.</p> : (
              <ul className="max-h-[60vh] divide-y divide-ink/10 overflow-y-auto">{today.map(HistRow)}</ul>
            )}
          </div>
        </aside>

        {/* ---- RIGHT: the pad ---- */}
        <div className="min-w-0 flex-1">
          {/* controls */}
          <div className="rx-noprint mb-3 flex flex-wrap items-center gap-2">
            <button onClick={() => window.print()} className="rounded bg-[#6d1414] px-4 py-2 text-sm font-bold text-white">🖨 Print / PDF</button>
            <button onClick={save} disabled={saving} className="rounded bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{saving ? "Saving…" : "💾 Save"}</button>
            <button onClick={resetAll} className="rounded border border-ink/25 bg-white px-4 py-2 text-sm font-semibold">＋ New</button>
            {savedId && <span className="text-sm font-semibold text-emerald-700">✅ Saved</span>}
          </div>

          <div className="rounded-md border border-[#8a2020]/40 bg-white shadow-lg">
            <Letterhead />
            <div className="px-5 py-4">
              {/* patient + auto */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div><label className={lbl}>Patient Name</label><input className={inp} value={patientName} onChange={(e) => setPatientName(e.target.value)} /></div>
                <div><label className={lbl}>Mobile</label><input className={inp} value={mobile} onChange={(e) => setMobile(e.target.value)} /></div>
                <div><label className={lbl}>Gender</label><select className={inp} value={gender} onChange={(e) => setGender(e.target.value)}><option value="">—</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div><label className={lbl}>Date of Birth</label><input type="date" className={inp} value={dob} onChange={(e) => setDob(e.target.value)} /></div>
                <div><label className={lbl}>Birth Time</label><input type="time" className={inp} value={tob} onChange={(e) => setTob(e.target.value)} /></div>
                <div><label className={lbl}>Birth Place</label><input list="rx-cities" className={inp} value={place} onChange={(e) => setPlace(e.target.value)} /><datalist id="rx-cities">{CITIES.map((c) => <option key={c.name} value={c.name} />)}</datalist></div>
              </div>
              <p className="mt-2 text-[11px] text-ink/50">Date: {now.toLocaleDateString("en-IN")} · Time: {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · Astrologer: <b>{astrologer}</b></p>

              {/* kundali + dasha */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1 font-serif text-lg font-bold text-[#a01414]">लग्न कुण्डली</p>
                  <div onClick={() => chart && setZoom(true)} className={`grid aspect-square w-full max-w-[260px] place-items-center rounded border-2 border-[#a01414]/70 p-2 ${chart ? "cursor-zoom-in" : ""}`}>
                    {kundaliState === "loading" ? <span className="text-sm text-ink/50">बन रही है…</span>
                      : chart ? <img src={chart} alt="Lagna Kundali" className="h-full w-full object-contain" />
                      : <span className="px-4 text-center text-xs text-ink/45">Naam, DOB, समय व स्थान भरते ही कुण्डली अपने आप बन जायेगी।</span>}
                  </div>
                  {chart && <p className="rx-noprint mt-1 text-center text-[11px] text-ink/45">(बड़ा देखने के लिए क्लिक करें)</p>}
                </div>
                <div className="space-y-1.5">
                  {[["महादशा", mahadasha, setMahadasha], ["अन्तर्दशा", antardasha, setAntardasha], ["प्र० दशा", pratyantar, setPratyantar], ["दोष", dosha, setDosha], ["योग", yog, setYog]].map(([label, val, set]) => (
                    <div key={label as string} className="flex items-center gap-2">
                      <span className="w-20 shrink-0 text-sm font-bold text-[#a01414]">{label as string} —</span>
                      <input className={inp} value={val as string} onChange={(e) => (set as (v: string) => void)(e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* on-screen only: planet nakshatra details (NOT printed) */}
              {kPlanets.length > 0 && (
                <div className="rx-noprint mt-3 rounded border border-ink/15 bg-[#faf6ee] p-2">
                  <p className="mb-1 text-xs font-bold text-[#a01414]">ग्रह विवरण (सिर्फ स्क्रीन पर)</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[11px]">
                      <thead><tr className="text-left text-ink/55"><th className="px-1">ग्रह</th><th className="px-1">राशि</th><th className="px-1">अंश</th><th className="px-1">भाव</th><th className="px-1">नक्षत्र</th></tr></thead>
                      <tbody>{kPlanets.map((p) => (<tr key={p.name} className="border-t border-ink/10"><td className="px-1 font-semibold">{p.name}</td><td className="px-1">{p.sign}</td><td className="px-1 font-mono">{fmtDeg(p.lon)}</td><td className="px-1">{p.house}</td><td className="px-1">{p.nakshatra}</td></tr>))}</tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* remedy rows (no problem field) */}
              <div className="mt-5">
                <p className="mb-2 font-serif text-lg font-bold text-[#a01414]">ग्रह उपाय / Planet Remedies</p>
                <div className="space-y-3">
                  {rows.map((row, i) => (
                    <div key={i} className="rounded border border-[#8a2020]/25 p-3">
                      <div><label className={lbl}>Planet</label>
                        <select className={`${inp} sm:max-w-[220px]`} value={row.planet} onChange={(e) => setRow(i, { planet: e.target.value, remedies: [] })}>
                          <option value="">—</option>{PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      {row.planet && (
                        <div className="mt-2">
                          <label className={lbl}>Remedies (select karein)</label>
                          <div className="grid gap-1 sm:grid-cols-2">
                            {remediesFor(row.planet).length === 0 && <p className="text-xs text-ink/45">Is planet ke remedies admin me add karein.</p>}
                            {remediesFor(row.planet).map((r) => (
                              <label key={r.id} className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={row.remedies.includes(r.title)} onChange={() => toggleRemedy(i, r.title)} /><span>{r.title}</span></label>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-2"><label className={lbl}>Notes</label><input className={inp} value={row.notes} onChange={(e) => setRow(i, { notes: e.target.value })} /></div>
                      {rows.length > 1 && <button onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))} className="mt-2 text-xs font-semibold text-rose-600">✕ Remove</button>}
                    </div>
                  ))}
                </div>
                <button onClick={() => setRows((rs) => [...rs, emptyRow()])} className="mt-2 rounded border border-[#8a2020]/40 px-3 py-1.5 text-sm font-semibold text-[#8a2020]">＋ Add planet row</button>
              </div>

              {/* gemstones (multiple) */}
              <div className="mt-5">
                <p className="mb-2 font-serif text-lg font-bold text-[#a01414]">रत्न / Gemstones</p>
                <div className="space-y-3">
                  {gems.map((g, i) => (
                    <div key={i} className="rounded border border-[#8a2020]/20 p-3">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div><label className={lbl}>Planet</label><select className={inp} value={g.planet} onChange={(e) => loadGemInto(i, e.target.value)}><option value="">—</option>{PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
                        <div><label className={lbl}>Stone</label><input className={inp} value={g.stone} onChange={(e) => setGemAt(i, { stone: e.target.value })} /></div>
                        <div><label className={lbl}>Weight</label><input className={inp} value={g.weight} onChange={(e) => setGemAt(i, { weight: e.target.value })} /></div>
                        <div><label className={lbl}>Metal</label><input className={inp} value={g.metal} onChange={(e) => setGemAt(i, { metal: e.target.value })} /></div>
                        <div><label className={lbl}>Finger</label><input className={inp} value={g.finger} onChange={(e) => setGemAt(i, { finger: e.target.value })} /></div>
                        <div><label className={lbl}>Day</label><input className={inp} value={g.day} onChange={(e) => setGemAt(i, { day: e.target.value })} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Mantra</label><input className={inp} value={g.mantra} onChange={(e) => setGemAt(i, { mantra: e.target.value })} /></div>
                      </div>
                      {gems.length > 1 && <button onClick={() => setGems((gs) => gs.filter((_, idx) => idx !== i))} className="mt-2 text-xs font-semibold text-rose-600">✕ Remove</button>}
                    </div>
                  ))}
                </div>
                <button onClick={() => setGems((gs) => [...gs, blankGem()])} className="mt-2 rounded border border-[#8a2020]/40 px-3 py-1.5 text-sm font-semibold text-[#8a2020]">＋ Add gemstone</button>
              </div>

              <div className="mt-4"><label className={lbl}>Additional Notes</label><textarea className={inp} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            </div>
            <Footer />
          </div>
        </div>
      </div>

      {/* kundali zoom modal */}
      {zoom && chart && (
        <div className="rx-noprint fixed inset-0 z-[120] grid place-items-center bg-black/70 p-4" onClick={() => setZoom(false)}>
          <div className="relative w-full max-w-[560px] rounded-lg bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoom(false)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/10 text-ink">✕</button>
            <p className="mb-2 text-center font-serif text-xl font-bold text-[#a01414]">लग्न कुण्डली</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chart} alt="Lagna Kundali (बड़ी)" className="mx-auto w-full max-w-[480px]" />
          </div>
        </div>
      )}

      {/* print doc */}
      {portal && createPortal(
        <div className="hidden print:block">
          <div className="mx-auto w-[210mm] bg-white p-[10mm] text-[#222]">
            <Letterhead />
            <div className="px-2 py-3 text-sm">
              <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                <p><b>नाम:</b> {patientName}</p><p><b>मोबाइल:</b> {mobile}</p><p><b>लिंग:</b> {gender}</p>
                <p><b>जन्म तिथि:</b> {dob}</p><p><b>समय:</b> {tob}</p><p><b>स्थान:</b> {place}</p>
                <p><b>दिनांक:</b> {now.toLocaleDateString("en-IN")}</p><p className="col-span-2"><b>ज्योतिषी:</b> {astrologer}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-[#a01414]">लग्न कुण्डली</p>
                  <div className="grid aspect-square w-full max-w-[75mm] place-items-center border-2 border-[#a01414]/70 p-1">{chart ? <img src={chart} alt="Kundali" className="h-full w-full object-contain" /> : null}</div>
                </div>
                <div className="space-y-0.5 text-sm">
                  <p><b>महादशा —</b> {mahadasha}</p><p><b>अन्तर्दशा —</b> {antardasha}</p><p><b>प्र० दशा —</b> {pratyantar}</p><p><b>दोष —</b> {dosha}</p><p><b>योग —</b> {yog}</p>
                </div>
              </div>
              {rows.some((r) => r.planet) && (
                <table className="mt-3 w-full border-collapse text-[12px]">
                  <thead><tr className="bg-[#f2e4d6] text-left"><th className="border border-ink/20 px-2 py-1">ग्रह</th><th className="border border-ink/20 px-2 py-1">उपाय</th><th className="border border-ink/20 px-2 py-1">Notes</th></tr></thead>
                  <tbody>{rows.filter((r) => r.planet).map((r, i) => (<tr key={i}><td className="border border-ink/20 px-2 py-1 align-top">{r.planet}</td><td className="border border-ink/20 px-2 py-1 align-top">{r.remedies.map((x, j) => <div key={j}>• {x}</div>)}</td><td className="border border-ink/20 px-2 py-1 align-top">{r.notes}</td></tr>))}</tbody>
                </table>
              )}
              {gems.some((g) => g.stone) && (
                <div className="mt-3 space-y-1">
                  {gems.filter((g) => g.stone).map((g, i) => (
                    <div key={i} className="rounded border border-[#a01414]/40 p-2 text-[12px]"><b className="text-[#a01414]">रत्न:</b> {g.planet} → {g.stone} · {g.weight} · {g.metal} · {g.finger} · {g.day} · मंत्र: {g.mantra}</div>
                  ))}
                </div>
              )}
              {notes && <p className="mt-2 text-[12px]"><b>Notes:</b> {notes}</p>}
            </div>
            <Footer />
          </div>
        </div>,
        portal
      )}
    </div>
  );
}
