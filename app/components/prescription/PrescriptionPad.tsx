"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CITIES } from "@/lib/calculators";
import { PLANETS, MISC_REMEDY_CATEGORY, DEFAULT_PAD_SECTIONS, DEFAULT_PAD_LABELS, resolveLabel, type PadSection, type PadLabel, type Anushthan, type GemGrade, type CaratOption } from "@/lib/cms";
import { generatePrescriptionPdf, downloadPdf, type PrescriptionPdfData } from "@/lib/prescriptionPad/generatePdf";
import { toHindi } from "@/lib/prescriptionPad/hindi";

/* ---------------- types ---------------- */
type Rem = { id: string; planet: string; title: string; enabled?: boolean };
type MiscRem = { id: string; title: string; enabled?: boolean };
type CountOpt = { id: string; title: string };
type GemRate = { id: string; label: string; price: number };
type Gem = { planet: string; stone: string; weight: string; metal: string; finger: string; day: string; rudraksha: string; carat?: string; grade?: string; rateA?: number; rateB?: number; rateC?: number; rates?: GemRate[]; rateLabel?: string; price?: number };
type AnuRow = { title: string; purpose: string; dakshina: string };
type Row = { planet: string; remedies: string[]; notes: string; remedyCounts?: Record<string, string> };
type KPlanet = { name: string; color?: string; abbr: string; lon: number; rashi: number; house: number; sign: string; nakshatra: string; nakshatra_lord?: string };
type Dasha = { mahadasha: string; antardasha: string };
type Consultation = {
  id: string; patientName: string; mobile: string; gender: string; dob: string; tob: string; place: string;
  astrologer: string; mahadasha: string; antardasha: string; pratyantar: string; dosha: string; yog: string;
  kundali: unknown; rows: Row[]; gemstones: Gem[]; anushthan?: AnuRow[]; notes: string; createdAt: string;
};

const emptyRow = (): Row => ({ planet: "", remedies: [], notes: "" });
const blankGem = (planet = ""): Gem => ({ planet, stone: "", weight: "", metal: "", finger: "", day: "", rudraksha: "", carat: "", grade: "" });

/** sidereal longitude -> "12°34'" */
function fmtDeg(lon: number): string {
  const d = ((lon % 30) + 30) % 30;
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
}
/** YYYY-MM-DD -> DD/MM/YYYY */
const fmtDMY = (ymd: string) => {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return d && m && y ? `${d}/${m}/${y}` : ymd;
};
/** As the user types digits, auto-insert "/" -> "DD/MM/YYYY" (max 8 digits). */
function maskDMY(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  let out = digits.slice(0, 2);
  if (digits.length > 2) out += "/" + digits.slice(2, 4);
  if (digits.length > 4) out += "/" + digits.slice(4, 8);
  return out;
}
/** "DD/MM/YYYY" -> "YYYY-MM-DD", or "" if incomplete/not a real calendar date. */
function parseDMY(str: string): string {
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  const [, d, mo, y] = m;
  const day = Number(d), month = Number(mo), year = Number(y);
  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return "";
  return `${y}-${mo}-${d}`;
}

/* ---------------- letterhead + footer (page banners + print) ----------------
   Every line is admin-editable via the padLabels collection (resolver `L`). */
type LabelFn = (key: string, fallback: string) => string;

function Letterhead({ L }: { L: LabelFn }) {
  return (
    <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#6d1414] via-[#8a2020] to-[#e2662a] px-5 py-3 text-white sm:px-8">
      <div>
        <p className="font-serif text-2xl font-extrabold leading-tight sm:text-3xl">{L("lh_name", "🕉 डॉ० राहुल राज ‘ज्योतिष गुरु’ 🕉")}</p>
        <p className="text-sm font-semibold">{L("lh_qual", "पी.एच.डी., गोल्ड मेडलिस्ट")}</p>
        <p className="mt-1 text-xs">{L("lh_titles", "ज्योतिष पारिजात · ज्योतिष रत्नश्री · ज्योतिष भास्कर")}</p>
        <p className="text-xs">{L("lh_shishya", "शिष्य — पं० के.ए. दूबे पद्मेश")}</p>
      </div>
      <div className="text-right text-[11px] leading-snug">
        <p className="text-sm font-bold text-amber-200">{L("lh_call", "परामर्श हेतु कॉल करें")}</p>
        <p className="text-lg font-extrabold">{L("lh_phone", "📞 9415312590")}</p>
        <p className="mt-1 opacity-90">{L("lh_office", "कार्यालय/निवास: डी-10, श्रवण अपार्टमेंट के सामने, सेक्टर-ई, लखनऊ")}</p>
        <p className="opacity-90">{L("lh_branch", "शाखा: ‘ज्योतिष योग’ सी-100, सेक्टर-डी, एल.डी.ए. कालोनी, कानपुर रोड, लखनऊ")}</p>
      </div>
    </div>
  );
}
function Footer({ L }: { L: LabelFn }) {
  return (
    <div className="bg-gradient-to-r from-[#e2662a] via-[#8a2020] to-[#6d1414] px-5 py-3 text-center text-white sm:px-8">
      <p className="text-sm font-bold text-amber-200">{L("ft_title", ": सम्पर्क समय :")} <span className="text-white/90">{L("ft_note", "(केवल अपॉइंटमेंट हेतु)")}</span></p>
      <p className="text-xs">{L("ft_timings", "प्रातः 11:00 से 1:00 · सायं 06:00 से 8:00 · रविवार सायं अवकाश")}</p>
      <p className="mt-1 text-[11px]">{L("ft_services", "कुण्डली निर्माण, वास्तु दोष निवारण एवं सिद्ध रत्न, रुद्राक्ष एवं यन्त्रों की सुविधा।")}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-amber-200">{L("ft_warning", "कृपया टोने-टोटके, वशीकरण इत्यादि के लिए सम्पर्क न करें।")}</p>
      <p className="mt-1 text-sm font-bold tracking-wide">{L("ft_website", "astrorahulraj.com")}</p>
    </div>
  );
}

