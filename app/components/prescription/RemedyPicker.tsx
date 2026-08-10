"use client";

/**
 * Reusable उपाय (remedies) picker for the new prescription workflows (Kundali
 * Milan, Birth Child). Reuses the EXISTING remedies data — the same
 * planetRemedies / miscRemedies / remedyCategories collections the normal
 * prescription pad uses — so nothing is duplicated. Astrologer can select
 * catalog remedies, add custom text, remove and reorder. Selected remedies are
 * returned via onChange and printed in the final report.
 */

import { useEffect, useState } from "react";
import { toHindi } from "@/lib/prescriptionPad/hindi";

type Rem = { id: string; planet: string; title: string; enabled?: boolean };
type MiscRem = { id: string; title: string; enabled?: boolean };
type Cat = { key: string; title: string; enabled?: boolean };

const FALLBACK_CATS: Cat[] = [
  { key: "Sun", title: "सूर्य" }, { key: "Moon", title: "चंद्र" }, { key: "Mars", title: "मंगल" },
  { key: "Mercury", title: "बुध" }, { key: "Jupiter", title: "गुरु" }, { key: "Venus", title: "शुक्र" },
  { key: "Saturn", title: "शनि" }, { key: "Rahu", title: "राहु" }, { key: "Ketu", title: "केतु" },
  { key: "Lagna", title: "लग्न" }, { key: "Miscellaneous", title: "विशेष उपाय" },
];

export function RemedyPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [remedies, setRemedies] = useState<Rem[]>([]);
  const [misc, setMisc] = useState<MiscRem[]>([]);
  const [cats, setCats] = useState<Cat[]>(FALLBACK_CATS);
  const [openCat, setOpenCat] = useState<string>("");
  const [custom, setCustom] = useState("");

  useEffect(() => {
    fetch("/api/content/planetRemedies").then((r) => r.json()).then((d) => Array.isArray(d) && setRemedies(d)).catch(() => {});
    fetch("/api/content/miscRemedies").then((r) => r.json()).then((d) => Array.isArray(d) && setMisc(d)).catch(() => {});
    fetch("/api/content/remedyCategories").then((r) => r.json()).then((d) => Array.isArray(d) && d.length && setCats(d)).catch(() => {});
  }, []);

  const catList = cats.filter((c) => c.enabled !== false && c.key);
  const forCat = (key: string): string[] =>
    key === "Miscellaneous"
      ? misc.filter((r) => r.enabled !== false).map((r) => r.title)
      : remedies.filter((r) => r.planet === key && r.enabled !== false).map((r) => r.title);

  const add = (t: string) => { const s = t.trim(); if (s && !value.includes(s)) onChange([...value, s]); };
  const remove = (t: string) => onChange(value.filter((x) => x !== t));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= value.length) return;
    const next = [...value]; [next[i], next[j]] = [next[j], next[i]]; onChange(next);
  };

  const inp = "w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#8a2020] focus:ring-2 focus:ring-[#8a2020]/15";

  return (
    <div>
      <p className="mb-2 font-serif text-xl font-bold text-[#a01414]">उपाय</p>

      {/* category selector */}
      <div className="flex flex-wrap gap-2">
        {catList.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setOpenCat(openCat === c.key ? "" : c.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${openCat === c.key ? "bg-[#8a2020] text-white" : "border border-ink/15 bg-white text-ink/70"}`}
          >
            {toHindi(c.title)}
          </button>
        ))}
      </div>

      {/* remedies of the open category */}
      {openCat && (
        <div className="mt-3 grid gap-1.5 rounded-lg border border-ink/12 bg-[#faf6ee] p-3 sm:grid-cols-2">
          {forCat(openCat).length === 0 && <p className="text-xs text-ink/45">इस श्रेणी में कोई उपाय नहीं।</p>}
          {forCat(openCat).map((t, i) => {
            const hi = toHindi(t);
            const on = value.includes(hi);
            return (
              <button key={i} type="button" onClick={() => (on ? remove(hi) : add(hi))} className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-left text-sm ${on ? "border-emerald-500/50 bg-emerald-50" : "border-ink/12 bg-white"}`}>
                <span>{hi}</span>
                <span className={`shrink-0 text-xs font-bold ${on ? "text-emerald-600" : "text-[#8a2020]"}`}>{on ? "✓" : "＋"}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* custom remedy */}
      <div className="mt-3 flex gap-2">
        <input className={inp} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="कस्टम उपाय लिखें…" onKeyDown={(e) => { if (e.key === "Enter") { add(custom); setCustom(""); } }} />
        <button type="button" onClick={() => { add(custom); setCustom(""); }} className="shrink-0 rounded-lg bg-[#8a2020] px-4 py-2 text-sm font-semibold text-white">जोड़ें</button>
      </div>

      {/* selected list */}
      {value.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {value.map((t, i) => (
            <li key={i} className="flex items-center gap-2 rounded-lg border border-ink/12 bg-white p-2 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#8a2020]/10 text-xs font-bold text-[#8a2020]">{i + 1}</span>
              <span className="min-w-0 flex-1 break-words">{t}</span>
              <button type="button" onClick={() => move(i, -1)} className="rx-noprint grid h-7 w-7 place-items-center rounded text-ink/50 hover:bg-ink/5" disabled={i === 0}>↑</button>
              <button type="button" onClick={() => move(i, 1)} className="rx-noprint grid h-7 w-7 place-items-center rounded text-ink/50 hover:bg-ink/5" disabled={i === value.length - 1}>↓</button>
              <button type="button" onClick={() => remove(t)} className="rx-noprint rounded px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