/* ---------------- main ---------------- */
export function PrescriptionPad() {
  const [remedies, setRemedies] = useState<Rem[]>([]);
  const [miscRemedies, setMiscRemedies] = useState<MiscRem[]>([]);
  const [countOptions, setCountOptions] = useState<CountOpt[]>([]);
  const [gemDefaults, setGemDefaults] = useState<(Gem & { kind?: string; rateA?: number; rateB?: number; rateC?: number; rates?: GemRate[] })[]>([]);
  const [padSections, setPadSections] = useState<PadSection[]>(DEFAULT_PAD_SECTIONS);
  const [anushthanCatalog, setAnushthanCatalog] = useState<Anushthan[]>([]);
  const [gemGrades, setGemGrades] = useState<GemGrade[]>([]);
  const [carats, setCarats] = useState<CaratOption[]>([]);
  const [anushthanRows, setAnushthanRows] = useState<AnuRow[]>([]);
  const [anuQuery, setAnuQuery] = useState("");
  const [remedyCats, setRemedyCats] = useState<{ key: string; title: string; enabled?: boolean }[]>([]);
  const [padLabels, setPadLabels] = useState<PadLabel[]>(DEFAULT_PAD_LABELS);
  const L = useCallback((key: string, fallback: string) => resolveLabel(padLabels, key, fallback), [padLabels]);

  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [dobText, setDobText] = useState(""); // what's shown in the DD/MM/YYYY input
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("Lucknow");

  const [mahadasha, setMahadasha] = useState("");
  const [antardasha, setAntardasha] = useState("");
  const [pratyantar, setPratyantar] = useState("");
  const [dosha, setDosha] = useState("");
  const [yog, setYog] = useState("");

  const [chart, setChart] = useState<string | null>(null);
  const [gochar, setGochar] = useState<string | null>(null);
  const [kundali, setKundali] = useState<unknown>(null);
  const [kundaliState, setKundaliState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [zoom, setZoom] = useState(false);
  const [gocharZoom, setGocharZoom] = useState(false);

  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [gems, setGems] = useState<Gem[]>([blankGem()]);
  const [notes, setNotes] = useState("");

  const [now] = useState(() => new Date());
  const astrologer = L("astrologer_name", "डॉ० राहुल राज");
  /** Fields the astrologer has typed into (or that came from a loaded record) —
   *  auto-fill must NEVER overwrite these, so manual corrections stick + save. */
  const manualDasha = useRef<Record<string, boolean>>({});
  const markDasha = (key: string) => { manualDasha.current[key] = true; };

  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [today, setToday] = useState<Consultation[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState<Consultation[] | null>(null);
  const [recDate, setRecDate] = useState("");
  const [dateRecs, setDateRecs] = useState<Consultation[] | null>(null);

  const [portal, setPortal] = useState<HTMLElement | null>(null);
  useEffect(() => setPortal(document.getElementById("print-portal")), []);

  const fetchToday = useCallback(() => {
    fetch("/api/prescriptions?today=1").then((r) => r.json()).then((j) => setToday(j.consultations || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/content/planetRemedies").then((r) => r.json()).then((d) => Array.isArray(d) && setRemedies(d)).catch(() => {});
    fetch("/api/content/remedyCategories").then((r) => r.json()).then((d) => Array.isArray(d) && setRemedyCats(d)).catch(() => {});
    fetch("/api/content/miscRemedies").then((r) => r.json()).then((d) => Array.isArray(d) && setMiscRemedies(d)).catch(() => {});
    fetch("/api/content/remedyCounts").then((r) => r.json()).then((d) => Array.isArray(d) && setCountOptions(d)).catch(() => {});
    fetch("/api/content/gemstones").then((r) => r.json()).then((d) => Array.isArray(d) && setGemDefaults(d)).catch(() => {});
    fetch("/api/content/padSections").then((r) => r.json()).then((d) => Array.isArray(d) && d.length && setPadSections(d)).catch(() => {});
    fetch("/api/content/padLabels").then((r) => r.json()).then((d) => Array.isArray(d) && d.length && setPadLabels(d)).catch(() => {});
    fetch("/api/content/anushthan").then((r) => r.json()).then((d) => Array.isArray(d) && setAnushthanCatalog(d)).catch(() => {});
    fetch("/api/content/gemGrades").then((r) => r.json()).then((d) => Array.isArray(d) && setGemGrades(d)).catch(() => {});
    fetch("/api/content/carats").then((r) => r.json()).then((d) => Array.isArray(d) && setCarats(d)).catch(() => {});
    fetchToday();
  }, [fetchToday]);

  // auto-generate Kundali + auto-fill dasha once birth date + time are present
  useEffect(() => {
    if (!dob || !tob) return;
    // जन्म स्थान खाली कर दिया गया — पुरानी/गलत कुंडली दिखाने के बजाय साफ कर दें और रुक जाएं।
    if (!place.trim()) {
      setChart(null); setGochar(null); setKundali(null); setKundaliState("idle");
      return;
    }
    const c = CITIES.find((x) => x.name.toLowerCase() === place.toLowerCase());
    setKundaliState("loading");
    const t = setTimeout(() => {
      fetch("/api/kundli", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dob, tob, place, lat: c?.lat, lon: c?.lon, tzone: c?.tzone }) })
        .then((r) => r.json())
        .then((j) => {
          if (j.ok) {
            setChart(j.chart); setGochar(j.gochar || null); setKundali(j.kundali); setKundaliState("done");
            const kk = j.kundali as { dasha?: Dasha; doshaStr?: string; yogStr?: string };
            // Only auto-fill fields the astrologer hasn't edited/loaded — never
            // clobber a manual correction (e.g. a hand-typed Yog/Dosh).
            const m = manualDasha.current;
            if (kk?.dasha) {
              if (!m.mahadasha) setMahadasha(kk.dasha.mahadasha);
              if (!m.antardasha) setAntardasha(kk.dasha.antardasha);
            }
            if (kk?.doshaStr && !m.dosha) setDosha(kk.doshaStr);
            if (kk?.yogStr && !m.yog) setYog(kk.yogStr);
          } else setKundaliState("error");
        })
        .catch(() => setKundaliState("error"));
    }, 350);
    return () => clearTimeout(t);
  }, [dob, tob, place]);

  /** Birth date field: mask keystrokes as DD/MM/YYYY, commit to ISO `dob` only once complete & valid. */
  const onDobChange = (raw: string) => {
    const masked = maskDMY(raw);
    setDobText(masked);
    const iso = parseDMY(masked);
    setDob(iso); // "" while incomplete/invalid — avoids firing kundli generation on a half-typed date
  };

  const remediesFor = useCallback(
    (planet: string): Rem[] =>
      planet === MISC_REMEDY_CATEGORY
        ? miscRemedies.filter((r) => r.enabled !== false).map((r) => ({ id: r.id, planet: MISC_REMEDY_CATEGORY, title: r.title }))
        : remedies.filter((r) => r.planet === planet && r.enabled !== false),
    [remedies, miscRemedies]
  );
  const kPlanets = useMemo<KPlanet[]>(() => ((kundali as { planets?: KPlanet[] } | null)?.planets ?? []), [kundali]);

  const setRow = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const toggleRemedy = (i: number, remedy: string) =>
    setRows((rs) => rs.map((r, idx) => {
      if (idx !== i) return r;
      const checked = r.remedies.includes(remedy);
      const remedies = checked ? r.remedies.filter((x) => x !== remedy) : [...r.remedies, remedy];
      const remedyCounts = { ...(r.remedyCounts || {}) };
      if (checked) delete remedyCounts[remedy]; // clear its count when unchecked
      return { ...r, remedies, remedyCounts };
    }));
  /** Set (or clear, when count === "") the admin-defined count/frequency picked for one remedy on a row. */
  const setRemedyCount = (i: number, remedy: string, count: string) =>
    setRows((rs) => rs.map((r, idx) => {
      if (idx !== i) return r;
      const remedyCounts = { ...(r.remedyCounts || {}) };
      if (count) remedyCounts[remedy] = count; else delete remedyCounts[remedy];
      return { ...r, remedyCounts };
    }));
  /** Remedy text with its selected count appended, e.g. "रामरक्षा पाठ (11)". */
  const remedyLine = (row: Row, title: string) => {
    const c = row.remedyCounts?.[title];
    return c ? `${title} (${c})` : title;
  };

  /** Auto price = ratti × per-ratti rate. Ratti comes from the कैरेट/रत्ती field
   *  (else parsed from the weight). Grade picks rateA/B/C; defaults to Grade A so
   *  a plain "5 ratti" with a ₹400/ratti rate = ₹2000 without choosing a grade.
   *  Used only to compute a FRESH price while the astrologer is actively picking/
   *  editing a row — once picked, the number is snapshotted onto `price` (see
   *  setGemAt/loadGemInto below) so later admin rate edits never change it. */
  const calcGemPriceNumber = useCallback((g: Gem): number => {
    const ratti = parseFloat(String(g.carat || g.weight || "").replace(/[^\d.]/g, ""));
    if (!ratti) return 0;
    // rate comes from the row, else falls back to the admin gemstone for this planet
    // (so setting the ₹/ratti in admin shows a price even on already-added rows)
    const src = gemDefaults.find((x) => x.planet === g.planet);
    const rateA = g.rateA ?? src?.rateA;
    const rateB = g.rateB ?? src?.rateB;
    const rateC = g.rateC ?? src?.rateC;
    const gi = g.grade ? gemGrades.findIndex((x) => x.title === g.grade) : 0;
    const rate = gi === 1 ? rateB : gi === 2 ? rateC : rateA; // default = Grade A
    if (!rate || rate <= 0) return 0;
    return Math.round(ratti * rate);
  }, [gemGrades, gemDefaults]);

  /** Display/print price. Prefers the SAVED snapshot (`g.price`) — the exact
   *  number chosen at pick-time — so Screen, Print, PDF, Save and Share always
   *  show the identical figure, unaffected by later Admin price changes. Falls
   *  back to a live calc only for a row that hasn't been snapshotted yet. */
  const gemPrice = useCallback((g: Gem): string => {
    const n = typeof g.price === "number" && g.price > 0 ? g.price : calcGemPriceNumber(g);
    return n > 0 ? `₹${n.toLocaleString("en-IN")}` : "";
  }, [calcGemPriceNumber]);

  const setGemAt = (i: number, patch: Partial<Gem>) =>
    setGems((gs) => gs.map((g, idx) => {
      if (idx !== i) return g;
      const next = { ...g, ...patch };
      const price = calcGemPriceNumber(next);
      return { ...next, price: price > 0 ? price : undefined };
    }));
  const loadGemInto = (i: number, planet: string) => {
    const d = gemDefaults.find((x) => x.planet === planet);
    setGems((gs) => gs.map((g, idx) => {
      if (idx !== i) return g;
      const next: Gem = d
        ? { planet, stone: d.stone, weight: d.weight, metal: d.metal, finger: d.finger, day: d.day, rudraksha: "", carat: g.carat || "", grade: g.grade || "", rateA: d.rateA, rateB: d.rateB, rateC: d.rateC, rates: d.rates || [] }
        : { ...blankGem(planet), carat: g.carat || "", grade: g.grade || "" };
      const price = calcGemPriceNumber(next);
      return { ...next, price: price > 0 ? price : undefined };
    }));
  };

  /** Astrologer picks one admin-defined rate option (e.g. "5 Ratti — ₹10,000") for the
   *  currently-selected planet. Its exact label+price snapshot onto the row so later
   *  admin edits never change an already-picked prescription. Blank selection falls
   *  back to the old carat×rate calc. */
  const selectGemRate = (i: number, rateId: string) =>
    setGems((gs) => gs.map((g, idx) => {
      if (idx !== i) return g;
      const src = gemDefaults.find((x) => x.planet === g.planet);
      const r = src?.rates?.find((x) => x.id === rateId);
      if (!r) return { ...g, rateLabel: undefined, price: calcGemPriceNumber(g) || undefined };
      return { ...g, rateLabel: r.label, price: r.price };
    }));

  /** Admin enters English; the pad/PDF/record store the Hindi form (manual
   *  `titleHi` override wins, else auto-converted). */
  const anuHi = useCallback((a: Anushthan): AnuRow => ({
    title: toHindi(a.title, a.titleHi),
    purpose: toHindi(a.purpose),
    dakshina: a.dakshina,
  }), []);

  /** Toggle an Anushthan catalog row on/off for this prescription (matched by its Hindi name). */
  const toggleAnushthan = (a: Anushthan) => {
    const hi = anuHi(a);
    setAnushthanRows((rows) =>
      rows.some((r) => r.title === hi.title)
        ? rows.filter((r) => r.title !== hi.title)
        : [...rows, hi]);
  };

  const resetAll = () => {
    setPatientName(""); setMobile(""); setGender(""); setDob(""); setDobText(""); setTob(""); setPlace("Lucknow");
    setMahadasha(""); setAntardasha(""); setPratyantar(""); setDosha(""); setYog("");
    manualDasha.current = {}; // new patient → auto-fill is free to populate again
    setChart(null); setGochar(null); setKundali(null); setKundaliState("idle");
    setRows([emptyRow()]); setGems([blankGem()]); setAnushthanRows([]); setAnuQuery(""); setNotes(""); setSavedId(null);
  };

  const load = (c: Consultation) => {
    setPatientName(c.patientName); setMobile(c.mobile); setGender(c.gender); setDob(c.dob); setDobText(fmtDMY(c.dob)); setTob(c.tob); setPlace(c.place || "Lucknow");
    setMahadasha(c.mahadasha); setAntardasha(c.antardasha); setPratyantar(c.pratyantar); setDosha(c.dosha); setYog(c.yog);
    // saved values are authoritative — lock them so the kundli refetch (triggered
    // by setDob/setTob/setPlace above) can't overwrite what was saved.
    manualDasha.current = { mahadasha: true, antardasha: true, pratyantar: true, dosha: true, yog: true };
    setKundali(c.kundali); setRows(c.rows?.length ? c.rows : [emptyRow()]); setGems(c.gemstones?.length ? c.gemstones : [blankGem()]); setAnushthanRows(Array.isArray(c.anushthan) ? c.anushthan : []); setNotes(c.notes);
    setSavedId(c.id); setChart(null); setGochar(null); setKundaliState("idle"); setResults(null);
  };

  const doSave = async (): Promise<string | null> => {
    if (!patientName.trim() || !mobile.trim()) { alert("ग्राहक का नाम और मोबाइल ज़रूरी है।"); return null; }
    setSaving(true);
    try {
      const body = JSON.stringify({ patientName, mobile, gender, dob, tob, place, astrologer, mahadasha, antardasha, pratyantar, dosha, yog, kundali, rows, gemstones: gems.filter((g) => g.stone), anushthan: anushthanRows, notes });
      // once a record already has an id, update it in place — every later Save/Share
      // click on the same visit should NOT create a new duplicate entry
      const url = savedId ? `/api/prescriptions?id=${encodeURIComponent(savedId)}` : "/api/prescriptions";
      const r = await fetch(url, { method: savedId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body });
      const j = await r.json();
      if (j.ok) { setSavedId(j.id); fetchToday(); return j.id as string; }
      alert(j.error || "सेव नहीं हुआ।"); return null;
    } catch { alert("सेव नहीं हुआ — दोबारा प्रयास करें।"); return null; }
    finally { setSaving(false); }
  };
  const save = () => { doSave(); };

  // Coordinate-accurate PDF (matches the physical pad). One click = one PDF.
  const [pdfBusy, setPdfBusy] = useState<"digital" | "print" | null>(null);

  const buildPdfData = useCallback((): PrescriptionPdfData => {
    return {
      patientName, mobile, gender,
      dob: fmtDMY(dob), tob, place,
      date: fmtDMY(now.toISOString().slice(0, 10)), astrologer,
      mahadasha, antardasha, pratyantar, dosha, yog,
      planets: kPlanets.map((p) => ({ name: p.name, abbr: p.abbr, house: p.house, degree: Math.floor(((p.lon % 30) + 30) % 30) })),
      // SAME asc_rashi as the on-screen chart (kundali is the single source of
      // truth) — the PDF's house-number labels must never be recalculated separately.
      ascRashi: (kundali as { asc_rashi?: number } | null)?.asc_rashi ?? 0,
      remedyRows: rows.filter((r) => r.planet).map((r) => ({ planet: r.planet, remedyLines: r.remedies.map((x) => remedyLine(r, x)), notes: r.notes })),
      gemRows: gems.filter((g) => g.stone).map((g) => ({ ...g, price: gemPrice(g) })),
      sections: padSections,
      anushthanRows,
      labels: {
        plabel_name: L("plabel_name", "नाम"),
        plabel_yajman: L("plabel_yajman", "यजमान"),
        plabel_mobile: L("plabel_mobile", "मोबाइल"),
        plabel_gender: L("plabel_gender", "लिंग"),
        plabel_birth: L("plabel_birth", "जन्म"),
        plabel_place: L("plabel_place", "स्थान"),
        plabel_date: L("plabel_date", "दिनांक"),
        plabel_astrologer: L("plabel_astrologer", "ज्योतिषी"),
      },
      notes,
    };
  }, [patientName, mobile, gender, dob, tob, place, now, astrologer, mahadasha, antardasha, pratyantar, dosha, yog, kPlanets, kundali, rows, gems, gemPrice, padSections, anushthanRows, L, notes]);

  /** डॉ० राहुल राज — ज्योतिष परामर्श - {PatientName}.pdf */
  const pdfFileName = useCallback(() => {
    const name = (patientName || "ग्राहक").trim().replace(/[\\/:*?"<>|]/g, "");
    return `डॉ० राहुल राज — ज्योतिष परामर्श - ${name}.pdf`;
  }, [patientName]);

  const downloadDigitalPdf = async () => {
    if (pdfBusy) return;
    setPdfBusy("digital");
    try {
      const blob = await generatePrescriptionPdf(buildPdfData(), "digital");
      downloadPdf(blob, pdfFileName());
    } catch (err) {
      alert(`PDF नहीं बन सकी: ${err instanceof Error ? err.message : String(err)}`);
    } finally { setPdfBusy(null); }
  };

  const openPrintPdf = async () => {
    if (pdfBusy) return;
    setPdfBusy("print");
    const tab = window.open("", "_blank"); // opened in the click so it's not popup-blocked
    try {
      const blob = await generatePrescriptionPdf(buildPdfData(), "print");
      const url = URL.createObjectURL(blob);
      if (tab) tab.location.href = url; else window.open(url, "_blank");
    } catch (err) {
      tab?.close();
      alert(`प्रिंट PDF नहीं बन सकी: ${err instanceof Error ? err.message : String(err)}`);
    } finally { setPdfBusy(null); }
  };

  const search = async () => {
    if (!searchQ.trim()) return;
    const r = await fetch(`/api/prescriptions?q=${encodeURIComponent(searchQ)}`);
    const j = await r.json();
    setResults(Array.isArray(j.consultations) ? j.consultations : []);
  };
  const loadByDate = async (date: string) => {
    setRecDate(date);
    if (!date) { setDateRecs(null); return; }
    const r = await fetch(`/api/prescriptions?date=${date}`);
    const j = await r.json();
    setDateRecs(Array.isArray(j.consultations) ? j.consultations : []);
  };
  const deleteRec = async (id: string) => {
    if (!confirm("यह रिकॉर्ड हटा दें?")) return;
    await fetch(`/api/prescriptions?id=${id}`, { method: "DELETE" });
    setDateRecs((rs) => (rs ? rs.filter((c) => c.id !== id) : rs));
    fetchToday();
  };

  /* ---- share ---- */
  const shareText = useCallback((link?: string) => {
    const L: string[] = ["🙏 *डॉ० राहुल राज — ज्योतिष परामर्श*"];
    if (patientName) L.push(`ग्राहक: ${patientName}`);
    if (dob) L.push(`जन्म: ${fmtDMY(dob)}  ${tob}  ${place}`);
    if (mahadasha) L.push(`महादशा: ${mahadasha}`);
    if (antardasha) L.push(`अन्तर्दशा: ${antardasha}`);
    const rem = rows.filter((r) => r.planet && r.remedies.length).map((r) => `${r.planet}: ${r.remedies.map((x) => remedyLine(r, x)).join(", ")}`);
    if (rem.length) { L.push("*उपाय:*"); rem.forEach((x) => L.push("• " + x)); }
    const gem = gems.filter((g) => g.stone).map((g) => `${g.planet} → ${g.stone} (${g.weight}, ${g.finger})${gemPrice(g) ? ` — ${gemPrice(g)}` : ""}`);
    if (gem.length) { L.push("*रत्न:*"); gem.forEach((x) => L.push("• " + x)); }
    if (notes) L.push(`टिप्पणी: ${notes}`);
    if (link) L.push(`\n📄 पूरी रिपोर्ट देखें/डाउनलोड करें:\n${link}`);
    L.push("\n— astrorahulraj.in · +91 94153 12590");
    return L.join("\n");
  }, [patientName, dob, tob, place, mahadasha, antardasha, rows, gems, gemPrice, notes]);

  const shareWhatsApp = async () => {
    const savedFor = savedId || (await doSave());
    if (!savedFor) return;
    const digits = mobile.replace(/\D/g, "");
    const to = digits.length === 10 ? "91" + digits : digits;
    let blob: Blob;
    try {
      blob = await generatePrescriptionPdf(buildPdfData(), "digital");
    } catch (err) {
      alert(`PDF नहीं बन सकी: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    const fname = pdfFileName();
    const file = new File([blob], fname, { type: "application/pdf" });
    // Mobile: share ONLY the PDF (no text) via the native share sheet.
    try {
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file] }); return; }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
    // Desktop / WhatsApp Web can't auto-attach files — download the PDF + open the chat.
    downloadPdf(blob, fname);
    window.open(`https://wa.me/${to}`, "_blank");
    alert("Desktop par WhatsApp me file auto-attach nahi hoti. PDF download ho gayi — chat me attach kar dein.\n(Mobile par sirf PDF direct share hoti hai.)");
  };
  const shareEmail = async () => {
    const savedFor = savedId || (await doSave());
    if (!savedFor) return;
    const link = `${window.location.origin}/rx/${savedFor}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(`ज्योतिष परामर्श — ${patientName || "ग्राहक"}`)}&body=${encodeURIComponent(shareText(link))}`;
  };

  const inp = "w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#8a2020] focus:ring-2 focus:ring-[#8a2020]/15";
  const lbl = "mb-1 block text-xs font-semibold text-ink/60";
  const btn = "rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5";
  const HistRow = (c: Consultation) => (
    <li key={c.id} className="flex items-center justify-between gap-2 py-2 text-xs">
      <span className="min-w-0"><b className="block truncate">{c.patientName}</b><span className="text-ink/50">{c.mobile} · {new Date(c.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span></span>
      <button onClick={() => load(c)} className="shrink-0 rounded-md bg-[#8a2020] px-2.5 py-1 font-semibold text-white">खोलें</button>
    </li>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f4eee3] print:bg-white">
      <style>{`@media print { .rx-noprint { display:none !important; } .rx-print-footer { position:fixed; bottom:0; left:0; right:0; } }`}</style>

      {/* ===== PAGE HEADER (top) ===== */}
      <header className="rx-noprint shadow-md"><Letterhead L={L} /></header>

      {/* ===== controls ===== */}
      <div className="rx-noprint mx-auto flex max-w-[1120px] flex-wrap items-center gap-2 px-3 pt-4">
        <button onClick={downloadDigitalPdf} disabled={pdfBusy !== null} className={`${btn} bg-[#6d1414] text-white disabled:opacity-60`}>{pdfBusy === "digital" ? "बन रहा है…" : "📄 PDF सेव करें"}</button>
        <button onClick={openPrintPdf} disabled={pdfBusy !== null} className={`${btn} bg-[#3a3a3a] text-white disabled:opacity-60`}>{pdfBusy === "print" ? "बन रहा है…" : "🖨️ प्रिंट (पैड पर)"}</button>
        <button onClick={shareWhatsApp} className={`${btn} bg-emerald-600 text-white`}>💬 WhatsApp</button>
        <button onClick={shareEmail} className={`${btn} bg-sky-700 text-white`}>📧 ईमेल</button>
        <button onClick={save} disabled={saving} className={`${btn} bg-amber-600 text-white disabled:opacity-60`}>{saving ? "सेव हो रहा…" : "💾 सेव करें"}</button>
        <button onClick={resetAll} className={`${btn} border border-ink/25 bg-white text-ink`}>＋ नया</button>
        {savedId && <span className="text-sm font-semibold text-emerald-700">✅ सेव हो गया</span>}
      </div>

      {/* ===== body: sidebar + pad ===== */}
      <div className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-4 px-3 py-4 lg:flex-row">
        {/* sidebar */}
        <aside className="rx-noprint w-full shrink-0 space-y-4 lg:w-64">
          <div className="rounded-xl border border-ink/10 bg-white p-3 shadow-sm">
            <p className="mb-2 text-sm font-bold text-[#8a2020]">🔎 नाम या मोबाइल से खोजें</p>
            <div className="flex gap-2">
              <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="नाम / मोबाइल…" className="w-full rounded-lg border border-ink/20 px-2.5 py-1.5 text-sm" />
              <button onClick={search} className="rounded-lg bg-[#8a2020] px-3 text-sm font-semibold text-white">खोजें</button>
            </div>
            {results && (
              <ul className="mt-2 max-h-56 divide-y divide-ink/10 overflow-y-auto">
                {results.length === 0 ? <li className="py-2 text-xs text-ink/50">कुछ नहीं मिला।</li> : results.map(HistRow)}
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-ink/10 bg-white p-3 shadow-sm">
            <p className="mb-2 text-sm font-bold text-[#8a2020]">📅 आज के परामर्श ({today.length})</p>
            {today.length === 0 ? <p className="text-xs text-ink/50">आज कोई परामर्श नहीं।</p> : (
              <ul className="max-h-[40vh] divide-y divide-ink/10 overflow-y-auto">{today.map(HistRow)}</ul>
            )}
          </div>
          <div className="rounded-xl border border-ink/10 bg-white p-3 shadow-sm">
            <p className="mb-2 text-sm font-bold text-[#8a2020]">📋 पुराने रिकॉर्ड — तारीख चुनें</p>
            <input type="date" value={recDate} onChange={(e) => loadByDate(e.target.value)} className="w-full rounded-lg border border-ink/20 px-2.5 py-1.5 text-sm" />
            {dateRecs && (
              <>
                <p className="mt-2 text-xs font-semibold text-ink/60">{recDate && fmtDMY(recDate)} — {dateRecs.length} परामर्श</p>
                {dateRecs.length === 0 ? (
                  <p className="mt-1 text-xs text-ink/50">इस तारीख को कोई रिकॉर्ड नहीं।</p>
                ) : (
                  <ul className="mt-1 max-h-[50vh] divide-y divide-ink/10 overflow-y-auto">
                    {dateRecs.map((c) => (
                      <li key={c.id} className="flex items-center justify-between gap-2 py-2 text-xs">
                        <span className="min-w-0"><b className="block truncate">{c.patientName}</b><span className="text-ink/50">{c.mobile} · {new Date(c.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span></span>
                        <span className="flex shrink-0 gap-1">
                          <button onClick={() => load(c)} className="rounded-md bg-[#8a2020] px-2 py-1 font-semibold text-white">खोलें</button>
                          <button onClick={() => deleteRec(c.id)} title="हटाएं" className="rounded-md bg-rose-600 px-2 py-1 font-semibold text-white">🗑</button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </aside>

        {/* pad */}
        <div className="min-w-0 flex-1 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:p-6">
          {/* client + auto */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div><label className={lbl}>ग्राहक का नाम</label><input className={inp} value={patientName} onChange={(e) => setPatientName(e.target.value)} /></div>
            <div><label className={lbl}>मोबाइल नंबर</label><input className={inp} value={mobile} onChange={(e) => setMobile(e.target.value)} /></div>
            <div><label className={lbl}>लिंग</label><select className={inp} value={gender} onChange={(e) => setGender(e.target.value)}><option value="">—</option><option>पुरुष</option><option>स्त्री</option><option>अन्य</option></select></div>
            <div><label className={lbl}>जन्म तिथि</label><input type="text" inputMode="numeric" placeholder="DD/MM/YYYY" maxLength={10} className={inp} value={dobText} onChange={(e) => onDobChange(e.target.value)} /></div>
            <div><label className={lbl}>जन्म समय</label><input type="time" className={inp} value={tob} onChange={(e) => setTob(e.target.value)} /></div>
            <div><label className={lbl}>जन्म स्थान</label><input list="rx-cities" className={inp} value={place} onChange={(e) => setPlace(e.target.value)} /><datalist id="rx-cities">{CITIES.map((c) => <option key={c.name} value={c.name} />)}</datalist></div>
          </div>
          <p className="mt-2 text-[11px] text-ink/50">दिनांक: {fmtDMY(now.toISOString().slice(0, 10))} · समय: {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · ज्योतिषी: <b>{astrologer}</b></p>

          {/* kundali (BIG) + dasha */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr,1fr]">
            <div>
              <p className="mb-2 font-serif text-xl font-bold text-[#a01414]">{L("heading_kundali", "लग्न कुण्डली")}</p>
              <div onClick={() => chart && setZoom(true)} className={`grid aspect-square w-full max-w-[380px] place-items-center rounded-xl border-2 border-[#a01414]/70 bg-[#fffdf8] p-3 ${chart ? "cursor-zoom-in" : ""}`}>
                {kundaliState === "loading" ? <span className="text-sm text-ink/50">बन रही है…</span>
                  : chart ? <img src={chart} alt="लग्न कुण्डली" className="h-full w-full object-contain" />
                  : <span className="px-4 text-center text-xs text-ink/45">नाम, जन्म तिथि, समय व स्थान भरते ही कुण्डली अपने आप बन जायेगी।</span>}
              </div>
              {chart && <p className="rx-noprint mt-1 text-center text-[11px] text-ink/45">(बड़ा देखने के लिए क्लिक करें)</p>}
            </div>
            <div className="space-y-2">
              {([
                ["mahadasha", L("label_mahadasha", "महादशा"), mahadasha, setMahadasha],
                ["antardasha", L("label_antardasha", "अन्तर्दशा"), antardasha, setAntardasha],
                ["pratyantar", L("label_pratyantar", "प्र० दशा"), pratyantar, setPratyantar],
                ["dosha", L("label_dosha", "दोष"), dosha, setDosha],
                ["yog", L("label_yog", "योग"), yog, setYog],
              ] as [string, string, string, (v: string) => void][]).map(([key, label, val, set]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-sm font-bold text-[#a01414]">{label} —</span>
                  <input className={inp} value={val} onChange={(e) => { markDasha(key); set(e.target.value); }} />
                </div>
              ))}
              {/* Gochar — right of kundali; click to expand. Reference only (not in PDF/print). */}
              {gochar && (
                <div onClick={() => setGocharZoom(true)} className="rx-noprint mt-3 w-[230px] cursor-zoom-in rounded-lg border border-ink/10 bg-white p-2 text-center">
                  <p className="text-[11px] font-bold text-[#1a5276]">गोचर (वर्तमान) — बड़ा देखने के लिए क्लिक</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gochar} alt="गोचर" className="mx-auto w-full" />
                </div>
              )}
            </div>
          </div>

          {/* planet details (screen only) */}
          {kPlanets.length > 0 && (
            <div className="rx-noprint mt-4 rounded-xl border border-ink/10 bg-[#faf6ee] p-3">
              <p className="mb-1 text-xs font-bold text-[#a01414]">ग्रह विवरण (केवल स्क्रीन पर)</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[11px]">
                  <thead><tr className="text-left text-ink/55"><th className="px-1">ग्रह</th><th className="px-1">राशि</th><th className="px-1">अंश</th><th className="px-1">भाव</th><th className="px-1">नक्षत्र</th></tr></thead>
                  <tbody>{kPlanets.map((p) => (<tr key={p.name} className="border-t border-ink/10"><td className="px-1 font-bold" style={{ color: p.color }}>{p.name}</td><td className="px-1">{p.sign}</td><td className="px-1 font-mono">{fmtDeg(p.lon)}</td><td className="px-1">{p.house}</td><td className="px-1">{p.nakshatra}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* remedies */}
          <div className="mt-6">
            <p className="mb-2 font-serif text-xl font-bold text-[#a01414]">{L("heading_remedies", "ग्रह उपाय")}</p>
            <div className="space-y-3">
              {rows.map((row, i) => (
                <div key={i} className="rounded-xl border border-[#8a2020]/20 p-3">
                  <div><label className={lbl}>ग्रह / श्रेणी</label>
                    <select className={`${inp} sm:max-w-[220px]`} value={row.planet} onChange={(e) => setRow(i, { planet: e.target.value, remedies: [], remedyCounts: {} })}>
                      <option value="">—</option>
                      {(remedyCats.length
                        ? remedyCats.filter((c) => c.enabled !== false)
                        : [
                            ...PLANETS.map((p) => ({ key: p, title: p })),
                            { key: "Lagna", title: "लग्न" },
                            { key: MISC_REMEDY_CATEGORY, title: "विशेष उपाय" },
                          ]
                      ).map((c) => <option key={c.key} value={c.key}>{c.title}</option>)}
                    </select>
                  </div>
                  {row.planet && (
                    <div className="mt-2">
                      <label className={lbl}>उपाय चुनें</label>
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {remediesFor(row.planet).length === 0 && <p className="text-xs text-ink/45">इस श्रेणी के उपाय एडमिन में जोड़ें।</p>}
                        {remediesFor(row.planet).map((r) => (
                          <div key={r.id} className="flex flex-wrap items-center gap-1.5 text-sm">
                            <label className="flex items-start gap-2">
                              <input type="checkbox" className="mt-1" checked={row.remedies.includes(r.title)} onChange={() => toggleRemedy(i, r.title)} />
                              <span>{r.title}</span>
                            </label>
                            {row.remedies.includes(r.title) && countOptions.length > 0 && (
                              <select
                                className="rounded-md border border-ink/20 px-1.5 py-0.5 text-xs"
                                value={row.remedyCounts?.[r.title] || ""}
                                onChange={(e) => setRemedyCount(i, r.title, e.target.value)}
                                title="संख्या / बार (वैकल्पिक)"
                              >
                                <option value="">संख्या —</option>
                                {countOptions.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-2"><label className={lbl}>टिप्पणी</label><input className={inp} value={row.notes} onChange={(e) => setRow(i, { notes: e.target.value })} /></div>
                  {rows.length > 1 && <button onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))} className="mt-2 text-xs font-semibold text-rose-600">✕ हटाएं</button>}
                </div>
              ))}
            </div>
            <button onClick={() => setRows((rs) => [...rs, emptyRow()])} className="mt-2 rounded-lg border border-[#8a2020]/40 px-3 py-1.5 text-sm font-semibold text-[#8a2020]">＋ ग्रह जोड़ें</button>
          </div>

          {/* anushthan — searchable dropdown (results after 3 letters) + chosen chips */}
          <div className="mt-6">
            <p className="mb-1 font-serif text-xl font-bold text-[#a01414]">{L("heading_anushthan", "अनुष्ठान")}</p>
            <p className="mb-2 text-[11px] text-ink/45">PDF/प्रिंट में सबसे ऊपर के 3 अनुष्ठान ही आते हैं।</p>
            {anushthanCatalog.length === 0 ? (
              <p className="text-xs text-ink/45">एडमिन → “Anushthan” में अनुष्ठान जोड़ें, फिर यहाँ खोजें।</p>
            ) : (
              <>
                {/* chosen chips (this is the order used in PDF/print) */}
                {anushthanRows.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {anushthanRows.map((r, idx) => (
                      <span key={r.title} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${idx < 3 ? "bg-[#8a2020]/10 text-[#8a2020]" : "bg-ink/10 text-ink/50"}`}>
                        {idx < 3 ? `${idx + 1}. ` : ""}{r.title}
                        <button type="button" onClick={() => setAnushthanRows((rs) => rs.filter((x) => x.title !== r.title))} className="text-current/70 hover:text-rose-600">✕</button>
                      </span>
                    ))}
                  </div>
                )}
                {/* search box */}
                <input
                  className={inp}
                  value={anuQuery}
                  onChange={(e) => setAnuQuery(e.target.value)}
                  placeholder="अनुष्ठान खोजें… (कम से कम 3 अक्षर लिखें)"
                />
                {anuQuery.trim().length >= 3 && (() => {
                  const q = anuQuery.trim().toLowerCase();
                  // search matches BOTH the English admin text and its Hindi form
                  const matches = anushthanCatalog.filter((a) => {
                    const hi = anuHi(a);
                    return `${a.title} ${a.purpose} ${a.dakshina} ${hi.title} ${hi.purpose}`.toLowerCase().includes(q);
                  });
                  return (
                    <ul className="mt-1 max-h-56 divide-y divide-ink/10 overflow-y-auto rounded-lg border border-ink/15 bg-white shadow-sm">
                      {matches.length === 0 ? (
                        <li className="px-3 py-2 text-xs text-ink/45">कोई अनुष्ठान नहीं मिला।</li>
                      ) : matches.map((a) => {
                        const hi = anuHi(a);
                        const on = anushthanRows.some((r) => r.title === hi.title);
                        return (
                          <li key={a.id}>
                            <button type="button" onClick={() => toggleAnushthan(a)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-[#8a2020]/5">
                              <span><b>{hi.title}</b><span className="text-ink/55"> · {hi.purpose} · {hi.dakshina}</span></span>
                              <span className={`shrink-0 text-xs font-bold ${on ? "text-emerald-600" : "text-[#8a2020]"}`}>{on ? "✓ जुड़ा" : "＋ जोड़ें"}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  );
                })()}
              </>
            )}
          </div>

          {/* gemstones */}
          <div className="mt-6">
            <p className="mb-2 font-serif text-xl font-bold text-[#a01414]">{L("heading_gemstones", "रत्न")}</p>
            <div className="space-y-3">
              {gems.map((g, i) => (
                <div key={i} className="rounded-xl border border-[#8a2020]/20 p-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div><label className={lbl}>ग्रह</label><select className={inp} value={g.planet} onChange={(e) => loadGemInto(i, e.target.value)}><option value="">—</option>{PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
                    <div><label className={lbl}>रत्न</label><input className={inp} value={g.stone} onChange={(e) => setGemAt(i, { stone: e.target.value })} /></div>
                    <div><label className={lbl}>वजन</label><input className={inp} value={g.weight} onChange={(e) => setGemAt(i, { weight: e.target.value })} /></div>
                    <div><label className={lbl}>धातु</label><input className={inp} value={g.metal} onChange={(e) => setGemAt(i, { metal: e.target.value })} /></div>
                    <div><label className={lbl}>अंगुली</label><input className={inp} value={g.finger} onChange={(e) => setGemAt(i, { finger: e.target.value })} /></div>
                    <div><label className={lbl}>दिन</label><input className={inp} value={g.day} onChange={(e) => setGemAt(i, { day: e.target.value })} /></div>
                    <div><label className={lbl}>रुद्राक्ष</label><input className={inp} value={g.rudraksha || ""} onChange={(e) => setGemAt(i, { rudraksha: e.target.value })} placeholder="जैसे 7 मुखी" /></div>
                    <div><label className={lbl}>कैरेट / रत्ती</label><select className={inp} value={g.carat || ""} onChange={(e) => setGemAt(i, { carat: e.target.value })}><option value="">—</option>{carats.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}</select></div>
                    <div><label className={lbl}>ग्रेड</label><select className={inp} value={g.grade || ""} onChange={(e) => setGemAt(i, { grade: e.target.value })}><option value="">— (A)</option>{gemGrades.map((gr) => <option key={gr.id} value={gr.title}>{gr.title}</option>)}</select></div>
                  </div>
                  {!!g.rates?.length && (
                    <div className="mt-2">
                      <label className={lbl}>मूल्य चुनें</label>
                      <select
                        className={inp}
                        value={g.rates.find((r) => r.label === g.rateLabel)?.id || ""}
                        onChange={(e) => selectGemRate(i, e.target.value)}
                      >
                        <option value="">— चुनें —</option>
                        {g.rates.map((r) => (
                          <option key={r.id} value={r.id}>{r.label} — ₹{r.price.toLocaleString("en-IN")}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    {gemPrice(g)
                      ? <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">मूल्य: {gemPrice(g)}</span>
                      : <span className="text-xs text-ink/40">कैरेट व ग्रेड चुनें → मूल्य अपने आप (रेट एडमिन में सेट करें)</span>}
                    {gems.length > 1 && <button onClick={() => setGems((gs) => gs.filter((_, idx) => idx !== i))} className="text-xs font-semibold text-rose-600">✕ हटाएं</button>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setGems((gs) => [...gs, blankGem()])} className="mt-2 rounded-lg border border-[#8a2020]/40 px-3 py-1.5 text-sm font-semibold text-[#8a2020]">＋ रत्न जोड़ें</button>
          </div>

          <div className="mt-4"><label className={lbl}>{L("heading_notes", "अतिरिक्त टिप्पणी")}</label><textarea className={inp} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
      </div>

      {/* ===== PAGE FOOTER (end) ===== */}
      <footer className="rx-noprint mt-2 shadow-inner"><Footer L={L} /></footer>

      {/* zoom modal */}
      {zoom && chart && (
        <div className="rx-noprint fixed inset-0 z-[120] grid place-items-center bg-black/70 p-4" onClick={() => setZoom(false)}>
          <div className="relative w-full max-w-[620px] rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoom(false)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/10 text-ink">✕</button>
            <p className="mb-2 text-center font-serif text-2xl font-bold text-[#a01414]">{L("heading_kundali", "लग्न कुण्डली")}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chart} alt="लग्न कुण्डली (बड़ी)" className="mx-auto w-full max-w-[540px]" />
          </div>
        </div>
      )}

      {/* gochar zoom modal */}
      {gocharZoom && gochar && (
        <div className="rx-noprint fixed inset-0 z-[120] grid place-items-center bg-black/70 p-4" onClick={() => setGocharZoom(false)}>
          <div className="relative w-full max-w-[620px] rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setGocharZoom(false)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/10 text-ink">✕</button>
            <p className="mb-2 text-center font-serif text-2xl font-bold text-[#1a5276]">गोचर कुण्डली (वर्तमान)</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gochar} alt="गोचर (बड़ा)" className="mx-auto w-full max-w-[540px]" />
          </div>
        </div>
      )}

      {/* print doc */}
      {portal && createPortal(
        <div className="hidden print:block">
          <div className="mx-auto w-[210mm] bg-white text-[#222]">
            <Letterhead L={L} />
            <div className="px-6 py-4 pb-[30mm] text-sm">
              <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                <p><b>ग्राहक:</b> {patientName}</p><p><b>मोबाइल:</b> {mobile}</p><p><b>लिंग:</b> {gender}</p>
                <p><b>जन्म तिथि:</b> {fmtDMY(dob)}</p><p><b>समय:</b> {tob}</p><p><b>स्थान:</b> {place}</p>
                <p><b>दिनांक:</b> {fmtDMY(now.toISOString().slice(0, 10))}</p><p className="col-span-2"><b>ज्योतिषी:</b> {astrologer}</p>
              </div>
              <div className="mt-3 grid grid-cols-[1.1fr,1fr] gap-4">
                <div>
                  <p className="font-bold text-[#a01414]">लग्न कुण्डली</p>
                  <div className="grid aspect-square w-full max-w-[95mm] place-items-center border-2 border-[#a01414]/70 p-1">{chart ? <img src={chart} alt="कुण्डली" className="h-full w-full object-contain" /> : null}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <p><b>महादशा —</b> {mahadasha}</p><p><b>अन्तर्दशा —</b> {antardasha}</p><p><b>प्र० दशा —</b> {pratyantar}</p><p><b>दोष —</b> {dosha}</p><p><b>योग —</b> {yog}</p>
                </div>
              </div>
              {rows.some((r) => r.planet) && (
                <table className="mt-3 w-full border-collapse text-[12px]">
                  <thead><tr className="bg-[#f2e4d6] text-left"><th className="border border-ink/20 px-2 py-1">ग्रह</th><th className="border border-ink/20 px-2 py-1">उपाय</th><th className="border border-ink/20 px-2 py-1">टिप्पणी</th></tr></thead>
                  <tbody>{rows.filter((r) => r.planet).map((r, i) => (<tr key={i}><td className="border border-ink/20 px-2 py-1 align-top">{r.planet}</td><td className="border border-ink/20 px-2 py-1 align-top">{r.remedies.map((x, j) => <div key={j}>• {remedyLine(r, x)}</div>)}</td><td className="border border-ink/20 px-2 py-1 align-top">{r.notes}</td></tr>))}</tbody>
                </table>
              )}
              {gems.some((g) => g.stone) && (
                <div className="mt-3 space-y-1">
                  {gems.filter((g) => g.stone).map((g, i) => (
                    <div key={i} className="rounded border border-[#a01414]/40 p-2 text-[12px]"><b className="text-[#a01414]">रत्न:</b> {g.planet} → {g.stone} · {g.weight} · {g.metal} · {g.finger} · {g.day}{gemPrice(g) ? ` · मूल्य: ${gemPrice(g)}` : ""}</div>
                  ))}
                </div>
              )}
              {notes && <p className="mt-2 text-[12px]"><b>टिप्पणी:</b> {notes}</p>}
            </div>
            <div className="rx-print-footer"><Footer L={L} /></div>
          </div>
        </div>,
        portal
      )}
    </div>
  );
}
